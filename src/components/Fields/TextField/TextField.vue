<template lang="pug">
  .vst-field-editor(class="container relative" :id="vstTextId")
    //div(class="control-group")
    //  label
    //    input(type="checkbox" :checked="isEditable" @change="() => (isEditable = !isEditable)")
    //    span Editable

    BubbleMenu.bubble-menu(v-if="editor && showMenu" :editor="editor" :options="{ placement: 'bottom', offset: 8 }")
      div(class="bubble-menu")
        VSTButton(
          :theme="editor.isActive('bold') ? activeButtonsTheme : defaultButtonsTheme"
          @click="editor.chain().focus().toggleBold().run()"
        )
          div(
            class="h18px mt-0"
            :class="{ 'fw-bold': editor.isActive('bold') }"
          ) B
        VSTButton(
          :theme="editor.isActive('italic') ? activeButtonsTheme : defaultButtonsTheme"
          @click="editor.chain().focus().toggleItalic().run()"
        )
          div(
            class="h18px mt-0"
            :class="{ 'italic': editor.isActive('italic') }"
          ) I
        VSTButton(
          :theme="editor.isActive('underline') ? activeButtonsTheme : defaultButtonsTheme"
          @click="editor.chain().focus().toggleUnderline().run()"
        )
          div(
            class="h18px mt-0"
            :class="{ 'underline': editor.isActive('underline') }"
          ) U

        VSTButton(@click="showLinkModal = true") Link
        VSTButton(
          :theme="editor.isActive('strike') ? activeButtonsTheme : defaultButtonsTheme"
          @click="editor.chain().focus().toggleStrike().run()"
          class="p-0"
        )
          div(
            class="h18px mt-0"
            :class="{ 'italic': editor.isActive('strike') }"
            :style=`{
              textDecoration: editor.isActive('strike') ? 'line-through' : undefined,
              textDecorationColor: editor.isActive('strike') ? '#fff' : undefined,
              // textDecorationThickness: editor.isActive('strike') ? '3px' : undefined,
            }`
          ) S
        // Добавляем кнопки для списков
        VSTButton(
          :theme="editor.isActive('bulletList') ? activeButtonsTheme : defaultButtonsTheme"
          @click="editor.chain().focus().toggleBulletList().run()"
          :class="{ 'fw-bold!': editor.isActive('bulletList') }"
        )
          svg(
            xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            class="icon icon-tabler icons-tabler-outline icon-tabler-list fs-1rem"
          )
            path(stroke="none" d="M0 0h24v24H0z" fill="none")
            path(d="M9 6l11 0")
            path(d="M9 12l11 0")
            path(d="M9 18l11 0")
            path(d="M5 6l0 .01")
            path(d="M5 12l0 .01")
            path(d="M5 18l0 .01")
        VSTButton(
          :theme="editor.isActive('orderedList') ? activeButtonsTheme : defaultButtonsTheme"
          @click="editor.chain().focus().toggleOrderedList().run()"
          :class="{ 'fw-bold!': editor.isActive('orderedList'), 'text-white! fill-white! stroke-white!': true, }"
        )
          svg(xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            class="icon icon-tabler icons-tabler-outline icon-tabler-list-numbers fs-1rem"
          )
            path(stroke="none" d="M0 0h24v24H0z" fill="none")
            path(d="M11 6h9" stroke="currentColor" fill="none")
            path(d="M11 12h9" stroke="currentColor" fill="none")
            path(d="M12 18h8" stroke="currentColor" fill="none")
            path(d="M4 16a2 2 0 1 1 4 0c0 .591 -.5 1 -1 1.5l-3 2.5h4" stroke="currentColor" fill="none")
            path(d="M6 10v-6l-2 2" stroke="currentColor" fill="none")

        VSTButton(@click="editor.chain().focus().toggleHeading({ level: 1 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }") H1
        VSTButton(@click="editor.chain().focus().toggleHeading({ level: 2 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }") H2

    //BubbleMenu.bubble-menu(
      //    v-if="editor && showMenu"
      //    :editor="editor"
      //    :should-show="() => editor.isActive('bulletList') || editor.isActive('orderedList')"
      //    :get-referenced-virtual-element="getListVirtualElement"
      //    :options="{ placement: 'top-start', offset: 8 }"
      //)
      //  div(class="bubble-menu")
      //    VSTButton(type="button" @click="toggleListType") Toggle list type

    EditorContent(:editor="editor")


    div(
      class="w25px h25px text-stone absolute t-10px r-12px z4 cursor-pointer hover:scale-130"
      v-if="!disabled && value"
      :class=`{
         // 't-15px': maskPreset == 'datetime' || maskPreset == 'datetimeSec',
         // 't-9px': maskPreset != 'datetime' && maskPreset != 'datetimeSec',
      }`
    )
      NoSymbolIcon(
        @click="_onInput('')"
      )

    div(v-if="showLinkModal" @close="showLinkModal = false")
      input(v-model="linkUrl" placeholder="URL")
      button(@click="addLink") Вставить ссылку
    component(is="style").

    div
      VSTStringField(inputValue="Для ссылок, например")
