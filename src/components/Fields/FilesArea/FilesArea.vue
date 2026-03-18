<template lang="pug">
  .dropzone(
    :class=`{
      'dz-valid':isValid,
      'dz-invalid':!isValid,
      'dz-droppable':dropZoneDroppable,
      'only-images':onlyImages
    }`
    @drop="hasDeleted ? null : onDrop"
    @dragover="hasDeleted || !canChange ? null : dragOver"
    @dragenter="hasDeleted || !canChange ? null : dragEnter"
    @dragleave="hasDeleted || !canChange ? null : dragLeave"
    @mouseleave="dropZoneDroppable = false"
    class="relative "
  )
    .dropzone-active(class="w100%")
      div(v-if="onlyImages")
        span(v-if="maxNumberOfFiles == 1 && files.length" ) Заменить файл <i class="fa fa-duotone fa-arrows-rotate-reverse"></i>
        span(v-else) Для загрузки изображений бростье их в этот блок или кликните по нему
      div(v-else class="w100%") Для загрузки бросьте файл в этот блок или кликните по нему
    div(
      :class=`{
        'text-center my12px': VST.$reactive.viewPortType == 'mobile',
        'min-h8px': VST.$reactive.viewPortType != 'mobile',
        'grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-5px': files.length,
      }`
      class=" w100% pt5px pb3px px5px"
    )
      div(v-show="files.length" v-for="(file, key) in files")
        FileItem(
          v-if="canChange || (!canChange && file?.found)"
          :file
          :fileName="file.name ? file.name : 'Unknown'"
          :fileUri="file.data && file.data.thumbnails && file.data.thumbnails['120x120'] ? file.data.thumbnails['120x120'].uri : (file.uri ? file.uri : 'unknown')"
          :fileSize="file.size ? file.size : null"
          :fileHash="file.hash ? file.hash : null"
          :fileMime="file.mime ? file.mime : null"
          :fileLastModifiedStamp="file.fileLastModifiedStamp ? file.fileLastModifiedStamp : null"
          :fileFound="file.found ? file.found : false"
          :hasDeleted="hasDeleted || maxNumberOfFiles == 1"
          :onlyImages
          :canChange
          @delete="fileDelete(key)"
          @restore="fileRestore(key)"
          @download="fileDownload(key)"
          @view="fileView(key)"
          @sort="fileSortDrop"
          @rename="startRenameFile(key)"
        )
      div(v-show="!files.length")
      .dropzone-empty-files(
        v-if="!files.length"
        :class="{'dropzone-empty-files-blocked':!canChange}"
        class="text-#dfa955 hover:color-red w100%"
      )
        span(v-if="canChange")
          div
            | Для загрузки бросьте файл в этот блок или кликните по нему
            i.fa-duotone.fa-cloud-arrow-up(class="text-35px mx-2 top-4")
        span(v-else style="color: #b3b3b3; user-select: none") Файлов нет
          br
          | Добавление новых ограничено
      //- Просмотр файлов
      ViewerFilesField(
        v-show="files.length"
        :files
        :docViewComponent
        :excelViewComponent
        :videoViewComponent
        ref="viewer"
        @download="fileDownload"
        @viewerOpened="$emit('viewerOpened')"
        @viewerClosed="$emit('viewerClosed')"
      )
    .dz-footer(
      v-if="canChange || files.length"
      class="flex flex-row w[calc(100%-12px)] items-center"
    )
      div(
        :title=`files.length >= maxNumberOfFiles && maxNumberOfFiles > 0
        ? 'Достигнуто максимальное количество файлов: <b>'+files.length+'</b>'+
          (hasDeleted ? '<br>(Удалённые тоже учитываются, сначала сохраните их удаление)' : '' )
        : ''`
        data-theme="darkgrey-warning"
        data-placement="bottom-start"
        data-width="none"
        :class=`{
          'text-primary': files.length >= maxNumberOfFiles,
          'text-warning': files.length < maxNumberOfFiles,
        }`
      )
        VSTButton(
          size="sm"
          theme="empty"
          :disabled="onUploadInProcess || onZipDownloadInProcess || (files.length >= maxNumberOfFiles && maxNumberOfFiles > 0)"
          :class=`{
          'fa-cloud-arrow-up':!onUploadInProcess || files.length == maxNumberOfFiles,
          'fa-sync': onUploadInProcess && (files.length != maxNumberOfFiles || maxNumberOfFiles == 0),
          'text-primary': files.length < maxNumberOfFiles || !maxNumberOfFiles,
        }`
          @clickTap="fileUpload"
          title="Загрузить файл"
          v-if="canChange"
          class="mb-5px"
        )
          svg(
            v-if="onUploadInProcess"
            xmlns='http://www.w3.org/2000/svg'
            width='24' height='24'
            viewbox='0 0 24 24' fill='none'
            stroke='#837777' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'
            class="spin"
          )
            path(stroke='none' d='M0 0h24v24H0z' fill='none')
            path(d='M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4')
            path(d='M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4')
          svg(
            v-else
            xmlns='http://www.w3.org/2000/svg' viewbox='0 0 24 24' fill='none'
            width='24'
            height='24'
            stroke="currentColor"
            stroke-width='2' stroke-linecap='round' stroke-linejoin='round'
            class="scale-90 text-stone hover:text-#0f83d0"
          )
            path(stroke='none' d='M0 0h24v24H0z' fill='none')
            path(d='M7 18a4.6 4.4 0 0 1 0 -9a5 4.5 0 0 1 11 2h1a3.5 3.5 0 0 1 0 7h-1')
            path(d='M9 15l3 -3l3 3')
            path(d='M12 12l0 9')
      div(
        class="mx5px"
      )
        span(v-if="onlyImages") Всего изображений:&nbsp;
        span(v-else) Всего файлов:&nbsp;
        b {{ totalFiles }}
        |  | Общий размер:&nbsp;
        b {{ totalSize }}
      div(class="ml-auto flex items-center justify-center")
        div(
          v-if="hasDeleted && maxNumberOfFiles != 1 && files.length > 1"
          :title=`
            '<div style="text-align: center">Для возможности сортировки '+(
              onlyImages ? 'изображений' : 'файлов'
            )+' снимите отметку удаления<div style="height: 4px">&nbsp;</div>'
          `
          data-theme="darkgrey-warning"
          data-placement="left"
        )
          svg(
            xmlns='http://www.w3.org/2000/svg'
            width='24' height='24' viewbox='0 0 24 24' fill='none'
            stroke='#ef4545' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'
            class="scale-90 mt3px"
          )
            path(stroke='none' d='M0 0h24v24H0z' fill='none')
            path(d='M11 7v-2h-1')
            path(d='M18 19v-1')
            path(d='M15.5 5h2a.5 .5 0 0 1 .5 .5v4a.5 .5 0 0 1 -.5 .5h-2a.5 .5 0 0 1 -.5 -.5v-4a.5 .5 0 0 1 .5 -.5')
            path(d='M10.5 14h2a.5 .5 0 0 1 .5 .5v4a.5 .5 0 0 1 -.5 .5h-2a.5 .5 0 0 1 -.5 -.5v-4a.5 .5 0 0 1 .5 -.5')
            path(d='M6 10v.01')
            path(d='M6 19v.01')
            path(d='M3 3l18 18')

        VSTButton(
          size="sm"
          theme="empty"
          v-if="!onlyImages && canChange"
          title="Сортировать по названию"
          :disabled="!totalFiles || hasDeleted"
          type="button"
          v-show="canChange"
          @clickTap="fileSort"
        )
          svg(
            xmlns='http://www.w3.org/2000/svg' fill='none'
            width='24' height='24'
            viewbox='0 0 24 24'
            stroke='#399c7f' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'
            class="scale-90"
          )
            path(stroke='none' d='M0 0h24v24H0z' fill='none')
            path(d='M15 10v-5c0 -1.38 .62 -2 2 -2s2 .62 2 2v5m0 -3h-4')
            path(d='M19 21h-4l4 -7h-4')
            path(d='M4 15l3 3l3 -3')
            path(d='M7 6v12')

        VSTButton(
          size="sm"
          theme="empty"
          v-if="maxNumberOfFiles != 1"
          :class=`{
            'fa-file-zipper':!onZipDownloadInProcess,
            'fa-sync': onZipDownloadInProcess,
            'spin': onZipDownloadInProcess,
          }`
          type="button"
          title="Скачать в виде .zip архива"
          @clickTap="fileDownloadAll"
          :disabled="!totalFiles || onZipDownloadInProcess || onUploadInProcess"
        )
          svg(
            xmlns='http://www.w3.org/2000/svg' viewbox='0 0 24 24' fill='none'
            width='24'
            height='24'
            stroke='#f5b705' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'
            class="scale-90"
          )
            path(stroke='none' d='M0 0h24v24H0z' fill='none')
            path(d='M14 3v4a1 1 0 0 0 1 1h4')
            path(d='M5 12v-7a2 2 0 0 1 2 -2h7l5 5v4')
            path(d='M16 18h1.5a1.5 1.5 0 0 0 0 -3h-1.5v6')
            path(d='M12 15v6')
            path(d='M5 15h3l-3 6h3')

      input(
        type="file"
        ref="filesInput"
        :class=`{
          ['dropzone-input-' + randomKey]: true,
        }`
        :multiple="maxNumberOfFiles != 1"
        :accept=`onlyImages
          ? 'image/apng image/avif, image/bmp, image/gif, image/jpeg, image/png, image/svg+xml, image/webp'
          : null`
        @input="uploadFiles"
      )
    div(
      class="absolute w100% h100% top-0 left-0 bg-amber-100/70 z3 rounded-13px flex flex-col items-center justify-center"
      v-if="editFileIndex"
    )
      h2(class="m0 mb-2px bg-white/80 px20px rounded-xl pb4px fs-1.5rem") Переименование файла
      VSTStringField(
        v-model="editFileName"
        class="w70%"
        size="md"
        :endText="`.${editFileExt}`"
        endColor="#000"
        endBg="#ccc"
        ref="editFileInput"
        @keypress.enter="renameFile()"
        @keypress.esc="editFileIndex = null"
      )
      div
        span(
          v-if="typeof canRenameFile == 'string'"
          class="text-center fw-bold text-red-400 mx5px bg-white/80 py10px px12px rounded-md"
        ) {{ canRenameFile }}
        VSTButton(
          v-else
          size="md"
          theme="black"
          @clickTap="renameFile()"
          :disabled="canRenameFile !== true"
        ) Переименовать
        VSTButton(
          size="md"
          @clickTap="editFileIndex = null"
        ) Отмена
