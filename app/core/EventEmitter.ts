import type { CustomEventHandler } from '~/types'

export class EventEmitter<
  EventType = string,
  EventArg = unknown,
  EventReturn = void,
> {
  private handlers: Map<
    EventType,
    CustomEventHandler<EventArg, EventReturn>[]
  > = new Map()

  emit(event: EventType, arg?: EventArg): void {
    const handlers = this.handlers.get(event)

    if (handlers?.length) {
      for (const handler of handlers) {
        handler(arg)
      }
    }
  }

  on(event: EventType, fn: CustomEventHandler<EventArg, EventReturn>): void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, [])
    }

    this.handlers.get(event)!.push(fn)
  }

  off(event: EventType, fn: CustomEventHandler<EventArg, EventReturn>): void {
    const handlers = this.handlers.get(event)

    if (handlers?.length) {
      const index: number = handlers.indexOf(fn)

      if (index > -1) {
        handlers.splice(index, 1)
      }
    }
  }
}
