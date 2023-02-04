import type { GraphicEqPreset, GraphicEqPresetName } from '@/types'

export const GRAPHIC_EQ_FLAT: GraphicEqPreset = {
  32: 0,
  64: 0,
  128: 0,
  256: 0,
  512: 0,
  1000: 0,
  2000: 0,
  4000: 0,
  8000: 0,
  10000: 0,
  13000: 0,
  16000: 0,
}

export const GRAPHIC_EQ_ACOUSTIC: GraphicEqPreset = {
  32: 4.5,
  64: 4,
  128: 3.25,
  256: 0.5,
  512: 1.75,
  1000: 1.75,
  2000: 3,
  4000: 4,
  8000: 3,
  10000: 1.75,
  13000: -0.5,
  16000: -0.75,
}

export const GRAPHIC_EQ_ELECTRONIC: GraphicEqPreset = {
  32: 5,
  64: 4.75,
  128: 1.5,
  256: 0,
  512: -2,
  1000: 2,
  2000: 1,
  4000: 1.25,
  8000: 3.25,
  10000: 3.75,
  13000: 4,
  16000: 4.5,
}

export const GRAPHIC_EQ_LATIN: GraphicEqPreset = {
  32: 5,
  64: 3,
  128: 0,
  256: 0,
  512: -2,
  1000: -2,
  2000: -2,
  4000: 0,
  8000: 2,
  10000: 3,
  13000: 3.5,
  16000: 4,
}

export const GRAPHIC_EQ_PIANO: GraphicEqPreset = {
  32: 3,
  64: 2,
  128: 0,
  256: 2.5,
  512: 3,
  1000: 1.5,
  2000: 3.5,
  4000: 4.5,
  8000: 3,
  10000: 3,
  13000: 3.25,
  16000: 3.5,
}

export const GRAPHIC_EQ_POP: GraphicEqPreset = {
  32: -1.5,
  64: -1,
  128: 0,
  256: 2.5,
  512: 3.5,
  1000: 3.5,
  2000: 2.5,
  4000: 0,
  8000: -0.5,
  10000: -1,
  13000: -1.25,
  16000: -1.5,
}

export const GRAPHIC_EQ_ROCK: GraphicEqPreset = {
  32: 5.5,
  64: 4,
  128: 3,
  256: 1.5,
  512: -0.5,
  1000: -1,
  2000: 0.5,
  4000: 2.75,
  8000: 3.25,
  10000: 3.75,
  13000: 4.25,
  16000: 4.5,
}

export const GRAPHIC_EQ_BASS_BOOST: GraphicEqPreset = {
  32: 5.5,
  64: 4.25,
  128: 3.25,
  256: 2.75,
  512: 1.75,
  1000: 0.25,
  2000: 0,
  4000: 0,
  8000: 0,
  10000: -0.25,
  13000: -0.75,
  16000: -1.5,
}

export const GRAPHIC_EQ_PRESET_MAP: {
  [key in GraphicEqPresetName]: GraphicEqPreset
} = {
  flat: GRAPHIC_EQ_FLAT,
  acoustic: GRAPHIC_EQ_ACOUSTIC,
  electronic: GRAPHIC_EQ_ELECTRONIC,
  latin: GRAPHIC_EQ_LATIN,
  piano: GRAPHIC_EQ_PIANO,
  pop: GRAPHIC_EQ_POP,
  rock: GRAPHIC_EQ_ROCK,
  bass: GRAPHIC_EQ_BASS_BOOST,
}