</template>


<script lang="ts">
import {Prop, VST, Watch} from '../../../core'
import FieldComponent from '../../../replaceable/FieldComponent.vue'
import FileItem, {FileFieldItemInterface} from './Components/FileItem.vue'
import ViewerFilesField from './Components/ViewerFilesField.vue'
import IFilesFormField from './IFilesField'
import JSZip from 'jszip'
import {md5} from 'js-md5'
import IFilesField from './IFilesField'
import {Button as VSTButton, StringField as VSTStringField} from '../../../kit'

@VST export default class FilesArea extends FieldComponent {
  readonly components: object = {FileItem, ViewerFilesField, VSTButton, VSTStringField}
  declare $refs: {
    editFileInput: typeof VSTStringField,
    viewer: ViewerFilesField,
    filesInput: HTMLInputElement,
  }
  emits = ['viewerOpened', 'viewerClosed', 'change']
  /** Максимальный размер загружаемого файла */
  @Prop(String, Number) readonly maxSize: number = 30

  /** Максимальное количество файлом */
  @Prop(String, Number) readonly maxNumberOfFiles: number = 0
  @Prop(Boolean) readonly canChange: boolean = false

  /** Можно ли удалять */
  @Prop(Boolean) readonly canDelete: boolean = true

  /** Можно ли загружать файлы */
  @Prop(Boolean) readonly canUpload: boolean = true

