<template>
  <QCard
    class="GraphicEqualizer glass-dark hide-scrollbar flex column"
    flat
    style=""
  >
    <QCardSection>
      <QSelect
        class="GraphicEqualizer__preset"
        color="secondary"
        dense
        flat
        outlined
        label="Preset"
        labelColor="secondary"
        :options="options"
        popupContentClass="glass no-shadow"
        v-model="selectedOption"
      />
    </QCardSection>
    <QCardSection class="GraphicEqualizer__channels">
      <QItem
        class="GraphicEqualizer__channel q-px-xs"
        v-for="(frequency, i) in GRAPHIC_EQ_FREQUENCIES"
        :key="i"
      >
        <QSlider
          class="GraphicEqualizer__slider q-mb-sm"
          :id="`eq-channel-${i}`"
          color="secondary"
          dark
          label
          :modelValue="model[frequency]"
          :min="-12"
          :max="12"
          reverse
          :step="0.25"
          vertical
          @update:modelValue="(value) => onSliderChange(frequency, value)"
        />
        <QItemLabel
          class="GraphicEqualizer__label text-secondary text-bold"
          :for="`eq-channel-${i}`"
        >
          {{ paramLabel(frequency) }}
        </QItemLabel>
      </QItem>
    </QCardSection>
  </QCard>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import {
  QCard,
  QCardSection,
  QItem,
  QItemLabel,
  QSlider,
  QSelect,
  type QSelectOption,
} from 'quasar'
import {
  GRAPHIC_EQ_FREQUENCIES,
  GRAPHIC_EQ_FLAT,
  GRAPHIC_EQ_PRESET_MAP,
} from '@/consts'
import { useAudioStore } from '@/stores/audio'
import type {
  GraphicEqFrequency,
  GraphicEqPreset,
  GraphicEqPresetName,
} from '@/types'

const audio = useAudioStore()

const model = computed<GraphicEqPreset>(
  () => audio.controller?.eqPreset || { ...GRAPHIC_EQ_FLAT }
)

const CUSTOM_EQ_DEFAULT: GraphicEqPreset = { ...GRAPHIC_EQ_FLAT }

const options: QSelectOption<GraphicEqPresetName | string>[] = [
  {
    label: 'Flat',
    value: 'flat',
  },
  {
    label: 'Acoustic',
    value: 'acoustic',
  },
  {
    label: 'Electronic',
    value: 'electronic',
  },
  {
    label: 'Latin',
    value: 'latin',
  },
  {
    label: 'Piano',
    value: 'piano',
  },
  {
    label: 'Pop',
    value: 'pop',
  },
  {
    label: 'Rock',
    value: 'rock',
  },
  {
    label: 'Bass Boost',
    value: 'bass',
  },
]

const isCustom = ref(false)

const selectedOption = computed({
  get() {
    const current = audio.controller?.eqPresetName

    if (isCustom.value) {
      return {
        label: 'Custom',
        value: 'custom',
      }
    }

    return current
      ? (options.find(
          ({ value }) => value === audio.controller?.eqPresetName
        ) as QSelectOption<GraphicEqPresetName | string>)
      : options[0]
  },
  set(option: QSelectOption) {
    audio.controller!.eqPresetName = option.value
    isCustom.value = false
  },
})

const onSliderChange = (
  frequency: GraphicEqFrequency,
  value: number | null
) => {
  audio.controller?.setChannelGain(frequency, value as number)
  audio.controller!.eqPresetName = 'custom'
  isCustom.value = true
}

const paramLabel = (value: number) => {
  const isKHz = value >= 1000
  const unit = `${isKHz ? 'K' : ''}Hz`

  return `${value / (isKHz ? 1000 : 1)}${unit}`
}
</script>

<style lang="scss" scoped>
.GraphicEqualizer {
  height: 454px;
  width: 775px;
  max-width: 80vw;

  &__channels {
    display: grid;
    flex: 1;
    grid-column-gap: map-get($space-md, 'x');
    grid-template-columns: repeat(12, 1fr);
    height: 100%;
  }

  &__preset {
    max-width: 250px;
  }

  &__channel {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &__slider {
    flex: 1;
    height: 100%;
    position: relative;
    z-index: 0;

    &:hover {
      z-index: 3;
    }
  }

  &__label {
    display: block;
  }
}
</style>
