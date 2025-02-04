export default defineProtectedHandler(async (event) => {
  const user = event.context.user as User
  const { getQuestionsByStudent } = useDb()

  const questions = await getQuestionsByStudent(user.id)

  return questions
})