  /** Можно ли загружать файлы */
  @Prop(String) readonly zipFileName: string = ''

  @Prop(String) readonly uploadPath: string = ''
  @Prop(Object, Function, null) readonly uploadHeaders: {[k: string]: string}|(() => {[k: string]: string})|null = null

  /** Разрешено только изображения */
  @Prop(Boolean) readonly onlyImages: boolean = false
  @Prop(Boolean, null) readonly saveOriginal: boolean|null = null
  @Prop(Object, null) readonly options: {[k:string]: any}|null = null
  @Prop(Array, null) readonly imagesThumbnails: {[k:string]: any}[]|null = null
  @Prop(Function) readonly errorHandler: ((error: any, type?: 'error'|'warning') => any)|null = null

  @Prop(String, null) readonly docViewComponent: string|null = ''
  @Prop(String, null) readonly excelViewComponent: string|null = ''
  @Prop(String, null) readonly videoViewComponent: string|null = ''

  totalSize = 0
  totalFiles = 0
  dropZoneDroppable: boolean = false
  isUploadStarted: boolean = false
  onUploadInProcess: boolean = false

  isValid: boolean = true

  onZipDownloadInProcess: boolean = false
  hasDeleted: boolean = false
  files: FileFieldItemInterface[] = []
  deleteFileTimeouts: any[] = []

