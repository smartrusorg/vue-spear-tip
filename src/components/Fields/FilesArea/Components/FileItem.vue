<template lang="pug">
.file-item(
  ref="draggable"
  draggable="true"
  @drop="hasDeleted || !canChange ? null : onDrop($event)"
  @dragstart="hasDeleted || !canChange ? null : startDrag($event)"
  @dragover="hasDeleted || !canChange ? null : dragOver($event)"
  @dragleave="hasDeleted || !canChange ? null : dragLeave($event)"
  :data-id="eURI(fileName + '|' + (fileHash ? fileHash : ''))"
  :class=`{
    'file-item-drop': isDroppable,
    'file-view-mode': !canChange,
    'only-images': onlyImages,
    'border-1px border-solid border-#e5e15e': !file?.new,
    'border-1px border-solid border-lightblue-300': file?.new,
}`
  :title="!onlyImages && !VST.$reactive.isIphone && !file.deleted ? fileName : null"
)
  .file-container(
    v-if="file.loaded == 100"
    :class=`{
      'only-images' :onlyImages,
    }`
    class="relative min-h92px"
  )
    .file-deleted(v-show="file.deleted")
      div(class="mb8px") Будет удалён при сохранении
      VSTButton(
        size="sm"
        theme="empty"
        @clickTap="$emit('restore', fileName, file.deleted = true)"
        title="Восстановить"
        data-placement="bottom"
      )
        svg(
          xmlns='http://www.w3.org/2000/svg'
          width='24' height='24' viewbox='0 0 24 24' fill='none'
          stroke='#ffffff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'
        )
          path(stroke='none' d='M0 0h24v24H0z' fill='none')
          path(d='M3.06 13a9 9 0 1 0 .49 -4.087')
          path(d='M3 4.001v5h5')
          path(d='M11 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0')
    .file-deleted(v-show="!file.found" style="padding-top: 20px")
      | Файл не найден на сервере. Будет удалён из списка, после сохранеdния.
      br
      |  <b>{{ fileName }}</b>
    .file-deleted.file-download(v-show="file.spin")
      i.fa.fa-duotone.fa-sync.spin.fa-4x
    .file-title(v-if="!onlyImages")
      div(
        :title="canChange && !file.deleted ? `<i class='text-lime'><b>Клик</b>: переименовать</i>` : null"
        data-placement="left"
        class="cursor-text text-center"
      )
        b {{ fileName.split('.').slice(0, -1).join('.') }}
    .file-content(
      @mouseenter="viewHover($event, true)"
      @mouseleave="viewHover($event, false)"
    )
      VSTButton(
        size="md"
        theme="empty"
      )
        div(
          class="absolute right--15px top-0 py0 uppercase px8px fw-bold fs-0.7rem rounded-xl bg-amber-100 z1"
        ) {{ file.ext }}
        //pre {{ fileType }}
        svg(
          v-if="fileType == 'image'"
          xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewbox='0 0 24 24' fill='none'
          stroke='#c4277a' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'
          class="scale-225 mt7px"
        )
          path(stroke='none' d='M0 0h24v24H0z' fill='none')
          path(d='M4 6a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2l0 -12')
          path(d='M4 16l16 0')
          path(d='M4 12l3 -3c.928 -.893 2.072 -.893 3 0l4 4')
          path(d='M13 12l2 -2c.928 -.893 2.072 -.893 3 0l2 2')
          path(d='M14 7l.01 0')
        svg(
          v-else-if="fileType == 'excel'"
          xmlns='http://www.w3.org/2000/svg'
          width='24' height='24' viewbox='0 0 24 24' fill='none'
          stroke='#28a930' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'
          class="scale-220 mt7px"
        )
          path(stroke='none' d='M0 0h24v24H0z' fill='none')
          path(d='M14 3v4a1 1 0 0 0 1 1h4')
          path(d='M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2')
          path(d='M8 11h8v7h-8l0 -7')
          path(d='M8 15h8')
          path(d='M11 11v7')
        svg(
          v-else-if="fileType == 'doc'"
          xmlns='http://www.w3.org/2000/svg'
          width='24' height='24' viewbox='0 0 24 24' fill='none'
          stroke='#1f4dd6' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'
          class="scale-220 mt7px"
        )
          path(stroke='none' d='M0 0h24v24H0z' fill='none')
          path(d='M14 3v4a1 1 0 0 0 1 1h4')
          path(d='M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2')
          path(d='M9 12l1.333 5l1.667 -4l1.667 4l1.333 -5')

        svg(
          v-else-if="fileType == 'video'"
          xmlns='http://www.w3.org/2000/svg'
          width='24' height='24' viewbox='0 0 24 24' fill='none'
          stroke='#a74ede' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'
          class="scale-250 mt7px"
        )
          path(stroke='none' d='M0 0h24v24H0z' fill='none')
          path(d='M15 10l4.553 -2.276a1 1 0 0 1 1.447 .894v6.764a1 1 0 0 1 -1.447 .894l-4.553 -2.276v-4')
          path(d='M3 8a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2l0 -8')
        svg(
          v-else-if="fileExt == 'pdf'"
          xmlns='http://www.w3.org/2000/svg'
          width='24' height='24' viewbox='0 0 24 24' fill='none'
          stroke='#d61f1f' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'
          class="scale-220 mt7px"
        )
          path(stroke='none' d='M0 0h24v24H0z' fill='none')
          path(d='M14 3v4a1 1 0 0 0 1 1h4')
          path(d='M5 12v-7a2 2 0 0 1 2 -2h7l5 5v4')
          path(d='M5 18h1.5a1.5 1.5 0 0 0 0 -3h-1.5v6')
          path(d='M17 18h2')
          path(d='M20 15h-3v6')
          path(d='M11 15v6h1a2 2 0 0 0 2 -2v-2a2 2 0 0 0 -2 -2h-1')

        svg(
          v-else
          xmlns='http://www.w3.org/2000/svg'
          width='24' height='24' viewbox='0 0 24 24' fill='none'
          stroke='#737373' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'
          class="scale-220 mt7px"
        )
          path(stroke='none' d='M0 0h24v24H0z' fill='none')
          path(d='M14 3v4a1 1 0 0 0 1 1h4')
          path(d='M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2')
          path(d='M12 17v.01')
          path(d='M12 14a1.5 1.5 0 1 0 -1.14 -2.474')
        //img(
        //  :src="onlyImages ? fileUri : fileGetImage()" draggable="false" alt=""
        //  @touchstart="VST.$reactive.isIphone ? $emit('view', fileName) : null"
        //)
        .file-view-text(
          v-if="!VST.$reactive.isIphone"
          title="Посмотреть содержимое"
          data-theme="yellow"
          data-placement="bottom"
          class="z2"
        )
          svg(
            xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewbox='0 0 24 24' fill='none'
            stroke='#56565e' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'
            class="scale-150 mt7px"
          )
            path(stroke='none' d='M0 0h24v24H0z' fill='none')
            path(d='M4 8v-2a2 2 0 0 1 2 -2h2')
            path(d='M4 16v2a2 2 0 0 0 2 2h2')
            path(d='M16 4h2a2 2 0 0 1 2 2v2')
            path(d='M16 20h2a2 2 0 0 0 2 -2v-2')
            path(d='M7 12c3.333 -4.667 6.667 -4.667 10 0')
            path(d='M7 12c3.333 4.667 6.667 4.667 10 0')
            path(d='M12 12h-.01')


    .file-buttons(
      class="absolute flex flex w100% bottom-5px"
    )
      VSTButton(
        size="sm"
        theme="empty"
        title="Скачать файл"
        data-theme="yellow"
        class="text-#37ad00 bg-transparent"
        data-placement="left"
        @clickTap="$emit('download', fileName)"
      )
        svg(
          xmlns='http://www.w3.org/2000/svg' viewbox='0 0 24 24' fill='none'
          width='24'
          height='24'
          stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'
          class="scale-80 text-stone hover:text-#5187d7"
        )
          path(stroke='none' d='M0 0h24v24H0z' fill='none')
          path(d='M19 18a3.5 3.5 0 0 0 0 -7h-1a5 4.5 0 0 0 -11 -2a4.6 4.4 0 0 0 -2.1 8.4')
          path(d='M12 13l0 9')
          path(d='M9 19l3 3l3 -3')

      VSTButton(
        v-if="canChange"
        size="sm"
        theme="empty"
        title="Пометить на удаление"
        data-theme="danger"
        class="ml-auto"
        data-placement="right"
        @clickTap="$emit('delete', fileName, file.deleted = true)"
      )
        svg(
          xmlns='http://www.w3.org/2000/svg' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'
          width='24'
          height='24'
          viewbox='0 0 24 24' fill='none' stroke='currentColor'
          class="scale-80 text-stone hover:text-#e2273d"
        )
          path(stroke='none' d='M0 0h24v24H0z' fill='none')
          path(d='M4 7h16')
          path(d='M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12')
          path(d='M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3')
          path(d='M10 12l4 4m0 -4l-4 4')

  .file-loading(v-else :class="{'only-images':onlyImages}")
    .file-loading-indicator
      div(class="text-center mt-2")
        b {{ file.loaded }}%
      .progress(class="rounded-xl mt7px b-solid border-1px b-emerald/20")
        .progress-bar.progress-bar-striped(
          data-animation="width"
          :data-value="`${file.loaded}%`"
          :style="`width: ${file.loaded}%`"
        )
      div(class="text-center text-9px mt-2 pt3px")
        b {{ file.loadedSize }} / {{ file.sizeNamed }}

  .file-info(
    v-if="file.loaded == 100"
    class="relative"
    :class=`{
      'text-center':canChange && !onlyImages,
      'bg-#e2df4463': !file?.new,
      'bg-lightblue-200/60': file.new,
    }`
  )
    div(v-if="onlyImages" class="p-0 text-center")
      b &nbsp;{{ file.sizeNamed }}
      //i.fa-duotone.fa-eye.text-primary(
      //  title="Просмотр изображения"
      //  data-placement="bottom"
      //  data-theme="primary"
      //  class="text-[#096a3eff] text-13px pl-1 cursor-pointer"
      //  @click="$emit('view', fileName)"
      //)
      //i.fa-duotone.fa-cloud-arrow-down(
      //  title="Скачать оригинал изображения"
      //  data-placement="bottom"
      //  data-theme="success"
      //  class="text-[#096a3eff] text-13px pl-1 cursor-pointer"
      //  @click="$emit('download', fileName)"
      //)
      //i.fa-duotone.fa-trash-xmark.text-danger(
      //  title="Пометить на удаление"
      //  data-placement="right"
      //  data-theme="danger"
      //  class="text-13px pl-4px cursor-pointer"
      //  @click="$emit('delete', fileName, file.deleted = true)"
      //)
    div(v-else)
      | Размер&nbsp;
      b {{ file.sizeNamed }}
