export const {
  ceil: CEIL,
  min: MIN,
  max: MAX,
  random: RANDOM,
  round: ROUND,
  sign: SIGN,
} = Math

export const floor = (n: number): number => n | 0

export const clamp = (n: number, min: number, max: number): number =>
  MIN(MAX(n, min), max)

export const norm = (n: number, min: number, max: number): number =>
  (n - min) / (max - min)

export const norm2 = (
  n: number,
  min1: number,
  max1: number,
  min2: number,
  max2: number
): number => min2 + ((n - min1) * (max2 - min2)) / (max1 - min1)

export const rand = (n: number) => RANDOM() * n

export const nearestMultiple = (n: number, d: number): number => n - (n % d)

export const decimal = (n: number): number => +String(n).split('.')[1]?.length