  randomKey: string = ''
  editFileIndex: null|number = null
  editFileExt: string = ''
  editFileName: string = ''

  created() {
    this.registerReactiveEvent('tap', '.dropzone-active', this.fileUpload)
    this.registerReactiveEvent('tap', '.dropzone-empty-files', this.fileUpload)
  }

  mounted() {
    this.deleteFileTimeouts = []
    this.randomKey = this.VST.generateRandomKey()
    this.setSizeAll()
  }

  get canRenameFile(): string|boolean {
    if (this.editFileIndex === null || this.editFileIndex === undefined) return false
    let newName = this.editFileName
    if (!newName) return 'Название должно быть заполнено'
    newName += '.' + this.files[this.editFileIndex].name?.split?.('.').slice?.(-1)?.[0]?.trim()
    const hasDuplicate = this.files.some((f, index) => {
      return index !== this.editFileIndex && f.name === newName
    })
    return hasDuplicate ? 'Такое название уже есть' : true
  }

  setValue(value: FileFieldItemInterface[]): any {
    const files = []
    for(let f of (Array.isArray(value) ? value : [])) {
      if(this.onlyImages) {
        if(f.data?.isImage) {
          files.push({...f, ...{
              sizeNamed : this.fileGetSize(f.size),
              found: true,
              loaded: 100
            }})
        }
      }
      else {
        files.push({...f, ...{
            sizeNamed : this.fileGetSize(f.size),
            found: true,
            loaded: 100
          }})
      }
    }
    this.files = files
  }

  getValue(): IFilesFormField[] {
    let out: IFilesFormField[] = []
    for(let f of this.files) {
      if(!f?.deleted && f.found) {
        out.push({
          ext : f.ext,
          name : f.name,
          hash : f.hash,
          size : f.size,
          mime : f.mime,
          uri : f.uri,
          deleted : f?.deleted,
          encoding : f.encoding, // @ts-ignore
          data : {
            ...{encoding: f.encoding},
            ...f.data
          },
          lastModified : f.lastModifiedStamp,
          sizeNamed : this.fileGetSize(f.size),
        })
      }
    }
    return out
  }

  setSizeAll() {
    let ts = 0, tf = 0
    for(let f of this.files) {
      if(!f?.deleted && f?.found && f?.size) {
        ts += f.size
        f.sizeNamed = this.fileGetSize(f.size)
        tf++;
      }
    }
    this.totalSize = this.fileGetSize(ts)
    this.totalFiles = tf
  }

