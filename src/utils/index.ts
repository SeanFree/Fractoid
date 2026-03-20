export * from './audio'
export * from './buffer'
export * from './math'
export * from './strings'

export const noop = (): void => {
  return
}

export const swap = <T extends Array<unknown>>(
  a: T,
  i: number,
  b: T,
  j: number
) => {
  if (!a[i]) throw new Error(`Array A has no entry at index i: ${i}`)
  if (!b[i]) throw new Error(`Array B has no entry at index i: ${i}`)
  if (!a[j]) throw new Error(`Array A has no entry at index j: ${j}`)
  if (!b[j]) throw new Error(`Array B has no entry at index j: ${j}`)
  ;[a[i], b[j]] = [b[j], a[i]]
}
