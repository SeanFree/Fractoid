import { EventEmitter } from '../../../app/core/EventEmitter'
import { beforeEach, expect, describe, it, vi } from 'vitest'

describe('EventEmitter', () => {
  let emitter: EventEmitter

  beforeEach(() => {
    vi.clearAllMocks()
    emitter = new EventEmitter()
  })

  it('should call registered handler on emit', () => {
    const eventFn = vi.fn()

    emitter.on('test', eventFn)
    emitter.emit('test', true)

    expect(eventFn).toHaveBeenCalledWith(true)
  })

  it('should call multiple registered handlers on emit', () => {
    const eventFn1 = vi.fn()
    const eventFn2 = vi.fn()

    emitter.on('test', eventFn1)
    emitter.on('test', eventFn2)

    emitter.emit('test', true)

    expect(eventFn1).toHaveBeenCalledWith(true)
    expect(eventFn2).toHaveBeenCalledWith(true)
  })

  it('should not call unregistered handler on emit', () => {
    const eventFn = vi.fn()

    emitter.on('test', eventFn)
    emitter.off('test', eventFn)
    emitter.emit('test', true)

    expect(eventFn).not.toHaveBeenCalled()
  })

  it('should not unregister multiple handlers', () => {
    const eventFn1 = vi.fn()
    const eventFn2 = vi.fn()

    emitter.on('test', eventFn1)
    emitter.on('test', eventFn2)
    emitter.off('test', eventFn2)
    emitter.emit('test', true)

    expect(eventFn1).toHaveBeenCalledWith(true)
    expect(eventFn2).not.toHaveBeenCalledWith(true)
  })

  it('should not unregister unknown handlers', () => {
    const eventFn1 = vi.fn()
    const eventFn2 = vi.fn()

    emitter.on('test', eventFn1)
    emitter.off('test', eventFn2)
    emitter.emit('test', true)

    expect(eventFn1).toHaveBeenCalledWith(true)
    expect(eventFn2).not.toHaveBeenCalledWith(true)
  })

  it('no-op deregister for coverage', () => {
    emitter.off('test', vi.fn())
  })
})
