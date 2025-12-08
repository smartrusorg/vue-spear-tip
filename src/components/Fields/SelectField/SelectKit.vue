<template lang="pug">
  div(class="mx-auto max-w1024px w100% min-h100% flex")
    div(class="flex px20px py15px w220px min-h100%!")
      GuidesMenu
    div(class="w[calc(100%-260px)]")
      h1 SelectKit
      div

</template>


<script lang="ts">
import {VST, Prop, BaseComponent} from '../../../core'
import GuidesMenu from '../../../components/Documentation/GuidesMenu.vue'

/**
 * SelectKit
 * @author CHORNY
 * @copyright https://smartrus.org
 */
@VST export default class SelectKit extends BaseComponent {
  components = {GuidesMenu}
}
</script>

<style lang="sass" scoped>
//span
//  @apply bg-red-200!
</style>

