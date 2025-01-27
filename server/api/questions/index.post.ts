import { z } from 'zod'

const bodySchema = z.object({
  count: z.coerce.number().min(1).max(10),
  subject: z.string(),
  topic: z.string()
})

const promptTemplate = `
Gere {count} perguntas sobre {subject} com o tema {topic}
`

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { count, subject, topic } = bodySchema.parse(body)

  return useQuestions(
    promptTemplate
      .replace('{count}', count?.toLocaleString() ?? '1')
      .replace('{subject}', subject?.toLocaleString() ?? 'Matemática')
      .replace('{topic}', topic?.toLocaleString() ?? 'Geometria')
  )
})
