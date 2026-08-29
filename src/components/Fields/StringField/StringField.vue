<template lang="pug">
  div(
    class="d-inline-block w100% relative"
    :class=`{
      ['sf'+randKey]: true,
      'my2px': size != 'sm' && !isDateTime,
      'my3px': size == 'sm' && !isDateTime,
    }`
  )
    div(
      class="flex w100% relative items-start"
      :class=`{
        'h45px' : size == 'lg' && !isDateTime,
        'h40px!' : size == 'lg' && isDateTime,
        'h26px': size == 'sm' && !isDateTime,
        'h35px': size == 'md' && !isDateTime,
      }`
    )
      .vst-string-field-start-block(
        v-if="(startText || startIcon || hasStartBlock) && !disabled && !(isDateTime && value && maskPreset != 'date')"
        class=`rounded-l-3xl flex items-center pl9px pr5px border-color-#c1c7cf border-solid
          border-width-[1px_0_1px_1px]! user-select-none`
        :style=`{
          background: startBg,
          color: startColor,
        }`
        :class=`{
          'fs-0.83rem': size == 'sm',
          'h40px!' : size == 'lg' && isDateTime,
          'h43px': size == 'lg' && !isDateTime,
          'h32px pt1px': size == 'md',
          'h24px': size == 'sm',
          [randKey + '-start-click-tap']: true,
        }`
        @touchstart="VST.$reactive.isIphone ? clickTap($event) : null"
        @mousedown="!VST.$reactive.isIphone ? clickTap($event) : null"
      )
        div(class="flex items-center" v-if="startIcon")
          i(:class="[startIcon, 'pointer-events-none']")
        div(class="flex items-center whitespace-nowrap px7px pointer-events-none" v-if="startText")
          span(v-html="startText")
        div(class="flex items-center" v-show="hasStartBlock")
          slot(name="start")
      div(
        class="flex h100% w100% relative"
      )
        div(class="relative h100% w100% vst-select-field-input-box")
          input(
            :value
            :id='`vst-string-field-${randKey}`'
            class="w100%"
            :class=`{
              'hover:bg-white!' : !disabled,
              'user-select-none!' : disabled,
              'rounded-l-3xl border-l-1px! pl25px' : (!startText && !startIcon && !hasStartBlock) || (isDateTime && value && maskPreset != 'date'),
              'border-l-0! pl12px': startText || startIcon || hasStartBlock,
              'rounded-r-3xl border-r-1px! pr35px' : !endText && !endIcon && !hasEndBlock,
              'border-r-0!': endText || endIcon || hasEndBlock,
              // fixme костыль при вставленном блоке даты, переделать когда будет какая-то общая концепция по размерам блоков
              'w100%! pr40px! pt4px!': (isDateTime && (startText || startIcon || hasStartBlock || disabled)) && size != 'md',
              'w100%! pr40px!': (isDateTime && (startText || startIcon || hasStartBlock || disabled)) && size == 'md',
              // 'rounded-l-none!' : !startText && !startIcon && !hasStartBlock,

              // 'min-h45px fs-1rem pt6px' : size == 'lg',
              'fs-1rem pt6px': size == 'lg',
              'min-h35px h35px fs-0.9rem pt5px': size == 'md',
              'min-h26px! pt6px pb5px fs-0.83rem': size == 'sm',
              'min-h40px! h40px!' : size == 'lg' && isDateTime,
              'h43px': size == 'lg' && !isDateTime,
            }`
            :disabled
            :type="asPassword ? 'password' : undefined"
            :placeholder
            @keypress.enter="$emit('keypress.enter')"
            @keyup.esc="$emit('keyup.esc')"
            @keydown.esc="$emit('keydown.esc')"
            @keypress.esc="$emit('keypress.esc')"
            @keydown.up="keyUp"
            @keydown.down="keyDown"
            :autocomplete="maskPreset == 'email' ? 'email' : 'off'"
            onsubmit="return false"
            autocorrect="off"
            autocapitalize="off"
            ref="selectInput"
          ).inputMask

          //- Кнопки увеличения/уменьшения количества в цифровом поле
          template(
            v-if="asNumber && !mask && !disabled && numberArrows"
          )
            div(
              class="absolute! z3 user-select-none fs-0.7rem text-stone-500! hover:scale-150 hover:fw-bold cursor-pointer"
              @click="keyUp"
              :class=`{
                'r-40px!': ((asNumber ? (value != '0' && value)  : value) || preResetValue) && resetButton,
                'r-16px!': (asNumber ? (value == '0' || !value) : (!value && !preResetValue)) || !resetButton,
                'top-2px': size != 'sm',
                'top--2px': size == 'sm',
              }`
              :style=`{
                pointerEvents: disabled ? 'none !important' : undefined,
              }`
            )
              svg(
                xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="#a5a09a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                class="icon icon-tabler icons-tabler-outline icon-tabler-chevron-compact-up"
              )
                path(stroke="none" d="M0 0h24v24H0z" fill="none")
                path(d="M4 13l8 -3l8 3")

            div(
              class="absolute! user-select-none fs-0.7rem text-stone-500! hover:scale-150 hover:fw-bold cursor-pointer"
              @click="keyDown"
              :class=`{
                'r-40px!': ((asNumber ? (value != '0' && value)  : value) || preResetValue) && resetButton,
                'r-16px!': (asNumber ? (value == '0' || !value) : (!value && !preResetValue)) || !resetButton,
                'bottom-2px': size != 'sm',
                'bottom--5px': size == 'sm',
              }`
              :style=`{
                pointerEvents: disabled ? 'none !important' : undefined,
              }`
            )
              svg(
                xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="#a5a09a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                class="icon icon-tabler icons-tabler-outline icon-tabler-chevron-compact-down"
              )
                path(stroke="none" d="M0 0h24v24H0z" fill="none")
                path(d="M4 11l8 3l8 -3")

          //- Идентификатор часового пояса, при выборе маски даты со временем
          div(
            v-if="maskPreset == 'datetime' || maskPreset == 'datetimeSec'"
            class="absolute! r-17px! t-2  fs-0.7rem text-stone-500 hover:scale-110 hover:fw-bold"
            :style=`{
              pointerEvents: disabled ? 'none !important' : undefined,
            }`
            :class=`{
              '-translate-y-3px': size == 'md',
            }`
          ) {{ utc }}


        //- Кнопка копирования содержимого поля
        .vst-string-field-copy-icon-box(
          class="w22px h22px text-stone absolute t-11px l-12px z4 cursor-pointer hover:scale-130"
          v-if="copyIcon && (disabled || alwaysCopyIcon) && value?.toString?.()?.trim?.() && !(asNumber && value == '0')"
        )
          ClipboardDocumentListIcon(
            @click="copyValueToClipboard()"
            v-if="!isOnlyValueCopied"
          )
          CheckBadgeIcon(
            v-else
            class="text-emerald-500"
          )

        //- Кнопка сброса и восстановления содержимого
        .vst-string-field-reset-revert-box(
          class="w25px h25px text-stone absolute r-12px z4 cursor-pointer hover:scale-130"
          v-if="!disabled && (value || preResetValue) && !(asNumber && value == '0') && resetButton"
          :class=`{
             't-15px': maskPreset == 'datetime' || maskPreset == 'datetimeSec' && size == 'lg',
             't-9px': maskPreset != 'datetime' && maskPreset != 'datetimeSec' && size == 'lg',
             't-13px!': maskPreset == 'datetime' || maskPreset == 'datetimeSec' && size == 'md',
             't-6px': maskPreset != 'datetime' && maskPreset != 'datetimeSec' && size == 'md',
          }`
        )
          svg(
            v-if="preResetValue"
            xmlns="http://www.w3.org/2000/svg"
            width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            class="icon icon-tabler icons-tabler-outline icon-tabler-arrow-back-up text-teal-500"
            @click="restore"
          )
            path(stroke="none" d="M0 0h24v24H0z" fill="none")
            path(d="M9 14l-4 -4l4 -4")
            path(d="M5 10h11a4 4 0 1 1 0 8h-1")
          NoSymbolIcon(
            v-else
            @click="onReset()"
            :class=`{
              'scale-75 mt--3px': size == 'md' && (maskPreset == 'datetime' || maskPreset == 'datetimeSec'),
            }`
          )

      .vst-string-field-end-block(
        v-if="endText || endIcon || hasEndBlock"
        class=`rounded-r-3xl flex items-center pr9px pl5px border-color-#c1c7cf border-solid
          border-width-[1px_1px_1px_0]! user-select-none`
        :style=`{
          background: endBg,
          color: endColor,
        }`
        :class=`{
          'fs-0.83rem': size == 'sm',
          'h40px!' : size == 'lg' && isDateTime,
          'h43px': size == 'lg' && !isDateTime,
          'h33px': size == 'md',
          'h26px': size == 'sm',
          [randKey + '-end-click-tap']: true,
        }`
        @touchstart="VST.$reactive.isIphone ? clickTap($event, true) : null"
        @mousedown="!VST.$reactive.isIphone ? clickTap($event, true) : null"
      )
        div(class="flex items-center" v-if="endIcon")
          i(:class="[endIcon, 'pointer-events-none']")
        div(class="flex items-center whitespace-nowrap px7px" v-if="endText")
          span(v-html="endText")
        div(class="flex items-center" v-if="hasEndBlock")
          slot(name="end")
    component(
      is="style"
      v-if="copyIcon && (disabled || alwaysCopyIcon) && value?.toString?.()?.trim?.() && !(asNumber && value == '0')"
    ).
      .sf{{ randKey }}[{{ $options.__scopeId }}] input {
        padding-left: 40px !important;
      }
