<template>
  <QCard class="ShaderInput glass col bg-transparent shadow-1">
    <QCardSection>
      <QItemLabel>{{ label }}</QItemLabel>

      <QField borderless hideBottomSpace labelColor="white" stackLabel>
        <QSlider
          color="secondary"
          label
          :max="max"
          :markerLabels="[
            {
              value: min,
            },
            {
              value: max,
            },
          ]"
          markerLabelsClass="ShaderInput__sliderLabels text-secondary"
          :min="min"
          :modelValue="modelValue"
          :step="step"
          @update:modelValue="handleChange"
        />
      </QField>

      <QSelect
        v-if="!disableAttach"
        :label="selectLabel"
        color="secondary"
        clearable
        dense
        hideBottomSpace
        labelColor="secondary"
        :options="audioChannelOptions"
        outlined
        popupContentClass="glass shadow-1"
        placeholder="Select Channel"
        v-model="selectedChannel"
        @update:modelValue="onChange"
      >
        <template #prepend>
          <QIcon
            name="commit"
            :color="selectedChannel?.value !== undefined ? 'secondary' : 'grey'"
          />
        </template>
      </QSelect>
    </QCardSection>
  </QCard>
</template>

<script lang="ts" setup>
import { computed, ref, onBeforeMount, onMounted, onBeforeUnmount } from 'vue'
import {
  QCard,
  QCardSection,
  QField,
  QIcon,
  QItemLabel,
  QSelect,
  type QSelectOption,
  QSlider,
} from 'quasar'

import type { AudioChannelID, ShaderProgramUniform } from '@/types'
import { useShadersStore } from '@/stores/shaders'
import { useAudioStore } from '@/stores/audio'
import { RENDER_HOOK_TYPES } from '@/consts'
import { nearestMultiple, norm2 } from '@/utils'

const audio = useAudioStore()
const shaders = useShadersStore()

const audioChannelOptions: QSelectOption[] = [
  {
    label: 'Sub Bass',
    value: '0',
  },
  {
    label: 'Bass',
    value: '1',
  },
  {
    label: 'Low Mid',
    value: '2',
  },
  {
    label: 'Mid',
    value: '3',
  },
  {
    label: 'High Mid',
    value: '4',
  },
  {
    label: 'Presence',
    value: '5',
  },
  {
    label: 'Brilliance',
    value: '6',
  },
]

const props = defineProps({
  attachChannel: Number,
  disableAttach: Boolean,
  selectLabel: {
    type: String,
    default: 'Attach To',
  },
  label: {
    type: String,
    required: true,
  },
  uniformName: {
    type: String,
    required: true,
  },
  min: {
    type: Number,
    default: 0,
  },
  max: {
    type: Number,
    default: 1,
  },
  step: {
    type: Number,
    default: 0.01,
  },
})

const isIndexedRegex = /\[(\d)/

const selectedChannel = ref<QSelectOption>()
const isSubscribed = ref(false)
const decimal = ref(props.step.toString().split('.')[1]?.length ?? 0)
const isIndexed = ref(isIndexedRegex.test(props.uniformName))
const uniformName = computed(() =>
  isIndexed.value
    ? props.uniformName.slice(
        0,
        props.uniformName.match(isIndexedRegex)?.index || 0
      )
    : props.uniformName
)
const valueIndex = computed(() =>
  isIndexed.value
    ? +(props.uniformName.match(isIndexedRegex)?.[1] as string)
    : null
)

const modelValue = computed(() => {
  let value: number

  if (isIndexed.value) {
    const arrayValue = shaders.getUniform(uniformName.value) as number[]

    value = (arrayValue || [])[valueIndex.value as number] || 0
  } else {
    value = shaders?.getUniform(uniformName.value) as number
  }
  return +nearestMultiple(value, props.step).toFixed(decimal.value)
})

const handleChange = (value: number | null) => {
  if (isIndexed.value) {
    if (valueIndex.value !== null) {
      const arrayValue = shaders.getUniform(uniformName.value) as number[]

      arrayValue[valueIndex.value as number] = value || 0

      shaders.setUniform(
        uniformName.value,
        arrayValue as ShaderProgramUniform['value']
      )
    }
  } else {
    shaders.setUniform(uniformName.value, value || 0)
  }
}
const updateUniform = () => {
  if (selectedChannel.value) {
    const channelValue = audio.controller?.getChannelValue(
      +selectedChannel.value.value as AudioChannelID,
      true
    )
    const normValue = norm2(channelValue || 0, 0, 1, props.min, props.max)

    handleChange(normValue)
  }
}

const unsubscribeHandler = ref<() => void>()

const subscribe = (value: boolean) => {
  if (value) {
    unsubscribeHandler.value = shaders?.on(
      RENDER_HOOK_TYPES.beforeRender,
      updateUniform
    )
  } else {
    unsubscribeHandler.value?.()
    unsubscribeHandler.value = undefined
  }

  isSubscribed.value = value
}

const onChange = () => {
  const hasValue = selectedChannel.value?.value !== undefined

  if (!isSubscribed.value && hasValue) {
    subscribe(true)
  } else if (!hasValue) {
    subscribe(false)
  }
}

onBeforeMount(() => {
  if (props.attachChannel !== undefined) {
    selectedChannel.value = audioChannelOptions.find(
      (option) => +option.value === +props.attachChannel!
    )
  }
})

onMounted(() => {
  if (props.attachChannel !== undefined) {
    subscribe(true)
  }
})

onBeforeUnmount(() => {
  if (isSubscribed.value) {
    subscribe(false)
  }
})
</script>

<style lang="scss" scoped>
.ShaderInput {
  :deep(.q-slider__marker-labels-container) {
    :first-child {
      transform: unset;
    }

    :last-child {
      transform: translateX(-100%);
    }
  }
}
</style>
