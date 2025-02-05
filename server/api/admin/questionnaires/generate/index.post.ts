import { z } from 'zod'

const bodySchema = z.object({
  subject: z.string(),
  topic: z.string(),
  count: z.coerce.string(),
})

const promptTemplate = `
Gere {count} perguntas sobre {subject} com o tema {topic}
`

export default defineProtectedHandler(async (event) => {
  const body = await readBody(event)
  const { subject, topic, count } = bodySchema.parse(body)

  return useQuestions(
    promptTemplate
      .replace('{count}', count ?? '1')
      .replace('{subject}', subject ?? 'Matemática')
      .replace('{topic}', topic ?? 'Geometria')
  )
}, {
  roles: ['admin', 'professor']
})
