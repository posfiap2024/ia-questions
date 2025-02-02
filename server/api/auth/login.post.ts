import { z } from 'zod'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { useDb } from '~/server/utils/db'

const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
})

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const body = await readBody(event)
  const { username, password } = loginSchema.parse(body)

  const { findUser } = useDb()
  const user = await findUser({ username })

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
