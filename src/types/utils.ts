export type ValueOf<T> = T[keyof T]

export type MouseEventHandler = (e: MouseEvent) => unknown

export type CustomEventHandler = (...args: unknown[]) => unknown
