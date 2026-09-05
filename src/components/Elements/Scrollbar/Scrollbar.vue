<template lang="pug">
  div(
    :data-simplebar-auto-hide="VST.$reactive.isMobile || autoHide ? 'true' : 'false'"
    :data-simplebar-direction="direction"
    :class=`{
      [randomClass]: true
    }`
    data-simplebar
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
        cursor: grabbing !important;
        width: {{ width }} !important;
      }
      .{{ randomClass }}
      > .simplebar-track
      > .simplebar-scrollbar:hover::before {
        background-color: {{ color }} !important;
        margin: {{ margin }} !important;
        cursor: grab !important;
        width: {{ width }} !important;
      }
      {{ hasHorizontalScrollbar ? `.${randomClass} {padding-bottom: 14px}` : '' }}
</template>


<script lang="ts">
import {Component, BaseComponent, Prop, VST, Watch} from '../../../core'
import SimpleBar from 'simplebar'

// fixme посмотреть для следующей версии https://kingsora.github.io/OverlayScrollbars/
// fixme вроде поддерживает плавную прокрутку

/**
 * Custom cross browser scrollbar
 * @author CHORNY (created 11.01.2026 19:22)
 * @copyright https://smartrus.org
 */
@Component export default class Scrollbar extends BaseComponent {
  @Prop(Boolean) readonly autoHide: boolean = false
  @Prop(String) readonly color: string = '#494747'
  @Prop(String) readonly margin: string = 'auto'
  @Prop(String) readonly width: string = '7px'
  @Prop(String) readonly direction: 'rtl'|'ltr' = 'ltr'

  declare $refs: {scrollContainer: HTMLDivElement}

  randomClass: string = ''
  simpleBar: SimpleBar|null = null
  hasHorizontalScrollbar: boolean = false
  hasVerticalScrollbar: boolean = false

  mounted() {
    this.randomClass = 'scrollbar-c' + this.VST.generateRandomKey()
    this.simpleBar = new SimpleBar(this.$refs.scrollContainer, {
      autoHide: this.autoHide,
      direction: this.direction,
    }) as any
    this.nextTick(() => {
      // 2. Начинаем отслеживать элемент контента
      const contentEl = this.simpleBar?.el?.querySelector?.('.simplebar-content') as HTMLDivElement
      if (contentEl) {
        //  Создаем ResizeObserver
        const resizeObserver = new ResizeObserver(() => {
          // Проверка на горизонтальный скролл
          this.hasHorizontalScrollbar = contentEl.scrollWidth > contentEl.clientWidth
          
          // Проверка на вертикальный скролл
          this.hasVerticalScrollbar = contentEl.scrollHeight > contentEl.clientHeight
          
        })
        this.hookWhenComponentDestroy(() => resizeObserver?.disconnect?.())
        resizeObserver.observe(contentEl)
      }
    }, 10)
  }

  beforeMount() {
    SimpleBar?.removeObserver?.()
  }
  
  scroll(x: number, y: number) {
    this.$el?.querySelector?.('.simplebar-content-wrapper')?.scrollTo?.({
      left: x,
      top: y,
      behavior: 'smooth',
    })
  }
}
</script>

<style lang="sass">
@import "simplebar/dist/simplebar.min.css"
</style>