</template>


<script lang="ts">
import {Prop, Component, Watch} from '../../../core'
import FieldComponent from '../../../replaceable/FieldComponent.vue'
import { ClipboardDocumentListIcon, CheckBadgeIcon } from "@heroicons/vue/24/solid"
import { NoSymbolIcon } from "@heroicons/vue/20/solid" // @ts-ignore
import InputMask from "./inputmask.es6"
import IMask from 'imask'

/**
 * Компонент для ввода строкового текста или значения!
 * @author CHORNY
 * @copyright https://smartrus.org
 */
@Component export default class StringField extends FieldComponent {
  declare $refs: {
    selectInput: HTMLInputElement & {maskRef: any}
  }
  emitsParent = [
    'input', 'change', 'focus', 'blur', 'update:modelValue', 'dateMaskChange', 'keypress.enter', 'reset',
    'startClickTap', 'endClickTap',
  ]
  componentsParent = {ClipboardDocumentListIcon, CheckBadgeIcon, NoSymbolIcon }
  
  /** Возвращать результат как число, если передать номер, то число с номером цифр после точки */
  @Prop(Boolean, Number) readonly asNumber: boolean|number = false
  
  /**
   * Включить ли увеличение/уменьшение цифрового значения в поле при прокрутке колесом внутри поля
   * @experimental Не стабильно работает пока
   */
  @Prop(Boolean) readonly wheelNumber: boolean = false
  @Prop(Boolean) readonly wheelNumberAlt: boolean = true
  
