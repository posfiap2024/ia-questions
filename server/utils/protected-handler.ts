import type { EventHandlerRequest, EventHandler } from 'h3'
import { defineEventHandler } from 'h3'
import jwt from 'jsonwebtoken'

export function defineProtectedHandler<T extends EventHandlerRequest, D>(
  handler: EventHandler<T, D>,
  options?: HandlerOptions
): EventHandler<T, D> {
  return defineEventHandler<T>(async (event) => {
    const { roles } = options || {}
    const config = useRuntimeConfig(event)
    const token = getCookie(event, 'token')

    if (!token) {
      throw createError({
        statusCode: 403,
        message: 'Forbidden'
      })
    }

    try {
      const decoded = jwt.verify(token, config.jwtSecret) as { userId: number, roleId: number }
      const user = await findUser(decoded.userId)

      if (!user) {
        throw new ErrorWithStatusCode(401, 'Unauthorized')
      }

      if (roles && !roles.includes(user.role.name)) {
        throw new ErrorWithStatusCode(403, 'Forbidden')
      }

      event.context.user = {
        id: user.id,
        username: user.username,
        role: user.role,
      }
    } catch (error) {
      if (error instanceof ErrorWithStatusCode) {
        throw createError({
          statusCode: error.status,
          message: error.message
        })
      }
    }

    return await handler(event)
  })
}

async function findUser(id: number) {
  const db = useDatabase()
  const result = await db
    .prepare(`
      SELECT u.id, u.username, u.password, r.id as role_id, r.name as role_name
      FROM users AS u
      JOIN roles AS r ON u.role_id = r.id
      WHERE u.id = ?
    `)
    .bind(id)
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

type HandlerOptions = {
  roles?: string[]
}

class ErrorWithStatusCode extends Error {
  constructor(readonly status: number, message: string) {
    super(message)
    this.name = 'ErrorWithStatusCode'
  }
}
