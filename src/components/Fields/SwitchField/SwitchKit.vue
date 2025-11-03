<template lang="pug">
  div(class="mx-auto max-w1024px w100% min-h100% flex")
    div(class="flex px20px py15px w220px min-h100%!")
      GuidesMenu
    div(class="w[calc(100%-260px)]")
      h1 SwitchKit
      .row
        .col-6 Default
        .col-6 Custom
        .col-2
          SwitchField(
            :inputValue="true"
          )
        .col-2
          SwitchField(
          )
        .col-2
          SwitchField(
            :inputValue="true"
            :disabled="true"
          )
        .col-2
          SwitchField(
            bg="#46bb27"
            labelColor="#ffdead"
            bgInactive="#ea9c28"
            boxShadow="0 0 2px #46bb27"
            labelBoxShadow="0 0 2px #46bb27"
            :inputValue="true"
          )
        .col-2
          SwitchField(
            bg="#46bb27"
            bgInactive="#f5ba63"
            labelColor="#ffdead"
            boxShadow="0 0 2px #46bb27"
            labelBoxShadow="0 0 2px #46bb27"
          )
        .col-2
          SwitchField(
            bg="#46bb27"
            labelColor="#ffdead"
            boxShadow="0 0 2px #46bb27"
            labelBoxShadow="0 0 2px #46bb27"
            :inputValue="true"
            :disabled="true"
          )
        .col-6 Toggler
        .col-6 Toggler Custom
        .col-2
          SwitchField(
            :inputValue="true"
            type="toggler"
          )
        .col-2
          SwitchField(
            type="toggler"
          )
        .col-2
          SwitchField(
            :inputValue="true"
            type="toggler"
            :disabled="true"
          )
        .col-2
          SwitchField(
            :inputValue="true"
            type="toggler"
            titleTogglerY="Yes"
            titleTogglerN="No"
            bgTogglerY="#42b8b8"
            bgTogglerN="#b8a68e"
          )
        .col-2
          SwitchField(
            type="toggler"
            titleTogglerY="Yes"
            titleTogglerN="No"
            bgTogglerY="#42b8b8"
            bgTogglerN="#b8a68e"
          )
        .col-2
          SwitchField(
            :inputValue="true"
            type="toggler"
            titleTogglerY="Yes"
            titleTogglerN="No"
            bgTogglerY="#42b8b8"
            bgTogglerN="#b8a68e"
            :disabled="true"
          )
      .row
        .col-12 Checkbox
        .col-2
          SwitchField(
            type="checkbox"
            :inputValue="true"
          )
        .col-2
          SwitchField(
            type="checkbox"
          )
        .col-2
          SwitchField(
            type="checkbox"
            :inputValue="true"
            :disabled="true"
          )
</template>


<script lang="ts">
import {VST, Prop, BaseComponent} from '../../../core'
import GuidesMenu from '../../../components/Documentation/GuidesMenu.vue'

/**
 * Button documentation with examples
 * @author CHORNY
 * @copyright https://smartrus.org
 */
@VST export default class SwitchKit extends BaseComponent {
  components = {GuidesMenu}
}
</script>

<style lang="sass" scoped>
//span
//  @apply bg-red-200!
</style>