  @Prop(String) readonly placeholder: string|{[k:string]:string} = 'Введите текст'
  @Prop(String) readonly maskPreset: 'email'|'date'|'datetime'|'datetimeSec'|null = null
  @Prop(Boolean) readonly force12hours: boolean = false
  @Prop(Boolean) readonly disabled: boolean = false
  @Prop(Boolean) readonly maskAsRegExp: boolean = false
  @Prop(String) readonly radix: string = ','
  @Prop(String) readonly mask: string|null = null
  @Prop(Array) readonly mapToRadix: string[] = ['.', ';', '/']
  @Prop(String) readonly dtPresetLocale: string = ''
  @Prop(String) readonly thousandsSeparator: string = ' '
  @Prop(Number) readonly step: number = 1
  @Prop(Number) readonly min: number = 0
  @Prop(Number) readonly max: number = Infinity
  @Prop(String) readonly startBg: string = 'white'
  @Prop(String) readonly startColor: string = '#a8a29e'
  @Prop(String) readonly startText: string|null = null
  @Prop(String) readonly startIcon: string|null = null
  @Prop(String) readonly endText: string|null = null
  @Prop(String) readonly endBg: string = 'white'
  @Prop(String) readonly endColor: string = '#a8a29e'
  @Prop(String) readonly endIcon: string|null = null
  @Prop(Boolean) readonly asPassword: boolean = false
  @Prop(Boolean) readonly returnUnmasked: boolean = false
  
  /** Включена ли кнопка сброса/восстановления значения */
  @Prop(Boolean) readonly resetButton: boolean = true
  /** Включена ли иконка копирования */
  @Prop(Boolean) readonly copyIcon: boolean = true
  /** Всегда отображать иконку копирования (должна быть включена copyIcon) */
  @Prop(Boolean) readonly alwaysCopyIcon: boolean = false
  /** Включены ли иконки стрелочек увеличения/уменьшения значения когда строка как цифра */
  @Prop(Boolean) readonly numberArrows: boolean = true
  
  maskInner: string|null = null
  maskBlocks = {}
  utc: string = 'UTC'
  is12hours: boolean = false
  randKey: string = ''
  preResetValue: string = ''
  isOnlyValueCopied = false
  
  get canIncrement(): boolean {
    if (!this.disabled) return false
    const value = parseFloat(this.value as string)
    return !this.max || value < this.max
  }
  get canDecrement(): boolean {
    if (!this.disabled) return false
    const value = parseFloat(this.value as string)
    return !this.min || value > this.min
  }
  
  get hasStartBlock(): boolean {
    return this.$slots?.start && !!this.$slots?.start?.()?.[0]?.['children']?.length
  }
  
  get hasEndBlock(): boolean {
    return this.$slots?.end && !!this.$slots?.end?.()?.[0]?.['children']?.length
  }
  
  /** Является ли маска датой или датой со временем */
  get isDateTime(): boolean {
    return ['date', 'datetime', 'datetimeSec'].includes(this.maskPreset ?? '')
  }

  createdParent() {
    this.randKey = `rnd${$VST.generateRandomKey()}`
    // this.registerReactiveEvent(
    //   'tap',
    //   `.${this.randKey}-start-click-tap`,
    //   e => this.clickTap(e.srcEvent)
    // )
    // this.registerReactiveEvent(
    //   'tap',
    //   `.${this.randKey}-end-click-tap`,
    //   e => this.clickTap(e.srcEvent, true)
    // )
    super.createdParent()
    if (this.asNumber && (!this.value || isNaN(this.value))) {
      this.value = 0
    }
    this.inputMaskOptionsPrepare = {}
    if (!this.is12hours && this.isDateTime) {
      try {
        const options = new Intl.DateTimeFormat(
            (this.dtPresetLocale || this.VST.$reactive.locale), { hour: 'numeric' })
            .resolvedOptions()
        this.is12hours = options.hourCycle === 'h11' || options.hourCycle === 'h12'
      } catch (e) {
        this.is12hours = false
      }
    }
    else if (this.force12hours) {
      this.is12hours = true
    }
  }
  
