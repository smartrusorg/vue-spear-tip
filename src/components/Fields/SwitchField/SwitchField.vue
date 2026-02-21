<template lang="pug">
  .container-switch(
    :title="disabled ? disabledTitle : title"
    :data-theme="disabled ? disabledTitleTheme : titleTheme"
    data-offset="[-15, 15]"
    :class=`{
      'min-w64px': type != 'checkbox',
    }`
  )
    | &nbsp;
    .switch(:class="disabled ? 'disabled' : ''" v-if="type == 'switcher'")
      .switch_box
        div(@click="!disabled ? (value = !value) : null" class="cursor-pointer fs-1rem mb2px")
          slot
        input(:id="'switch-'+randomId" type="checkbox" v-model="value" :disabled="disabled")
        label(:for="'switch-'+randomId" :class=`{
          disabled,
        }`)
    .hybrid-checkbox(
      v-else-if="type == 'toggler'"
      :class=`{
      ['toggler-'+randomId]: true,
    }`
    )
      input(class="tgl tgl-flip" :id="'toggler-'+randomId" type="checkbox" v-model="value" :disabled="disabled")
      label(class="tgl-btn" :data-tg-off="titleTogglerN" :data-tg-on="titleTogglerY" :for="'toggler-'+randomId")
    .typical-checkbox(
      v-else-if="type == 'checkbox'"
      :class=`{
        disabled,
      }`
    )
      span(class="")
        input(type="checkbox" :id="'checkbox-'+randomId" v-model="value" :disabled="disabled")
        label(
          :for="'checkbox-'+randomId"
          class="check pb3px! w20px! p0!"
          :class=`{
            'bg-white': value,
            'mt3px!': !value,
          }`
        )
          svg(
            width="20px" height="20px" viewBox="0 0 18 18"
            class="w20px"
            :class=`{
              'svg-unchecked bg-white': !value,
            }`
          )
            path(
              :d=`
                'M1,9 L1,3.5 C1,2 2,1 3.5,1 L14.5,1 C16,1 17,2 17,3.5 L17,14.5 C17,16 16,17 14.5,17 L3.5,17 C2,17 1,'+
                '16 1,14.5 L1,9 Z'
              `
            )
            polyline(points="1 9 7 14 15 4")
      span(
        v-if="$slots.default"
        @click="!disabled ? (value = !value) : null"
        class="cursor-pointer fs-1rem mx15px my2px whitespace-nowrap"
        :class=`{
          'fw-bold underline underline-black': value,
        }`
      )
        slot
    component(is="style" v-if="type == 'toggler'").
      .toggler-{{ randomId }} .tgl-flip + .tgl-btn {
        perspective: {{ value ? togglerWidthActive : togglerWidth }} !important;
        width: {{ value ? togglerWidthActive : togglerWidth }} !important;
      }
      .toggler-{{ randomId }} .tgl-flip + .tgl-btn:before {
        background: {{ togglerRevertColors ? bgTogglerY : bgTogglerN }}
      }
      .toggler-{{ randomId }} .tgl-flip:checked + .tgl-btn:after {
        background: {{ !togglerRevertColors ? bgTogglerY : bgTogglerN }}
      }
    component(is="style" v-if="type == 'toggler' && disabled").
      .toggler-{{ randomId }} {
        opacity: 0.5 !important;
      }
    component(is="style" v-if="type == 'checkbox'").
      #checkbox-{{ randomId }} {
        display: none;
        visibility: hidden;
      }
      #checkbox-{{ randomId }} + label {
        box-sizing: content-box !important;
      }
    component(is="style").
      [for="switch-{{ randomId }}"]::before {
        background: {{ bg }};
        box-shadow: {{ boxShadow }} !important;
      }
      [for="switch-{{ randomId }}"]:not(.disabled):hover {
        box-shadow: {{ boxShadowHover }};
      }
      .switch_box [for="switch-{{ randomId }}"]::after {
        background: {{ labelColor }} !important;
        box-shadow: {{ labelBoxShadow }};
      }
      .switch_box [for="switch-{{ randomId }}"] input {
        display: none !important;
      }
      .switch_box label[for="switch-{{ randomId }}"] {
        background: {{ bgInactive }} !important;
      }
