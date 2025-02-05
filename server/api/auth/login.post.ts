import { z } from 'zod'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
})

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const body = await readBody(event)
  const { username, password } = loginSchema.parse(body)
  const user = await findUser(username)

  if (!user || !(await bcrypt.compare(password, user.password!))) {
    throw createError({
      statusCode: 401,
      message: 'Invalid credentials'
    })
  }

  const token = jwt.sign(
    {
      userId: user.id,
      roleId: user.role.id,
    },
    config.jwtSecret,
    { expiresIn: '24h' }
  ) as string

  setResponseHeader(event, 'Set-Cookie', `token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`)

  return {
    token,
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
    }
  }
})

async function findUser(username: string) {
  const db = useDatabase()
  const result = await db
    .prepare(`
      SELECT u.id, u.username, u.password, r.id as role_id, r.name as role_name
      FROM users AS u
      JOIN roles AS r ON u.role_id = r.id
      WHERE u.username = ?
    `)
    .bind(username)
    .get() as any

  return {
    id: result.id,
    username: result.username,
    password: result.password,
    role: {
      id: result.role_id,
      name: result.role_name,
    }
  }
}