</template>


<script lang="ts">
import {Prop, BaseComponent, VST} from '../../../../core'
import {Button as VSTButton} from '../../../../kit'

import IFilesField from '../IFilesField'

@VST export default class FileItem extends BaseComponent {
  components = {VSTButton}
  readonly emits: Array<string> = ['delete', 'restore', 'download', 'view', 'sort', 'rename']

  /** Объект файла */
  @Prop(Object) readonly file: FileFieldItemInterface = {} as FileFieldItemInterface

  /** Название файла */
  @Prop(String) readonly fileName: string = ''

  /** Путь к файлу относительно директории */
  @Prop(String) readonly fileUri: string = ''

  /** MD5 хеш файла */
  @Prop(String, null) readonly fileHash: string | null = null

  /** Можно ли удалять вносить изменения */
  @Prop(Boolean) readonly canChange: boolean = true

  /** Разрешено только изображения */
  @Prop(Boolean) readonly onlyImages: boolean = false

  /** Ес ли удалённые файлы */
  @Prop(Boolean) readonly hasDeleted: boolean = false

  isDroppable: boolean = false
  fileCanView: boolean = true
  fileExt: string = ''
  
  created() {
    this.fileExt = this.fileName?.split?.('.')?.pop()?.trim() ?? ''

    this.registerReactiveEvent(
      'tap', '.file-view-text', () => this.$emit('view', this.fileName)
    )
    this.registerReactiveEvent(
      'tap', '.file-title > div', () => this.canChange
        ? this.$emit('rename', this.file)
        : null
    )
  }

