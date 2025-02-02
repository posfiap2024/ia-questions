import type { EventHandlerRequest, EventHandler } from 'h3'
import { defineEventHandler } from 'h3'
import jwt from 'jsonwebtoken'

export function defineProtectedHandler<T extends EventHandlerRequest, D>(
  handler: EventHandler<T, D>
): EventHandler<T, D> {
  return defineEventHandler<T>(async (event) => {
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
        throw new Error('User not found')
      }

      event.context.user = {
        id: user.id,
        username: user.username,
        role: user.role,
      }
    } catch (error) {
      throw createError({
        statusCode: 401,
        message: 'Unauthorized'
      })
    }

    return await handler(event)
  })
}
