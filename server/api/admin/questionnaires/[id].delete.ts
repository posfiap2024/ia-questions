export default defineProtectedHandler(async (event) => {
  const user = event.context.user as User
  const id = getRouterParam(event, 'id')
  const db = useDatabase()

  try {
    await db.exec(`BEGIN TRANSACTION`)

    await db
      .prepare(`
        DELETE FROM questionnaires
        WHERE owner_id = ? AND id = ?
      `)
      .bind(user.id, id)
      .run()

    await db.exec('COMMIT')

    return { id }
  } catch (error) {
    await db.exec('ROLLBACK')

    throw error
  }
})
