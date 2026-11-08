<template v-once lang="pug">
  .vst-code-highlighter(
    class="d-inline-block mx2px my1px w100% h100%"
  )
    div(class="flex" v-if="codeBlocks.length > 1")
      .code-tabs(
        v-for="(block, i) in codeBlocks"
        :class=`{
          'bg-amber-300 rounded-t-lg': i == currentTab,
          'bg-stone-300 rounded-t-xl fs-0.8rem': i != currentTab,
        }`
        @click="currentTab = i"
      ) {{ block?.title || block.lang.toUpperCase() }}

    template(v-for="(block, i) in codeBlocks")
      .code-content(v-if="i == currentTab")
        HighCode(
          class="pt-0! pb-2! m0!  flex! justify-start! w100%! h100%!"
          :codeValue="block.code"
          :lang="block.lang"
          :theme
          maxWidth="200px"
          fontSize="12px"
          :copy="block.copy ?? false"
          :nameShow="false"
          :class=`{
            'rounded-5px!': codeBlocks.length < 2,
            'rounded-tl-0!': codeBlocks.length > 1,
          }`
        )
</template>

<script lang="ts">

import {Computed, Prop, Component, Watch, VueClass} from '../../core' // @ts-ignore

// https://www.npmjs.com/package/vue-highlight-code?activeTab=readme
import { HighCode } from 'vue-highlight-code'
import 'vue-highlight-code/dist/style.css'

/**
 * Подсветка кода
 * @author CHORNY
 * @copyright https://smartrus.org
 */
@Component export default class CodeHighlight extends VueClass {
  @Prop(String, Object) code: string|null|CodeHighlight['codeBlocks'][number]|CodeHighlight['codeBlocks'] = null
  codeBlocks: {
    // prioritized?: true
    lang: string
    code: string
    title?: string
    copy?: boolean
  }[] = []
  @Prop(String) lang: string = 'pug'
  @Prop(String) title: string = ''
  @Prop(String) theme: 'light'|'dark' = 'dark'
  currentTab: number = 0
  components = {HighCode}
//   emits = ['click']
  declare $refs: {
    selectInput: HTMLInputElement
  }
  // @Prop(Boolean) readonly autofocus: boolean = false
  // @Prop(String) readonly mode: 'select' | 'multi' | 'tags' = 'select'
  // @Prop(Array) readonly items: { key: string | number, value: string, selected?: string }[]|null = null
  created() {
    this.codeBlocks = []
  }
  beforeMount() {
    if (this.code && typeof this.code === 'string') {
      this.codeBlocks = [{lang: this.lang, title: this.title, code: this.code}]
    }
    else if (Array.isArray(this.code)) {
      this.codeBlocks = this.code
    }
    else if (this.code !== null) {
      this.codeBlocks = [this.code as any]
    }
  }


  mounted() {
    // console.log('mounted', this.code)
    // if extendable code here
  }
  mountedParent() {
    // if extendable code here
  }

  // // Watch dynamic changes to items prop
  // @Watch('items', true) _itemsWatch(items: any) {
  //
  // }
  // Generate computed class prop
  // declare defaultSlotCode: boolean; @Computed('defaultSlotCode') _defaultSlotCodeComputed(
  //     code: string
  // ): string { // @ts-ignore
  //   return (this.$slots.default?.()?.[0]?.children?.trim() || this.code?.trim() || '')
  // }
  // declare htmlSlotCode: boolean; @Computed('htmlSlotCode') _htmlSlotCodeComputed(
  //     code: string
  // ): string { // @ts-ignore
  //   return this.$slots.html?.()?.[0]?.children?.trim() || this.code?.trim() || '';
  // }
}
</script>

<style lang="sass">
.vst-code-highlighter
  .code-content
    @apply fs-10px! p0! m0!
    .atom_one_light, .atom_one_dark
      @apply max-w100%! h-auto! min-h100% p0 m0
    .code_area
      @apply h-auto! m0!
    .code_header
      @apply p0! m0! h0! lh-0!
.code-tabs
  @apply px14px py5px cursor-pointer hover:op-80 flex items-center
//  display: flex
//  background: #2d2d2d
//  border-top-left-radius: 8px
//  border-top-right-radius: 8px
//
//  button
//    padding: 8px 16px
//    background: none
//    border: none
//    color: #ccc
//    cursor: pointer
//    &.active
//      color: white
//      border-bottom: 2px solid #42b883
//
//.code-content
//  background: #1a1a1a
</style>
