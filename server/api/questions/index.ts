import { useChat } from "~/server/utils/chat"

const promptTemplate = `
Gere {count} perguntas sobre {subject} com o tema {topic}
`

export default defineEventHandler(async (event) => {
  const { count, subject, topic } = getQuery(event)

  return useChat(
    promptTemplate
      .replace('{count}', count?.toLocaleString() ?? '1')
      .replace('{subject}', subject?.toLocaleString() ?? 'Matemática')
      .replace('{topic}', topic?.toLocaleString() ?? 'Geometria')
  )
})