</template>


<script lang="ts">

import {Prop, VST, Watch} from '../../../core'
import FieldComponent from '../../../replaceable/FieldComponent.vue'

/**
 * Переключатель-чекбокс
 * @author CHORNY
 * @copyright https://smartrus.org
 */
@VST export default class SwitchField extends FieldComponent {
  @Prop(Boolean) readonly disabled: boolean = false
  @Prop(String) readonly bg: string = 'linear-gradient(330deg, #0aa86d 0%, #4eb18d 50%, #0ca86e 100%)'
  @Prop(String) readonly bgInactive: string = '#a1a1a1'
  @Prop(String) readonly title: string|null = null
  @Prop(String) readonly titleTheme: string = 'info'
  @Prop(String) readonly bgTogglerY: string = '#3db37e'
  @Prop(String) readonly bgTogglerN: string = '#FF3A19'
  @Prop(String) readonly titleTogglerY: string = 'Active'
  @Prop(String) readonly titleTogglerN: string = 'Inactive'
  @Prop(String) readonly togglerWidth: string = '100px'
  @Prop(String) readonly togglerWidthActive: string = '100px'
  @Prop(Boolean) readonly togglerRevertColors: boolean|null = null
  @Prop(String) readonly boxShadow: string = '0 0 2px #1ca95e'
  @Prop(String) readonly disabledTitle: string = 'Disabled'
  @Prop(String) readonly disabledTitleTheme: string = 'grey'
  @Prop(String) readonly boxShadowHover: string = '0 0 2px #9eeda8'
  @Prop(String) readonly labelColor: string = '#fff'
  @Prop(String) readonly labelBoxShadow: string = '0 0 4px #a4a4a4'
  @Prop(String) readonly type: 'switcher'|'toggler'|'checkbox' = 'switcher'
  @Prop(Boolean, null) readonly modelValue: boolean = false
  value: boolean = false

  beforeMount() {
    this.value = this.modelValue || this.inputValue
    this.randomId = $VST.generateRandomKey(32)
  }
  emits = ['update:modelValue', 'change']

  onValueChange() {
    this.$emit('update:modelValue', this.value)
    this.$emit('change', this.value)
  }

  randomId: string = ''


  @Watch('modelValue', true) modelValueChanged(value: any) {
    this.setValue(value)
  }
}
</script>


<style lang="sass">
.container-switch
  @apply h100% p-0 m-0 text-center z-10! flex! user-select-none
  @apply min-h44px
.switch
  @apply z-10! rounded-15px relative!
  input
    @apply d-none

  &.disabled
    label
      opacity: .7
      cursor: not-allowed !important
    &::after
      color: #f3f3f3 !important

  &_box
    width: 62px
    label
      transition: all .14s ease
      &:not(.disabled):hover
        transform: scale(1.16)
        &::after
          transform: scale(.965) !important
          @apply mb-1px
      display: flex
      align-items: center
      width: 100%
      height: 36px
      box-shadow: 1px 1px 2px #737373
      background: #a1a1a1
      position: relative
      cursor: pointer
      border-radius: 24px

      &::after
        content: ""
        position: absolute
        left: 7px
        width: 23px
        height: 23px
        border-radius: 50%
      &::before
        content: ''
        width: 100%
        height: 100%
        border-radius: inherit
        opacity: 0
  & input:checked
    & ~ label
      &::before
        opacity: 1
      &::after
        left: 54%