  fileGetSize(count: any = 0, decimal=2, level=0): any {
    let unitList: string[] = ['Бт','Кб','Мб','Гб','Тб', 'Пб'];
    if(count >= 1024.0 && (level+1 < unitList.length)) {
      return this.fileGetSize(count/1024, decimal, ++level)
    }

    return `${decimal ? (count).toFixed(decimal) : Math.round(count)} ${unitList[level]}`
  }

  fileUpload() {
    if(this.canChange) {
      this.$refs?.filesInput?.click?.()
    }
  }

  fileDelete(key: number) {
    this.hasDeleted = true
    this.files[key].deleted = true
    this.files[key].deletedName = this.files[key].name // @ts-ignore
    this.files[key].name = null
    this.setSizeAll()
  }

  fileRestore(key: number) {
    this.files[key].deleted = false
    this.files[key].name = this.fileGetName(this.files[key].deletedName)
    delete this.files[key].deletedName
    this.hasDeleted = (this.files[key]?.filter?.((item: IFilesField) => item.deleted === true)?.length || 0) > 0
    this.setSizeAll()
  }

  fileDownload(key: number) {
    this.files[key].spin = true

    fetch(this.files[key].uri)
        .then(response => response.blob())
        .then(blob => {
          const blobUrl = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = blobUrl
          a.download = this.files[key].name
          a.style.display = 'none'
          document.body.appendChild(a)
          a.click()
          window.URL.revokeObjectURL(blobUrl)
          this.files[key].spin = false
        })
  }

  fileDownloadAll() {
    const zip = new JSZip()
    const promises: any[] = []
    this.onZipDownloadInProcess = true
    this.files.forEach(({ name, uri }) => {
      promises.push(
        fetch(uri.startsWith('http') ? uri : `${location.protocol}//${location.host}${uri}`)
          .then(response => response.blob())
          .then(blob => zip.file(name, blob))
      )
    })

    Promise.all(promises).then(() => {
      zip.generateAsync({ type: 'blob' }).then((content: any) => {
        const url = URL.createObjectURL(content)
        const a = document.createElement('a')
        a.href = url
        a.download = `${this.zipFileName}.zip`
        a.style.display = 'none'
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        this.onZipDownloadInProcess = false
      })
    })
  }

  fileView(key: number) { // @ts-ignore
    (this.$refs.viewer as ViewerFilesField).view(key)
    // Engine.modal.info({
    //   title : 'Информация',
    //   message: 'Просмотр содержимого файла. Пока не реализовано '+key,
    // })
  }

  startRenameFile(key: number) {
    this.editFileIndex = key
    this.editFileExt = this.files[this.editFileIndex].name?.split?.('.').slice?.(-1)[0]
    this.editFileName = this.files[this.editFileIndex].name?.split?.('.').slice?.(0, -1).join('.')
    this.nextTick(() => {
      this.$refs.editFileInput?.focus?.(0, this.$refs.editFileInput?.value?.length ?? 0)
    })
  }
  renameFile() {
    if (this.canRenameFile !== true) return
    this.files[this.editFileIndex!].name = this.$refs.editFileInput.getValue()
      + '.' + this.files[this.editFileIndex!].name.split('.').slice(-1)[0]
    this.editFileIndex = null
  }

  fileSortDrop(from: any, to: any) {
    let fromIndex = 0, toIndex = 0
    for(let file of this.files) {
      if(file.name == from.name && file?.hash == from.hash) {
        break
      }
      ++fromIndex;
    }
    for(let file of this.files) {
      if(file.name == to.name && file?.hash == to.hash) {
        break
      }
      ++toIndex;
    }
    let element = this.files[fromIndex],
        // Удаляем перемещаемый элемент
        f = [...this.files].slice(0,fromIndex).concat([...this.files].slice(fromIndex+1)),
        fa = f.slice(toIndex)
    // Вставляем перемещаемый элемент на место drop zone
    fa.unshift(element)
    const files = f.slice(0,toIndex).concat(fa)
    this.files = []
    this.nextTick(() => this.files = files)
  }

