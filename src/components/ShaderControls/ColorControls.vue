<template>
  <QExpansionItem tag="section">
    <template #header>
      <QItemSection avatar>
        <QIcon color="secondary" name="palette" />
      </QItemSection>

      <QItemSection> Color Controls </QItemSection>
    </template>
    <QList class="q-mt-xs q-py-md" dense tag="fieldset">
      <QItem class="q-mb-md">
        <QItemSection>
          <QToggle
            color="secondary"
            label="Time Update Hue"
            :modelValue="timeUpdateHue"
            @update:modelValue="onTimeUpdateHueChange"
          />
        </QItemSection>
      </QItem>
      <QItem v-for="control in controls" :key="control.uniformName">
        <AttachChannelMenu
          :label="control.label"
          :attachChannel="control.attachChannel"
          :uniformName="control.uniformName"
          :min="control.min"
          :max="control.max"
          :step="control.step"
        />
      </QItem>
    </QList>
  </QExpansionItem>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import {
  QExpansionItem,
  QList,
  QIcon,
  QItem,
  QItemSection,
  QToggle,
} from 'quasar'
import type { ShaderControl } from './ShaderControl'
import { AUDIO_CHANNELS } from '@/consts'
import AttachChannelMenu from './AttachChannelMenu.vue'
import { useShadersStore } from '@/stores/shaders'

const shaders = useShadersStore()

const timeUpdateHue = computed(
  () => !!shaders.getUniform('uTimeUpdateHue') || false
)

const controls: ShaderControl[] = [
  {
    label: 'Hue Base',
    min: 0,
    max: 1,
    step: 0.001,
    uniformName: 'uHueBase',
  },
  {
    attachChannel: AUDIO_CHANNELS.MID,
    label: 'Hue Range',
    min: 0,
    max: 1,
    step: 0.001,
    uniformName: 'uHueRange',
  },
  {
    label: 'Hue Multiplier',
    min: 0.001,
    max: 0.1,
    step: 0.001,
    uniformName: 'uHueMultiplier',
  },
  {
    attachChannel: AUDIO_CHANNELS.SUB_BASS,
    label: 'Saturation Base',
    min: 0,
    max: 1,
    step: 0.01,
    uniformName: 'uSaturationBase',
  },
  {
    attachChannel: -1,
    label: 'Saturation Range',
    min: 0,
    max: 1,
    step: 0.01,
    uniformName: 'uSaturationRange',
  },
  {
    attachChannel: AUDIO_CHANNELS.PRESENCE,
    label: 'Lightness Base',
    min: 0,
    max: 1,
    step: 0.01,
    uniformName: 'uLightnessBase',
  },
  {
    attachChannel: AUDIO_CHANNELS.BRILLIANCE,
    label: 'Lightness Range',
    min: 0,
    max: 1,
    step: 0.01,
    uniformName: 'uLightnessRange',
  },
]

const onTimeUpdateHueChange = (value: boolean) => {
  shaders.setUniform('uTimeUpdateHue', +value)
}
</script>

<style lang="scss" scoped>
.ColorControls {
  &__attachWrapper {
    width: 100%;
  }
}
</style>