  mounted() {
    // Engine.l('canChange', this.canChange, this.hasDeleted)
  }



  get fileType(): 'image'|'video'|'archive'|'excel'|'doc'|'file' {
    // Image
    const imageExt = [
      'jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp',
      'ico', 'tiff', 'tif', 'avif', 'heic', 'heif'
    ]
    if (imageExt.includes(this.file.ext)) {
      return 'image'
    }

    // Video
    const videoExt = [
      'mp4', 'avi', 'mkv', 'mov', 'wmv', 'flv', 'webm',
      'm4v', 'mpg', 'mpeg', '3gp', 'ogv', 'ts', 'mts'
    ]
    if (videoExt.includes(this.file.ext)) {
      return 'video'
    }

    // Архивы
    const archiveExt = [
      'zip', 'rar', 'tar', 'gz', '7z', 'bz2', 'xz',
      'tgz', 'z', 'arc', 'cab'
    ]
    if (archiveExt.includes(this.file.ext)) {
      return 'archive'
    }

    // Excel (spreadsheet)
    const excelExt = [
      'xls', 'xlsx', 'ods', 'xlsm', 'xlsb', 'csv'
    ]
    if (excelExt.includes(this.file.ext)) {
      return 'excel'
    }

    // Word (document)
    const wordExt = [
      'doc', 'docx', 'odt', 'ods', 'odp', 'md', 'rtf', 'txt'
    ]
    if (wordExt.includes(this.file.ext)) {
      return 'doc'
    }

    return 'file'
  }

