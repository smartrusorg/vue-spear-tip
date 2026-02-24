<template lang="pug">
  .vst-date-field(
    class="d-inline-block my1px w100% flex items-center relative"
    :class=`{
      // 'vst-select-multi': mode == 'multi' || mode == 'tags',
    }`
  )
    //@click="!$root.APP.hasTouchpad ? addDate() : null"
    //@touchstart="$root.APP.hasTouchpad ? addDate() : null"
    div(
      class=`flex items-center min-w240px h100% bg-white rounded-3xl justify-center text-stone w100%`
      v-if="!value"
    )
      div(
        class=`h[calc(100%-2px)]! h44px! text-stone border-y-solid border-l-solid rounded-l-3xl
          cursor-pointer px10px border-1px! flex items-center border-#D0CCC9FF`
      )
        div
          .vst-date-field-calendar-icon(
            class="w24px h24px text-stone hover:scale-130 mx2px"
          )
            CalendarDaysIcon(
              @click="value ? inputFocus() : addDate()"
            )
      div(
        tabindex="-1"
        @focusin="!disabled ? addDate() : null"
        @click="!disabled ? addDate() : null"
        class=`flex items-center min-w240px bg-white rounded-r-3xl justify-center text-#c1c7cf
            border-solid border-solid border-1px w100% z2
            mx-auto min-h44px! cursor-text my1px`
        :class=`{
          'hover:border-stone hover:text-stone border-#c1c7cf' : !disabled,
          'border-#D0CCC9FF cursor-no-drop' : disabled,
        }`
      ) {{ disabled ? '----' : (placeholder?.[localeInner] || placeholder?.en || placeholder) }}
    // @blur="v => _onBlur(v)"
    VSTStringField(
      v-if="value"
      :maskPreset
      :placeholder="(placeholder?.[localeInner] || placeholder?.en || placeholder)"
      class=`z2`
      @focus="inputFocus()"
      @change="(v, reset) => changeInput(v, reset)"
      @dateMaskChange="dateMaskChange"
      :force12hours
      :dtPresetLocale="locale"
      :disabled
      :fontSize="'1rem'"
      @keypress.enter="inputEnter($refs.VSTStringField?.getValue?.())"
      @reset="onReset"
      ref="VSTStringField"
    )
      template(#start v-if="!disabled")
        .vst-date-field-calendar-icon(
          class="w24px h24px text-stone cursor-pointer hover:scale-130 w100% mx5px"
          v-if="!disabled"
        )
          CalendarDaysIcon(
            @click="value ? inputFocus() : addDate()"
          )
    div(class="cursor-pointer absolute op-0 t-0 l-50% translate-x--50%" v-show="value" )
      input(
        ref="picker"
        type="text"
        readonly
        @mousedown.prevent
      )
    component(is="style" v-if="!showCalendar") .flatpickr-calendar {display: none !important}
    component(is="style") .flatpickr-calendar {box-shadow: 0px 2px 13px var(--un-shadow-color, rgb(193 193 193)) !important}
    //div {{ value }}
</template>


<script lang="ts">

import {Temporal} from 'temporal-spec'
import {Prop, VST, Watch} from '../../../core'
import FieldComponent from '../../../replaceable/FieldComponent.vue'
import FPLocales from 'flatpickr/dist/l10n'
import flatpickr from 'flatpickr'
import 'flatpickr/dist/flatpickr.min.css'
import 'flatpickr/dist/plugins/confirmDate/confirmDate.css'
import confirmDatePlugin from 'flatpickr/dist/plugins/confirmDate/confirmDate.js'
import {StringField as VSTStringField} from '../../../kit'
import IDateField from './IDateField'
import { CalendarDaysIcon } from "@heroicons/vue/24/solid"

/**
 * Поле даты/даты-время с календарём и маской автоматически подстраивающеюся под локаль
 * @author CHORNY
 * @copyright https://smartrus.org
 */
@VST export default class DateField extends FieldComponent implements IDateField {
  components = {VSTStringField, CalendarDaysIcon}
  emits = ['change']
  declare $refs: {
    picker: HTMLElement
    VSTStringField?: any
  }
  @Prop(String, Object) readonly placeholder: string|{[k:string]:string} = {
    en: 'Select date',
    ru: 'Нажмите для выбора даты',
  }
  @Prop(Boolean) readonly force12hours: boolean = false
  /** Добавить время */
  @Prop(Boolean) readonly withTime: boolean = false
  @Prop(Number) readonly hoursIncrement: number = 1
  @Prop(Number) readonly minuteIncrement: number = 1
  /** Добавить секунды */
  @Prop(Boolean) readonly withSeconds: boolean = false
  @Prop(Number) readonly secondsIncrement: number = 1
  /** Подстроить формат даты под какую-то конкретную локаль. По умолчанию определяется автоматически. */
  @Prop(String) readonly locale: string = ''
  /** Заблокировать изменения в поле (отключить) */
  @Prop(Boolean) readonly disabled: boolean = false
  /** Возвращать значение в формате строки ISO861 в UTC (+00:00) */
  @Prop(Boolean) readonly ISO861UTCMode: boolean = false
  /** Обработка элементов конкретного дня по очереди. Для возможности добавления своих стилей, атрибутов, классов */
  @Prop(Function) readonly dayPreRender: ((
      /** HTML элемент конкретного дня, для возможности модификации */
      day: HTMLElement,
      /** Дата в формате Temporal равная обрабатываемому дню */
      dt?: Temporal.ZonedDateTime,
      /** Текущий ли это месяц (null), следующий (true) или предыдущий (false) */
      currentNextOrPrev?: null|boolean
  ) => void)|undefined

  /** Максимальная дата для выбора. Будет наложено поверх maxField при его наличии. */
  @Prop(String, Number, Date) readonly max: string|number|Date = 0
  /** Минимальная дата для выбора. Будет наложено поверх maxField при его наличии. */
  @Prop(String, Number, Date) readonly min: string|number|Date = 0

  /** Поле даты, в котором указывается максимальная возможная дата и время для текущего. */
  @Prop(String) readonly maxField: string = ''
  /** Поле даты, в котором указывается минимально возможная дата и время для текущего. */
  @Prop(String) readonly minField: string = ''

  /**
   * Глобальное название поля. Используется для ссылок на поля дат (этого же компонента), в которых указываются
   * минимальные/максимальные даты для текущего поля даты.
   * Внимание! Для сложных форм используйте префиксы.
   */
  @Prop(String) readonly fieldName: string = ''

  /** Первый день недели. По умолчанию автоматически. */
  @Prop(Number, String) readonly firstDayOfWeek: 'auto'|1|2|3|4|5|6|7 = 'auto'
  /** Список конкретных дней недоступных для выбора */
  @Prop(Array) readonly disabledDays: number|string|Date[] = []
  /** Отключить выходные для выбора */
  @Prop(Boolean) readonly disableWeekends: boolean = false
  /** Отключить конкретные дни недели для выбора */
  @Prop(Array) readonly disableDaysOfWeek: (1|2|3|4|5|6|7)[] = []

  // todo
  // multiply dates?
  // date range in one field?
  // maskPreset dateRange|datetimeRange|datetimeSecRange
  // https://flatpickr.js.org/examples/#range-calendar

  value: number|string|null = null
  localeInner: string = 'en'
  maskPreset: 'date'|'datetime'|'datetimeSec' = 'date'
  showCalendar: boolean = true
  DT: Temporal.ZonedDateTime|null = null
  beforeMount() {
    if (this.withTime) {
      this.maskPreset = 'datetime'
      if (this.withSeconds) {
        this.maskPreset = 'datetimeSec'
      }
    }
    this.initTemporalUpdateOut = true
    this.value = this.modelValue || this.inputValue || null

    if (this.maxField)
      $VST.$on('$VST.components.fields.date.'+btoa(this.maxField), this.onMaxDateFieldChange)
    if (this.minField)
      $VST.$on('$VST.components.fields.date.'+btoa(this.minField), this.onMinDateFieldChange)
  }

  mounted() {
    this.nextTick(() => {
      this.initPicker()
      this.nextTick(() => {
        if (this.value) {
          this.addDate()
        }
      })
    })
  }
  beforeUnmount() {
    if (this.maxField)
      $VST.$off('$VST.components.fields.date.'+btoa(this.maxField), this.onMaxDateFieldChange)
    if (this.minField)
      $VST.$off('$VST.components.fields.date.'+btoa(this.minField), this.onMinDateFieldChange)
    clearInterval(this.pickerInterval)
  }

  private onMaxDateFieldChange(stamp: number) {
    this.fp?.set?.('maxDate', stamp ? new Date(stamp) : null)
  }
  private onMinDateFieldChange(stamp: number) {
    this.fp?.set?.('minDate', stamp ? new Date(stamp) : null)
  }

  /** Библиотека по работе  */
  private fp: any|null = null

  addDate() {
    const zonedDate = $VST.DT()
    const isNewVal: boolean = !!this.value
    this.value = this.value || (this.ISO861UTCMode ? zonedDate?.[
      this.maskPreset == 'date' ? 'toPlainDate' : 'toPlainDateTime'
    ]?.()?.toString().replace('T', ' ') : zonedDate.epochMilliseconds)
    this.showCalendar = false
    setTimeout(() => {
      if (!this.fp) this.initPicker()
      this.nextTick(() => {
        this.fp?.open?.()
        this.fp?.close?.()
        this.nextTick(() => {
          if (!this.disabled && !isNewVal) this.$refs.VSTStringField?.focus?.()
          if (this.$refs?.picker) {
            setTimeout(() => {
              this.showCalendar = true
              this.$refs.picker.setAttribute('value', this.formatDate(new Date(zonedDate.epochMilliseconds)))
              this.fp?.setDate?.(new Date($VST.DT(this.value!).epochMilliseconds))
              if (!isNewVal) {
                this.fp?.open?.()
              }
            }, 250)
          }
        })
      })
    }, 100)
  }

  private extractDateOnly(dateString:string): string|null {
    const regex = /(\d{2,4}[./_-]\d{2,4}[./_-]\d{2,4})/
    const match = dateString.match(regex)
    if (match) return match?.[0] ?? null
    return null
  }

  private preventMaskDateChange = false
  private initPicker() {
    const localeName = ((this.force12hours ? 'en-US'  : this.locale) || this.VST.$reactive.locale)
    const localeShort = localeName?.split?.('-')?.[0]
    if (!this.$refs.picker || !localeShort) return
    this.localeInner = localeShort
    let pmHours: boolean
    try {
      const options = new Intl.DateTimeFormat(localeName, { hour: 'numeric' }).resolvedOptions()
      pmHours = options.hourCycle === 'h11' || options.hourCycle === 'h12'
    } catch (e) {
      pmHours = false
    }
    const disable: any = [(date: Date) => {
      if (this.disableWeekends) {
        return (date.getDay() === 5 || date.getDay() === 6)
      }
      if (this.disableDaysOfWeek?.length) {
        return this.disableDaysOfWeek?.includes((date.getDay()+1) as any)
      }
    }] // @ts-ignore
    for (const disabledDay of this.disabledDays ?? []) {
      disable.push(new Date($VST.DT(disabledDay).epochMilliseconds))
    }
    let change // @ts-ignore
    const locale = (localeShort ? FPLocales?.[localeShort] : FPLocales?.default) || FPLocales?.default || {} // @ts-ignore
    if (this.firstDayOfWeek != 'auto') locale.firstDayOfWeek = (parseInt(this.firstDayOfWeek) || 1)-1 // @ts-ignore
    this.fp = (flatpickr as any)(this.$refs.picker as HTMLElement, {
      enableTime: this.withTime,
      time_24hr: !pmHours,
      enableSeconds: this.withSeconds,
      weekNumbers: true,
      dateFormat: 'Y-m-d H:i:S', // Формат с секундами
      minDate: this.min ? $VST.DT(this.min) : null,
      maxDate: this.max ? $VST.DT(this.max) : null,
      minuteIncrement: this.minuteIncrement,
      secondsIncrement: this.minuteIncrement,
      hoursIncrement: this.hoursIncrement,
      allowInput: 1,
      closeOnSelect: false,
      className: 'custom-flatpickr-theme', // @ts-ignore
      disable, // @ts-ignore
      locale, // @ts-ignore
      plugins: this.withSeconds || this.withTime ? [new confirmDatePlugin({
        confirmIcon: '',
        showAlways: true,
      })] : [],
      onValueUpdate: (dates: any) => {
        if (this.preventMaskDateChange) return this.preventMaskDateChange = false
        const time = dates?.[0]?.getTime?.() ?? 0
        if (time) {
          this.setInputMaskValueByDTStamp(time)
        }
      },
      onDayCreate: (dateObj: any, dateStr: any, fp: any, dayElem: any) => {
        let dt: Temporal.ZonedDateTime|null = null
        if (dateObj?.[0]) {
          try {
            dt = $VST.DT(new Date(
              `${fp.currentYear}-${
                  (fp.currentMonth+1).toString().padStart(2, '0')
              }-${dayElem.innerText.trim().toString().split('.')[0].padStart(2, '0')}`
            ))
            if (dayElem?.classList?.contains?.('prevMonthDay')) dt = dt.subtract({months: 1})
            if (dayElem?.classList?.contains?.('nextMonthDay')) dt = dt.add({months: 1})
            if (this.dayPreRender) {
              this.dayPreRender(
                  dayElem,
                  dt,
                  dayElem?.classList?.contains?.('nextMonthDay')
                  || (dayElem?.classList?.contains?.('prevMonthDay') ? false : null)
              )
              dayElem.classList.add('_vst-date-field-pre-rendered')
            }
          } catch (e) {
            // Несуществующая дата
          }
        }
      },
      onMonthChange: change = (dateObj: any, dateStr: any, fp: any, dayElem: any) => {
        for (const child of fp.days.children) {
          if (this.dayPreRender && !child.classList.contains('_vst-date-field-pre-rendered')) {
            let dt: Temporal.ZonedDateTime = $VST.DT(new Date(
                `${fp.currentYear}-${
                    (fp.currentMonth+1).toString().padStart(2, '0')
                }-${dayElem.innerText.trim().toString().split('.')[0].padStart(2, '0')}`
            ))
            if (dayElem?.classList?.contains?.('prevMonthDay')) dt = dt.subtract({months: 1})
            if (dayElem?.classList?.contains?.('nextMonthDay')) dt = dt.add({months: 1})
            this.dayPreRender(
                dayElem,
                dt,
                dayElem?.classList?.contains?.('nextMonthDay')
                || (dayElem?.classList?.contains?.('prevMonthDay') ? false : null)
            )
            dayElem.classList.add('_vst-date-field-pre-rendered')
          }
        }
      },
      onYearChange: change,
    })


    this.pickerInterval = setInterval(() => {
      if (this.$refs.VSTStringField?.$el) {
        this.nextTick(() => {
          if (this.value) {
            this.setInputMaskValueByDTStamp(this.value)
          }
          clearInterval(this.pickerInterval)
        })
      }
    }, 25)
  }

  pickerInterval: number = 0

  private inputFocus() {
    if (this.fp && !this.fp.isOpen) {
      this.fp.open()
    }
  }

  // private _onBlur(val: string) {
  //   const isFromCalClick = !!this.fp?.isOpen
  //   setTimeout(() => {
  //     this.nextTick(() => {
  //       if (!this.$refs.VSTStringField?.value && val?.includes('_')) {
  //         this.changeInput('')
  //       }
  //       else if (
  //         val?.length && !val.includes('_')
  //         && (!this.withTime || !isFromCalClick)
  //         && this.$refs.VSTStringField?.$el
  //       ) {
  //         const mask = this.$refs.VSTStringField.mask
  //         const month = this.$refs.VSTStringField.getFromMask(mask, val, 'MM').toString().padStart(2, '0')
  //         const year = this.$refs.VSTStringField.getFromMask(mask, val, 'YYYY').toString().padStart(4, '0')
  //         const day = this.$refs.VSTStringField.getFromMask(mask, val, 'DD').toString().padStart(2, '0')
  //         let hour = this.$refs.VSTStringField.getFromMask(mask, val, 'hh').toString().padStart(2, '0')
  //         const minute = this.$refs.VSTStringField.getFromMask(mask, val, 'mm').toString().padStart(2, '0')
  //         const seconds = this.$refs.VSTStringField.getFromMask(mask, val, 'ss').toString().padStart(2, '0')
  //         let strDt = `${year}-${month}-${day}`
  //         if (this.withTime) {
  //           strDt += ` ${hour}:${minute}:${this.withSeconds ? seconds : '00'}`
  //         }
  //         if (!isFromCalClick) {
  //           this.DT = $VST.DT(strDt.split('.')[0])
  //           this._setInputMaskValueByDTStamp(this.DT.epochMilliseconds)
  //         }
  //       }
  //       this.nextTick(() => {
  //         if (this.fp && this.fp.isOpen && (!this.withTime || !isFromCalClick)) {
  //           this.fp.close()
  //         }
  //       })
  //     })
  //   }, 150)
  // }

  private changeInput(val: string, reset: boolean = false) {
    if (!val?.toString?.()?.trim?.()) {
      this.$emit('update:modelValue', this.value = null)
    }
    if (this.fp && !this.fp.isOpen && !this.value && !reset) {
      this.fp.open()
    }
    if (reset && !this.withTime) {
      this.nextTick(() => {
        this.addDate()
      })
    }
  }
  private inputEnter(val: string) {
    if (this.fp && this.fp.isOpen) {
      this.fp.close()
    }
    this.$refs?.VSTStringField?.blur?.()
    // this._onBlur(val)
  }

  onReset() {
    if (this.withTime) {
      this.value = ''
      this.fp?.open?.()
    }
  }

  /**
   * Установка даты по вводимым данным из поля маски в
   * @param val
   * @private
   */
  private dateMaskChange(val: {
    month: number|string, year: number|string, day: number|string, hour: number|string,
    minute: number|string, seconds: number|string, AmPm?: string
  })
  {
    let {month, year, day, hour, minute, seconds, AmPm} = val
    const dt = new Date
    if (!month) month = (dt.getMonth() + 1)
    if (!day) day = dt.getDate()
    if ((year?.toString?.()?.length ?? 0) < 4) year = dt.getFullYear()
    let isPm: null|boolean = null
    if (!hour && this.maskPreset != 'date') {
      hour = dt.getHours()
      if (hour == 23) hour = 0
      else ++hour
    }
    else {
      if (this.$refs.VSTStringField.is12hours) {
        hour = hour == 12 ? (
          AmPm == 'am' ? ((hour as number)-12) : hour
        ) : hour
      }
    }

    const dtc = new Date(
        year as number, (month as number)-1, day as number,
        0, minute as number, seconds as number
    )
    dtc.setHours(hour as number)
    if (this.fp) {
      this.fp?.setDate(dtc)
      if (this.maskPreset == 'date') {
        this.nextTick(() => this.fp?.close?.())
      }
    }
  }

  private parseTime(time: any): string {
    return time.toString().split('+')[0].split('.')[0]
      .replace('T', ' ').split(
        this.withTime ? '!' : ' '
      )[0]
  }

  private formatDate(time: Date): string {
    const month = new Intl.DateTimeFormat('ru-RU', { month: 'short', day: 'numeric' }).format(
        time
    ).replace(/\d+\s?/, '')
    const date = $VST.DT(time.getTime())
    return `${date.day} ${month} ${date.year}`+
        (this.withTime
                ? ` в ${date.hour.toString().padStart(2, '0')}:${date.minute.toString().padStart(2, '0')}`
                : ''
        )+
        (this.withSeconds ? `:${date.second.toString().padStart(2, '0')}` : '')
  }

  private setInputMaskValueByDTStamp(stamp: number|string) {
    this.DT = $VST.DT(stamp)
    this.$emit(
      'update:modelValue',
      this.value = this.ISO861UTCMode ? this.DT?.[
        this.maskPreset == 'date' ? 'toPlainDate' : 'toPlainDateTime'
      ]?.()?.toString().replace('T', ' ') : this.DT.epochMilliseconds
    )
    let val = this.DT.toLocaleString(
        (this.locale || new Intl.DateTimeFormat().resolvedOptions().locale), {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: this.maskPreset == 'datetime' || this.maskPreset == 'datetimeSec' ? '2-digit' : undefined,
          minute: this.maskPreset == 'datetime' || this.maskPreset == 'datetimeSec' ? '2-digit' : undefined,
          second: this.maskPreset == 'datetimeSec' ? '2-digit' : undefined,
        }
    )
    if (this.maskPreset == 'date') {
      val = this.extractDateOnly(val) ?? ''
    }
    val = val.trim().replace(/\s+/g, ' ')
    this.$refs.VSTStringField?.setValue?.(val)
  }

  private initTemporalUpdateOut: boolean = false
  onValueChange() {
    this.initTemporalUpdateOut = true
    this.DT = $VST.DT(this.value || undefined)
    if (!this.value) this.fp?.clear?.()
    $VST.$emit(
      '$VST.components.fields.date.'+btoa(this.fieldName),
      this.ISO861UTCMode ? (this.value ? $VST.DT(this.value).epochMilliseconds : 0) : (this.value || 0)
    )
  }

  @Watch('DT', true, true) watchDT(DT: Temporal.ZonedDateTime|null) {
    if (this.initTemporalUpdateOut) return this.initTemporalUpdateOut = false
    this.initTemporalUpdateOut = true
    if (DT) this.value = this.ISO861UTCMode ? DT?.[
      this.maskPreset == 'date' ? 'toPlainDate' : 'toPlainDateTime'
    ]?.()?.toString().replace('T', ' ') : DT.epochMilliseconds
    else this.value = null
    this.$emit('update:modelValue', this.value || null)
  }
}

</script>


<style lang="sass">

//Основные стили поля
.vst-date-field
  @apply w-full relative select-none!

  .flatpickr-input
    @apply select-none! hover:text-stone-500 hover:underline hover:border-#d6ff63 min-w230px min-h52px! w100%
    div
      @apply select-none!
    &.active
      @apply border-#d6ff63! border-width-1px! shadow-none! outline-solid-stone outline-2px

  input
    @apply px-5px border bg-white cursor-pointer min-w240px 1rem! h28px! py0
    @apply user-select-none w[calc(100%-12px)]
    @apply border-y-1px border-y-#c1c7cf border-t-solid text-center
    @apply disabled:(bg-gray-100 cursor-not-allowed)
    &:focus
      @apply border-#d6ff63! border-width-1px shadow-none! outline-solid-stone outline-2px
    &.is-invalid
      @apply border-red-500


.flatpickr-calendar
  @apply w320px! rounded-3xl shadow-[0px_2px_13px_#c1c1c1]! border-color-#ededed! px10px z9999!
  .flatpickr-day.today
    @apply bg-zinc-500 border-yellow-300 text-yellow-200 fw-bold op-80
    @apply hover:bg-yellow-400 hover:border-yellow-400 hover:text-stone-700
  //.flatpickr-day.selected
  //  @apply bg-red-400 border-red-500 hover:bg-red-500 hover:border-red-200
  .flatpickr-day.selected.today, .flatpickr-day.selected
    @apply bg-stone-700! text-white! border-stone-800! fw-bold hover:bg-stone-900! hover:border-stone-400!
    @apply hover:text-white!
  .flatpickr-day.selected.today
    @apply fw-bold!

  .flatpickr-months
    @apply flex! items-center justify-center pt1px
    .flatpickr-prev-month, .flatpickr-next-month
      @apply flex! items-center! justify-center!
    .flatpickr-prev-month
      @apply ml20px h40px p0
    .flatpickr-next-month
      @apply mr20px h40px p0
  .flatpickr-monthDropdown-months
    @apply flex items-center justify-center h25px! fs-16px! overflow-hidden!
  .flatpickr-current-month
    @apply flex items-center justify-center h25px!
  &.open
    @apply z9999!
  .flatpickr-confirm.visible
    @apply bg-stone! text-white! fw-bold rounded-3xl! mb10px mt4px
.numInputWrapper, .numInputWrapper input, .flatpickr-current-month, .flatpickr-time-separator
  @apply h25px! lh-25px!
.numInput
  @apply h28px! fs-16px!
.numInputWrapper, .numInput
  @apply min-w70px!

.flatpickr-time
  @apply h38px! pt6px
  input
    @apply hover:bg-gray-100!
    &.flatpickr-hour
      @apply hover:bg-gray-100!
    &.flatpickr-minute
      @apply hover:bg-gray-100!

.flatpickr-innerContainer
  @apply flex items-center justify-center
  .flatpickr-days
    @apply pb8px px5px w235px!
    .flatpickr-day
      @apply w25px! h25px! lh-25px! mb2px! fs-13px
  .flatpickr-weeks
    @apply self-start mb3px rounded-b-3xl flex items-start justify-start flex-column
    .flatpickr-day
      @apply max-w25px! h28px! lh-27px! mb2px! text-gray-500! op-80
      &:last-child
        @apply pb0! mb0!
  .flatpickr-weekwrapper
    @apply flex items-start justify-start flex-column self-start bg-#e4e4e4 mt3px rounded-b-2xl
    @apply rounded-tl-2xl
    .flatpickr-weekdays
      @apply w200px!
    .flatpickr-weekday
      @apply max-w25px! h17px! lh-17px! mt3px text-gray-400! flex items-end justify-end h24px pb3px pt2px d-block
      @apply ml7px rounded-tl-14px op-70
  .flatpickr-weekdaycontainer
    @apply pb4px pt5px px11px grid! grid-cols-7! gap-1! items-center justify-items-center bg-#e4e4e4 rounded-r-3xl
    .flatpickr-weekday
      @apply text-gray-400! self-start text-gray-500! op-80
  .dayContainer
    @apply py4px px5px grid grid-cols-7 gap-1 items-center justify-items-center w240px! max-w240px! min-w-auto!


// Кастомизация flatpickr
.custom-flatpickr-theme
  @apply bg-white rounded-lg! shadow-lg! border! border-#c1c7cf!
  &.has-event
    @apply fw-bold

  &.selected
    @apply bg-blue-500 text-white border-blue-500 fs-13px!
    @apply hover:(bg-blue-600)
</style>
