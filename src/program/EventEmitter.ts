import type { CustomEventHandler } from '@/types'

export class EventEmitter {
  events: {
    [eventName: string]: CustomEventHandler[]
  }

  constructor() {
    this.events = {}
  }

  dispatch(event: string, ...args: unknown[]): void {
    if (this.events[event]) {
      for (const handler of this.events[event]) {
        handler(...args)
      }
    }
  }

  subscribe(event: string, fn: CustomEventHandler): void {
    if (!this.events[event]) {
      this.events[event] = []
    }

    this.events[event].push(fn)
  }

  unsubscribe(event: string, fn: CustomEventHandler): void {
    const index: number = this.events[event].indexOf(fn)

    if (index > -1) {
      this.events[event].splice(index, 1)
    }
  }
}