</template>

<script lang="ts">
import { findParentNode, posToDOMRect } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import { Editor, EditorContent } from '@tiptap/vue-3' // @ts-ignore
import { BubbleMenu } from '@tiptap/vue-3/menus'
import {VST, Watch, Prop} from '../../../core'
import {default as VSTButton} from '../../Elements/Button'
import {default as VSTStringField} from '../StringField'
import FieldComponent from '../../../replaceable/FieldComponent.vue'
import { Markdown } from 'tiptap-markdown'
import Placeholder from '@tiptap/extension-placeholder'
// import {Markdown} from '@tiptap/markdown'
import { Link } from '@tiptap/extension-link'
import { NoSymbolIcon } from "@heroicons/vue/20/solid"


@VST export default class TextField extends FieldComponent {
  @Prop(String) readonly outputFormat: 'markdown'|'html' = 'markdown'
  @Prop(String) readonly defaultButtonsTheme: string = 'pink'
  @Prop(String) readonly activeButtonsTheme: string = 'purple'
  @Prop(String) readonly placeholder: string = ''
  components = {
    EditorContent,
    BubbleMenu,
    VSTButton,
    VSTStringField,
    NoSymbolIcon,
  }

  editor: any|(typeof Editor) = undefined
  isEditable = true
  showMenu = true
  vstTextId: string = ''
  showLinkModal: boolean = false
  linkUrl: string = ''
  beforeMount() {
    this.vstTextId = `vst-text-field-${this.VST.generateRandomKey()}`
  }

  mounted() {
    this.value = (this.modelValue || this.inputValue || '')
    this.editor = new Editor({
      extensions: [
        StarterKit,
        // Markdown,
        // Markdown.configure({
        //   // contentType: 'markdown',
        //   html: true,                  // Allow HTML input/output
        //   tightLists: true,            // No <p> inside <li> in markdown output
        //   tightListClass: 'tight',     // Add class to <ul> for tight list styling
        //   bulletListMarker: '-',       // List item prefix in markdown output
        //   linkify: true,              // Auto-convert URLs to links
        //   breaks: true,               // Convert \n to <br>
        //   transformPastedText: true,
        //   transformCopiedText: true,
        // }),
        Placeholder.configure({
          placeholder: this.placeholder ? this.placeholder : 'Введите текст',
        }),
        Link.configure({
          openOnClick: false,
          autolink: true,
          defaultProtocol: 'https',
        }),
        Markdown.configure({
          html: true,
          breaks: true,
          linkify: true,
          transformPastedText: true,
          transformCopiedText: this.outputFormat === 'markdown',
          // Включаем трансформацию при копировании в Markdown
          // transformCopiedText: (text) => {
          //   console.log('text', text)
          //   // Используем геттер Markdown для буфера обмена
          //   return this.outputFormat === 'markdown' ? this.editor?.storage.markdown.getMarkdown() : text;
          // },
        }),
      ],
      // contentType: 'html',
      // content: ,
      content: this.value
    })

    // if (this.outputFormat === 'html') {
      // Если ожидаем HTML, вставляем его как HTML
      // this.editor.commands.setContent(this.value, {
      //   parseOptions: { contentType: 'text/markdown' }
      // })
    // }
    // else {
    //   // Если ожидаем Markdown, вставляем его как Markdown
    //   this.editor.commands.setContent(this.value, {
    //     parseOptions: { contentType: 'text/markdown' }
    //   })
    // }
  }

  getValue(): string {
    // if (!this.editor) return this.internalContent

    if (this.outputFormat === 'markdown') {
      return this.editor.storage.markdown.getMarkdown()
    } else {
      return this.editor.getHTML()
    }
  }

