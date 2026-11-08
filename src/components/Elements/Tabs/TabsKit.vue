<template lang="pug">
  div(class="mx-auto max-w1024px w100% min-h100% flex")
    div(class="flex px20px py15px w220px min-h100%!")
      GuidesMenu
    div(class="w[calc(100%-260px)]")
      h1 TabsKit
      div(class="flex")
        Tabs

          template(#$title-default) DEF
          template(#default) 1

          template(#$title-tab) TAB TITLE
          template(#tab) 2
</template>


<script lang="ts">
import {Component, Prop, BaseComponent} from '../../../core'
import GuidesMenu from '../../../components/Documentation/GuidesMenu.vue'

/**
 * Button documentation with examples
 * @author CHORNY
 * @copyright https://smartrus.org
 */
@Component export default class TabsKit extends BaseComponent {
  components = {GuidesMenu}
}
</script>

<style lang="sass" scoped>
//span
//  @apply bg-red-200!
</style>

