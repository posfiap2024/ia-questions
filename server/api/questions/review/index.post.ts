import { z } from "zod"

const bodySchema = z.object({
  question: z.string(),
  answer: z.string(),
  student_answer: z.string(),
})

const promptTemplate = `
Avalie a resposta do aluno:

<question>
  {question}
</question>

<answer>
  {answer}
</answer>

<student_answer>
  {studentAnswer}
</student_answer>
`

export default defineProtectedHandler(async (event) => {
  const body = await readBody(event)
  const { question, answer, student_answer: studentAnswer } = bodySchema.parse(body)

  return useReview(
    promptTemplate
      .replace('{question}', question)
      .replace('{answer}', answer)
      .replace('{studentAnswer}', studentAnswer)
  )
})