  clickTap(e: Event, isEnd: boolean = false) {
    if (!isEnd) {
      if (this.startText || this.startIcon || this.hasStartBlock) {
        this.$emit('startClickTap', e, this)
      }
    }
    else {
      if (this.endText || this.endIcon || this.hasEndBlock) {
        this.$emit('endClickTap', e, this)
      }
    }
  }

  beforeMountParent() {
    if (this.isDateTime) {
      const parts = (new Intl.DateTimeFormat((
          this.dtPresetLocale || this.VST.$reactive.locale
      ), {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: (this.maskPreset == 'datetime' || this.maskPreset == 'datetimeSec') ? '2-digit' : undefined,
        minute: (this.maskPreset == 'datetime' || this.maskPreset == 'datetimeSec') ? '2-digit' : undefined,
        second: (this.maskPreset == 'datetimeSec' ? '2-digit' : undefined),
        timeZoneName: 'longOffset',
      })).formatToParts(new Date($VST.DT().epochMilliseconds))

      this.maskInner = parts
          .map(part => {
            switch (part.type) {
              case 'year':
                return 'YYYY'
              case 'month':
                return 'MM'
              case 'day':
                return 'DD'
              case 'hour':
                return 'hh'
              case 'second':
                return 'ss'
              case 'minute':
                return 'mm'
              case 'literal':
                return part.value
              case 'timeZoneName':
                this.utc = part.value
                return ''
              default:
                return ''
            }
          })
          .join('')

      if (this.is12hours && this.maskPreset !== 'date') {
        this.maskInner += '!'
      }
      else if (this.maskPreset === 'date') {
        const dateMask = this.extractDateOnly(this.maskInner!)
        if (dateMask) {
          this.maskInner = dateMask
        }
      }
      this.maskInner = this.maskInner.replace(/\s+/g, ' ')

      // TODO есть шанс, что получится совместить с текущей реализацией, заменив на лет YYYY на Y и обратно, например

      this.maskBlocks = {
        'YYYY': {
          mask: IMask.MaskedRange,
          from: 1000,
          to: 2300,
          validate: (value: string, masked: any)  => this.dateMaskValidateWithReplaceDays(masked),
          overwrite: true,
        },
        'MM': {
          mask: IMask.MaskedRange,
          from: 1,
          to: 12,
          validate: (value: string, masked: any)  => this.dateMaskValidateWithReplaceDays(masked),
          overwrite: true,
        },
        'DD': {
          mask: IMask.MaskedRange,
          from: 1,
          to: 31,
          validate: (value: string, masked: any)  => this.dateMaskValidateWithReplaceDays(masked),
          overwrite: true,
        },
        // todo определять 12 часовой формат
        'hh': {
          mask: IMask.MaskedRange,
          from: this.is12hours ? 1 : 0,
          to: this.is12hours ? 12 : 23,
          overwrite: true,
        },
        'mm': {
          mask: IMask.MaskedRange,
          from: 0,
          to: 59,
          overwrite: true,
        },
        'ss': {
          mask: IMask.MaskedRange,
          from: 0,
          to: 59,
          overwrite: true,
        },
        '!': {
          mask: IMask.MaskedEnum,
          enum: ['AM', 'PM', 'am', 'pm'],
          overwrite: true,
        },
      }
      // this.maskInner = this.mask
    }
    else if (this.mask) {
      this.maskInner = this.mask
    }
  }
  mountedParent() {
    this.nextTick(() => {
      if (this.$refs.selectInput) {
        this.$refs.selectInput.value = this.value
        this.$refs.selectInput.addEventListener('focus', this.onFocus)
        this.$refs.selectInput.addEventListener('blur', this.onBlur)
        if (!this.mask /* Есть глюки у цифр с точкой, нужно больше тестов */) {
          const self = this
          this.$refs.selectInput.addEventListener(
            'wheel', this.wheelToUnmDel = (e: any) => this.onWheel.bind(this)(e, self)
          )
        }
        // if (!this.isDateTime) {
          this.$refs.selectInput.addEventListener('input', this.onInput)
          this.$refs.selectInput.addEventListener('keydown', this.onKeydown)
        // }
      }
      this.initInputMask(this.$refs.selectInput)
    }, 5)
  }
  wheelToUnmDel: any

