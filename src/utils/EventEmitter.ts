export type CustomEventImpl<T> = CustomEvent<T>

export interface CustomEventHandler<T = unknown> extends EventListener {
  (evt?: CustomEventImpl<{ detail: T }>): void
}

export class EventEmitter<Events = Record<string, unknown>> {
  protected eventTarget: EventTarget = new EventTarget()

  emit<K extends keyof Events>(event: K, detail?: Events[K]): void {
    this.eventTarget.dispatchEvent(new CustomEvent(event as string, { detail }))
  }

  on<K extends keyof Events>(
    event: K,
    handler: CustomEventHandler<Events[K]>
  ): () => void {
    this.eventTarget.addEventListener(event as string, handler)

    return () => this.eventTarget.removeEventListener(event as string, handler)
  }
}
