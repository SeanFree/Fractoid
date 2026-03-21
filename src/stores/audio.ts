import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import {
  AudioController,
  type RepeatType,
  type AudioEvent,
  type AudioTrack,
} from '@/audio'

export const useAudioStore = defineStore('audio', () => {
  const controller = ref<AudioController>()
  const loading = ref(false)
  const unsubscribeHandlers = ref<(() => void)[]>([])
  const setLoading = (value: boolean) => (loading.value = value)

  const playing = ref(false)
  const setPlaying = (value: boolean) => (playing.value = value)

  const currentTrack = ref<AudioTrack>()
  const setCurrentTrack = (track?: AudioTrack) => {
    if (track) {
      controller.value!.currentTrack = track
    }
    currentTrack.value = track || controller.value?.currentTrack
  }

  const isShuffled = ref(false)
  const tracks = ref<AudioTrack[]>()
  const setTracks = () => (tracks.value = controller.value?.tracks || [])
  const trackId = computed(() => controller.value?.currentTrack?.id || '')

  const currentTime = ref(0)
  const setCurrentTime = (value?: number) => {
    if (value) {
      controller.value!.currentTime = value as number
    }

    currentTime.value = controller.value?.currentTime as number
  }

  const volume = ref(0)
  const setVolume = (value?: number) => {
    if ((value as number) >= 0) {
      controller.value!.volume = value as number
    }

    volume.value = controller.value?.volume as number
  }

  const on = (event: AudioEvent, handler: () => void) => {
    const off = controller.value!.on(event, handler)

    unsubscribeHandlers.value.push(off)

    return off
  }

  const create = (parent: HTMLAudioElement) => {
    if (!controller.value) {
      controller.value = new AudioController(parent)

      setVolume()

      on('play', () => setPlaying(true))
      on('pause', () => setPlaying(false))
      on('loading', () => setLoading(true))
      on('loaded', () => {
        setLoading(false)
        setTracks()
        setCurrentTrack()
      })
      on('timeupdate', () => setCurrentTime())
      on('skip', () => setCurrentTrack())
      on('shuffle', () => {
        isShuffled.value = true
        setTracks()
      })
      on('unshuffle', () => {
        isShuffled.value = false
        setTracks()
      })
    }
  }

  const addAll = (items: string[] | File[]) => {
    return controller.value?.addAll(items)
  }
  const disconnect = () => {
    controller.value?.disconnect()

    unsubscribeHandlers.value.forEach((fn) => fn())
  }
  const play = () => {
    return controller.value?.play()
  }
  const pause = () => {
    return controller.value?.pause()
  }
  const togglePlayback = () => {
    if (playing.value) pause()
    else play()
  }
  const skipNext = () => {
    return controller.value?.skipNext()
  }
  const skipPrevious = () => {
    return controller.value?.skipPrevious()
  }

  const repeat = ref<RepeatType>('all')
  const toggleRepeat = () => {
    let type: RepeatType = 'all'

    if (repeat.value === 'all') {
      type = 'one'
    } else if (repeat.value === 'one') {
      type = 'off'
    } else {
      type = 'all'
    }

    controller.value!.emit('playthroughChange', type)
    repeat.value = type
  }
  const toggleShuffle = () =>
    (controller.value!.shuffleTracks = !controller.value?.shuffleTracks)

  const setArtist = (trackId: string, artist: string) => {
    controller.value?.setTrackMetadata(trackId, { artist })
  }
  const setTitle = (trackId: string, title: string) => {
    controller.value?.setTrackMetadata(trackId, { title })
  }

  return {
    controller,
    loading,
    playing,
    isShuffled,
    toggleShuffle,
    currentTime,
    setCurrentTime,
    currentTrack,
    setCurrentTrack,
    trackId,
    tracks,
    create,
    volume,
    setVolume,
    addAll,
    disconnect,
    togglePlayback,
    repeat,
    play,
    pause,
    skipNext,
    skipPrevious,
    toggleRepeat,
    setArtist,
    setTitle,
  }
})
