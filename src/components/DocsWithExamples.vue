<template lang="pug">
  div
    link(rel="preconnect" href="https://fonts.googleapis.com")
    link(rel="preconnect" href="https://fonts.gstatic.com" crossorigin)
    link(href="https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,opsz,wght@0,6..12,200..1000;1,6..12,200..1000&display=swap" rel="stylesheet")
    header(class="bg-[#fcffdfff] w100% fixed t-0 z3003")
      .row(class="container mx-auto px-4 py-3 flex items-center justify-between w100%")
        .col-5(class="flex items-center space-x-10")
          .row
            .col-6(class="text-xl flex flex-col items-center font-700 tracking-tight")
              RouterLink(to="/" class="text-center color-black")
                img(src="../resources/VST_LOGO.png" class="w80px")
                div
                  span Vue Spear Tip
                  small(class="ml8px fs-normal text-emerald-500") {{ actualVersion }}
            .col-6(
              class="flex items-end justify-center h100%"
            )
              ul(class="flex space-x-6")
                li(
                  v-for="item in menu"
                  :key="item.name"
                  :class=`{
                    'fw-bold': $route.path == item.url
                  }`
                )
                  RouterLink(:to="item.url") {{ item.name }}
        .col-5(class="flex items-center space-x-4 justify-center h100%")
          a(
            href="https://github.com/smartrusorg/vue-spear-tip"
            target="_blank"
            class="text-[#b33c62ff]"
          ) GitHub
        .col-2
    div(class="flex flex-col items-center justify-center relative mt140px")
      RouterView
</template>


<script lang="ts">
import {VST, Prop, VueClass} from '../core'
import {version} from '../../package.json'
import PageAbstract from './Documentation/PageAbstract.vue'

/**
 * Documentation site
 * @author CHORNY
 * @copyright https://smartrus.org
 */
@VST export default class DocsWithExamples extends PageAbstract {
  @Prop(String) readonly text: string = ''
  actualVersion: string = `v${version}`
  menu = [
    { name: 'About', url: '/' },
    { name: 'Guide', url: '/guide' },
    { name: 'Donate', url: '/donate' },
  ]
  routedPageMount(data?: {from: any, to: any}) {
    // console.log(data)
  }
}
</script>

<style lang="sass">
body, html
  @apply p0 m0 box-sizing-border-box
  font-family: "Nunito Sans", sans-serif
a
  @apply decoration-none! hover:decoration-underline! text-lightblue-500
li
  list-style: none
</style>

<style lang="sass" scoped>
//span
//  @apply bg-red-200!
</style>

