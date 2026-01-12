<template lang="pug">
  div(class="mx-auto max-w1024px w100% min-h100% flex")
    div(class="flex px20px py15px w220px min-h100%!")
      GuidesMenu
    div(class="w[calc(100%-260px)]")
      h1(class="mb0") ScrollbarKit
      div(class="mb10px")
        b Based on&nbsp;
        a(target="_blank" href="https://github.com/Grsmto/simplebar") SimpleBar
      div
        h4(class="mb0 pb0") Use
        pre(class="mt0 pb0").
          <code class="my0 py0">
          Scrollbar(
            :autoHide="false"
          )
          </code>
      b Example
      Scrollbar(class="max-h100px b-solid border-1px rounded-md p5px")
        div(class="h150px") Scrollbar Example
        div Scrollbar Example bottom
      b Example with autohide (in mobile enabled by default)
      Scrollbar(class="max-h100px b-solid border-1px rounded-md p5px" :autoHide="true")
        div(class="h150px") Scrollbar Example
        div Scrollbar Example bottom
</template>


<script lang="ts">
import {VST, Prop, BaseComponent} from '../../../core'
import GuidesMenu from '../../../components/Documentation/GuidesMenu.vue'
/**
 * Button documentation with examples
 * @author CHORNY (created 11.01.2026 19:22
 * @copyright https://smartrus.org
 */
@VST export default class ScrollbarKit extends BaseComponent {
  components = {GuidesMenu}
}
</script>

<style lang="sass" scoped>
//span
//  @apply bg-red-200!
</style>

