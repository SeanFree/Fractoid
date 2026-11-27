import { getTrackKey } from './tracks'

import type { Context } from 'hono'
import type { AppEnv } from './types'

const getContentRange = (range: R2Range, size: number): string => {
  let offset: number
  let length: number

  if ('suffix' in range) {
    offset = size - range.suffix
    length = range.suffix
  } else {
    offset = range.offset ?? 0
    length = range.length ?? size - offset
  }

  return `bytes ${offset}-${offset + length - 1}/${size}`
}

export const handleAudio = async (c: Context<AppEnv>): Promise<Response> => {
  const key = getTrackKey(c.req.param('name'))

  if (!key) return c.notFound()

  const requestHeaders = c.req.raw.headers
  const object = await c.env.FRACTOID.get(key, {
    range: requestHeaders,
    onlyIf: requestHeaders,
  })

  if (!object) return c.notFound()

  const headers = new Headers()

  object.writeHttpMetadata(headers)
  headers.set('etag', object.httpEtag)
  headers.set('accept-ranges', 'bytes')
  headers.set('cache-control', 'private, max-age=86400')

  // R2 returns the object without a body when an onlyIf condition fails
  if (!('body' in object)) {
    const status = requestHeaders.has('If-None-Match') ? 304 : 412

    return new Response(null, { status, headers })
  }

  if (object.range && requestHeaders.has('Range')) {
    headers.set('content-range', getContentRange(object.range, object.size))

    return new Response(object.body, { status: 206, headers })
  }

  return new Response(object.body, { headers })
}