  inputMaskOptions: any = {}
  inputMaskOptionsPrepare: {[k:string]:any} = {}
  iMaskedInst: any = {}
  initInputMask(el: HTMLInputElement){

    // TODO 1 маску сделать кастомную для цифр, но только если маски нет. Если маска есть, но цифры стоят,
    //  то просто строку в цифру превращать на выходе

    if (this.isDateTime) {
      this.iMaskedInst = IMask(el, {
        mask: (this.maskInner || String) as string,
        scale: (typeof this.asNumber === 'number' ? this.asNumber : 0) as number,
        autofix: true,
        placeholder: this.placeholder as any,
        padFractionalZeros: true,
        overwrite: true,
        lazy: false,
        autocomplete: 'off',
        blocks: this.maskBlocks,
      })

      // Настройка обработчиков событий
      this.iMaskedInst.on('accept', () => {
        this.onAccept(this.iMaskedInst.value)
      })
    }
    else if (!this.mask && this.asNumber) {
      this.maskInner = ''
      const isDecimal = typeof this.asNumber == 'number'
      let inputMaskOptionsPrepare = {...this.inputMaskOptionsPrepare}
      // Используем альтернативные настройки для поддержки группировки и плавающей точки
      inputMaskOptionsPrepare.autoGroup = true
      inputMaskOptionsPrepare._radixDance = true
      inputMaskOptionsPrepare.groupSize = 3
      inputMaskOptionsPrepare.groupSeparator = this.thousandsSeparator
      inputMaskOptionsPrepare.radixPoint = this.radix
      // inputMaskOptionsPrepare.digitsOptional = true
      inputMaskOptionsPrepare.inputtype = 'text'
      
      inputMaskOptionsPrepare.numericInput = true
      inputMaskOptionsPrepare.insertMode = true
      inputMaskOptionsPrepare.SetMaxOnOverflow = true
      inputMaskOptionsPrepare.rightAlign = false
      inputMaskOptionsPrepare.allowMinus = false
      inputMaskOptionsPrepare.placeholder = '0'
      inputMaskOptionsPrepare.keepStatic = true
      if (isDecimal) { // Выделяем всё при дробных числах
        inputMaskOptionsPrepare.positionCaretOnClick = 'radixFocus'
        inputMaskOptionsPrepare.digitsOptional = true
        inputMaskOptionsPrepare.autoUnmask = true
      }
      
      // Устанавливаем количество знаков после запятой
      inputMaskOptionsPrepare.digits = isDecimal && this.asNumber ? this.asNumber : 0

      if (this.max && this.max != Infinity) {
        inputMaskOptionsPrepare.max = this.max
      }
      if (this.min) {
        inputMaskOptionsPrepare.min = this.min
      }
      inputMaskOptionsPrepare.allowMinus = (this.min ?? 0) < 0

      this.maskInner = 'numeric'
      inputMaskOptionsPrepare.alias = 'numeric'
      this.inputMaskOptionsPrepare = inputMaskOptionsPrepare
    }


    if (!this.maskInner && this.mask && !this.isDateTime) {
      this.maskInner = this.mask
    }
    if (this.maskInner && !this.isDateTime) {
      if (typeof this.asNumber === 'number' && typeof this.value === 'number' && this.value % 1 !== 0) {
        // Для установки с плавающей точкой, при входящей строке в виде значения с ней,
        // необходима конвертация для InputMask. В виде строки срабатывает корректно.
        this.value = this.value.toString().replace('.', this.radix)
      }
      const im = new InputMask(this.mask && this.maskAsRegExp ? {
        regex: this.mask,
      } : this.maskInner, this.inputMaskOptions = JSON.parse(JSON.stringify({
        ...this.inputMaskOptionsPrepare,
      })))
      im.mask(el)
    }
  }
  keyUp(){ // @ts-ignore
    this.onWheel({deltaY:-1}, this, true)
  }
  keyDown(){ // @ts-ignore
    this.onWheel({deltaY:0}, this, true)
  }

  beforeUnmountParent() {
    if (this.$refs.selectInput) {
      this.$refs.selectInput.removeEventListener('focus', this.onFocus)
      this.$refs.selectInput.removeEventListener('blur', this.onBlur)
      this.$refs.selectInput.removeEventListener('wheel', this.wheelToUnmDel)
      // if (!this.isDateTime) {
        this.$refs.selectInput.removeEventListener('input', this.onInput)
        this.$refs.selectInput.removeEventListener('keydown', this.onKeydown)
      // }
    }
  }
  onAccept(value: string) {

    // TODO тут отправка в дату была

    const month = this.getFromMask(this.maskInner as string, value, 'MM')
    const year = this.getFromMask(this.maskInner as string, value, 'YYYY')
    const day = this.getFromMask(this.maskInner as string, value, 'DD')
    let hour = this.getFromMask(this.maskInner as string, value, 'hh')
    const minute = this.getFromMask(this.maskInner as string, value, 'mm')
    const seconds = this.getFromMask(this.maskInner as string, value, 'ss')
    const AmPm = this.is12hours ? (
        value.toLowerCase().includes('am') ? 'am' : 'pm'
    ) : ''

    this.$emit('dateMaskChange', {
      month, year, day, hour, minute, seconds, AmPm
    })
  }
  
