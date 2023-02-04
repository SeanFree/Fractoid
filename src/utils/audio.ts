import { floor } from '@/utils'

export const getSpectrumWidth = (
  frequency: number,
  nyquist: number,
  domainLength: number
): number => floor((frequency / nyquist) * domainLength)
