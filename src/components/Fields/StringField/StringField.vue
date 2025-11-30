<template lang="pug">
  div(
    class="d-inline-block my2px w100% relative"
    :class=`{
      ['sf'+_randKey]: true,
    }`
  )
    div(class="flex h100% w100% relative")
      div(
        v-if="startText || startIcon || $slots.start"
        class="rounded-l-3xl h43px flex items-center pl9px pr5px border-color-#c1c7cf border-solid border-width-[1px_0_1px_1px]!"
        :style=`{
          background: startBg,
          color: startColor,
        }`
      )
        div(class="flex items-center" v-if="startIcon")
          i(:class="startIcon")
        div(class="flex items-center whitespace-nowrap px7px" v-if="startText")
          span(v-html="startText")
        div(class="flex items-center" v-if="$slots.start")
          slot(name="start")
      div(class="flex h100% w100% relative")
        div(class="relative h100% w100%")
          //- type="number"
          //:type="asNumber ? 'number' : 'text'"
          input(
            :value
            :id='`vst-string-field-${_randKey}`'
            class="w100%"
            :class=`{
              'hover:bg-white' : !disabled,
              'user-select-none!' : disabled,
              'rounded-l-3xl border-l-1px! pl25px' : !startText && !startIcon && !$slots.start,
              'border-l-0! pl12px': startText || startIcon || $slots.start,
              'rounded-r-3xl border-r-1px! pr35px' : !endText && !endIcon && !$slots.end,
              'border-r-0!': endText || endIcon || $slots.end,
              // fixme костыль при вставленном блоке даты, переделать когда будет какая-то общая концепция по размерам блоков
              'pr65px!': isDateTime && (startText || startIcon || $slots.start),
              // 'rounded-l-none!' : !startText && !startIcon && !$slots.start,
            }`
            :disabled
            :placeholder
            @keypress.enter="$emit('keypress.enter')"
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
            v-if="asNumber === true && !mask"
          )
            div(
              class="absolute! z3 user-select-none top-2px fs-0.7rem text-stone-500! hover:scale-150 hover:fw-bold cursor-pointer"
              @click="keyUp"
              :class=`{
                'r-40px!': (asNumber ? (value != '0' && value)  : value) || _preResetValue,
                'r-16px!': asNumber ? (value == '0' || !value) : (!value && !_preResetValue),
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
              class="absolute! user-select-none bottom-2px fs-0.7rem text-stone-500! hover:scale-150 hover:fw-bold cursor-pointer"
              @click="keyDown"
              :class=`{
                'r-40px!': (asNumber ? (value != '0' && value)  : value) || _preResetValue,
                'r-16px!': asNumber ? (value == '0' || !value) : (!value && !_preResetValue),
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
            //svg(
            //  xmlns="http://www.w3.org/2000/svg" width="32" height="38" viewBox="0 0 32 30" fill="none"
            //  stroke="#8b8683" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            //  class="icon icon-tabler icons-tabler-outline icon-tabler-chevron-compact-up"
            //)
            //  path(stroke="none" d="M0 0h24v24H0z" fill="none")
            //  path(d="M4 13l8 -3l8 3")

          //- Идентификатор часового пояса, при выборе маски даты со временем
          div(
            v-if="maskPreset == 'datetime' || maskPreset == 'datetimeSec'"
            class="absolute! r-15px! t-2 fs-0.7rem text-stone-500 hover:scale-110 hover:fw-bold"
            :style=`{
              pointerEvents: disabled ? 'none !important' : undefined,
            }`
          ) {{ utc }}


        //- Кнопка копирования содержимого поля
        div(
          class="w22px h22px text-stone absolute t-11px l-12px z4 cursor-pointer hover:scale-130"
          v-if="(disabled || alwaysCopyIcon) && value?.toString?.()?.trim?.() && !(asNumber && value == '0')"
        )
          ClipboardDocumentListIcon(
            @click="_copyValueToClipboard()"
            v-if="!_isOnlyValueCopied"
          )
          CheckBadgeIcon(
            v-else
            class="text-emerald-500"
          )

        //- Кнопка сброса и восстановления содержимого
        div(
          class="w25px h25px text-stone absolute r-12px z4 cursor-pointer hover:scale-130"
          v-if="!disabled && (value || _preResetValue) && !(asNumber && value == '0')"
          :class=`{
             't-15px': maskPreset == 'datetime' || maskPreset == 'datetimeSec',
             't-9px': maskPreset != 'datetime' && maskPreset != 'datetimeSec',
          }`
        )
          svg(
            v-if="_preResetValue"
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
            @click="_onReset()"
          )

      div(
        v-if="endText || endIcon || $slots.end"
        class="rounded-r-3xl flex items-center pr9px pl5px border-color-#c1c7cf border-solid border-width-[1px_0_1px_1px]!"
        :style=`{
          background: endBg,
          color: endColor,
        }`
      )
        div(class="flex items-center" v-if="endIcon")
          i(:class="endtIcon")
        div(class="flex items-center whitespace-nowrap px7px" v-if="endText")
          span(v-html="endText")
        div(class="flex items-center" v-if="$slots.end")
          slot(name="end")
    component(
      is="style"
      v-if="(disabled || alwaysCopyIcon) && value?.toString?.()?.trim?.() && !(asNumber && value == '0')"
    ).
      .sf{{ _randKey }}[{{ $options.__scopeId }}] input {
        padding-left: 40px !important;
      }
</template>


<script lang="ts">
import {Computed, IVueClass, Prop, VST, Watch} from '../../../core'
import FieldComponent from '../../../replaceable/FieldComponent.vue'
import { ClipboardDocumentListIcon, CheckBadgeIcon } from "@heroicons/vue/24/solid"
import { NoSymbolIcon } from "@heroicons/vue/20/solid" // @ts-ignore
import InputMask from "./inputmask.es6"
import IMask from 'imask'

// InputMask.extendDefinitions({
//   'y': {  //masksymbol
//     "validator": function (chrs, buffer, pos, strict, opts) {
//       console.log(chrs, pos, strict, opts)
//       //do some logic and return true, false, or { "pos": new position, "c": character to place }
//       return {pos, c: chrs}
//     }
//   }
// })

/**
 * Компонент для ввода строкового текста или значения!
 * @author CHORNY
 * @copyright https://smartrus.org
 */
@VST export default class StringField extends FieldComponent {
  @Prop(String) readonly maskPreset: 'email'|'date'|'datetime'|'datetimeSec'|null = null
  @Prop(Boolean) readonly force12hours: boolean = false
  @Prop(Boolean) readonly alwaysCopyIcon: boolean = false
  @Prop(Boolean) readonly disabled: boolean = false
  /** Возвращать результат как число, если передать номер, то число с номером цифр после точки */
  @Prop(Boolean, Number) readonly asNumber: boolean|number = false
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


  /**
   * Включить ли увеличение/уменьшение цифрового значения в поле при прокрутке колесом внутри поля
   * @experimental Не стабильно работает пока
   */
  @Prop(Boolean) readonly wheelNumber: boolean = true

  emitsParent = ['input', 'change', 'focus','blur','update:modelValue', 'dateMaskChange', 'keypress.enter', 'reset']
  componentsParent = {ClipboardDocumentListIcon, CheckBadgeIcon, NoSymbolIcon }
  declare $refs: {
    selectInput: HTMLInputElement & {maskRef: any}
  }
  maskInner: string|null = null
  maskBlocks = {}
  utc: string = 'UTC'

  @Prop(String) readonly placeholder: string = 'Введите текст'

  is12hours: boolean = false
  private _randKey: string = ''

  createdParent() {
    this._inputMaskOptionsPrepare = {}
    this._randKey = $VST.generateRandomKey() // @ts-ignore
    StringField['__init_'+this._randKey] = this
    if (!this.is12hours && this.isDateTime) {
      try {
        const options = new Intl.DateTimeFormat(
            (this.dtPresetLocale || this.VST.$r.locale), { hour: 'numeric' })
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

  beforeMountParent() {
    let value = (this.modelValue || this.inputValue || '')
    if (typeof value != 'string') value = ''
    this._preResetValue = ''
    this.value = value
    if (this.isDateTime) {
      const parts = (new Intl.DateTimeFormat((
          this.dtPresetLocale || this.VST.$r.locale
      ), {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: (this.maskPreset == 'datetime' || this.maskPreset == 'datetimeSec') ? '2-digit' : undefined,
        minute: (this.maskPreset == 'datetime' || this.maskPreset == 'datetimeSec') ? '2-digit' : undefined,
        second: (this.maskPreset == 'datetimeSec' ? '2-digit' : undefined),
        timeZoneName: 'longOffset',
      })).formatToParts(new Date($VST.DT().epochMilliseconds))

      // todo 3 переделать по правилам inputmask

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
        const dateMask = this._extractDateOnly(this.maskInner)
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
        this.$refs.selectInput.addEventListener('focus', this._onFocus)
        this.$refs.selectInput.addEventListener('blur', this._onBlur)
        if (this.wheelNumber && typeof this.asNumber == 'boolean' && !this.mask /* Есть глюки у цифр с точкой, нужно больше тестов */) {
          const self = this
          this.$refs.selectInput.addEventListener(
            'wheel', this._wheelToUnmDel = (e: any) => this._onWheel.bind(this)(e, self)
          )
        }
        if (!this.isDateTime) {
          this.$refs.selectInput.addEventListener('input', this._onInput)
          this.$refs.selectInput.addEventListener('keydown', this._onKeydown)
        }
      }
      this.initInputMask(this.$refs.selectInput)
    }, 5)
  }
  _wheelToUnmDel: any

  _inputMaskOptions: any = {}
  _inputMaskOptionsPrepare: {[k:string]:any} = {}
  _iMaskedInst: any = {}
  initInputMask(el: HTMLInputElement){

    // TODO 1 маску сделать кастомную для цифр, но только если маски нет. Если маска есть, но цифры стоят,
    //  то просто строку в цифру превращать на выходе

    if (this.isDateTime) {
      this._iMaskedInst = IMask(el, {
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
      this._iMaskedInst.on('accept', () => {
        this.onAccept(this._iMaskedInst.value)
      })
    }
    else if (!this.mask && this.asNumber) {
      this.maskInner = ''
      let inputMaskOptionsPrepare = {...this._inputMaskOptionsPrepare}
      // Используем альтернативные настройки для поддержки группировки и плавающей точки
      inputMaskOptionsPrepare.autoGroup = true
      inputMaskOptionsPrepare._radixDance = true
      inputMaskOptionsPrepare.groupSize = 3
      inputMaskOptionsPrepare.groupSeparator = this.thousandsSeparator
      inputMaskOptionsPrepare.radixPoint = this.radix
      inputMaskOptionsPrepare.digitsOptional = true
      inputMaskOptionsPrepare.inputtype = 'text'
      inputMaskOptionsPrepare.numericInput = true
      inputMaskOptionsPrepare.insertMode = true
      inputMaskOptionsPrepare.SetMaxOnOverflow = true
      inputMaskOptionsPrepare.rightAlign = false
      inputMaskOptionsPrepare.allowMinus = false
      inputMaskOptionsPrepare.placeholder = '0'

      // Устанавливаем количество знаков после запятой
      inputMaskOptionsPrepare.digits = typeof this.asNumber == 'number' && this.asNumber ? this.asNumber : 0

      if (this.max) inputMaskOptionsPrepare.max = this.max
      if (this.min) inputMaskOptionsPrepare.min = this.min

      this.maskInner = 'numeric'
      if (!this.mask) {
        inputMaskOptionsPrepare.alias = 'numeric'
      }
      this._inputMaskOptionsPrepare = inputMaskOptionsPrepare
    }


    if (!this.maskInner && this.mask && !this.isDateTime) {
      this.maskInner = this.mask
    }
    if (this.maskInner && !this.isDateTime) {
      new InputMask(this.maskInner, this._inputMaskOptions = JSON.parse(JSON.stringify({
        ...this._inputMaskOptionsPrepare,
      }))).mask(el)
    }
  }
  keyUp(){ // @ts-ignore
    this._onWheel({deltaY:-1}, this)
  }
  keyDown(){ // @ts-ignore
    this._onWheel({deltaY:0}, this)
  }

  beforeUnmountParent() {
    if (this.$refs.selectInput) {
      this.$refs.selectInput.removeEventListener('focus', this._onFocus)
      this.$refs.selectInput.removeEventListener('blur', this._onBlur)
      if (this.wheelNumber) this.$refs.selectInput.removeEventListener('wheel', this._wheelToUnmDel)
      if (!this.isDateTime) {
        this.$refs.selectInput.removeEventListener('input', this._onInput)
        this.$refs.selectInput.removeEventListener('keydown', this._onKeydown)
      }
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
    if (this._preResetValue) {
      this.nextTick(() => {
        const pv = this._preResetValue
        this._isInnerSetValue = true
        this._onInput(pv)
        this._preResetValue = ''
        this.$refs.selectInput?.focus?.()
      })
    }
  }

  private _preResetValue: string = ''
  private _onReset() {
    this._preResetValue = this.value || this.$refs.selectInput.value
    this.$emit('reset')
    this._isInnerSetValue = true
    this.setValue(this.$refs.selectInput.value = this.value = '')

    // if (this.withTime) {
    //   this.$refs?.VSTStringField?.blur?.()
    // }
    if (this.maskPreset == 'date') {
      this.$refs.selectInput?.focus?.()
    }
    else if (this.isDateTime) {
      this.$refs.selectInput?.blur?.()
    }
  }
  private _onInput(event: any, reset: boolean = false) {
    const val = event?.target?.value || event

    if (!['string', 'number'].includes(typeof val)) {
      if (!this.isDateTime) {
        this._isInnerSetValue = true
        this.setValue('')
        this.$emit('input', '', reset)
        this.$emit('change', '', reset)
        this.$emit('update:modelValue', '')
      }
      return
    }
    else if (val) this._preResetValue = ''
    if (['string', 'number'].includes(typeof (val))){


      //
      // if (typeof this.asNumber == 'number') this.value = InputMask.unmask('numeric', val, this._inputMaskOptions)
      // // TODO 2 просто возвращать обычный unmask без numeric ^ проверки.
      // //  Просто при цифрах обрезать лишние символы и возвращать float при необходимости
      //
      // else
      let emitVal: string|number = ''
      if (this.mask || !this.asNumber && this.maskInner) {
        this.value = emitVal = InputMask.unmask(this.maskInner, val, this._inputMaskOptions) || val
      }
      else {
        this.value = val
        if (this.asNumber) {
          emitVal = parseFloat(val?.replaceAll?.(this.thousandsSeparator, '').replaceAll(this.radix, '.'))
        }
        else emitVal = val
      }
      if ((this.asNumber && this.mask) || this.mask?.includes('\\')) {
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
          if (this.mask[i+escaped] === '9' && this.mask?.[i+escaped-1] !== '\\' && /[0-9]/.test(val[i])) {
            userDigits += val[i]
            staticDigits += val[i]
            staticUnderDigits += val[i]
          }
          else if (/[0-9]/.test(this.mask[i]) && this.mask?.[i-1] !== '\\') {
            // Если в маске на этой позиции цифра (но не '9'), добавляем в статические
            staticDigits += this.mask[i]
            staticUnderDigits += '_'
          }

        }

        // Сохраняем оба значения
        this.value = emitVal = userDigits;
      }
      else emitVal = val

      this.$emit('input', emitVal, reset)
      this.$emit('change', emitVal, reset)
      this.$emit('update:modelValue', emitVal)
    }
  }
  private _onFocus() {
    this.$emit('focus')
  }
  private _onBlur() {
    this.nextTick(() => this.$emit('blur', this.$refs.selectInput?.value))
    // this.value = this.$refs.selectInput.value
  }
  private _onWheel = (event: WheelEvent, field: StringField) => {
    if (field.disabled || !field.asNumber) return
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

    // console.log('currentValue', currentValue, field.value)
    // Применяем ограничения min/max если они заданы
    if (field.min !== undefined && currentValue < field.min) {
      currentValue = field.min
    }
    if (field.max !== undefined && currentValue > field.max) {
      currentValue = field.max
    }

    // Округление до указанного количества знаков после запятой
    if (typeof field.asNumber == 'number') {
      currentValue = parseFloat(currentValue?.toFixed?.(field.asNumber))
    }
    field.$emit('input', currentValue)
    field.$emit('change' ,currentValue)
    field.$emit('update:modelValue', currentValue)
    field._isInnerSetValue = true
    field.setValue(currentValue)
    if (currentValue && field._preResetValue) {
      field._preResetValue = ''
    }
  }
  private _onKeydown(event: any) {
    const isCtrlOrCmd = event?.ctrlKey || event?.metaKey
    // Восстановление при нажатии ctrl + z после нажатия сброса
    if (this._preResetValue && isCtrlOrCmd && event.key === 'z') {
      this.restore()
    }
  }

  private _extractDateOnly(dateString:string): string|null {
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

  _isInnerSetValue: boolean = false
  setValue(value: any) {
    if (this.isDateTime && this._iMaskedInst) {
      this.nextTick(this.$refs.selectInput.value = this.value = value?.toString())
      return this.nextTick(() => {
        this._iMaskedInst.unmaskedValue = value?.toString()
      })
    }

    this.value = value
    // if (this.$refs?.selectInput) this.$refs.selectInput.value = value
    if (this._isInnerSetValue) {
      this._isInnerSetValue = false
      this.$emit('input', value)
      this.$emit('change', value)
      this.$emit('update:modelValue', value)
    }
  }

  getValue(): any {
    if (this.isDateTime) {
      return this._iMaskedInst?._unmaskedValue || ''
    }
    return typeof this.asNumber == 'number'
      ? parseFloat((this.value || '0')
          .replaceAll(this.thousandsSeparator, '').replaceAll(this.radix, '.')
        )
      : this.asNumber
        ? parseInt(
            (this.value || '0')
              .replaceAll(this.thousandsSeparator, '').replaceAll(this.radix, '.')
          )
        : this.value || ''
  }

  replaceInMask(rule: string, mask: string, value: string, type = 'MM') {
    const typeIndex = rule.indexOf(type)
    if (typeIndex === -1) return mask
    const normalizedValue = value.toString().padStart(2, '0')
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

  private _isOnlyValueCopied = false
  private _copyValueToClipboard() {
    if (this.value) $VST.copyToClipboard(this.getValue())
    this._isOnlyValueCopied = true
    setTimeout(() => this._isOnlyValueCopied = false, 500)
  }

  declare canIncrement: boolean;
  @Computed('canIncrement') _canIncrementComputed(): boolean {
    if (!this.disabled) return false
    const value = parseFloat(this.value as string)
    return !this.max || value < this.max
  }

  declare canDecrement: boolean;
  @Computed('canDecrement') _canDecrementComputed(): boolean {
    if (!this.disabled) return false
    const value = parseFloat(this.value as string)
    return !this.min || value > this.min
  }

  /** Является ли маска датой или датой со временем */
  declare isDateTime: boolean; @Computed('isDateTime') _valueComputed(): boolean {
    return ['date', 'datetime', 'datetimeSec'].includes(this.maskPreset ?? '')
  }
}
</script>

<style scoped lang="sass">
input
  @apply w100%! border-0 border-color-#c1c7cf border-solid border-y-1px! min-h45px fs-1rem
  @apply outline-stone-400 outline-1px focus:bg-white bg-white
  &[disabled]
    @apply bg-stone-200 text-stone-500!
  &::placeholder
    @apply fs-1rem text-#c1c7cf!
  &[disabled]::placeholder
    @apply bg-stone-200 text-stone-400! op-80
</style>
