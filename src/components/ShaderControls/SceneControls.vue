<template>
  <QExpansionItem tag="section">
    <template #header>
      <QItemSection avatar>
        <QIcon color="secondary" name="movie_edit" />
      </QItemSection>

      <QItemSection> Scene Controls </QItemSection>
    </template>
    <QList class="q-py-md" dense tag="fieldset">
      <QItem class="q-mb-md">
        <QItemSection>
          <QOptionGroup
            color="secondary"
            horizontal
            :options="sceneOptions"
            type="toggle"
            v-model="sceneModel"
            @update:modelValue="onSceneOptionsChange"
          />
        </QItemSection>
      </QItem>
      <QItem>
        <AttachChannelMenu
          :attachChannel="AUDIO_CHANNELS.BRILLIANCE"
          label="Scale Base"
          uniformName="uScaleBase"
        />
      </QItem>
      <QItem>
        <AttachChannelMenu
          :attachChannel="AUDIO_CHANNELS.BASS"
          label="Scale Range"
          uniformName="uScaleRange"
        />
      </QItem>
      <QItem>
        <AttachChannelMenu
          :attachChannel="AUDIO_CHANNELS.PRESENCE"
          label="Glow Intensity"
          uniformName="uGlowIntensity"
        />
      </QItem>
    </QList>
  </QExpansionItem>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import {
  QExpansionItem,
  QIcon,
  QItem,
  QItemSection,
  QList,
  QOptionGroup,
} from 'quasar'
import { useShadersStore } from '@/stores/shaders'
import { AUDIO_CHANNELS } from '@/consts'
import AttachChannelMenu from './AttachChannelMenu.vue'

const shaders = useShadersStore()

const sceneModel = ref(['uRotateScene', 'uSmoothShading'])

const sceneOptions = [
  {
    label: 'Rotate Scene',
    value: 'uRotateScene',
  },
  {
    label: 'Smooth Shading',
    value: 'uSmoothShading',
  },
]

const onSceneOptionsChange = (selected: string[]) => {
  for (const option of sceneOptions) {
    shaders.setUniform(option.value, +selected.includes(option.value))
  }
}
</script>