.hybrid-checkbox
  @apply d-inline-block
  .tgl-btn
    @apply min-w100px!
  .tgl
    display: none

  .tgl,
  .tgl:after,
  .tgl:before,
  .tgl *,
  .tgl *:after,
  .tgl *:before,
  .tgl + .tgl-btn
    box-sizing: border-box
  .tgl::-moz-selection,
  .tgl:after::-moz-selection,
  .tgl:before::-moz-selection,
  .tgl *::-moz-selection,
  .tgl *:after::-moz-selection,
  .tgl *:before::-moz-selection,
  .tgl + .tgl-btn::-moz-selection,
  .tgl::selection,
  .tgl:after::selection,
  .tgl:before::selection,
  .tgl *::selection,
  .tgl *:after::selection,
  .tgl *:before::selection,
  .tgl + .tgl-btn::selection
    background: none
  .tgl + .tgl-btn
    @apply mx4px w-auto
    outline: 0
    display: block
    height: 2em
    position: relative
    cursor: pointer
    user-select: none
  .tgl + .tgl-btn:after,
  .tgl + .tgl-btn:before
    position: relative
    display: block
    content: ""
    width: 50%
    height: 100%
  .tgl + .tgl-btn:after
    left: 0
  .tgl + .tgl-btn:before
    display: none
  .tgl:checked + .tgl-btn:after
    left: 50%

  .tgl-flip + .tgl-btn
    padding: 2px
    transition: all 0.2s ease
    font-family: sans-serif
    perspective: 100px
  .tgl-flip + .tgl-btn:after,
  .tgl-flip + .tgl-btn:before
    display: inline-block
    transition: all 0.4s ease
    width: 100%
    text-align: center
    position: absolute
    line-height: 2em
    font-weight: bold
    color: #fff
    top: 0
    left: 0
    -webkit-backface-visibility: hidden
      backface-visibility: hidden
    border-radius: 4px
  .tgl-flip + .tgl-btn:after
    content: attr(data-tg-on)
    // background: #02C66F
    transform: rotateY(-180deg)
  .tgl-flip + .tgl-btn:before
    content: attr(data-tg-off)
  .tgl-flip + .tgl-btn:active:before
    transform: rotateY(-20deg)
  .tgl-flip:checked + .tgl-btn:before
    transform: rotateY(180deg)
  .tgl-flip:checked + .tgl-btn:after
    transform: rotateY(0)
    left: 0
  .tgl-flip:checked + .tgl-btn:active:after
    transform: rotateY(20deg)


.typical-checkbox
  @apply flex px10px min-h44px! items-center mx-auto
  label.check
    @apply rounded-3px flex! items-center justify-center
    display: inline-block
    cursor: pointer
    position: relative
    margin: auto
    -webkit-tap-highlight-color: transparent
    transform: translate3d(0, 0, 0)
  .check:before
    content: ""
    position: absolute
    top: -15px
    left: -15px
    width: 50px
    height: 50px
    border-radius: 50%
    opacity: 0
    transition: opacity 0.2s ease
  .check svg
    @apply rounded-2px
    position: relative
    z-index: 1
    fill: none
    stroke-linecap: round
    stroke-linejoin: round
    stroke: #bababb
    stroke-width: 1.5
    transform: translate3d(0, 0, 0) scale(1.3)
    transition: all 0.2s ease

  &.disabled
    @apply opacity-60
    .check svg
      //@apply stroke-stone-300! mb20px
  .check svg path
    stroke-dasharray: 60
    stroke-dashoffset: 0
  .check svg polyline
    stroke-dasharray: 22
    stroke-dashoffset: 66
  &:not(.disabled)
    .check:hover:before
      opacity: 1
    .check:hover svg
      stroke: #4285f4
  input[type="checkbox"]:checked + label
    @apply border-solid border-2px border-#4285f4 rounded-3px px4px! py2px!
  input[type="checkbox"]:checked + .check svg
    stroke: #4285f4
  input[type="checkbox"]:checked + .check svg path
    stroke-dashoffset: 60
    transition: all 0.3s linear
  input[type="checkbox"]:checked + .check svg polyline
    stroke-dashoffset: 42
    transition: all 0.2s linear
    transition-delay: 0.15s
</style>
