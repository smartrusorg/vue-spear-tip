<template lang="pug">
  div(class="mx-auto max-w1024px w100% min-h100% flex")
    div(class="flex px20px py15px w220px min-h100%!")
      GuidesMenu
    div(class="w[calc(100%-260px)]")
      h1 SelectKit
      div
        .row(class="p5px w100%")
      .col-4(class="px30px")
        b Single select
        SelectField(
          placeholder="Select one value"
          v-model="selectOnce"
          :items="selectOnceItems"
        )
        div(
          class="mx-20px bg-amber-100 my8px px15px py7px rounded-lg"
        )
          div
            b v-model =&nbsp;
            span {{ selectOnce }}
          div(class="mt5px bg-amber-50 p10px")
            b :items =&nbsp;
            span {{ selectOnceItems }}
      .col-4(class="px30px")
        b Multi select
        SelectField(
          mode="multi"
          placeholder="Select multi value"
          v-model="selectMulti"
          :items="selectMultiItems"
        )
        div(
          class="mx-20px bg-amber-100 my8px px15px py7px rounded-lg"
        )
          div
            b v-model =&nbsp;
            span {{ selectMulti }}
          div(class="mt5px bg-amber-50 p10px")
            b :items =&nbsp;
            span {{ selectMultiItems }}
      .col-4(class="px30px")
        b Tags select with presets
        SelectField(
          mode="tags"
          placeholder="Select tags values with preset"
          v-model="selectTags"
          :items="selectTagsItems"
        )
        div(
          class="mx-20px bg-amber-100 my8px px15px py7px rounded-lg"
        )
          div
            b v-model =&nbsp;
            span {{ selectTags }}
          div(class="mt5px bg-amber-50 p10px")
            b :items =&nbsp;
            span {{ selectTagsItems }}

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

  selectOnce: number|null = 2
  selectOnceItems: any[] = []
  selectMulti: number[]|null = [2,1]
  selectMultiItems: any[] = []
  selectTags: {value:string, key?:string|number}[]|null = [{key:4, value: 'Fourth'}]
  selectTagsItems: {value:string, key?:string|number}[]|null = []
  beforeMount() {
    this.selectOnceItems = [{key:1, value: 'Test'}, {key:2, value: 'Second value'}, ]
    this.selectMultiItems = [{key:1, value: 'Test'}, {key:2, value: 'Second value'}, {key:3, value: 'Third'}]
    this.selectTagsItems = [{key:1, value: 'Test'}, {key:2, value: 'Second value'}, {key:4, value: 'Fourth'}]
    setTimeout(() => this.selectOnce = 3, 2000)
    setTimeout(() => this.selectMulti = [1,3], 1000)
    setTimeout(() => this.selectOnceItems.push({ "key": 3, "value": "S3" }), 1000)
    setTimeout(() => this.selectOnceItems.push({ "key": 9, "value": "Some 9" }), 6000)
    setTimeout(() => this.selectTags = [ { "key": 2, "value": "Second value" }], 3000)
  }
}
</script>

<style lang="sass" scoped>
//span
//  @apply bg-red-200!
</style>

