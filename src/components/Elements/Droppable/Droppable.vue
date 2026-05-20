<template lang="pug">
  div(
    ref="zone"
    :class="{ 'drag-over': status === 'over' }"
    :style="status === 'over' ? dragoverStyle : {}"
  )
    slot
</template>

<script lang="ts">
import { Component, Prop, Ref } from '../../../core'
import BaseComponent from '../../BaseComponent.vue'

/**
 * Зона отслеживания сбрасывания перетаскиваемого элемента
 * @author CHORNY
 * @copyright https://smartrus.org
 */
@Component export default class Droppable extends BaseComponent {
  emits = ['drop']
  declare $refs: {zone: HTMLElement}
  @Prop(String) readonly group: string = 'GLOBAL'
  @Prop(Boolean) readonly disabled: boolean = false
  /** SCC Стили при наведении */
  @Prop(String, Object) readonly dragoverStyle: string|{[k: string]: string} = {
    background: '#bce3cd',
    borderRadius: '14px',
  }

  status: 'default' | 'over' = 'default'
  private isDragActive = false

  mounted() {
    this.VST.$on('$sm.drag.start', this.onDragStart)
    this.VST.$on('$sm.drag.move', this.onDragMove)
    this.VST.$on('$sm.drag.end', this.onDragEnd)
    this.VST.$on('$sm.drag.stop', this.onDragStop)
  }

  beforeUnmount() {
    this.VST.$off('$sm.drag.start', this.onDragStart)
    this.VST.$off('$sm.drag.move', this.onDragMove)
    this.VST.$off('$sm.drag.end', this.onDragEnd)
    this.VST.$off('$sm.drag.stop', this.onDragStop)
  }

  onDragStart() {
    const el = this.$root!['___SM_DAD_EL']
    if (!el || el.group !== this.group || this.disabled) return
    this.isDragActive = true
  }

  onDragMove({ x, y }: { x: number; y: number }) {
    if (!this.isDragActive || this.disabled) return
    const rect = this.$refs.zone.getBoundingClientRect()
    const hit = x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom
    this.status = hit ? 'over' : 'default'
  }

  onDragEnd({ x, y }: { x: number; y: number }) {
    if (!this.isDragActive || this.disabled) return
    this.onDragMove({ x, y }) // последнее обновление статуса
    if (this.status === 'over') {
      const el = this.$root!['___SM_DAD_EL']
      if (el) {
        this.$emit('drop', el.data)
      }
    }
    this.status = 'default'
    this.isDragActive = false
  }

  onDragStop() {
    this.status = 'default'
    this.isDragActive = false
  }
}
</script>

<style lang="sass" scoped>
// .dropzone
//   min-height: 50px
//   &.drag-over
//     // background: rgba(0,120,255,0.2)
//     outline: 2px dashed #08f
</style>