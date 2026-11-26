export class MockAnalyserNode {
  fftSize = 2048
  maxDecibels = -30
  minDecibels = -100
  smoothingTimeConstant = 0.8

  constructor(readonly context: MockAudioContext) {}

  get frequencyBinCount() {
    return this.fftSize / 2
  }

  connect<T>(node: T): T {
    return node
  }

  disconnect() {}

  getByteFrequencyData(array: Uint8Array) {
    array.fill(0)
  }

  getByteTimeDomainData(array: Uint8Array) {
    array.fill(128)
  }
}

export class MockAudioContext {
  readonly sampleRate: number
  state: AudioContextState = 'running'

  constructor(options?: AudioContextOptions) {
    this.sampleRate = options?.sampleRate ?? 44100
  }

  createAnalyser() {
    return new MockAnalyserNode(this)
  }

  async resume() {
    this.state = 'running'
  }

  async close() {
    this.state = 'closed'
  }
}
