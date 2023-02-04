import { floor } from '@/utils'

export const pad = (
  v: string | number,
  n: number | string,
  c: number | string
): string => `${c.toString().repeat(+n)}${v}`.slice(-n)

export const hhmmss = (s: number | string): string => {
  const $s = Number(s)

  const m = ($s / 60) | 0
  const h = (m / 60) | 0
  const HH = h ? `${pad(h, 2, '0')}:` : ''
  const MM = pad(floor($s / 60), h || m >= 10 ? 2 : 1, '0')
  const SS = pad(floor($s % 60), 2, '0')

  return `${HH}${MM}:${SS}`
}

export const getUniqueId = (): string => {
  return crypto ? crypto.randomUUID() : Date.now().toString(16)
}
