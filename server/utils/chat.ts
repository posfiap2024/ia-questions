import { OpenAI } from 'openai'

const openai = new OpenAI({
  apiKey: 'ollama',
  baseURL: 'http://localhost:11434/v1',
})

const defaultSystemPrompt = `
Você é um assistente multidisciplinar educacional com o objetivo de auxiliar professores a criar e corrigir exercícios de apoio para alunos.
`

export async function useChat(prompt: string, options: UseChatOptions) {
  console.log('prompt', prompt)
  const response = await openai.chat.completions.create({
    model: 'llama3.2',
    messages: [
      { role: 'system', content: options?.systemPrompt || defaultSystemPrompt },
      { role: 'user', content: prompt }
    ]
  })
  
  const completions = response.choices.map((choice) => ({
    role: choice.message.role,
    content: choice.message.content?.replace(/<think>[\s\S]*?<\/think>/g, '').trim()
  }))
  console.log('completions', completions)
  
  // Remove as tags <think> e o conteúdo entre elas

  return completions
}

type UseChatOptions = {
  systemPrompt?: string
}