  prevUnmaskedLength = 0

  focus(rangeStart = 0, rangeEnd = 0) {
    const el = this.$el.querySelector('input.inputMask') as HTMLInputElement
    el?.focus?.()
    if (el?.setSelectionRange && el?.value?.trim?.()) {
      el?.setSelectionRange?.(rangeStart, rangeEnd > rangeStart
        ? (!rangeEnd ? rangeStart : rangeEnd)
        : rangeEnd
      )
    }
  }
  blur() {
    const el = this.$el.querySelector('input.inputMask') as HTMLInputElement
    el?.blur?.()
  }

  restore() {
    if (this.preResetValue) {
      this.nextTick(() => {
        const pv = this.preResetValue
        this.isInnerSetValue = true
        this.onInput(pv)
        this.preResetValue = ''
        this.$refs.selectInput?.focus?.()
      })
    }
  }

  onReset() {
    this.preResetValue = this.iMaskedInst
      ? (this.$refs.selectInput.value || this.value)
      : (this.value || this.$refs.selectInput.value)
    this.$emit('reset')
    this.isInnerSetValue = true
    this.setValue(this.$refs.selectInput.value = this.value = '')

    // if (this.withTime) {
    //   this.$refs?.VSTStringField?.blur?.()
    // }
    this.nextTick(() => this.$refs?.selectInput?.focus?.())
  }
  