  fileSort() {
    const files = [...this.files].sort((a, b) => a.name > b.name ? 1 : -1)
    this.files = []
    this.nextTick(() => this.files = files)
  }

  fileGetName(name: string): any {
    for(let v of this.files) {
      if(v.name == name) {
        if(/\([0-9]+\)\.[a-z0-9A-Z]+$/.test(name)) { // @ts-ignore
          name = name.replace(/(.*)\(([0-9]+)\)\.([a-z0-9A-Z])+$/g, function(match, name, int, ext) {
            ext = match.split('.').slice(-1)[0]
            return `${name}(${parseInt(int)+1}).${ext}`
          })
          return this.fileGetName(name)
        }
        else {
          let split = name.split('.'),
              ext = split[split.length-1]
          split.splice(-1)
          name = `${split.join('.')} (1).${ext}`
        }
      }
    }
    return name
  }

  dragOver(e: any) {
    this.dragEnter(e)
  }

  dragEnter(e: any) {
    e.preventDefault()
    if(
        this.canChange
        // && e?.fromElement && !e?.fromElement?.closest('.dz-content')
        && e?.dataTransfer.effectAllowed != 'move' // Исключаем активацию при внутренних перемещениях
        && Array.from(e.dataTransfer.types).includes('Files') // Разрешаем только файлы
    ) {
      this.dropZoneDroppable = true
    }
  }

  dragLeave(e: any) {
    e.preventDefault()
    if(e.target.classList.contains("dz-droppable") || e.target.classList.contains("dropzone-active")) {
      this.dropZoneDroppable = false
    }
  }

  onDrop(e: any) {
    e.preventDefault()
    if (!this.canChange) return
    this.dropZoneDroppable = false
    if(!this.canChange) {
      return false
    }
    if(e.dataTransfer.files.length) {
      this.uploadFiles(e.dataTransfer.files).then()
    }
  }