  addLink() {
    this.editor.chain().focus().setLink({ href: this.linkUrl }).run()
    this.showLinkModal = false
    this.linkUrl = ''
  }

  beforeUnmount() {
    // this.editor.destroy()
  }
  getListVirtualElement() {
    const editor = this.editor
    const parentNode = findParentNode(node => node.type.name === 'bulletList' || node.type.name === 'orderedList')(
        editor.state.selection,
    )
    if (parentNode) {
      const domRect = posToDOMRect(editor.view, parentNode.start, parentNode.start + parentNode.node.nodeSize)
      return {
        getBoundingClientRect: () => domRect,
        getClientRects: () => [domRect],
      }
    }
    return null
  }

  toggleListType() {
    const editor = this.editor
    const chain = editor.chain().focus()
    if (editor.isActive('bulletList')) {
      chain.toggleOrderedList()
    } else {
      chain.toggleBulletList()
    }
    chain.run()
  }


  @Watch('isEditable') isEditableWatch(value: boolean) {
    this.editor.setEditable(value)
  }
}
</script>

<style lang="sass">
.vst-field-editor
  .bubble-menu
    @apply flex
  p.is-editor-empty:first-child::before
    color: #c1c7cf
    content: attr(data-placeholder)
    float: left
    height: 0
    pointer-events: none

  .tiptap.ProseMirror
    @apply bg-white overflow-y-auto
    @apply min-h50px w[calc(100%-55px)] py8px px25px ou-none resize-none fs-1rem
    @apply font-500 font-inherit rounded-25px my1px max-h60vh
    scrollbar-width: thin
    scrollbar-color: #808080 transparent
    -webkit-appearance: none
    border: 1px solid #c1c7cf
    transition: border 0.3s ease
    scrollbar-gutter: stable
    :first-child
      margin-top: 0

    ul
      list-style-type: disc // Явно указываем маркеры-точки для ul
    ol
      list-style-type: decimal // Явно указываем номера для ol
    ul, ol
      @apply px-7! mx-0! my-1! py-1px! rounded-xl fs-1.05rem
    ul li::marker,
    ol li::marker
      font-weight: bold
    ul li,
    ol li
      font-weight: normal
    // Если этого недостаточно, используйте более специфичный селектор
    ul li
      list-style-type: disc
      > ul li
        list-style-type: circle !important

    ol li
      list-style-type: decimal
      //> ol li
      //  list-style-type: lower-alpha !important

    /* List styles */
    ul,
    ol
      padding: 0 1rem
      margin: 1.25rem 1rem 1.25rem 0.4rem
      // Здесь могут быть конфликты, поэтому важно, чтобы list-style-type
      // был указан после возможного reset-стиля

      li p
        margin-top: 0.25em
        margin-bottom: 0.25em

    /* Code and preformatted text styles */
    code
      background-color: var(--purple-light)
      border-radius: 0.4rem
      color: var(--black)
      font-size: 0.85rem
      padding: 0.25em 0.3em


    pre
      background: var(--black)
      border-radius: 0.5rem
      color: var(--white)
      font-family: 'JetBrainsMono', monospace
      margin: 1.5rem 0
      padding: 0.75rem 1rem

      code
        background: none
        color: inherit
        font-size: 0.8rem
        padding: 0


    blockquote
      border-left: 3px solid var(--gray-3)
      margin: 1.5rem 0
      padding-left: 1rem

    hr
      border: none
      border-top: 1px solid var(--gray-2)
      margin: 2rem 0

    *
      white-space: pre-wrap !important
      word-wrap: break-word !important
    &::-webkit-scrollbar
      visibility: hidden
      width: 4px
    &::placeholder
      color: #c1c7cf
    &:disabled
      cursor: not-allowed
      background: #f7f7f7
      border: #e5e5e5 1px solid !important

    &.ProseMirror-focused
      outline: 1px solid #fff !important
      border: 1px solid #fff !important
      @apply outline-color-stone! border-color-stone!
    &.is-valid
      border: 2px solid #80d1b3
      &.ProseMirror-focused
        outline: 2px solid #80d1b3 !important
    &.is-invalid
      border: 2px solid #ff6464
      &.ProseMirror-focused
        outline: 2px solid #ff6464 !important
      &::placeholder
        @apply text-red-400
    &::placeholder
      color: #c1c7cf
    p:first-child
      @apply mt3px
    p:not(:first-child)
      margin: 6px 2px !important
</style>
