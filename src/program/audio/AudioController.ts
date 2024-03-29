import {
  AUDIO_CHANNELS,
  AUDIO_CONTROLLER_EVENTS,
  AUDIO_CORE_EVENTS,
  GRAPHIC_EQ_PRESET_MAP,
  VOLUME_DEFAULT,
} from '@/consts'

import type {
  AudioControllerEvent,
  AudioCoreEvent,
  AnalyserConfig,
  GraphicEqFrequency,
  GraphicEqPreset,
  GraphicEqPresetName,
  CustomEventHandler,
  TrackMetadata,
} from '@/types'

import {
  AudioAnalyser,
  GraphicEqualizer,
  AudioTrack,
  EventEmitter,
  TrackClient,
  TrackList,
} from '@/program'

type RepeatType = 'all' | 'one' | 'off'
type EventType = AudioControllerEvent | AudioCoreEvent

export class AudioController extends EventEmitter<EventType> {
  private _eqPresetName: GraphicEqPresetName | string = 'flat'
  private gainNode: GainNode
  private mediaSrc: MediaElementAudioSourceNode
  private equalizer: GraphicEqualizer
  private trackClient: TrackClient
  private trackList: TrackList
  private _shuffleTracks: boolean = false

  readonly ctx: AudioContext
  readonly el: HTMLAudioElement
  readonly audioChannels: {
    [id: number]: () => number
  }
  readonly analyser: AudioAnalyser
  repeat: RepeatType = 'all'

  constructor(
    root?: string | HTMLAudioElement,
    analyserConfig?: Partial<AnalyserConfig>
  ) {
    super()

    let el: HTMLAudioElement | null = null

    if (!root) {
      el = document.createElement('audio')
    } else if (typeof root === 'string') {
      el = document.querySelector(root) as HTMLAudioElement
    } else if (typeof root === 'object' && root?.nodeName === 'AUDIO') {
      el = root
    }

    if (!el || el.nodeName !== 'AUDIO') {
      const error = new TypeError()

      error.message = `Invalid argument provided for root: ${
        (root as HTMLElement)?.nodeName || (root as string)
      }`

      throw error
    }

    this.el = el
    this.ctx = new AudioContext()
    this.mediaSrc = this.ctx.createMediaElementSource(this.el)

    this.gainNode = this.ctx.createGain()
    this.gainNode.gain.value = VOLUME_DEFAULT

    this.analyser = new AudioAnalyser(this.ctx, analyserConfig)
    this.equalizer = new GraphicEqualizer(this.ctx)

    this.mediaSrc.connect(this.gainNode).connect(this.equalizer.head)

    this.equalizer.tail
      .connect(this.analyser.node)
      .connect(this.ctx.destination)

    this.audioChannels = {
      [AUDIO_CHANNELS.SUB_BASS]: () => this.analyser.subBass,
      [AUDIO_CHANNELS.BASS]: () => this.analyser.bass,
      [AUDIO_CHANNELS.LOW_MID]: () => this.analyser.lowMid,
      [AUDIO_CHANNELS.MID]: () => this.analyser.mid,
      [AUDIO_CHANNELS.HIGH_MID]: () => this.analyser.highMid,
      [AUDIO_CHANNELS.PRESENCE]: () => this.analyser.presence,
      [AUDIO_CHANNELS.BRILLIANCE]: () => this.analyser.brilliance,
    }

    this.trackClient = new TrackClient()
    this.trackList = new TrackList()

    this.on('ended', () => {
      if (this.repeat === 'all') {
        this.skipNext()
      } else if (this.repeat === 'one') {
        this.play()
      } else if (this.repeat === 'off') {
        const autoplay =
          this.trackList.currentIndex !== this.trackList.count - 1

        this.skipNext(autoplay)
      }
    })
  }

  get shuffleTracks(): boolean {
    return this._shuffleTracks
  }

  set shuffleTracks(enabled: boolean) {
    this._shuffleTracks = enabled

    if (enabled) {
      this.shuffle()
    } else {
      this.unshuffle()
    }
  }

  get eqPresetName(): GraphicEqPresetName | string {
    return this._eqPresetName
  }

  set eqPresetName(name: GraphicEqPresetName | string) {
    this._eqPresetName = name

    if ((name as string) in GRAPHIC_EQ_PRESET_MAP) {
      this.eqPreset = GRAPHIC_EQ_PRESET_MAP[name as GraphicEqPresetName]
    }

    this.emit(AUDIO_CONTROLLER_EVENTS.eqPresetChange, {
      name: this.eqPresetName,
      values: this.eqPreset,
    })
  }

  get eqPreset(): GraphicEqPreset {
    return this.equalizer.preset
  }

  set eqPreset(preset: GraphicEqPreset) {
    for (const [frequency, value] of Object.entries(preset)) {
      this.equalizer.setGain(+frequency as GraphicEqFrequency, value)
    }
  }

  get playing(): boolean {
    return !this.el.paused
  }

  get tracks(): AudioTrack[] {
    return this.trackList.items
  }

  set currentTrack(track: AudioTrack | AudioTrack['id']) {
    const id =
      typeof track === 'string'
        ? track
        : track instanceof AudioTrack
        ? track.id
        : this.currentTrack.id

    this.skip(this.trackList.getIndex(id))
  }

