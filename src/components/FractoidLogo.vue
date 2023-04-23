<template>
  <div
    :class="[
      'FractoidLogo flex items-center no-wrap text-teal-4 q-px-lg',
      {
        'FractoidLogo--compact': compact,
      },
    ]"
  >
    <QImg
      class="FractoidLogo__icon q-mr-sm"
      src="/Fractoid-icon.svg"
      :width="`${compact ? '45' : '90'}px`"
      :height="`${compact ? '45' : '90'}px`"
    />
    <QItemLabel class="FractoidLogo__name">Fractoid</QItemLabel>
  </div>
</template>

<script lang="ts" setup>
import { QImg, QItemLabel } from 'quasar'

defineProps({
  compact: Boolean,
})
</script>

<style lang="scss" scoped>
.FractoidLogo {
  &--compact &__name {
    font-size: 2rem;
  }

  &__name {
    font-size: 3.5rem !important;
  }
}
</style>
