import { OpenAI } from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

const defaultSystemPrompt = `
Você é um assistente multidisciplinar educacional com o objetivo de auxiliar professores a criar e corrigir exercícios de apoio para alunos.
`

export async function useChat(prompt: string, options: UseChatOptions) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: options?.systemPrompt || defaultSystemPrompt },
      { role: 'user', content: prompt }
    ]
  })

  const completions = response.choices.map((choice) => ({
    role: choice.message.role,
    content: choice.message.content
  }))

  return completions
}

type UseChatOptions = {
  systemPrompt?: string
}
