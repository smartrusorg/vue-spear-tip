<template v-once lang="pug">
  div(
    class="d-inline-block my2px w100% relative"
    :class=`{
      ['sf'+_randKey]: true,
    }`
  )
    div(class="relative w100%")
      IMaskComponent(
        :value
        :mask
        radix=","
        :placeholder
        ref="selectInput"
        :lazy="false"
        :overwrite="true"
        :blocks="maskBlocks"
        :autocomplete="maskPreset == 'email' ? 'email' : 'off'"
        onsubmit="return false;"
        autocorrect="off"
        autocapitalize="off"
        @accept="onAccept"
        @complete:typed="onCompleteTyped"
        class="w100%"
        :class=`{
          'hover:bg-white' : !disabled,
          'user-select-none!' : disabled,
        }`
        :disabled
        :prepare="_prepareIMask"
        @keypress.enter="$emit('keypress.enter')"
      ).inputMask
      div(
        v-if="maskPreset == 'datetime' || maskPreset == 'datetimeSec'"
        class="absolute! r-15px! t-2 fs-0.7rem text-stone-500 hover:scale-110 hover:fw-bold"
        :style=`{
          pointerEvents: disabled ? 'none !important' : undefined,
        }`
      ) {{ utc }}

    div(
      class="w22px h22px text-stone absolute t-13px l-12px z4 cursor-pointer hover:scale-130"
      v-if="disabled || alwaysCopyIcon"
    )
      ClipboardDocumentListIcon(
        @click="_copyValueToClipboard()"
        v-if="!_isOnlyValueCopied"
      )
      CheckBadgeIcon(
        v-else
        class="text-emerald-500"
      )
    div(
      class="w25px h25px text-stone absolute r-12px z4 cursor-pointer hover:scale-130"
      v-if="!disabled && value"
      :class=`{
         't-15px': maskPreset == 'datetime' || maskPreset == 'datetimeSec',
         't-9px': maskPreset != 'datetime' && maskPreset != 'datetimeSec',
      }`
    )
      NoSymbolIcon(
        @click="_onReset()"
      )
    component(is="style" v-if="disabled || alwaysCopyIcon").
      .sf{{ _randKey }}[{{ $options.__scopeId }}] input {
        padding-left: 40px !important;
      }
</template>


<script lang="ts">
import {Computed, Prop, VST, Watch} from '../../../core'
import FieldComponent from '../../../replaceable/FieldComponent.vue'
import {IMask, IMaskComponent} from 'vue-imask'
import { ClipboardDocumentListIcon, CheckBadgeIcon } from "@heroicons/vue/24/solid"
import { NoSymbolIcon } from "@heroicons/vue/20/solid"

/**
 * Компонент для ввода строкового текста или значения
 * @author CHORNY
 * @copyright https://smartrus.org
 */
@VST export default class StringField extends FieldComponent {
  @Prop(String) readonly maskPreset: 'email'|'date'|'datetime'|'datetimeSec'|null = null
  @Prop(Boolean) readonly force12hours: boolean = false
  @Prop(Boolean) readonly alwaysCopyIcon: boolean = false
  @Prop(Boolean) readonly disabled: boolean = false
  @Prop(String) readonly dtPresetLocale: string = ''
  emitsParent = ['input', 'change', 'focus','blur','update:modelValue', 'dateMaskChange', 'keypress.enter', 'reset']
  componentsParent = {IMaskComponent, ClipboardDocumentListIcon, CheckBadgeIcon, NoSymbolIcon }
  declare $refs: {
    selectInput: typeof IMaskComponent
  }
  mask: string|null = null
  maskBlocks = {}
  utc: string = 'UTC'

  @Prop(String) readonly placeholder: string = 'Введите текст'

