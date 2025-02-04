export default defineProtectedHandler(async (event) => {
  const user = event.context.user as User
  const db = useDatabase()

  const questions = await db
    .prepare(`
      SELECT * FROM questionnaires
      where owner_id = ?
    `)
    .bind(user.id)
    .all() as any[]

  return questions.map(question => ({
    id: question.id as number,
    subject: question.subject as string,
    topic: question.topic as string,
    questionCount: question.question_count as number
  }))
}, {
  roles: ['admin', 'professor']
})
