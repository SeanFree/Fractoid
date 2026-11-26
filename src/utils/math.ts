export const {
  ceil: CEIL,
  cos: COS,
  min: MIN,
  max: MAX,
  random: RANDOM,
  round: ROUND,
  sign: SIGN,
  sin: SIN,
  floor: FLOOR,
  PI,
} = Math

export const TAU = 2 * PI

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

export const rotate = (
  [x, y]: [number, number],
  angle: number
): [number, number] => {
  const cos = COS(angle)
  const sin = SIN(angle)

  return [x * cos - y * sin, x * sin + y * cos]
}
