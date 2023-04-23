import { floor, rand } from '@/utils'

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
  return crypto?.randomUUID?.() || Date.now().toString(16)
}

export const getRandomString = (length: number) => {
  const charCodes = [
    48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 65, 66, 67, 68, 69, 70, 71, 72, 73,
    74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 97, 98,
    99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113,
    114, 115, 116, 117, 118, 119, 120, 121, 122,
  ]

  let codeVerifier = ''

  for (let i = 0; i < length; i++) {
    codeVerifier += String.fromCharCode(
      charCodes[floor(rand(charCodes.length))]
    )
  }

  return codeVerifier
}
