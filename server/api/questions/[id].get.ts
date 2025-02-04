import { z } from 'zod'

const paramsSchema = z.object({
  id: z.coerce.number()
})

const promptTemplate = `
Gere {count} perguntas sobre {subject} com o tema {topic}
`

export default defineProtectedHandler(async (event) => {
  const params = getRouterParams(event)
  const user = event.context.user as User
  const { id } = paramsSchema.parse(params)

  return cachedQuestions(id, user.id)
})

const cachedQuestions = defineCachedFunction(async (id: number, _: number) => {
  const { getQuestion } = useDb()
  const { subject, topic, questionCount: count } = await getQuestion({ id })

  return useQuestions(
    promptTemplate
      .replace('{count}', count?.toLocaleString() ?? '1')
      .replace('{subject}', subject?.toLocaleString() ?? 'Matemática')
      .replace('{topic}', topic?.toLocaleString() ?? 'Geometria')
  )
}, {
  maxAge: 60 * 60 * 24,
  getKey: (id, userId) => `questions:${id}:${userId}`,
})
