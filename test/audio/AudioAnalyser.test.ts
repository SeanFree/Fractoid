import { AudioAnalyser, AudioSpectrum } from '@/audio'
import { ANALYSER_CONFIG_DEFAULT } from '@/consts'
import type { AnalyserConfig } from '@/types'
import { describe, expect, it, vi } from 'vitest'

describe('AudioAnalyser', () => {
  let ctx: AudioContext
  let config: Partial<AnalyserConfig> = {}
  let audioAnalyser: AudioAnalyser

  const setup = (
    analyserConfig?: Partial<AnalyserConfig>,
    contextOptions?: AudioContextOptions
  ) => {
    ctx = new AudioContext(contextOptions)
    config = { ...analyserConfig }
    audioAnalyser = new AudioAnalyser(ctx, config)
  }

  describe('initialization', () => {
    it('should create a readonly AnalyserNode with provided config values', () => {
      setup(ANALYSER_CONFIG_DEFAULT)
      expect(audioAnalyser.analyser).toBeInstanceOf(AnalyserNode)
      expect(audioAnalyser.analyser.fftSize).toBe(
        ANALYSER_CONFIG_DEFAULT.fftSize
      )
      expect(audioAnalyser.analyser.maxDecibels).toBe(
        ANALYSER_CONFIG_DEFAULT.maxDecibels
      )
      expect(audioAnalyser.analyser.minDecibels).toBe(
        ANALYSER_CONFIG_DEFAULT.minDecibels
      )
      expect(audioAnalyser.analyser.smoothingTimeConstant).toBe(
        ANALYSER_CONFIG_DEFAULT.smoothingTimeConstant
      )
    })

    it('should apply default config values when no config is provided', () => {
      setup()
      expect(audioAnalyser.analyser.fftSize).toBe(
        ANALYSER_CONFIG_DEFAULT.fftSize
      )
      expect(audioAnalyser.analyser.maxDecibels).toBe(
        ANALYSER_CONFIG_DEFAULT.maxDecibels
      )
      expect(audioAnalyser.analyser.minDecibels).toBe(
        ANALYSER_CONFIG_DEFAULT.minDecibels
      )
      expect(audioAnalyser.analyser.smoothingTimeConstant).toBe(
        ANALYSER_CONFIG_DEFAULT.smoothingTimeConstant
      )
    })

    it('should set nyquist to half the context sample rate', () => {
      setup()
      expect(audioAnalyser.nyquist).toBe(0.5 * ctx.sampleRate)
    })

    it('should size freqDomain and timeDomain to binCount (fftSize / 2)', () => {
      const config: Partial<AnalyserConfig> = { fftSize: 512 }
      const binCount = 0.5 * config.fftSize!

      setup(config)
      expect(audioAnalyser.freqDomain.length).toBe(binCount)
      expect(audioAnalyser.timeDomain.length).toBe(binCount)
    })
  })

  describe('band getters', () => {
    const bands = [
      'subBass',
      'bass',
      'lowMid',
      'mid',
      'highMid',
      'presence',
      'brilliance',
    ] as const

    const cases = [32, 64, 128, 256, 512, 1024, 2048].flatMap((fftSize) =>
      bands.map((band) => ({ fftSize, band }))
    )

    it.each(cases)(
      '$band should average its bins at fftSize $fftSize',
      ({ fftSize, band }) => {
        setup({ fftSize })
        audioAnalyser.freqDomain.fill(200)
        expect(audioAnalyser[band]).toBe(200)
      }
    )

    const isolationCases = [44100, 48000].flatMap((sampleRate) =>
      bands.map((band) => ({ sampleRate, band }))
    )

    it.each(isolationCases)(
      '$band should be the only band to respond to its own bins at $sampleRate Hz',
      ({ sampleRate, band }) => {
        setup(undefined, { sampleRate })
        const spectrum = new AudioSpectrum(
          audioAnalyser.node,
          audioAnalyser.nyquist
        )
        const [start, end] = spectrum[band]

        audioAnalyser.freqDomain.fill(0)
        audioAnalyser.freqDomain.fill(200, start, end)

        for (const other of bands) {
          expect(audioAnalyser[other]).toBe(other === band ? 200 : 0)
        }
      }
    )
  })

  describe('getFrequency', () => {
    const setupIndexedBins = () => {
      setup({ fftSize: 512 }, { sampleRate: 44100 })

      for (let i = 0; i < audioAnalyser.freqDomain.length; i++) {
        audioAnalyser.freqDomain[i] = i
      }
    }

    it('should return bin 0 for 0 Hz', () => {
      setupIndexedBins()
      expect(audioAnalyser.getFrequency(0)).toBe(0)
    })

    it('should return the bin containing a mid-range frequency', () => {
      setupIndexedBins()
      expect(audioAnalyser.getFrequency(1000)).toBe(11)
    })

    it('should return the last bin for a frequency just below nyquist', () => {
      setupIndexedBins()
      expect(audioAnalyser.getFrequency(audioAnalyser.nyquist - 1)).toBe(255)
    })
  })

  describe('update', () => {
    it('should fill freqDomain via getByteFrequencyData', () => {
      setup()

      const spy = vi.spyOn(audioAnalyser.analyser, 'getByteFrequencyData')

      audioAnalyser.update()
      expect(spy).toHaveBeenCalledWith(audioAnalyser.freqDomain)
    })

    it('should fill timeDomain via getByteTimeDomainData', () => {
      setup()

      const spy = vi.spyOn(audioAnalyser.analyser, 'getByteTimeDomainData')

      audioAnalyser.update()
      expect(spy).toHaveBeenCalledWith(audioAnalyser.timeDomain)
    })
  })

  describe('connect', () => {
    it('should forward to the analyser and return its result', () => {
      setup()

      const destination = ctx.createAnalyser()
      const spy = vi.spyOn(audioAnalyser.analyser, 'connect')

      expect(audioAnalyser.connect(destination)).toBe(destination)
      expect(spy).toHaveBeenCalledWith(destination)
    })
  })

  describe('accessors', () => {
    it('should return the analyser from node', () => {
      setup()
      expect(audioAnalyser.node).toBe(audioAnalyser.analyser)
    })

    it('should return frequencyBinCount from binCount', () => {
      setup({ fftSize: 512 })
      expect(audioAnalyser.binCount).toBe(256)
    })
  })
})
