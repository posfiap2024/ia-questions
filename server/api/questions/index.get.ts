export default defineProtectedHandler(async (event) => {
  const user = event.context.user as User
  const db = useDatabase()

  const questionnaires = await db
    .prepare(`
      SELECT q.id, q.subject, q.topic FROM students_questionnaires AS sq
      INNER JOIN questionnaires AS q ON sq.questionnaire_id = q.id
      WHERE sq.student_id = ?
    `)
    .bind(user.id)
    .all() as any[]

  return questionnaires.map(question => ({
    id: question.id as number,
    subject: question.subject as string,
    topic: question.topic as string
  }))
}, {
  roles: ['student']
})
