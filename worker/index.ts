import { Hono } from 'hono'
import { secureHeaders } from 'hono/secure-headers'
import { handleAudio } from './audio'

import type { AppEnv } from './types'

const app = new Hono<AppEnv>()

app.use('/audio/*', secureHeaders({ strictTransportSecurity: false }))

app.get('/audio/*', handleAudio)

export default app
