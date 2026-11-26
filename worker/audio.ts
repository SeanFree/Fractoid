import type { Context } from 'hono'
import type { AppEnv } from './types'

export const handleAudio = async (c: Context<AppEnv>): Promise<Response> => {
  if (c.req.header('Sec-Fetch-Site') !== 'same-origin') {
    return c.text('Forbidden', 403)
  }

  const object = await c.env.FRACTOID.get(c.req.path.slice(1))

  if (!object) return c.notFound()

  const headers = new Headers()

  object.writeHttpMetadata(headers)
  headers.set('etag', object.httpEtag)
  headers.set('cache-control', 'private, max-age=86400')

  return new Response(object.body, { headers })
}
