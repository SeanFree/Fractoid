import { Hono } from 'hono'
import { cache } from 'hono/cache'
import { handleAudio } from './audio'
import { sameOriginOnly } from './middleware'
import { handleArtwork, handleTrackList } from './tracks'

import type { AppEnv } from './types'

const app = new Hono<AppEnv>()

const edgeCache = cache({ cacheName: 'fractoid-api' })

app.use('/api/*', sameOriginOnly)

// The track list and artwork are built from several R2 reads, so they're
// cached at the edge for the lifetime in each response's Cache-Control.
// Audio is streamed straight from R2 with Range support, so it isn't.
app.use('/api/tracks', edgeCache)
app.use('/api/artwork/*', edgeCache)

app.get('/api/tracks', handleTrackList)
app.get('/api/artwork/:name', handleArtwork)
app.get('/api/audio/:name', handleAudio)

export default app
