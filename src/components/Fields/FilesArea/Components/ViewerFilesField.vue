<template lang="pug">
  div(
    class="fixed z1000 l-0 t-0 w100% h100% bg-stone/70" v-if="currentFile"
    :style=`{
      'user-drag': 'element',
      '-webkit-user-drag': 'element',
    }`
  )
    div(class="fixed z10 t-0 w100% h50px bg-stone-100 flex items-center justify-end")
      div(class="ml1rem fs-1rem flex gap-x-3")
        span Просмотр файла
        b {{ currentFile.name.split('.').slice(0, -1).join('.') }}
      div(class="mr-auto ml10px fw-bold fs-1rem bg-amber-300 px10px rounded-lg relative")
        span {{ currentFile.ext.toUpperCase() }}
        div(
          class=`fw-bold text-emerald-700 absolute whitespace-nowrap fs-0.5rem right--4px top--6px bg-white/70
          rounded-xl px5px`
        ) {{ currentFile.sizeNamed }}
      VSTButton(
        theme="white"
        :disabled="!hasPreviousFile"
        @clickTap="view(currentKey-1)"
        size="md"
      )
        svg(
          xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewbox='0 0 24 24' fill='none'
          stroke='#383838' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'
        )
          path(stroke='none' d='M0 0h24v24H0z' fill='none')
          path(d='M5 12h6m3 0h1.5m3 0h.5')
          path(d='M5 12l4 4')
          path(d='M5 12l4 -4')
      div(class="fs-0.9rem mx7px text-stone-500") Файл \#{{ currentKey+1 }} из {{ files.length }}
      VSTButton(
        theme="white"
        size="md"
        :disabled="!hasNextFile"
        @clickTap="view(currentKey+1)"
      )
        svg(xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewbox='0 0 24 24' fill='none' stroke='#383838' stroke-width='2' stroke-linecap='round' stroke-linejoin='round')
          path(stroke='none' d='M0 0h24v24H0z' fill='none')
          path(d='M5 12h.5m3 0h1.5m3 0h6')
          path(d='M15 16l4 -4')
          path(d='M15 8l4 4')

      VSTButton(
        @clickTap="$emit('download', currentKey)"
        theme="yellow"
        size="md"
      )
        span(class="mr5px") Скачать оригинал
        svg(
          xmlns='http://www.w3.org/2000/svg' viewbox='0 0 24 24' fill='none'
          width='24'
          height='24'
          stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'
          class="scale-80"
        )
          path(stroke='none' d='M0 0h24v24H0z' fill='none')
          path(d='M19 18a3.5 3.5 0 0 0 0 -7h-1a5 4.5 0 0 0 -11 -2a4.6 4.4 0 0 0 -2.1 8.4')
          path(d='M12 13l0 9')
          path(d='M9 19l3 3l3 -3')
      VSTButton(
        title="Esc"
        @clickTap="currentFile = null"
        theme="danger"
        size="md"
        class="mr0.5rem"
      )
        svg(
          xmlns='http://www.w3.org/2000/svg'
          width='24'
          height='24' viewbox='0 0 24 24' fill='none'
          stroke='currentColor' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'
          class="scale-70"
        )
          path(stroke='none' d='M0 0h24v24H0z' fill='none')
          path(d='M18 6l-12 12')
          path(d='M6 6l12 12')

    div(class="mt50px")
      div(v-if="fileType == 'image'")
        ImageViewerFilesField(
          :fileName="currentFile?.name.split('.').slice(0, -1).join('.')"
          :ext="currentFile?.ext"
          :size="currentFile?.size"
          :uri="currentFile?.uri"
        )
      div(v-else-if="fileType == 'video'")
        div video
      div(v-else-if="fileType == 'archive'")
        div archive
      div(v-else-if="fileType == 'excel' && excelViewComponent")
        div
          component(
            :is="excelViewComponent"
            :fileName="currentFile?.name.split('.').slice(0, -1).join('.')"
            :ext="currentFile?.ext"
            :uri="currentFile?.uri"
            :size="currentFile?.size"
          )
      div(v-else-if="fileType == 'doc' && docViewComponent")
        div
          component(
            :is="docViewComponent"
            :fileName="currentFile?.name.split('.').slice(0, -1).join('.')"
            :ext="currentFile?.ext"
            :size="currentFile?.size"
            :uri="currentFile?.uri"
          )
      div(v-else-if="currentFile.ext == 'pdf'")
        PDFViewerFilesField(
          :fileName="currentFile?.name.split('.').slice(0, -1).join('.')"
          :ext="currentFile?.ext"
          :size="currentFile?.size"
          :uri="currentFile?.uri"
        )
      div(
        v-else
        class="fixed w100% h100% t-50px flex items-center justify-center text-stone-600 bg-white/90 fs-2rem"
      )
       div(class="translate-y--100%") Просмотр данного типа файла не поддерживается
