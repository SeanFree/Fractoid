interface WorkerMessage<
  T extends string,
  D extends Record<string | number, unknown> = never,
> {
  type: T
  payload?: D
}
