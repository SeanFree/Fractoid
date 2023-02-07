<template>
  <QDialog
    :modelValue="visible"
    @update:modelValue="(value) => modals.setVisibility(name, value)"
  >
    <QCard class="glass-dark">
      <QToolbar class="glass-secondary">
        <QAvatar size="48px">
          <QIcon name="audio_file" color="secondary" />
        </QAvatar>
        <QToolbarTitle>Add File</QToolbarTitle>
      </QToolbar>

      <QCardSection>
        <QForm>
          <QItem class="glass-info rounded-borders q-mb-md">
            <QIcon class="q-mr-lg" color="blue-3" name="info" size="18px" />
            <QItemLabel caption class="text-white text-italic">
              Uploaded files are not saved to an external source and will only
              be available during a given session
            </QItemLabel>
          </QItem>

          <QFile
            clearable
            label="File"
            color="secondary"
            outlined
            accept="audio/*"
            v-model="file"
          >
            <template #append>
              <QIcon name="upload_file" :color="file ? 'secondary' : 'grey'" />
            </template>
          </QFile>

          <QItemLabel class="text-italic q-my-lg">
            Choose a file or drop below
          </QItemLabel>

          <QItem
            class="AddFileModal__dropArea rounded-borders q-mb-md"
            :style="{
              borderColor: isDragging ? 'var(--q-secondary)' : 'grey',
            }"
            @dragenter="onDragEnter"
            @dragleave="onDragLeave"
            @dragover="onDragOver"
            @drop="onDrop"
          >
            <QIcon
              class="AddFileModal__dropIcon absolute"
              :name="symOutlinedPlaceItem"
              :color="isDragging ? 'secondary' : 'grey'"
              size="60px"
            />
          </QItem>

          <div class="flex justify-end">
            <QBtn
              :loading="audio.loading"
              class="q-mr-sm q-px-lg"
              color="secondary"
              :disabled="!file"
              label="Save"
              outline
              rounded
              size="16px"
              @click="save"
            />

            <QBtn
              :loading="audio.loading"
              class="q-px-lg"
              flat
              label="Cancel"
              rounded
              size="16px"
              @click="modals.hide(name)"
            />
          </div>
        </QForm>
      </QCardSection>
    </QCard>
  </QDialog>
</template>

<script lang="ts" setup>
import { computed, ref, onBeforeMount, onMounted, watch } from 'vue'
import {
  QAvatar,
  QBtn,
  QCard,
  QCardSection,
  QDialog,
  QFile,
  QForm,
  QIcon,
  QItem,
  QItemLabel,
  QToolbar,
  QToolbarTitle,
} from 'quasar'
import { symOutlinedPlaceItem } from '@quasar/extras/material-symbols-outlined'
import { useModalsStore } from '@/stores/modals'
import { useAudioStore } from '@/stores/audio'

const url = ref<string | null>(null)
const file = ref<File | File[] | null>(null)

const name = 'addFile'

const audio = useAudioStore()
const modals = useModalsStore()

const visible = computed(() => modals.getVisibility(name))
const isDragging = ref(false)

const onDragEnter = (e: DragEvent) => {
  isDragging.value = true
}

const onDragLeave = (e: DragEvent) => {
  isDragging.value = false
}

const onDragOver = (e: DragEvent) => {
  e.preventDefault()
}
const onDrop = (e: DragEvent) => {
  e.preventDefault()

  isDragging.value = false

  if (e.dataTransfer?.files) {
    file.value = e.dataTransfer.files[0]
  }
}

const save = async () => {
  await audio.addAll([file.value as File])

  audio.play()

  modals.hide(name)
}

watch(visible, () => {
  url.value = null
  file.value = null
})

onBeforeMount(() => {
  modals.add('addFile')
})

onMounted(() => {
  audio.controller?.subscribe('loaded', () => {})
})
</script>

<style lang="scss" scoped>
.AddFileModal {
  &__dropIcon {
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
  }

  &__dropArea {
    border: 2px dashed;

    height: 200px;
  }
}
</style>