  countEditableChars(mask: string, value: string, upToIndex: number): number {
    let count = 0
    const placeholder = '_' // или пробел, если используется другой символ
    const limit = Math.min(upToIndex, mask.length, value.length)
    for (let i = 0; i < limit; i++) {
      const mc = mask[i]
      if (mc === '9' || mc === 'A' || mc === 'a') {
        if (value[i] !== placeholder) count++
      }
      // фиксированные символы маски (пробелы, скобки, !, -) просто пропускаются,
      // они не влияют на количество введённых символов
    }
    return count
  }
  onInput(event: any, reset: boolean = false) {
    event?.preventDefault?.()
    const val = event?.target?.value ?? event
    if (!['string', 'number'].includes(typeof val)) {
      if (!this.isDateTime) {
        this.isInnerSetValue = true
        this.setValue('')
        this.$emit('input', '', reset)
        this.$emit('change', '', reset)
        this.$emit('update:modelValue', '')
      }
      return
    }
    else if (val) this.preResetValue = ''
    if (['string', 'number'].includes(typeof (val))) {
      let emitVal: string|number = ''
      if ((this.mask || (!this.asNumber && this.maskInner)) && !this.maskAsRegExp) {
        const input = event?.target
        const oldValue = input?.value ?? ''
        const maskInner = this.maskInner?.toString?.()?.replaceAll('\\', '') ?? ''
        const totalOld = this.countEditableChars(maskInner, oldValue, oldValue?.length)
        
        const selStart = input?.selectionStart
        const rawBefore = selStart > 0
          ? this.countEditableChars(maskInner, oldValue, selStart - 1)
          : 0
        
        emitVal = (!this.returnUnmasked || !maskInner)
          ? val
          : this.$refs?.selectInput?.inputmask?.unmaskedvalue?.() ?? InputMask.unmask(maskInner, val, {
            ...this.inputMaskOptions,
            mask: this.maskInner,
          }) ?? val
        
        this.nextTick(() => {
          const el = event?.target
          const newValue = el?.value ?? ''
          const totalNew = this.countEditableChars(maskInner!, newValue, newValue.length)
          
          let newPos = newValue.length
          
          // ищем позицию для rawBefore + 1
          for (let i = 1; i <= newValue.length; i++) {
            if (this.countEditableChars(maskInner!, newValue, i) === rawBefore + 1) {
              newPos = i
              break
            }
          }
          
          // fallback при удалении или отсутствии нового символа
          if (newPos === newValue.length) {
            const totalSignificant = this.countEditableChars(maskInner!, newValue, newValue.length)
            if (rawBefore + 1 > totalSignificant) {
              const lenDiff = newValue.length - oldValue.length
              newPos = Math.min(Math.max(selStart + lenDiff, 0), newValue.length)
            }
          }
          
          // Коррекция: не даём курсору застрять на нередактируемом символе
          while (newPos < maskInner!.length && !this.isEditableByMask(maskInner!, newPos)) {
            if (totalNew >= totalOld) {
              newPos++   // добавление или заполнение группы → вперёд
            } else {
              if (newPos > 0) newPos--   // удаление → назад
              else break
            }
          }
          if (newPos > newValue.length) newPos = newValue.length
          
          el?.setSelectionRange?.(newPos, newPos)
        }, 5)
      }
      else {
        if (this.asNumber) {
          emitVal = parseFloat(val?.replaceAll?.(this.thousandsSeparator, '').replaceAll(this.radix, '.'))
        }
        else {
          emitVal = val
        }
        const selStart = event?.target?.selectionStart
        this.nextTick(() => event?.target?.setSelectionRange?.(selStart, selStart), 5)
      }

      if (
        !this.maskAsRegExp && (
          (this.asNumber && this.mask) || this.mask?.includes('\\')
        )
      ) {
        // Извлекаем цифры на позициях, где в маске стоит '9' (пользовательский ввод)
        let userDigits = '';
        // Извлекаем статические цифры из маски (не '9')
        let staticDigits = ''
        let staticUnderDigits = ''
        let minLength = Math.min(this.mask.length, val.length);

        let escaped = 0
        for (let i = 0; i < minLength; i++) {
          if (this.mask?.[i+escaped] === '\\') {
            escaped++
            continue
          }
          if (this.mask![i+escaped] === '9' && this.mask?.[i+escaped-1] !== '\\' && /[0-9]/.test(val[i])) {
            userDigits += val[i]
            staticDigits += val[i]
            staticUnderDigits += val[i]
          }
          else if (/[0-9]/.test(this.mask?.[i] ?? '') && this.mask?.[i-1] !== '\\') {
            // Если в маске на этой позиции цифра (но не '9'), добавляем в статические
            staticDigits += this.mask!?.[i] ?? ''
            staticUnderDigits += '_'
          }

        }

        // Сохраняем оба значения
        emitVal = userDigits
      }
      else if (!emitVal && emitVal !== 0) {
        emitVal = val
      }

      this.$emit('input', emitVal, reset)
      this.$emit('change', emitVal, reset)
      this.$emit('update:modelValue', this.value = emitVal)
    }
  }
  isEditableByMask(mask: string, pos: number): boolean {
    if (pos >= mask.length) return false
    const mc = mask[pos]
    return mc === '9' || mc === 'A' || mc === 'a'
  }
  onFocus() {
    this.$emit('focus')
  }
  onBlur() {
    this.nextTick(() => this.$emit('blur', this.$refs.selectInput?.value))
    // this.value = this.$refs.selectInput.value
  }
  onWheel = (event: WheelEvent, field: StringField, inner: boolean = false) => {
    if (field.disabled || !field.asNumber) return
    if (!inner && (
      (!this.wheelNumber && !this.wheelNumberAlt)
      || (this.wheelNumberAlt && !(event.altKey || event.shiftKey))
    )) {
      return
    }
    event?.preventDefault?.()
    let currentValue = parseFloat(
      field.value?.toString()
        .replaceAll(this.thousandsSeparator, '')
        .replace(field.radix, '.')
      ) // / (typeof this.asNumber == 'number' ? (10*this.asNumber) : 1)


    if (isNaN(currentValue)) {
      currentValue = 0
    }
    const step =(this.step || 1) //  / (100 * ((typeof field.asNumber == 'number' ? field.asNumber : 1)))
    if (event.deltaY < 0) { // Прокрутка вверх - увеличение
      currentValue += step
    } else {
      currentValue -= step
    }

    // Применяем ограничения min/max если они заданы
    if (field.min !== undefined && currentValue < field.min) {
      currentValue = field.min
    }
    if (field.max !== undefined && currentValue > field.max) {
      currentValue = field.max
    }

    // Округление до указанного количества знаков после запятой
    if (typeof field.asNumber == 'number') {
      currentValue = parseFloat(currentValue?.toFixed?.(field.asNumber) ?? '0')
    }
    field.$emit('input', currentValue)
    field.$emit('change', currentValue)
    field.$emit('update:modelValue', currentValue)
    field.isInnerSetValue = true
    field.setValue(currentValue)
    if (currentValue && field.preResetValue) {
      field.preResetValue = ''
    }
  }
  onKeydown(event: any) {
    const isCtrlOrCmd = event?.ctrlKey || event?.metaKey
    // Восстановление при нажатии ctrl + z после нажатия сброса
    if (this.preResetValue && isCtrlOrCmd && event.key.toLowerCase() === 'z') {
      this.restore()
    }
    else if (
      (isCtrlOrCmd && (['z', 'y'].includes(event.key.toLowerCase())))
      || (event.shiftKey && isCtrlOrCmd && event.key.toLowerCase() === 'z')
    ) {
      setTimeout(() => this.onInput({target: this.$refs.selectInput}), 100)
    }
  }

  extractDateOnly(dateString:string): string|null {
    const regex = /([\d\w]{2,4}[./_-][\d\w]{2,4}[./_-][\d\w]{2,4})/

    // Метод match() возвращает массив совпадений или null.
    const match = dateString.match(regex)

    // Если совпадение найдено, возвращаем всю совпавшую строку (первый элемент массива).
    if (match) {
      return match?.[0] ?? null
    }

    // Если совпадений нет, возвращаем null.
    return null;
  }