  onAccept(value: string) {
    // console.log('on onAccept', value)
    const month = this.getFromMask(this.mask as string, value, 'MM')
    const year = this.getFromMask(this.mask as string, value, 'YYYY')
    const day = this.getFromMask(this.mask as string, value, 'DD')
    let hour = this.getFromMask(this.mask as string, value, 'hh')
    const minute = this.getFromMask(this.mask as string, value, 'mm')
    const seconds = this.getFromMask(this.mask as string, value, 'ss')
    const AmPm = this.is12hours ? (
        value.toLowerCase().includes('am') ? 'am' : 'pm'
    ) : ''
    this.$emit('dateMaskChange', {
      month, year, day, hour, minute, seconds, AmPm
    })
  }
  onCompleteTyped(value: string) {
    // console.log('on onCompleteTyped', value)
  }

  is12hours: boolean = false
  private _randKey: string = ''
  createdParent() {
    this._randKey = $VST.generateRandomKey()
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
      this.mask = parts
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
        this.mask += '!'
      }
      else if (this.maskPreset === 'date') {
        const dateMask = this._extractDateOnly(this.mask)
        if (dateMask) {
          this.mask = dateMask
        }
      }
      this.mask = this.mask.replace(/\s+/g, ' ')

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
    }
  }

  mountedParent() {
    this.$refs.selectInput.$el.addEventListener('focus', this._onFocus)
    this.$refs.selectInput.$el.addEventListener('blur', this._onBlur)
    if (!this.isDateTime) {
      this.$refs.selectInput.$el.addEventListener('input', this._onInput)
    }
  }
  beforeUnmountParent() {
    this.$refs.selectInput.$el.removeEventListener('focus', this._onFocus)
    this.$refs.selectInput.$el.removeEventListener('blur', this._onBlur)
    if (!this.isDateTime) {
      this.$refs.selectInput.$el.removeEventListener('input', this._onInput)
    }
  }

  focus(rangeStart = 0, rangeEnd = 0) {
    const el = this.$el.querySelector('input.inputMask') as HTMLInputElement
    el?.focus?.()
    el?.setSelectionRange?.(rangeStart, rangeEnd > rangeStart
      ? (!rangeEnd ? rangeStart : rangeEnd)
      : rangeEnd
    )
  }
  blur() {
    const el = this.$el.querySelector('input.inputMask') as HTMLInputElement
    el?.blur?.()
  }

  private _onReset() {
    this.$emit('reset')
    this._onInput('', true)
  }

  private _onFocus() {
    this.$emit('focus')
  }
  private _onBlur() {
    this.nextTick(() => this.$emit('blur', this.$refs.selectInput?.$el?.value))
  }
  private _onInput(event: any, reset: boolean = false) {
    const val = event?.target?.value?.trim?.() || event
    if (typeof val != 'string') return
    this.$emit('input', this.value = val, reset)
    this.$emit('change', this.value, reset)
    this.$emit('update:modelValue', this.value)
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
    const monthIndex = rule.indexOf(type)
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
  setValue(value: any) {
    if (this.$refs?.selectInput?.maskRef) {
      this.$refs.selectInput.maskRef.unmaskedValue = value
    }
    super.setValue(value)
  }

  _prepareIMask(str: string) {
    if (this.isDateTime) {
      return str.toUpperCase()
    }
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
          this.$refs.selectInput.$el.value = this.replaceInMask(
            masked.parent.mask, masked.parent.displayValue, maxDays.toString(), 'DD'
          )
          this.$refs.selectInput.$el.blur()
          this.nextTick(() => {
            this.$refs.selectInput.$el.focus()
          })
        })
      }
    }
    return true
  }

  private _isOnlyValueCopied = false
  private _copyValueToClipboard() {
    if (this.value) $VST.copyToClipboard(this.value)
    this._isOnlyValueCopied = true
    setTimeout(() => this._isOnlyValueCopied = false, 500)
  }

  /** Является ли маска датой или датой со временем */
  declare isDateTime: boolean; @Computed('isDateTime') _valueComputed(): boolean {
    return ['date', 'datetime', 'datetimeSec'].includes(this.maskPreset ?? '')
  }
}
</script>

<style scoped lang="sass">
input
  @apply w100%! border-color-#c1c7cf border-solid border-1px! min-h44px pl25px pr35px rounded-3xl fs-1rem
  @apply outline-stone-400 outline-1px focus:bg-white bg-white
  &::placeholder
    @apply fs-1rem text-#c1c7cf!
</style>
