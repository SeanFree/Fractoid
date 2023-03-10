<template>
  <QDialog
    class="AppInfoModal"
    :persistent="!userAcknowledged"
    :modelValue="visible"
    @update:modelValue="(value) => modals.setVisibility(name, value)"
  >
    <QCard class="AppInfoModal__content glass-dark flex column shadow-2">
      <QCardSection class="flex no-wrap text-teal-4 q-px-lg">
        <QImg
          class="AppInfoModal__logo q-mr-lg"
          src="/Fractoid-logo.svg"
          width="90px"
          height="90px"
        />
        <QItemLabel class="text-h1">Fractoid</QItemLabel>
      </QCardSection>

      <QSeparator />

      <QCardSection>
        <QItemLabel class="text-teal-1">
          An audio visualizer app that uses audio frequency data to animate a
          julia set fractal.
        </QItemLabel>
      </QCardSection>

      <QCardSection>
        <QItemLabel class="text-teal-1">
          All pre-loaded songs provided by
          <QBtn
            href="https://studio.youtube.com/"
            rel="noopener noreferrer"
            flat
            iconRight="launch"
            inline
            label="YouTube Audio Library"
            rounded
            target="_blank"
          />
        </QItemLabel>
      </QCardSection>

      <QCardSection class="text-teal-1">
        <QItemLabel> Built with </QItemLabel>

        <div class="q-px-lg q-py-sm">
          <QItemLabel> TypeScript / Vite / Vue / Quasar </QItemLabel>

          <QItemLabel> Web Audio API / WebGL / GLSL </QItemLabel>
        </div>
      </QCardSection>

      <QCardSection class="flex row justify-between align-center">
        <QItemLabel class="AppInfoModal__enjoy text-teal-1">
          Enjoy!
        </QItemLabel>

        <QBtn
          href="https://github.com/SeanFree/Fractoid"
          class="AppInfoModal__github glass-dark"
          :icon="mdiGithub"
          label="View on GitHub"
          outline
          rounded
          target="_blank"
          rel="noopener noreferrer"
          aria-label="(Opens in a new tab)"
        />
      </QCardSection>

      <QCardSection class="glass-info flex row align-center">
        <QIcon class="q-mr-md" name="warning" color="warning" size="32px" />

        <QItemLabel class="col">
          This application may potentially trigger seizures for people with
          photosensitive epilepsy. User discretion is advised
        </QItemLabel>
      </QCardSection>

      <QCardActions align="right" class="text-teal q-pa-md">
        <QBtn
          class="AppInfoModal__close"
          iconRight="chevron_right"
          :label="userAcknowledged ? 'Close' : 'Start'"
          outline
          rounded
          size="18px"
          v-close-popup
        >
        </QBtn>
      </QCardActions>
    </QCard>
  </QDialog>
</template>

<script lang="ts" setup>
import { computed, onBeforeMount } from 'vue'
import {
  QBtn,
  QCard,
  QCardSection,
  QCardActions,
  QDialog,
  QSeparator,
  QIcon,
  QImg,
  QItemLabel,
} from 'quasar'
import { mdiGithub } from '@quasar/extras/mdi-v6'
import { useModalsStore } from '@/stores/modals'

const name = 'appInfo'

const modals = useModalsStore()

const visible = computed(() => modals.getVisibility(name))

defineProps({
  userAcknowledged: Boolean,
})

onBeforeMount(() => {
  modals.add(name, true)
})
</script>

<style lang="scss" scoped>
.AppInfoModal {
  &__content {
    width: 572px;
    max-width: 80vw;
  }

  &__logo {
    align-self: center;
  }

  &__enjoy {
    line-height: 32px !important;
  }

  &__github {
    padding-left: 6px;
  }

  &__close {
    padding: 4px 8px 4px 18px !important;
  }
}
</style>
