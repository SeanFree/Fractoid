import type { CustomEventHandler, PlaythroughType } from '@/types'
import type { AudioTrack } from '@/program'

import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { AudioController } from '@/program'

const controller = ref<AudioController>()

export const useAudioStore = defineStore('audio', () => {
  const loading = ref(false)
  const setLoading = (value: boolean) => (loading.value = value)

  const playing = ref(false)
  const setPlaying = (value: boolean) => (playing.value = value)

  const currentTrack = ref<AudioTrack>()
  const setCurrentTrack = (track?: AudioTrack) => {
    if (track) {
      ;(controller.value as AudioController).currentTrack = track
    }
    currentTrack.value = track || controller.value?.currentTrack
  }

  const isShuffled = ref(false)
  const tracks = ref<AudioTrack[]>()
  const setTracks = () => (tracks.value = controller.value?.tracks) || []
  const trackId = computed(() => controller.value?.currentTrack?.id || '')

  const currentTime = ref(0)
  const setCurrentTime = (value?: number) => {
    if (value) {
      ;(controller.value as AudioController).currentTime = value as number
    }

    currentTime.value = controller.value?.currentTime as number
  }

  const volume = ref(0)
  const setVolume = (value?: number) => {
    if ((value as number) >= 0) {
      ;(controller.value as AudioController).volume = value as number
    }

    volume.value = controller.value?.volume as number
  }

  const create = (parent: HTMLAudioElement) => {
    if (!controller.value) {
      controller.value = new AudioController(parent)

      setVolume()

      controller.value.subscribe('play', () => setPlaying(true))
      controller.value.subscribe('pause', () => setPlaying(false))
      controller.value.subscribe('loading', () => setLoading(true))
      controller.value.subscribe('loaded', () => {
        setLoading(false)
        setTracks()
        setCurrentTrack()
      })
      controller.value.subscribe('timeupdate', () => setCurrentTime())
      controller.value.subscribe('skip', () => setCurrentTrack())
      controller.value.subscribe('shuffle', () => {
        isShuffled.value = true
        setTracks()
      })
      controller.value.subscribe('unshuffle', () => {
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
  }
  const play = () => {
    return controller.value?.play()
  }
  const pause = () => {
    return controller.value?.pause()
  }
  const togglePlayback = () => {
    playing.value ? pause() : play()
  }
  const skipNext = () => {
    return controller.value?.skipNext()
  }
  const skipPrevious = () => {
    return controller.value?.skipPrevious()
  }
  const toggleRepeat = () => {
    if (controller.value?.repeat === 'all') {
      controller.value!.repeat = 'one'
    } else if (controller.value?.repeat === 'one') {
      controller.value!.repeat = 'off'
    } else {
      controller.value!.repeat = 'all'
    }
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
    play,
    pause,
    skipNext,
    skipPrevious,
    toggleRepeat,
    setArtist,
    setTitle,
  }
})
