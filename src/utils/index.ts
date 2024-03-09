export * from './arrays'
export * from './audio'
export * from './buffer'
export * from './files'
export * from './math'
export * from './strings'

export const noop = (): void => {
  return
}

export const debounce = (fn: Function, wait = 200) => {
  let timeout: NodeJS.Timeout

  return (...args: unknown[]) => {
    if (timeout) clearTimeout(timeout)

    timeout = setTimeout(() => fn(...args), wait)
  }
}
