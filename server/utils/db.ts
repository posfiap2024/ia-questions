async function findUser(params: { id?: number, username?: string }): Promise<User | undefined> {
  const { id, username } = params

  if (!id && !username) throw new Error('id or username is required')

  const db = useDatabase()

  const statement = db.prepare(`
    SELECT u.id, u.username, u.password, r.id as role_id, r.name as role_name
    FROM users as u
    INNER JOIN roles as r ON u.role_id = r.id
    WHERE ${id ? `u.id = ?` : `u.username = ?`}
  `).bind(id ? id : username)

  const user = await statement.get() as UserDTO | undefined

  if (!user) {
    return undefined
  }

  return {
    id: user.id,
    username: user.username,
    password: user.password,
    role: {
      id: user.role_id,
      name: user.role_name,
    }
  }
}

export async function getQuestionsByStudent(userId: number): Promise<Question[]> {
  const db = useDatabase()

  const statement = db.prepare(`
    SELECT * FROM students_questionnaires as sq
    INNER JOIN questionnaires as q ON sq.questionnaire_id = q.id
    WHERE student_id = ?
  `).bind(userId)

  const questions = await statement.all() as QuestionDTO[]

  return questions.map(question => ({
    id: question.id,
    subject: question.subject,
    topic: question.topic,
    questionCount: question.question_count
  }))
}

export async function getQuestion(params: { id: number }): Promise<Question> {
  const { id } = params

  const db = useDatabase()

  const statement = db.prepare(`
    SELECT * FROM questionnaires
    WHERE id = ?
  `).bind(id)

  const question = await statement.get() as QuestionDTO

  return {
    id: question.id,
    subject: question.subject,
    topic: question.topic,
    questionCount: question.question_count
  }
}

export function useDb() {
  return { findUser, getQuestionsByStudent, getQuestion }
}

type UserDTO = {
  id: number,
  username: string,
  password: string,
  role_id: number,
  role_name: string,
}

type QuestionDTO = {
  id: number,
  subject: string,
  topic: string,
  question_count: number
}
