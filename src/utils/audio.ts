import { AUDIO_SPECTRUM_RANGE } from '@/consts'
import { FLOOR, MAX } from '@/utils'

import type { AudioBinRange, AudioBandRanges } from '@/types'

export const getSpectrumWidth = (
  frequency: number,
  nyquist: number,
  domainLength: number
): number => FLOOR((frequency / nyquist) * domainLength)

export const toBinRange = (
  [low, high]: [number, number],
  nyquist: number,
  binCount: number
): AudioBinRange => {
  const start = getSpectrumWidth(low, nyquist, binCount)
  // enforce minimum of 1 for band end
  const end = MAX(getSpectrumWidth(high, nyquist, binCount), start + 1)
  const bandWidth = end - start

  return [start, end, bandWidth]
}

export const getBinRanges = (
  nyquist: number,
  binCount: number
): AudioBandRanges => ({
  SUB_BASS: toBinRange(AUDIO_SPECTRUM_RANGE[0], nyquist, binCount),
  BASS: toBinRange(AUDIO_SPECTRUM_RANGE[1], nyquist, binCount),
  LOW_MID: toBinRange(AUDIO_SPECTRUM_RANGE[2], nyquist, binCount),
  MID: toBinRange(AUDIO_SPECTRUM_RANGE[3], nyquist, binCount),
  HIGH_MID: toBinRange(AUDIO_SPECTRUM_RANGE[4], nyquist, binCount),
  PRESENCE: toBinRange(AUDIO_SPECTRUM_RANGE[5], nyquist, binCount),
  BRILLIANCE: toBinRange(AUDIO_SPECTRUM_RANGE[6], nyquist, binCount),
})
