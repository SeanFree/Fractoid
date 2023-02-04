<template>
  <QDialog
    class="AppInfoModal"
    :modelValue="modelValue"
    @update:modelValue="(value) => $emit('update:modelValue', value)"
  >
    <QCard class="glass-dark flex column shadow-2">
      <QCardSection class="flex">
        <QImg
          class="q-mr-md"
          src="/Fractoid-logo.svg"
          width="90px"
          height="90px"
        />
        <QItemLabel class="text-h1">Fractoid</QItemLabel>
      </QCardSection>

      <QSeparator />

      <QCardSection>
        <QItemLabel>
          An audio visualizer app that uses audio frequency data to animate a
          julia set fractal.
        </QItemLabel>
      </QCardSection>

      <QCardSection>
        <QItemLabel>
          All pre-loaded songs are provided by the YouTube Audio Library.
        </QItemLabel>
      </QCardSection>

      <QCardSection>
        <QItemLabel> Built with </QItemLabel>

        <div class="q-px-lg q-py-sm">
          <QItemLabel> TypeScript / Vite / Vue / Quasar </QItemLabel>

          <QItemLabel> Web Audio API / WebGL / GLSL </QItemLabel>
        </div>
      </QCardSection>

      <QCardSection class="flex justify-between">
        <QItemLabel>Enjoy!</QItemLabel>

        <QBtn
          href="https://github.com/SeanFree/Fractoid"
          class="glass-dark"
          :icon="mdiGithub"
          label="View on GitHub"
          rounded
          target="_blank"
          rel="noopener noreferrer"
          aria-label="(Opens in a new tab)"
          style="padding-left: 6px"
        />
      </QCardSection>

      <QCardSection class="glass bg-teal-10 flex row align-center">
        <QIcon class="q-mr-md" name="warning" color="warning" size="24px" />

        <QItemLabel class="col">
          This application may potentially trigger seizures for people with
          photosensitive epilepsy. User discretion is advised
        </QItemLabel>
      </QCardSection>

      <QCardActions align="right" class="text-teal">
        <QBtn
          flat
          label="Start"
          size="18px"
          iconRight="chevron_right"
          rounded
          v-close-popup
          style="padding: 4px 8px 4px 24px"
        >
        </QBtn>
      </QCardActions>
    </QCard>
  </QDialog>
</template>

<script lang="ts" setup>
import { toRefs } from 'vue'
import {
  QBtn,
  QCard,
  QCardSection,
  QCardActions,
  QDialog,
  QSeparator,
  QIcon,
  QImg,
  QList,
  QItemLabel,
  QItem,
} from 'quasar'
import { mdiGithub } from '@quasar/extras/mdi-v6'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
})
defineEmits(['update:modelValue'])

const { modelValue } = toRefs(props)
</script>

<style lang="scss" scoped>
.AppInfoModal {
  &__content {
    height: 454px;
    width: 775px;
    max-width: 80vw;
  }
}
</style>
