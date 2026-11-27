import type { MiddlewareHandler } from 'hono'
import type { AppEnv } from './types'

export const sameOriginOnly: MiddlewareHandler<AppEnv> = async (c, next) => {
  if (c.req.header('Sec-Fetch-Site') !== 'same-origin') {
    return c.text('Forbidden', 403)
  }

  await next()
}
