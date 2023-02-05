<template>
  <QExpansionItem tag="section">
    <template #header>
      <QItemSection avatar>
        <QIcon color="secondary" name="waves" />
      </QItemSection>

      <QItemSection> Fractal Controls </QItemSection>
    </template>
    <QList class="q-mt-xs q-py-md" dense tag="fieldset">
      <QItem class="q-mb-md">
        <QItemSection>
          <QToggle
            color="secondary"
            label="Time Update C"
            v-model="timeUpdateC"
            @update:modelValue="onTimeUpdateCChange"
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
  QIcon,
  QItem,
  QItemSection,
  QList,
  QToggle,
} from 'quasar'
import type { ShaderControl } from './ShaderControl'
import { AUDIO_CHANNELS } from '@/consts'
import { useShadersStore } from '@/stores/shaders'
import AttachChannelMenu from './AttachChannelMenu.vue'

const shaders = useShadersStore()

const timeUpdateC = computed(
  () => !!shaders.getUniform('uTimeUpdateC') || false
)

const controls: ShaderControl[] = [
  {
    uniformName: 'uC[0]',
    label: 'C Base X',
    max: 1.5,
    min: -1.5,
    step: 0.001,
  },
  {
    uniformName: 'uC[1]',
    label: 'C Base Y',
    max: 1.5,
    min: -1.5,
    step: 0.001,
  },
  {
    uniformName: 'uCRotateRange',
    attachChannel: AUDIO_CHANNELS.HIGH_MID,
    label: 'C Rotate Range',
    max: 2,
    min: 0,
    step: 0.001,
  },
  {
    uniformName: 'uZMax',
    label: 'Z Max',
    max: 3,
    min: 1,
    step: 0.01,
  },
]

const onTimeUpdateCChange = (value: boolean) => {
  shaders.setUniform('uTimeUpdateC', +value)
}
</script>
