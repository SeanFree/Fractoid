import type { CustomEventHandler } from '@/types'

export class EventEmitter<EventType = string> {
  handlers: Map<EventType, CustomEventHandler[]> = new Map()

  emit(event: EventType, ...args: unknown[]): void {
    const handlers = this.handlers.get(event)

    if (handlers?.length) {
      for (const handler of handlers) {
        handler(...args)
      }
    }
  }

  on(event: EventType, fn: CustomEventHandler): void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, [])
    }

    this.handlers.get(event)!.push(fn)
  }

  off(event: EventType, fn: CustomEventHandler): void {
    const handlers = this.handlers.get(event)

    if (handlers?.length) {
      const index: number = handlers.indexOf(fn)

      if (index > -1) {
        handlers.splice(index, 1)
      }
    }
  }
}