  startDrag(e: any) {
    if(!this.canChange) {
      return e.preventDefault()
    }
    e.dataTransfer.dropEffect = 'move'
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('itemID', JSON.stringify({
      name: this.fileName,
      hash: this.fileHash
    }))
  }

  dragOver(e: any) {
    e.preventDefault()
    this.isDroppable = true
  }

  dragLeave(e: any) {
    e.preventDefault()
    this.isDroppable = false
  }

  onDrop(e: any) {
    this.isDroppable = false
    const names = decodeURI(e.target?.closest('.file-item')?.getAttribute('data-id') ?? '').split('|')
    const from = e.dataTransfer.getData('itemID')
    const to = {
        name: names[0],
        hash: names[1] ? names[1] : null
      }
    if(from != JSON.stringify(to)) {
      this.$emit('sort', JSON.parse(from), to)
    }
  }

  eURI(uri: any) {
    return encodeURI(uri)
  }

  viewHover(e: any, hover: boolean) {
    let el = e.target
    // Проверка условия hover и наличия изображения с атрибутом src
    if(hover && el?.querySelector?.('img')?.getAttribute?.('src')?.split('/').slice(-1)[0] !== 'file.png') {
      el.querySelector('.file-view-text').style.display = 'block'
      el.querySelector('.file-view-text').style.cursor = 'zoom-in'
    }
    else {
      el.querySelector('.file-view-text').style.display = 'none'
      el.querySelector('.file-view-text').style.cursor = 'auto'
    }
  }

}

export interface FileFieldItemInterface extends IFilesField {
  loadedSize?: number
  found?: boolean,
  spin?: boolean,
  loaded?: number,
  deleted?: boolean,
  sizeNamed?: string
}

</script>


<style lang="sass" scoped>
.progress
  width: 100%
  background-color: #f1f1f1

.progress-bar
  @apply bg-emerald
  width: 50% /* Измените этот процент для отображения прогресса */
  height: 20px
  text-align: center
  line-height: 30px
  color: white
  background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, .15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%, transparent 75%, transparent)
  background-image:      -o-linear-gradient(45deg, rgba(255, 255, 255, .15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%, transparent 75%, transparent)
  background-image:         linear-gradient(45deg, rgba(255, 255, 255, .15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%, transparent 75%, transparent)
  -webkit-background-size: 40px 40px
  background-size: 40px 40px
  -webkit-animation: progress-bar-stripes 2s linear infinite
  -o-animation: progress-bar-stripes 2s linear infinite
  animation: progress-bar-stripes 2s linear infinite
@keyframes progress-bar-stripes
  from
    background-position: 40px 0
  to
    background-position: 0 0

.file-item
  @apply relative
  @apply rounded-xl
  cursor: move
  height: 118px
  margin: 0 4px 4px
  width: 118px
  -webkit-user-drag: element !important
  user-select: auto !important
  touch-action: auto !important
  &.only-images
    height: 154px


.file-item.file-view-mode
  cursor: auto

.file-deleted
  @apply absolute h116px flex flex-col bg-rose-6/90 text-white items-center justify-center w100% text-center z-3
  @apply rounded-xl fw-500

.file-loading
  @apply top-0 absolute rounded-lg
  background: #fff
  //padding-top: 144px

.file-download
  padding-top: 42px !important
  height: 123px
  background: #cefbb7d1
  border: 1px solid #e7e7e7
  color: #5c5c5c
  opacity: 0.85


.file-loading-indicator
  @apply rounded-lg
  margin-top: -110px
  padding: 6px
  position: absolute

.file-loading-indicator > .progress
  @apply w105px bg-stone-100!

.file-item-drop
  background: #ccc
  border-style: dashed

.file-item-drop * 
  opacity: .4

.file-title
  @apply rounded-xl
  font-size: 14px
  background: #fff
  border: solid #FFF
  border-width: 2px 8px
  white-space: nowrap
  overflow: hidden

.file-content
  padding: 5px
  height: 66px
  text-align: center
  position: relative
  background: #ffffff

.file-container
  &.only-images
    .file-content
      border-radius: 20px
      height: 119px
    img
      max-width: 120px
      max-height: 120px
      border-radius: 10px
    &:hover
      img
        opacity: .8
    .file-view-text
      height: 90px
      display: none !important
    .file-info
      border-radius: 0 0 10px 10px
      padding: 2px 0 0 0
      line-height: 24px
.file-loading
  @apply top-100%

.file-content img
  max-width: 76px
  max-height: 76px

.file-content .file-view-text
  @apply mt-0 rounded-3xl
  display: none
  position: absolute
  top: 0
  background: #fdf8c0
  width: 70px
  height: 40px

.file-info
  @apply mt3px fs-12px rounded-b-xl text-center w100%
  padding: 2px 4px


</style>