  async uploadFiles(e: any) {
    let fls = e.target?.files ?? ((e instanceof FileList) ? e : [])
    if(!fls.length) {
      return
    }
    this.dropZoneDroppable = false
    this.onUploadInProcess = true

    const formData = new FormData()
    let loadedKeys: string[] = []
    let sendKeys: {[key: string]: string} = {}
    let sendFiles: any[] = []
    let lastFileName: string = ''
    const notImages: string[] = []
    const extraFiles: string[] = []
    const filesWithExtraSize: string[] = []
    for (let i = 0; i < fls.length; i++) {
      if(this.onlyImages && !this.isImage(fls[i].type)) {
        notImages.push(fls[i].name)
      }
      // Если файлов больше чем разрешено
      else if(this.maxNumberOfFiles > 1 && this.files.length >= this.maxNumberOfFiles) {
        extraFiles.push(fls[i].name)
      }
      // Если файл больше максимально установленного размера
      else if(fls[i].size > (this.maxSize * 1024 * 1024)) {
        filesWithExtraSize.push(fls[i].name)
      }
      else {
        let loadedKey = this.VST.generateRandomKey(12)
        lastFileName = fls[i].name
        const file = {
          name: this.fileGetName(lastFileName),
          size: fls[i].size,
          sizeNamed: this.fileGetSize(fls[i].size),
          loaded: 0.01,
          loadedSize: 0,
          loadedKey: loadedKey,
          new: true,
          deleted: false,
          hash: await this.calculateMD5(fls[i]),
          found: true,
          file: fls[i]
        }
        // Если включено только изображения и это не изображение
        if(this.maxNumberOfFiles == 1) {
          // extraFiles.push(fls[i].name)
        }
        else {
          try {
            const hash = await this.calculateMD5(fls[i])
            const issetFile = this.files.find(item => item.hash === hash)

            if(!issetFile) {
              formData.append('files[]', file.file)
              sendFiles.push(file)
              this.files.push(file as any)
            }
          }
          catch (e: any) {
            this.onUploadInProcess = false
            this.errorHandler?.({
              title: 'Произошла ошибка при вычислении MD5 хэша файла',
              message: e?.message ?? e,
            })
          }
        }
        sendKeys[fls[i].name] = loadedKey
        loadedKeys.push(loadedKey)
      }
    }
    if(notImages.length) {
      this.errorHandler?.({
        title: 'Внимание!',
        width: '450px',
        message: `<div class="text-center">Следующие файлы не были добавлены, потому не являются изображениями:</div>
          <br><div class="text-center"><b>&#8226; ${notImages.join('</b><br><b>&#8226; ')}</b><br>
          <br>Поддерживаемые расширения файлов для загрузки:<br>
          <b>.jpeg .jpg .png .svg .svgz .gif .bmp .webp .avif .apng .webp .jfif, .pgp</b></div>`,
      }, 'warning')
    }
    if(extraFiles.length) {
      this.errorHandler?.({
        title: 'Внимание!',
        width: '450px',
        message: `<div class="text-center">Следующие файлы не были добавлены:</div>
          <br><div class="text-center"><b>&#8226; ${extraFiles.join('</b><br><b>&#8226; ')}</b><br><br>
          Устновлено ограничение на количество: <u><b>${this.maxNumberOfFiles}</b></u>
          </div>`,
      }, 'warning')
    }
    if(filesWithExtraSize.length) {
      this.errorHandler?.({
        title: 'Внимание!',
        width: '450px',
        message: `<div class="text-center">Следующие файлы не были добавлены, потому что максимальный размер
              загружаемого изображения не должно превышать <b>${this.fileGetSize(this.maxSize * 1024 * 1024)}</b>:</div>
          <br><div class="text-center"><b>&#8226; ${filesWithExtraSize.join('</b><br><b>&#8226; ')}</b><br><br></div>`,
      }, 'warning')
    }

    if (!formData.has('files[]')) {
      this.errorHandler?.({ title: 'Ошибка', message: 'Такие файлы уже есть' })
      this.onUploadInProcess = false
      return
    }

    const xhr = new XMLHttpRequest()
    const url = this.uploadPath

    xhr.open('POST', url, true)

    let headers: {[k: string]: string} = {}
    if (this.uploadHeaders) {
      if (typeof this.uploadHeaders == 'function') {
        headers = this.uploadHeaders()
      }
      else {
        headers = this.uploadHeaders
      }
    }

    for (const key in headers) {
      xhr.setRequestHeader(key, headers[key])
    }

    // Отслеживание прогресса загрузки
    xhr.upload.addEventListener('progress', (progressEvent) => {
      if (progressEvent.lengthComputable) {
        const percent = Math.ceil((progressEvent.loaded / progressEvent.total) * 100)
        for (let v of this.files) {
          if (loadedKeys.includes(v.loadedKey)) {
            v.loaded = Math.ceil(percent >= 100 ? 99 : percent)
            v.loadedSize = this.fileGetSize(progressEvent.loaded)
          }
        }
      }
    })

    // Обработка завершения запроса
    xhr.onload = () => {
      // if (xhr.status === 401) {
      //   this.errorHandler?.('Время авторизации истекло, страница будет обновлена.')
      //   location.reload()
      //   return;
      // }

      let responseData
      try {
        responseData = JSON.parse(xhr.responseText)
      } catch (e) {
        this.errorHandler?.({ title: 'Ошибка', message: 'Некорректный ответ сервера' })
        this.onUploadInProcess = false
        return
      }

      if (!responseData.success) {
        this.errorHandler?.({ title: 'Ошибка', message: responseData.error })
        return;
      }

      // Обработка успешного ответа (аналогично axios-версии)
      for (let file of responseData.files) {
        const f = this.files.find(f => f.hash === file.hash)
        if (!f) continue
        f.loaded = 100
        f.size = file.size
        f.mime = file.mime
        f.ext = file.ext
        f.id = file.id
        f.hash = file.hash
        f.uri = file.uri
        f.lastModified = file.lastModified;
        f.data = {
          ...{ encoding: f.encoding },
          ...file.data
        };
        f.found = true

        this.deleteFileTimeouts.push(setTimeout(() => {
          this.files = this.files.filter(fl => fl.hash === f.hash)
        }, 604800000))
      }

      let files = this.files
      this.files = []
      this.$nextTick(() => this.files = files)
      this.setSizeAll()
      this.onUploadInProcess = false
    }

    xhr.onerror = () => {
      this.errorHandler?.({ title: 'Ошибка', message: 'Сетевая ошибка' })

      let oldFiles = this.files.filter(f => !f.loadedKey || !sendFiles.some(item => item.loadedKey === f.loadedKey))
      this.files = []
      this.$nextTick(() => {
        this.files = oldFiles
        this.setSizeAll()
      });
    }

    xhr.onloadstart = () => {
      this.isUploadStarted = true
    }
    xhr.onloadend = () => {
      this.isUploadStarted = false
    }

    // Отправка FormData
    xhr.send(formData)
  }


