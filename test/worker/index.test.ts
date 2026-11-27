// @vitest-environment node
import { describe, expect, it } from 'vitest'
import app from '../../worker'
import { createBucket, createMp3, executionCtx, sameOrigin } from './fixtures'

import type { TrackListResponse } from '../../src/types/audio'

describe('worker', () => {
  let bucket: R2Bucket

  const artwork = Array.from({ length: 256 }, (_, i) => i)

  const setup = (
    objects: Parameters<typeof createBucket>[0],
    failing?: string[]
  ) => {
    bucket = createBucket(objects, failing)
  }

  const request = (path: string, init: RequestInit = sameOrigin) =>
    app.request(path, init, { FRACTOID: bucket }, executionCtx)

  describe('same-origin check', () => {
    it.each(['/api/tracks', '/api/artwork/a', '/api/audio/a'])(
      'should refuse cross-site requests to $0',
      async (path) => {
        setup({})

        const response = await request(path, {
          headers: { 'Sec-Fetch-Site': 'cross-site' },
        })

        expect(response.status).toBe(403)
      }
    )
  })

  describe('/api/tracks', () => {
    it('should list each mp3 with its tags, duration and artwork url', async () => {
      setup({
        'audio/Stars_JVNA.mp3': {
          data: createMp3({
            frames: 1000,
            tags: {
              title: 'Stars',
              artist: 'JVNA',
              album: 'YouTube Audio Library',
              year: '2019',
              artwork,
            },
          }),
        },
      })

      const response = await request('/api/tracks')
      const { tracks } = (await response.json()) as TrackListResponse

      expect(tracks).toEqual([
        {
          fileUrl: '/api/audio/Stars_JVNA',
          metadata: {
            title: 'Stars',
            artist: 'JVNA',
            album: 'YouTube Audio Library',
            year: '2019',
            duration: expect.closeTo(26.122, 3),
            artwork: '/api/artwork/Stars_JVNA',
          },
        },
      ])
    })

    it('should fall back to the file name when a track has no tags', async () => {
      setup({ 'audio/Untitled.mp3': { data: createMp3() } })

      const response = await request('/api/tracks')
      const { tracks } = (await response.json()) as TrackListResponse

      expect(tracks[0]!.metadata.title).toBe('Untitled')
    })

    it('should leave out files that are not mp3s', async () => {
      setup({
        'audio/a.mp3': { data: createMp3() },
        'audio/notes.txt': { data: new Uint8Array(4) },
      })

      const response = await request('/api/tracks')
      const { tracks } = (await response.json()) as TrackListResponse

      expect(tracks.map(({ fileUrl }) => fileUrl)).toEqual(['/api/audio/a'])
    })

    it('should skip a file that cannot be read and list the rest', async () => {
      setup(
        {
          'audio/a.mp3': { data: createMp3() },
          'audio/b.mp3': { data: createMp3() },
        },
        ['audio/a.mp3']
      )

      const response = await request('/api/tracks')
      const { tracks } = (await response.json()) as TrackListResponse

      expect(tracks.map(({ fileUrl }) => fileUrl)).toEqual(['/api/audio/b'])
    })
  })

  describe('/api/artwork/:name', () => {
    it('should return the embedded artwork with its content type', async () => {
      setup({ 'audio/a.mp3': { data: createMp3({ tags: { artwork } }) } })

      const response = await request('/api/artwork/a')

      expect(response.headers.get('content-type')).toBe('image/jpeg')
      expect([...new Uint8Array(await response.arrayBuffer())]).toEqual(artwork)
    })

    it('should read artwork from a tag larger than the first read', async () => {
      const large = Array.from({ length: 100 * 1024 }, (_, i) => i % 256)

      setup({
        'audio/a.mp3': { data: createMp3({ tags: { artwork: large } }) },
      })

      const response = await request('/api/artwork/a')

      expect(new Uint8Array(await response.arrayBuffer()).length).toBe(
        large.length
      )
    })

    it('should return 404 for a track without artwork', async () => {
      setup({ 'audio/a.mp3': { data: createMp3({ tags: { title: 'A' } }) } })

      const response = await request('/api/artwork/a')

      expect(response.status).toBe(404)
    })

    it('should return 404 for a name with unexpected characters', async () => {
      setup({})

      const response = await request('/api/artwork/a%20b')

      expect(response.status).toBe(404)
    })
  })

  describe('/api/audio/:name', () => {
    it('should return the whole file without a Range header', async () => {
      const data = createMp3()

      setup({ 'audio/a.mp3': { data, contentType: 'audio/mpeg' } })

      const response = await request('/api/audio/a')

      expect(response.status).toBe(200)
      expect(response.headers.get('accept-ranges')).toBe('bytes')
      expect(new Uint8Array(await response.arrayBuffer()).length).toBe(
        data.length
      )
    })

    it('should return 206 with Content-Range for a Range request', async () => {
      const data = createMp3()

      setup({ 'audio/a.mp3': { data } })

      const response = await request('/api/audio/a', {
        headers: { 'Sec-Fetch-Site': 'same-origin', Range: 'bytes=0-99' },
      })

      expect(response.status).toBe(206)
      expect(response.headers.get('content-range')).toBe(
        `bytes 0-99/${data.length}`
      )
    })

    it('should not accept writes', async () => {
      setup({ 'audio/a.mp3': { data: createMp3() } })

      const response = await request('/api/audio/a', {
        method: 'PUT',
        headers: { 'Sec-Fetch-Site': 'same-origin' },
      })

      expect(response.status).toBe(404)
    })

    it('should return 404 for a name with unexpected characters', async () => {
      setup({ 'audio/a b.mp3': { data: createMp3() } })

      const response = await request('/api/audio/a%20b')

      expect(response.status).toBe(404)
    })
  })
})
