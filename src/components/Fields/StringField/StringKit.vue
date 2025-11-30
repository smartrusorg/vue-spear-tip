<template lang="pug">
  div(class="mx-auto max-w1024px w100% min-h100% flex")
    div(class="flex px20px py15px w220px min-h100%!")
      GuidesMenu
    div(class="w[calc(100%-260px)]")
      h1 StringKit
      .row(class="gap-x-3")
        .col-6
          //div {{ fValueNum1 }}
          StringField(
            :asNumber="4"
            v-model="fValueNum1"
            placeholder="Simple string field"
          )
        .col-6
          StringField(
            mask="+\\9 (999) 999-99-99"
            :asNumber="4"
            :alwaysCopyIcon="true"
          )
        .col-6
          StringField(
            v-model="fValueNum"
            :asNumber="true"
            mask="+7 (999) 999-999"
            :alwaysCopyIcon="true"
          )
          //div {{ fValueNum }}
        .col-6
          StringField(
            :alwaysCopyIcon="true"
            :asNumber="true"
            :max="5151"
            placeholder="Number field"
          )
        .col-6
          //div {{ fValueNum2 }}
          StringField(
            mask="+7 (999) 999-99-99"
            :alwaysCopyIcon="true"
          )
        .col-6
          //div {{ fValueNum2 }}
          StringField(
            v-model="fValueNum2"
            :alwaysCopyIcon="true"
          )
        .col-12
          StringField(
            placeholder="Simple string field with copy when has value"
            maskPreset="phone"
            :alwaysCopyIcon="true"
          )
        .col-12
          StringField(
            inputValue="Disabled with copy icon if has value"
            maskPreset="phone"
            :alwaysCopyIcon="true"
            disabled
          )
        .col-6
          StringField(
            :alwaysCopyIcon="true"
            startText="Text start"
            startBg="#4e4b4b"
            startColor="#fff"
            :asNumber="true"
            :max="5151"
            placeholder="Number field"
          )
        .col-6
          StringField(
            :alwaysCopyIcon="true"
            endText="Text end"
            endBg="#b41e1e"
            endColor="#fff"
            placeholder="Some field"
          )
</template>


<script lang="ts">
import {VST, Prop, BaseComponent} from '../../../core'
import GuidesMenu from '../../../components/Documentation/GuidesMenu.vue'

/**
 * StringKit
 * @author CHORNY
 * @copyright https://smartrus.org
 */
@VST export default class StringKit extends BaseComponent {
  components = {GuidesMenu}

  fValueNum: number = 0
  fValueNum1: number = 0
  fValueNum2: string = ''
}
</script>

<style lang="sass" scoped>
//span
//  @apply bg-red-200!
</style>

