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
      .{{ randomClass }} {padding-bottom: {{ paddingBottom }}}
      .{{ randomClass }} .simplebar-track.simplebar-horizontal .simplebar-scrollbar.simplebar-visible {
        margin-top: 3px !important;
        height: {{ parseInt(width)-1 }}px !important;
        border: 0 !important;
        opacity: 0.8 !important;
        cursor: grabbing !important;
      }
    component(is="style").
      .{{ randomClass }}
      > .simplebar-track
      > .simplebar-scrollbar::before {
        background-color: {{ color }} !important;
        margin: {{ margin }} !important;
        cursor: grabbing !important;
        width: {{ width }} !important;
        margin-left: 1px !important;
        opacity: 0.8;
      }
      .{{ randomClass }}
      > .simplebar-track:hover,
      .{{ randomClass }}
      > .simplebar-track:hover
      > .simplebar-scrollbar::before {
        cursor: grabbing !important;
      }
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
  emits = ['scroll', 'scrollSync']
  @Prop(Boolean) readonly autoHide: boolean = false
  @Prop(String) readonly color: string = '#494747'
  @Prop(String) readonly margin: string = 'auto'
  @Prop(String) readonly width: string = '7px'
  @Prop(String) readonly paddingBottom: string = '14px'
  @Prop(String) readonly direction: 'rtl'|'ltr' = 'ltr'

  declare $refs: {scrollContainer: HTMLDivElement}

  randomClass: string = ''
  simpleBar: SimpleBar|null = null
  hasHorizontalScrollbar: boolean = false
  hasVerticalScrollbar: boolean = false
  wrapperEl: HTMLDivElement|null = null
  scrollEvCb: any = null
  
  rafPending: boolean = false
  lastTop: number = 0
  lastLeft: number = 0
  
  created() {
    this.scrollEvCb = (event: Event) => {
      const target = event.target as HTMLElement
      this.lastTop = target.scrollTop
      this.lastLeft = target.scrollLeft
      
      // 1) Синхронный эмит — для прямой манипуляции DOM без Vue.
      //    Используется для «горячих» элементов (шапка), где важна задержка 0 кадров.
      this.$emit('scrollSync', this.lastTop, this.lastLeft)
      
      // 2) rAF-троттлинг — для реактивного состояния (ячейки опций и т.п.),
      //    где Vue re-render на 1 кадр позже не критичен.
      if (this.rafPending) return
      this.rafPending = true
      requestAnimationFrame(() => {
        this.$emit('scroll', this.lastTop, this.lastLeft)
        this.rafPending = false
      })
    }
  }
  
  mounted() {
    this.randomClass = 'scrollbar-c' + this.VST.generateRandomKey()
    this.simpleBar = new SimpleBar(this.$refs.scrollContainer, {
      autoHide: this.autoHide,
      direction: this.direction,
    }) as any
    this.nextTick(() => {
      // Начинаем отслеживать элемент контента
      this.wrapperEl = this.simpleBar?.el?.querySelector?.('.simplebar-content-wrapper') as HTMLDivElement
      const contentEl = this.wrapperEl?.querySelector?.('.simplebar-content') as HTMLDivElement
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
        this.wrapperEl.addEventListener('scroll', this.scrollEvCb);
      }
    }, 10)
  }

  beforeMount() {
    this.wrapperEl?.removeEventListener?.('scroll', this.scrollEvCb);
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