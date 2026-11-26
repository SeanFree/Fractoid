import { FLOOR } from '@/utils'

export const getSpectrumWidth = (
  frequency: number,
  nyquist: number,
  domainLength: number
): number => FLOOR((frequency / nyquist) * domainLength)

export const toBinRange = (
  [low, high]: [number, number],
  nyquist: number,
  binCount: number
): [number, number] => {
  const start = getSpectrumWidth(low, nyquist, binCount)
  const end = getSpectrumWidth(high, nyquist, binCount)
  return [start, Math.max(end, start + 1)]
}
