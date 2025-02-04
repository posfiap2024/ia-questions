import { z } from 'zod'

const bodySchema = z.object({
  subject: z.string(),
  topic: z.string(),
  questions: z.array(
    z.union([
      z.object({
        type: z.literal('open'),
        statement: z.string(),
        answer: z.string(),
      }),
      z.object({
        type: z.literal('closed'),
        statement: z.string(),
        options: z.array(z.object({
          text: z.string(),
          correct: z.boolean()
        }))
      })
    ])
  )
})

export default defineProtectedHandler(async (event) => {
  const user = event.context.user as User
  const body = await readBody(event)
  const { subject, topic, questions } = bodySchema.parse(body)

  const db = useDatabase()

  await db.exec('BEGIN TRANSACTION')

  const { id: questionnaireId } = await db
    .prepare(`
      INSERT INTO questionnaires (subject, topic, owner_id)
      VALUES (?, ?, ?)
      RETURNING id;
    `)
    .bind(subject, topic, user.id)
    .get() as { id: number }


  await Promise.all(
    questions.map(async (question) => {
      const { id: questionId } = await db
        .prepare(`
          INSERT INTO questions (questionnaire_id, statement, type, answer)
          VALUES (?, ?, ?, ?)
          RETURNING id;
        `)
        .bind(
          questionnaireId,
          question.statement,
          question.type,
          question.type === 'open' ? question.answer : null
        )
        .get() as { id: number }

      if (question.type === 'closed') {
        await Promise.all(
          question.options.map(async ({ text, correct }) => {
            await db
              .prepare(`
                INSERT INTO question_options (question_id, option, correct)
                VALUES (?, ?, ?);
              `)
              .bind(questionId, text, correct ? 1 : 0)
              .run()
          })
        )
      }

      return true
    })
  )

  await db.exec('COMMIT')
}, {
  roles: ['admin', 'professor']
})
