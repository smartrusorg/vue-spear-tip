<template lang="pug">
  div(class="mx-auto max-w1024px w100% min-h100% flex")
    div(class="flex px20px py15px w220px min-h100%!")
      GuidesMenu
    div(class="w[calc(100%-260px)]")
      
      h1 ModalsKit
      div(class="flex")
        Tabs

          template(#$title-default) Examples
          template(#default)
            div Modals

          //template(#$title-tab) TAB TITLE
          //template(#tab) 2
    Modals
</template>


<script lang="ts">
import {Component, Prop, BaseComponent} from '../../../core'
import GuidesMenu from '../../../components/Documentation/GuidesMenu.vue'
import Modals from './Modals.vue'

/**
 * Button documentation with examples
 * @author CHORNY
 * @copyright https://smartrus.org
 */
@Component export default class ModalsKit extends BaseComponent {
  components = {GuidesMenu, Modals}
  declare $refs: {modal: Modals}
  
  mounted() {
    // $VST._modal = this.$refs.modal
  }
}
</script>

<style lang="sass" scoped>
//span
//  @apply bg-red-200!
</style>

