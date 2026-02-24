<template lang="pug">
  div(
    :data-simplebar-auto-hide="VST.$reactive.isMobile || autoHide ? 'true' : 'false'"
    :data-simplebar-direction="direction"
    :class=`{
      [randomClass]: true
    }`
    class="user-select-auto!"
    ref="scrollContainer"
  )
    slot
    component(is="style").
      .{{ randomClass }}
      > .simplebar-track
      > .simplebar-scrollbar::before {
        background-color: {{ color }} !important;
        margin: {{ margin }} !important;
        cursor: grab !important;
        width: {{ width }} !important;
      }
</template>


<script lang="ts">
import {BaseComponent, Prop, VST, Watch} from '../../../core'
import SimpleBar from 'simplebar'

/**
 * Custom cross browser scrollbar
 * @author CHORNY (created 11.01.2026 19:22)
 * @copyright https://smartrus.org
 */
@VST export default class Scrollbar extends BaseComponent {
  @Prop(Boolean) readonly autoHide: boolean = false
  @Prop(String) readonly color: string = '#494747'
  @Prop(String) readonly margin: string = 'auto'
  @Prop(String) readonly width: string = '7px'
  @Prop(String) readonly direction: string = 'ltr'

  declare $refs: {scrollContainer: HTMLDivElement}

  randomClass: string = ''
  simpleBar: SimpleBar|null = null

  mounted() {
    this.randomClass = 'scrollbar-c' + this.VST.generateRandomKey()
    this.simpleBar = new SimpleBar(this.$refs.scrollContainer)
  }

  beforeMount() {
    SimpleBar.removeObserver()
  }
}
</script>

<style lang="sass">
@import "simplebar/dist/simplebar.min.css"
</style>