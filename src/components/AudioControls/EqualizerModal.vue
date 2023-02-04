<template>
  <QDialog
    :modelValue="modelValue"
    @update:modelValue="(value) => $emit('update:modelValue', value)"
  >
    <GraphicEqualizer />
  </QDialog>
</template>

<script lang="ts" setup>
import { toRefs } from 'vue'
import { QDialog } from 'quasar'
import GraphicEqualizer from '../GraphicEqualizer.vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
})
defineEmits(['update:modelValue'])

const { modelValue } = toRefs(props)
</script>
