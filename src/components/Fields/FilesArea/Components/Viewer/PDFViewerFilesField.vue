<template lang="pug">
  div(class="pdf-container h100vh w-full fixed l-0 t-50px bg-white p-0")
    div(
      v-if="loading"
      class="absolute t-0 l-0 bg-white/80 text-lightblue-600 flex items-center justify-center w100% h100%"
    )
      .spin
        svg(
          xmlns='http://www.w3.org/2000/svg'
          width='24' height='24' viewbox='0 0 24 24'
          fill='none' stroke='currentColor'
          stroke-width='2' stroke-linecap='round' stroke-linejoin='round'
          class="scale-800!"
        )
          path(stroke='none' d='M0 0h24v24H0z' fill='none')
          path(d='M12 6l0 -3')
          path(d='M16.25 7.75l2.15 -2.15')
          path(d='M18 12l3 0')
          path(d='M16.25 16.25l2.15 2.15')
          path(d='M12 18l0 3')
          path(d='M7.75 16.25l-2.15 2.15')
          path(d='M6 12l-3 0')
          path(d='M7.75 7.75l-2.15 -2.15')

    // Нативный просмотрщик через iframe
    div(
      v-if="pdfUrl"
      class="bg-white h[calc(100vh-50px)] w100vw fixed p-0"
    )
      iframe(
        :src="pdfUrl"
        width="100%"
        height="100%"
        frameborder="0"
        class="p-0"
      )
    component(is="style").
      .simplebar-track.simplebar-vertical {
        display: none;
      }
</template>



<script lang="ts">
import {Prop, BaseComponent, VST} from '../../../../../core'

@VST export default class PdfViewer extends BaseComponent {

  @Prop(String) readonly uri: string = ''
  @Prop(String) readonly ext: string = ''
  @Prop(String) readonly fileName: string = ''

  pdfUrl: string | null = null
  loading: boolean = true

  async mounted() {
    await this.loadAndShowPdf()
  }

  async fetchPdfFile(): Promise<File | undefined> {
    try {
      const response = await fetch(this.uri)
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`)
      }

      const blob = await response.blob()
      const mimeType = 'application/pdf'
      const name = this.fileName || this.uri.split('/').pop() || 'document.pdf'

      return new File([blob], name, { type: mimeType })
    } catch (error) {
      console.error('Failed to fetch the file:', error)
    }
  }

  async loadAndShowPdf() {
    const file = await this.fetchPdfFile()
    if (file) {
      const pdfUrl = URL.createObjectURL(file)

      // Создаем HTML с вашими стилями
      const htmlContent = `
      <html>
        <head>
          <style>
            body, html { margin: 0; padding: 0; background: #2c3e50; box-sizing: border-box; }
            embed { width: 100vw; height: 100vh; } /* Пример стиля */
          </style>
        </head>
        <body>
          <embed src="${pdfUrl}" type="application/pdf">
        </body>
      </html>
    `
      const htmlBlob = new Blob([htmlContent], { type: 'text/html' })
      this.pdfUrl = URL.createObjectURL(htmlBlob)
    }
    this.loading = false
  }

  // Очистка памяти при уничтожении компонента
  beforeUnmount() {
    if (this.pdfUrl) {
      URL.revokeObjectURL(this.pdfUrl)
    }
  }
}
</script>

<style lang="sass" scoped>
.pdf-container
  @apply flex flex-col p-4
</style>
