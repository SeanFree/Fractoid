// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { getDuration, getTagSize } from '../../worker/mp3'
import { BITRATE, SAMPLE_RATE, SAMPLES_PER_FRAME, createMp3 } from './fixtures'

describe('mp3', () => {
  describe('getTagSize', () => {
    it('should return 0 for a file without an ID3 tag', () => {
      expect(getTagSize(createMp3())).toBe(0)
    })

    it('should return the tag size including its 10 byte header', () => {
      const untagged = createMp3()
      const tagged = createMp3({ tags: { title: 'Title' } })

      expect(getTagSize(tagged)).toBe(tagged.length - untagged.length)
    })
  })

  describe('getDuration', () => {
    it('should use the Xing frame count when the file has one', () => {
      const mp3 = createMp3({ frames: 1000 })

      expect(getDuration(mp3, 0, mp3.length)).toBeCloseTo(
        (1000 * SAMPLES_PER_FRAME) / SAMPLE_RATE
      )
    })

    it('should estimate from the bitrate when there is no Xing frame', () => {
      const mp3 = createMp3({ frames: 1000, xing: false })

      expect(getDuration(mp3, 0, mp3.length)).toBeCloseTo(
        (mp3.length * 8) / BITRATE
      )
    })

    it('should start looking for a frame after the tag', () => {
      const mp3 = createMp3({ frames: 1000, tags: { title: 'Title' } })

      expect(getDuration(mp3, getTagSize(mp3), mp3.length)).toBeCloseTo(
        (1000 * SAMPLES_PER_FRAME) / SAMPLE_RATE
      )
    })

    it('should return undefined when there is no frame', () => {
      const bytes = new Uint8Array(64)

      expect(getDuration(bytes, 0, bytes.length)).toBeUndefined()
    })
  })
})