  cancelUpload() {
    // TODO через prompt и signal
    this.errorHandler?.('Отмена загрузки пока не реализована')
  }


  calculateMD5(file: FileList) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event: any) => {
        // js-md5 принимает ArrayBuffer напрямую.
        // Это в десятки раз быстрее и потребляет в разы меньше памяти.
        const hash = md5(event.target.result)
        resolve(hash);
      }

      reader.onerror = (error) => {
        reject(error)
      }

      reader.readAsArrayBuffer(file)
    })
  }


  isImage(mime: string): boolean {
    return [
      'image/apng',
      'image/avif',
      'image/bmp',
      'image/gif',
      'image/jpeg',
      'image/png',
      'image/svg+xml',
      'image/webp',
    ].includes(mime)
  }


  @Watch watchFiles() {
    this.setSizeAll()
    this.$emit('change', this.files)
  }

  beforeUnmount() {
    for(const timer of this.deleteFileTimeouts) {
      clearTimeout(timer)
    }
  }
}

type FilesAreaResponseType = {
  // Axios type
  data: {[k:string]: any}|string
  status: number
  statusText: string
  headers: {[k:string]: any}
  config: {[k:string]: any}
  request: {[k:string]: any}
}|Response

</script>

<style scoped lang="sass">
input
  display: none

.dropzone
  font-size: 12px
  display: grid
  width: 100%
  border: 1px solid #f3eb8c
  border-radius: 14px
  background: #fffee9
  margin-bottom: 11px
  -webkit-user-drag: element !important
  user-select: none !important
  touch-action: none !important

.dropzone .dropzone-active
  text-align: center
  font-size: 2em
  display: none
  width: 100%
  min-height: 100px
  align-items: center
  justify-content: center

.dropzone-empty-files
  cursor: pointer
  font-size: 2em
  width: 100%
  text-align: center
  height: 176px
  display: flex
  align-items: center
  justify-content: center

.dropzone-empty-files-blocked
  cursor: auto

.dz-droppable
  cursor: pointer
  height: 223px
  background: #daffb2
  border: 2px dashed #76c70c
  display: flex
  align-items: center
  justify-content: center
  &.only-images
    height: 205px !important

.dropzone
  &.only-images
    .dropzone-empty-files
      height: 160px !important


.dz-droppable .dropzone-active
  display: flex


.dz-droppable .dz-content, .dz-droppable .dz-footer
  display: none

.dropzone .dz-footer
  background: #fff
  border-top: 1px solid #f3eb8c
  padding: 6px
  border-radius: 0 0 14px 14px

.dropzone.dz-valid
  border: 1px dashed #4CD964

.dropzone.dz-invalid
  border: 1px dashed #FF3B30

</style>