  get currentTrack(): AudioTrack {
    return this.trackList.currentTrack as AudioTrack
  }

  get trackMetadata(): TrackMetadata | undefined {
    return this.currentTrack?.metadata
  }

  get trackCount(): number {
    return this.trackList.count
  }

  set elementSrc(src: string) {
    this.el.src = src
  }

  get currentTime(): number {
    return this.el.currentTime
  }

  set currentTime(time) {
    this.el.currentTime = time
  }

  get duration(): number {
    return this.currentTrack?.metadata?.duration || 0
  }

  get volume(): number {
    return this.gainNode.gain.value
  }

  set volume(value: number) {
    this.gainNode.gain.value = value
  }

  async addOne(
    item: File | string,
    autoSave = true,
    dispatchEvent = true
  ): Promise<AudioTrack | null> {
    if (dispatchEvent) {
      this.emit(AUDIO_CONTROLLER_EVENTS.loading)
    }

    let track: AudioTrack | null = null

    if (item instanceof File) {
      track = (await this.trackClient.createTrack(item)) as AudioTrack
    } else if (typeof item === 'string') {
      track = (await this.trackClient.fetchTrack(item)) as AudioTrack
    }

    if (track && autoSave) {
      this.trackList.add(track)
    }

    if (dispatchEvent) {
      this.emit(AUDIO_CONTROLLER_EVENTS.loaded)
    }

    return track
  }

  async addAll(items: File[] | string[]): Promise<(AudioTrack | null)[]> {
    this.emit(AUDIO_CONTROLLER_EVENTS.loading)

    const previousIndex = this.trackCount - 1
    const tracks = await Promise.all(
      items.map((item) => this.addOne(item, false, false))
    )

    for (const track of tracks) {
      track && this.trackList.add(track)
    }

    this.trackList.currentIndex = previousIndex + 1

    this.elementSrc = this.currentTrack.objectUrl as string

    this.emit(AUDIO_CONTROLLER_EVENTS.loaded)

    return tracks
  }

  updateAnalyser(): void {
    this.analyser.update()
  }

  getChannelValue(
    channelId = AUDIO_CHANNELS.SUB_BASS,
    normalize = false
  ): number {
    return this.audioChannels[channelId]() / (normalize ? 255 : 1)
  }

  setChannelGain(frequency: number, gain: number) {
    this.equalizer.setGain(frequency, gain)
  }

  getChannelGain(frequency: number) {
    return this.equalizer.getGain(frequency)
  }

  on(
    event: AudioControllerEvent | AudioCoreEvent,
    fn: CustomEventHandler | EventListener
  ) {
    if ((event as string) in AUDIO_CONTROLLER_EVENTS) {
      super.on(event, fn as CustomEventHandler)
    } else if (AUDIO_CORE_EVENTS[event as AudioCoreEvent]) {
      this.el.addEventListener(event, fn)
    }
  }

  off(
    event: AudioControllerEvent | AudioCoreEvent,
    fn: CustomEventHandler | EventListener
  ) {
    if ((event as AudioControllerEvent) in AUDIO_CONTROLLER_EVENTS) {
      super.off(event, fn as CustomEventHandler)
    } else if (AUDIO_CORE_EVENTS[event as AudioCoreEvent]) {
      this.el.removeEventListener(event, fn)
    }
  }

  async play(): Promise<void> {
    if (this.el.src) {
      await this.ctx.resume()
      await this.el.play()
    }
  }

  pause(): void {
    if (this.el.src) {
      this.el.pause()
    }
  }

  async disconnect(): Promise<void> {
    this.elementSrc = ''

    this.ctx.destination.disconnect()
    this.gainNode.disconnect()
    this.analyser.node.disconnect()
    this.mediaSrc.disconnect()

    await this.ctx.close()
  }

  async skip(index: number, autoplay = true): Promise<void> {
    this.trackList.currentIndex = index

    this.elementSrc = this.currentTrack.objectUrl as string

    this.emit(AUDIO_CONTROLLER_EVENTS.skip)

    if (autoplay) {
      await this.play()
    }
  }

  async skipPrevious(): Promise<void> {
    await this.skip(
      this.trackList.currentIndex > 0
        ? this.trackList.currentIndex - 1
        : this.trackList.count - 1
    )
  }

  async skipNext(autoplay = true): Promise<void> {
    await this.skip(
      this.trackList.currentIndex < this.trackCount - 1
        ? this.trackList.currentIndex + 1
        : 0,
      autoplay
    )
  }

  shuffle(): void {
    this.trackList.shuffle()

    this.emit(AUDIO_CONTROLLER_EVENTS.shuffle)
  }

  unshuffle(): void {
    this.trackList.unshuffle()

    this.emit(AUDIO_CONTROLLER_EVENTS.unshuffle)
  }

  getTrack(id: string) {
    return this.trackList.getById(id)
  }

  setTrackMetadata(id: string, metadata: Partial<TrackMetadata>) {
    const track = this.getTrack(id)

    if (track) {
      track.metadata = {
        ...track.metadata,
        ...metadata,
      }

      this.emit(AUDIO_CONTROLLER_EVENTS.trackMetaUpdated)
    }
  }
}
