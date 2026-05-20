<template lang="pug">
  .draggable(
    @pointerdown.prevent="onPointerDown"
    :style="{ opacity: isDragging ? 0.4 : 1, touchAction: 'none' }"
  )
    slot
</template>

<script lang="ts">
import { Component, Prop, VST } from '../../../core'
import BaseComponent from '../../BaseComponent.vue'

/**
 * Элемент для отслеживания сбрасывания
 * @author CHORNY
 * @copyright https://smartrus.org
 */
@Component export default class Draggable extends BaseComponent {
  emits = ['start', 'stop']
  @Prop(String) readonly group: string = 'GLOBAL'
  @Prop({ default: null }) readonly data: any = null
  @Prop(Boolean) readonly disabled: boolean = false
  @Prop(String) readonly ignoreTopSelector: string = ''

  isDragging = false
  clone: HTMLElement | null = null
  startX = 0
  startY = 0
  offsetX = 0
  offsetY = 0
  id: string = ''

  created() {
    this.id = `drag-${this.VST.generateRandomKey()}-${this.group}`
  }

  onPointerDown(e: PointerEvent) {
    if (this.disabled || this.isDragging || (
      this.ignoreTopSelector && (
        !!e?.srcElement?.classlist?.includes?.(this.ignoreTopSelector)
        || !!e.srcElement.closest?.(this.ignoreTopSelector)
      )
    )) return
    const el = this.$el as HTMLElement
    const rect = el.getBoundingClientRect()
    this.startX = e.clientX
    this.startY = e.clientY
    this.offsetX = e.clientX - rect.left
    this.offsetY = e.clientY - rect.top

    this.clone = el.cloneNode(true) as HTMLElement
    this.clone.classList.add('clone')
    Object.assign(this.clone.style, {
      position: 'fixed',
      left: rect.left + 'px',
      top: rect.top + 'px',
      width: rect.width + 'px',
      height: rect.height + 'px',
      opacity: '0.8',
      pointerEvents: 'none',
      zIndex: '9999',
      margin: '0',
      transition: 'none'
    })
    document.body.appendChild(this.clone)

    this.isDragging = true
    ;(this.clone as any).setPointerCapture?.(e.pointerId) // необязательно

    document.addEventListener('pointermove', this.onPointerMove)
    document.addEventListener('pointerup', this.onPointerUp)
    document.addEventListener('pointercancel', this.onPointerUp)

    // Уведомляем droppable о начале
    this.$emit('start', this.$root!['___SM_DAD_EL'] = {
      group: this.group,
      data: this.data,
      id: this.id
    })
    this.VST.$emit('$sm.drag.start')
  }

  onPointerMove(e: PointerEvent) {
    if (!this.isDragging || !this.clone) return
    const x = e.clientX - this.offsetX
    const y = e.clientY - this.offsetY
    this.clone.style.left = x + 'px'
    this.clone.style.top = y + 'px'

    // Оповещаем droppable-зоны о текущих координатах
    this.VST.$emit('$sm.drag.move', { x: e.clientX, y: e.clientY })
  }

  onPointerUp(e: PointerEvent) {
    if (!this.isDragging) return
    document.removeEventListener('pointermove', this.onPointerMove)
    document.removeEventListener('pointerup', this.onPointerUp)
    document.removeEventListener('pointercancel', this.onPointerUp)

    if (this.clone) {
      this.clone.remove()
      this.clone = null
    }

    // Передаём финальные координаты для определения drop-зоны
    this.VST.$emit('$sm.drag.end', { x: e.clientX, y: e.clientY })

    this.$emit('stop', {...this.$root?.['___SM_DAD_EL'] ?? {}})
    delete this.$root!['___SM_DAD_EL']
    this.VST.$emit('$sm.drag.stop')
    this.isDragging = false
  }

  beforeUnmount() {
    document.removeEventListener('pointermove', this.onPointerMove)
    document.removeEventListener('pointerup', this.onPointerUp)
  }
}
</script>

<style lang="sass" scoped>
.draggable
  cursor: grab
  user-select: none
  touch-action: none
</style>