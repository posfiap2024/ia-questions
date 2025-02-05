export default defineProtectedHandler(async (event) => {
  const user = event.context.user as User
  const id = getRouterParam(event, 'id')
  const db = useDatabase()

  const questionnaire = await db
    .prepare(`
      SELECT q.id, q.subject, q.topic FROM students_questionnaires AS sq
      JOIN questionnaires AS q ON sq.questionnaire_id = q.id
      WHERE sq.student_id = ? AND sq.questionnaire_id = ?
    `)
    .bind(user.id, id)
    .get() as QuestionnaireDTO

  if (!questionnaire) {
    throw createError({
      statusCode: 404,
      message: 'Questionário não encontrado'
    })
  }

  const questions = await db
    .prepare(`
      SELECT id, statement, type, answer FROM questions
      WHERE questionnaire_id = ?
    `)
    .bind(questionnaire.id)
    .all() as QuestionsDTO[]

  const questionWithOptions = await Promise.all(
    questions.map(async (question) => {
      if (question.type !== 'closed')
        return question

      const options =  await db
        .prepare(`
          SELECT id, option, correct FROM question_options
          WHERE question_id = ?
        `)
        .bind(question.id)
        .all() as OptionsDTO[]

      return {
        ...question,
        options: options.map(option => ({
          id: option.id,
          text: option.option,
          correct: !!option.correct
        }))
      }
    })
  )

  return {
    id: questionnaire.id,
    subject: questionnaire.subject,
    topic: questionnaire.topic,
    questions: questionWithOptions
  } as Questionnaire
})

type QuestionnaireDTO = {
  id: number
  subject: string
  topic: string
}

type QuestionsDTO = {
  id: number
  statement: string
  type: 'open' | 'closed'
  answer: string
}

type OptionsDTO = {
  id: string
  option: string
  correct: boolean
}