</template>

<script lang="ts">
import {Prop, BaseComponent, VST, Watch} from '../../../../core'
import {Button as VSTButton} from '../../../../kit'

import { FileFieldItemInterface } from './FileItem.vue'
import ImageViewerFilesField from './Viewer/ImageViewerFilesField.vue'
import ExcelViewerFilesField from './Viewer/ExcelViewerFilesField.vue'
import DocxViewerFilesField from './Viewer/DocxViewerFilesField.vue'
import PDFViewerFilesField from './Viewer/PDFViewerFilesField.vue'

@VST export default class ViewerFilesField extends BaseComponent {
  components = {
    ImageViewerFilesField, ExcelViewerFilesField, DocxViewerFilesField, VSTButton, PDFViewerFilesField,
  }
  emits = ['viewerOpened', 'viewerClosed']
  currentFile: FileFieldItemInterface|null = null
  
  @Prop(Array, null) readonly files: FileFieldItemInterface[] = []
  @Prop(String, null) readonly docViewComponent: string|null = ''
  @Prop(String, null) readonly excelViewComponent: string|null = ''
  currentKey: number = 0

  created() {
    this.registerHotKey('escape', () => this.currentFile = null, false, false, false)
    this.registerHotKey('arrowLeft', () => {
      if (this.hasPreviousFile) {
        this.view(this.currentKey-1)
      }
    }, false, false, false)
    this.registerHotKey('arrowRight', () => {
      if (this.hasNextFile) {
        this.view(this.currentKey+1)
      }
    }, false, false, false)
  }

  view(key: number) {
    this.currentFile = null
    this.nextTick(() => this.currentFile = this.files[this.currentKey = key])
  }

  get fileType(): 'image'|'video'|'archive'|'excel'|'doc'|null {
    if (!this.currentFile) return null
    // Image
    const imageExt = [
      'jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp',
      'ico', 'tiff', 'tif', 'avif', 'heic', 'heif'
    ]
    if (imageExt.includes(this.currentFile.ext)) {
      return 'image'
    }

    // Video
    const videoExt = [
      'mp4', 'avi', 'mkv', 'mov', 'wmv', 'flv', 'webm',
      'm4v', 'mpg', 'mpeg', '3gp', 'ogv', 'ts', 'mts'
    ]
    if (videoExt.includes(this.currentFile.ext)) {
      return 'video'
    }

    // Архивы
    const archiveExt = [
      'zip', 'rar', 'tar', 'gz', '7z', 'bz2', 'xz',
      'tgz', 'z', 'arc', 'cab'
    ]
    if (archiveExt.includes(this.currentFile.ext)) {
      return 'archive'
    }

    // Excel (spreadsheet)
    const excelExt = [
      'xls', 'xlsx', 'ods', 'xlsm', 'xlsb', 'csv'
    ]
    if (excelExt.includes(this.currentFile.ext)) {
      return 'excel'
    }

    // Word (document)
    const wordExt = [
      'doc', 'docx', 'odt', 'ods', 'odp', 'md', 'rtf', 'txt'
    ]
    if (wordExt.includes(this.currentFile.ext)) {
      return 'doc'
    }

    return null
  }

  get hasPreviousFile(): boolean {
    return this.currentKey > 0
  }

  get hasNextFile(): boolean {
    return this.currentKey < this.files.length - 1
  }

  @Watch watchCurrentFile(currentFile: string|null) {
    if (currentFile) {
      this.$emit('viewerOpened')
    }
    else {
      this.$emit('viewerClosed')
    }
  }
}
</script>
<style lang="sass"></style>
