<template lang="pug">
  div(
    :title="disabled ? disabledTitle : ''"
    :data-theme="dataThemeInner"
    :data-offset="dataOffset"
    :data-placement="dataPlacement"
    class="d-inline-block relative whitespace-nowrap"
    v-if="showButton"
    :class=`{
      'h24px': size == 'sm',
      'h34px': size == 'md',
      'min-h40px': size == 'lg',
    }`
  )
    button(
      :title="!disabled ? innerTitle : ''"
      :data-theme="dataThemeInner"
      :data-offset="dataOffset"
      :data-placement="dataPlacement"
      @mouseover="isOnHover = true"
      @mouseout="isOnHover = false"
      @touchstart="touchstart"
      @touchend="touchend"
      @mouseup="mouseup"
      @mousedown="mousedown"
      @keydown.enter="keydownEnter"
      @mouseleave="isButtonActive = false"
      class="relative w100% h100% flex! items-center! justify-center!"
      :disabled="disabled"
      :type="type"
      :class=`{
        shine,
        [randomClass + '-click-tap']: true,
        [randomClass + (isOnHover ? ' hover' : '')]: true,
        'py10px px8px': size == 'sm',
        'py10px px13px': size == 'md',
        'py10px px18px': size == 'lg',
        // mobile: viewPortType == 'mobile',
        // tablet: viewPortType == 'tablet',
      }`
      :style=`{...{
        fontSize: size == 'sm' ? '0.75rem' : fontSize,
        fontFamily,
        borderRadius,
        width,
      }, ...style}`
      ref="button"
    )
      div(
        v-if="badge"
        class="absolute right--9px top--9px bg-lightblue-400 fw-bold rounded-full z-3 px7px"
        :style=`{
        background: badgeBg ?? undefined,
        color: badgeColor ?? '#ffffff',
      }`
      ) {{ badge }}
      span.left-icon-animate(v-if="icon" :class="$slots.default && $refs?.button?.innerText?.trim?.()?.length ?  'left-icon' : ''")
        div(v-if="icon?.startsWith('<')" v-html="icon")
        i.fa(v-else :class="icon")
      slot
      span.right-icon-animate(
        v-if="iconRight"
        :class="$slots.default && $refs?.button?.innerText?.trim?.()?.length ?  'right-icon' : ''"
      )
        div(v-if="iconRight?.startsWith('<')" v-html="iconRight")
        i.fa(v-else :class="iconRight")
      component(is="style")
        | .{{ randomClass }} {
        |   background: {{ style?.bacground ?? (currentBg + '!important') }};
        |   box-shadow: none !important;
        |   color: {{ currentColor }} !important;
        |   border-color: {{ currentBorderColor }} !important;
        | }
        //- template(v-if="viewPortType == 'tablet' || viewPortType == 'mobile'")
        //-   | .{{ randomClass }} {
        //-   |   outline: none !important;
        //-   | }
        template(v-if="currentColorHover")
          | .{{ randomClass }}:hover {
          |   color: {{ style?.color ?? (currentColorHover + '!important') }};
          | }
        template(v-if="!disabled")
          | .{{ randomClass }}:active {
          |   background: {{ currentBgActive }} !important;
          |   border-color: {{ currentBorderColorActive }} !important;
          |   color: {{ currentColorActive }} !important;
          |   opacity: 1 !important;
          |   {{ boxShadowCss }} !important;
          | }
        //| .{{ randomClass }}:hover { background: {{ bgHover }} {{ isButtonActive ? '' : '!important' }} }
      a(
        ref="link"
        v-if="link && link?.startsWith('http') || link?.startsWith('//')"
        :href="link"
        target="_blank"
        class="d-none"
      ) &nbsp;
      a(
        ref="link"
        v-else-if="!link && linkRevert && !linkRevert?.startsWith('http') && !linkRevert?.startsWith('//')"
        :href="linkRevert"
        class="d-none"
        target="_blank"
      ) &nbsp;
</template>


<script lang="ts">
import {Prop, VST, Watch} from '../../../core'
import ButtonInherited from './ButtonInherited'

/**
 * Кнопка (наследуемая)
 * @author CHORNY (created 02.03.2024 4:32)
 * @copyright https://smartrus.org
 */
@VST export default class Button extends ButtonInherited {}
</script>

<style scoped lang="sass">
button
  @apply w100% h100% flex! items-center! justify-center!
  touch-action: manipulation
  position: relative
  font-size: 14px
  margin: 2px 4px
  opacity: 0.9
  user-select: none
  box-shadow: none
  outline: none
  cursor: pointer
  display: inline-block
  border: 1px solid #fff
  transition: all 0.04s ease-in-out
  //&.hover
  //  opacity: 0.9
  .left-icon
    padding-right: 5px
  .right-icon
    padding-left: 5px
  &:not(:disabled)
    .left-icon-animate i, .right-icon-animate i
      transition: all 0.1s ease-in-out !important
  &:disabled
    opacity: 0.5
    cursor: not-allowed
  &:focus-visible
    @apply rounded-8px outline-orange-500!
  &.shine:not(:disabled)::before
    content: ''
    position: absolute
    user-select: none
    //left: -100%
    inset: 0
    width: 100%
    opacity: 0
    background: linear-gradient(120deg, transparent 0%, transparent 25%, rgba(255, 255, 255, 0.6) 45%, rgba(255, 255, 255, 0.6) 50%, transparent 75%, transparent 100%)
    animation: shine 3s linear infinite
    z-index: 1
    pointer-events: none

@keyframes shine
  0%
    opacity: 0
    transform: translateX(-100%)
  45%
    opacity: 0.005
    transform: translateX(-60%)
  50%
    opacity: 0.8
    transform: translateX(0)
  54%
    opacity: 0
    transform: translateX(60%)
  100%
    opacity: 0
    transform: translateX(100%)

// Можно придумать разные анимации, добавить их в классы и подключать классы в зависимости от props
button:hover:not(:disabled), button:focus-visible:not(:disabled)
  transform: scale(1.06)
  border-radius: 8px
  .left-icon-animate i, .right-icon-animate i
    transform: rotate(-18deg)
button:active:not(:disabled)
  transform: scale(1)
  .left-icon-animate i, .right-icon-animate i
    transform: rotate(22deg)
</style>
