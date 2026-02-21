<template v-once lang="pug">
  div(
    class="d-inline-block mx2px my1px w100%"
    :class=`{
      'vst-select-multi': mode == 'multi' || mode == 'tags',
    }`
  )
    input(ref="selectInput" :value="reactiveValue" :autofocus)
</template>


<script lang="ts">

import {Prop, VST, Watch} from '../../../core'
import FieldComponent from '../../../replaceable/FieldComponent.vue'

/**
 * Пример компонента
 * @author CHORNY
 * @copyright https://smartrus.org
 */
// if not extendable
@VST export default class Example extends FieldComponent {
// if extendable
// export default abstract class Example extends FieldComponent {
  emits = ['click']
  declare $refs: {
    selectInput: HTMLInputElement
  }
  // @Prop(Boolean) readonly autofocus: boolean = false
  // @Prop(String) readonly mode: 'select' | 'multi' | 'tags' = 'select'
  // @Prop(Array) readonly items: { key: string | number, value: string, selected?: string }[]|null = null
  mounted() {
    // if extendable code here
  }
  mountedParent() {
    // if extendable code here
  }

  // Watch dynamic changes to items prop
  @Watch('items', true) _itemsWatch(items: any) {

  }
  // Generate computed class prop
  get some(): string {
    return 'some'
  }
}
</script>

<style scoped lang="sass">
//.vst-select-multi
//  @apply min-w220px! min-h44px! flex! items-center justify-center rounded-3xl
</style>
