<template lang="pug">
  div(class="mx-auto max-w1024px w100% min-h100% flex")
    div(class="flex px20px py15px w220px min-h100%!")
      GuidesMenu
    div(class="w[calc(100%-260px)]")
      h1 Vite Config Guide
      div soon
      //- Добавить какой-нибудь параметр full в vite компонент, который бы, например, даже vue подключал
</template>


<script lang="ts">
import {VST, Prop, BaseComponent} from '../../../core'
import GuidesMenu from '../GuidesMenu.vue'

/**
 * ViteConfigGuide
 * @author CHORNY
 * @copyright https://smartrus.org
 */
@VST export default class ViteConfigGuide extends BaseComponent {
  components = {GuidesMenu}
}
</script>

<style lang="sass" scoped>
//span
//  @apply bg-red-200!
</style>

