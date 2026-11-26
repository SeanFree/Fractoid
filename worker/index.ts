import { Hono } from 'hono'
import { handleAudio } from './audio'

import type { AppEnv } from './types'

const app = new Hono<AppEnv>()

app.get('/audio/*', handleAudio)

export default app
