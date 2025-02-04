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
    const { findUser } = useDb()

    if (!token) {
      throw createError({
        statusCode: 403,
        message: 'Forbidden'
      })
    }

    try {
      const decoded = jwt.verify(token, config.jwtSecret) as { userId: number, roleId: number }
      const user = await findUser({ id: decoded.userId })

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

type HandlerOptions = {
  roles?: string[]
}

class ErrorWithStatusCode extends Error {
  constructor(readonly status: number, message: string) {
    super(message)
    this.name = 'ErrorWithStatusCode'
  }
}
