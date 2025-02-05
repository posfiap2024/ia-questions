export default defineProtectedHandler(async (event) => {
  const user = event.context.user as User
  const db = useDatabase()

  const questionnaires = await db
    .prepare(`
      SELECT * FROM questionnaires
      where owner_id = ?
    `)
    .bind(user.id)
    .all() as any[]

  return questionnaires.map(questionnaire => ({
    id: questionnaire.id as number,
    subject: questionnaire.subject as string,
    topic: questionnaire.topic as string
  }))
}, {
  roles: ['admin', 'professor']
})
