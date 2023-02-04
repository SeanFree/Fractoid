<template>
  <QItem class="MediaPlayer no-padding" flat aria-live="polite"> </QItem>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
.MediaPlayer {
  display: inline-flex;
  flex-direction: column;
  justify-content: space-between;

  &__img {
    opacity: 0.8;
  }
}
</style>