  getFromMask(rule: string, mask: string, type: string = 'MM') {
    const monthIndex = rule?.toString().indexOf(type)
    if (monthIndex === -1) {
      return 0
    }

    const monthString = mask.slice(monthIndex, monthIndex + type.length)
    const monthNumber = parseInt(monthString, 10)

    if (isNaN(monthNumber)) {
      return 0
    }

    return monthNumber
  }

  isInnerSetValue: boolean = false
  setValue(value: string|number|null) {
    if (this.asNumber) {
      value = typeof this.asNumber == 'number'
        ? parseFloat(value?.toString?.().replace(this.radix, '.') ?? '0')
        : parseInt(value?.toString?.() ?? '0')
      if (isNaN(value)) value = 0
    }
    if (this.isDateTime && this.iMaskedInst) {
      this.nextTick(() => {
        if (this.$refs.selectInput) { // @ts-expect-error
          this.$refs.selectInput.value = (this.value = value?.toString?.() ?? '')?.toString().replace(this.radix, '.') ?? ''
        }
      }, 2)
      return this.nextTick(() => { // @ts-expect-error
        this.iMaskedInst.unmaskedValue = value?.toString()
      })
    }

    if (value === null || ['string', 'number'].includes(typeof value)) {
      this.value = value
      if (this.isInnerSetValue) {
        this.isInnerSetValue = false
        this.$emit('input', value)
        this.$emit('change', value)
        this.$emit('update:modelValue', value)
      }
    }
  }

  getValue(): any {
    if (this.isDateTime) {
      return this.iMaskedInst?._unmaskedValue || ''
    }
    if (typeof this.asNumber == 'number') {
      return parseFloat((this.value?.toString().replace('.', this.radix) || '0')
        .replaceAll(this.thousandsSeparator, '').replaceAll(this.radix, '.')
      )
    }
    if (this.asNumber) {
      return parseInt(
        (this.value || '0')
          .replaceAll(this.thousandsSeparator, '').replaceAll(this.radix, '.')
      )
    }
    return this.value?.trim?.() || ''
  }

  replaceInMask(rule: string, mask: string, value: string, type = 'MM') {
    const typeIndex = rule.indexOf(type)
    if (typeIndex === -1) return mask
    const normalizedValue = value?.toString?.().padStart(2, '0')
    return mask.slice(0, typeIndex) + normalizedValue + mask.slice(typeIndex + type.length)
  }

  /**
   * Автоматическая корректировка дней дат по маске DT
   * @param masked
   */
  dateMaskValidateWithReplaceDays(masked: any) {
    const month = this.getFromMask(masked.parent.mask, masked.parent.displayValue, 'MM')
    const year = this.getFromMask(masked.parent.mask, masked.parent.displayValue, 'YYYY')
    const day = this.getFromMask(masked.parent.mask, masked.parent.displayValue, 'DD')
    let maxDays = day
    if (month) {
      if (month == 2 && (!year || (year && year % 4 == 0))) {
        maxDays = 29
      }
      else if (month == 2 && year && year.toString().length == 4 && (year % 4 != 0)) {
        maxDays = 28
      }
      else if ([1, 3, 5, 7, 8, 10, 12].includes(month)) {
        maxDays = 31
      }
      else {
        maxDays = 30
      }
      if (maxDays < day) {
        this.nextTick(() => {
          if (this.$refs.selectInput) {
            this.$refs.selectInput.value = this.replaceInMask(
              masked.parent.mask, masked.parent.displayValue, maxDays.toString(), 'DD'
            )
            this.$refs.selectInput.blur()
            this.nextTick(() => {
              this.$refs.selectInput?.focus()
            })
          }
        })
      }
    }
    return true
  }

  copyValueToClipboard() {
    if (this.value) $VST.copyToClipboard(this.getValue())
    this.isOnlyValueCopied = true
    setTimeout(() => this.isOnlyValueCopied = false, 500)
  }

  onValueChange(value: any) {
    if (this.$refs.selectInput) {
      if (this.asNumber && isNaN(this.value)) {
        this.$refs.selectInput.value = '0'
      }
      else {
        if (typeof this.asNumber == 'number') {
          this.value = this.value?.toString?.().replace('.', this.radix) ?? 0
        }
        if (this.$refs.selectInput && ['string', 'number'].includes(typeof this.value)) {
          this.$refs.selectInput.value = this.value
        }
      }
    }
  }
  
  @Watch watchAsPassword() {
    this.initInputMask(this.$refs.selectInput)
  }
  @Watch watchModelValue(newModelValue: any) {
    if ((this.value = newModelValue?.toString?.() ?? '')?.length) {
      this.preResetValue = ''
    }
  }
}
</script>

<style scoped lang="sass">
input
  @apply w100% border-0 border-stone-400/60 border-solid border-1px
  @apply outline-stone-400 outline-1px focus:bg-white bg-white
  &[disabled]
    @apply bg-stone-200/50 text-stone-500!
  &::placeholder
    @apply fs-1rem text-#c1c7cf!
  &[disabled]::placeholder
    @apply bg-stone-200/50 text-stone-400! op-80
</style>
