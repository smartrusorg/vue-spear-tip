<template lang="pug">
  .vst-select-field(
    class="d-inline-block mx2px my1px w100%"
    :class=`{
      'vst-select-multi': mode == 'multi' || mode == 'tags',
    }`
  )
    input(ref="selectInput" :id="randKey" :value="reactiveValue" :autofocus)

    //svg(
    //  data-slot="icon" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"
    //)
    //  path(stroke-linecap="round" stroke-linejoin="round" d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636")
</template>


<script lang="ts">
import Tagify from '@yaireo/tagify' // @ts-ignore
import TagifyEsm from './tagify.esm.js'

import {Prop, VST, Watch} from '../../../core'
import FieldComponent from '../../../replaceable/FieldComponent.vue'


/**
 * Выпадающий список на базе Tagify
 * @author CHORNY
 * @copyright https://smartrus.org
 */
@VST export default class SelectField extends FieldComponent {
  emits = [
    'input',
    'change',
  ]
  declare $refs: {
    selectInput: HTMLInputElement
  }
  @Prop(Boolean) readonly loading: boolean = false
  @Prop(Boolean) readonly autofocus: boolean = false
  @Prop(String) readonly inputValidatePattern: string|null = null
  @Prop(String) readonly mode: 'select' | 'multi' | 'tags' = 'select'
  @Prop(Array) readonly items: { key: string | number, value: string, selected?: string }[]|null = null
  @Prop(String, Object) readonly placeholder: string|{[k:string]:string} = {
    en: 'Select value',
    ru: 'Выберите значение',
  }
  tagify: TagifyEsm
  reactiveValue: any = null
  randomClass: string = ''
  itemsInner: any[] = []
  randKey: string = ''
  createdParent() {
    super.createdParent()
    this.value = this.inputValue || this.modelValue || null
    this.randKey = 'vst-select-'+this.VST.generateRandomKey()
  }

  beforeMountParent() {
    this.randomClass = 'vst-select-'+Math.random().toString().split('.')[1]
    this.isFirstValueSet = false
    this.isIgnoreSetTags = false
  }

  private isFirstValueSet: boolean = false
  private isIgnoreSetTags: boolean = false
  mountedParent() {
    let settings: Tagify.TagifySettings = {
      mode: this.mode == 'select' ? 'select' : undefined,
      addTagOnBlur: false,
      onChangeAfterBlur: false,
      whitelist: this.itemsInner,
      dropdown: {
        // maxTags: 5,
        // fetchSuggestions: this.mode != 'select',
        highlightFirst: true,
        clearOnSelect: true,
        closeOnSelect: this.mode == 'select',
        enabled: 0,
        maxItems: 2000,
      },
      // delimiters: null,
      placeholder: typeof this.placeholder == 'string'
          ? this.placeholder
          : (this.placeholder as any)?.[this.VST.$reactive.locale]
            || (this.placeholder as any)?.en || 'Выберите значение',
      callbacks: {
        change: (e: any) => {
          let modelValue: any = ''
          if (e.detail?.value?.trim?.()?.length && e.detail?.value != 'null') {
            if (this.mode == 'select') {
              modelValue
                  = typeof e.detail?.value == 'string' && (
                  e.detail?.value?.trim?.()?.startsWith('{') || e.detail?.value?.trim?.()?.startsWith('[')
              )
                ? JSON.parse(e.detail?.value)?.[0]?.key
                : (e.detail?.value?.[0]?.key || e.detail?.value?.key)
              this.nextTick(() => {

                const item = (JSON.parse(JSON.stringify((this.itemsInner.find(
                  v => (v?.key) === modelValue) ?? null
                ))))
                if (item?.key || item?.key === 0) {
                  this.tagify.addTags(this.reactiveValue = item?.value)
                  this.$emit(
                    'change',
                    this.isFirstValueSet ? (modelValue ?? null) : (this.value = modelValue ?? null)
                  )
                }
              })
            }
            else if (this.mode == 'multi') {
              this.tagify.removeAllTags?.()
              modelValue = JSON.parse(e.detail?.value)
              modelValue = Array.isArray(modelValue) ? modelValue.map(v => v.key) : [modelValue]
              this.tagify.addTags(JSON.parse(e.detail?.value))
              this.nextTick(() => {
                this.$emit(
                  'change',
                  this.isFirstValueSet ? modelValue : this.value = modelValue
                )
                this.reactiveValue = e.detail?.value
              })
            }
            else if (this.mode == 'tags'){
              this.tagify?.removeAllTags?.()
              modelValue = JSON.parse(e.detail?.value)
              this.tagify.addTags(modelValue)
              this.nextTick(() => {
                this.reactiveValue = e.detail?.value
                this.nextTick(() => {
                  this.isIgnoreSetTags = true
                  this.$emit(
                    'change',
                    this.isFirstValueSet ? (modelValue ?? null) : (this.value = modelValue ?? null)
                  )
                })
              })
            }
          }
        },
        remove: (e: any) => {
          if (this.disabled) return
          if (this.mode == 'select' && !(e.detail?.tagify?.value ?? []).length && this.value !== null) {
            this.tagify?.removeAllTags()
            this.reactiveValue = null
            this.$emit('change',  this.value = null)
          }
          else if (this.mode == 'tags') {
            const reactiveValue = JSON.parse(this.reactiveValue)?.filter((v: any) => v.key != e.detail?.data?.key)
            if (!reactiveValue?.length && this.reactiveValue != '[]') {
              this.tagify.removeAllTags()
              this.$emit('change', this.value = [])
              this.reactiveValue = '[]'
            }
          }
          else if (typeof this.reactiveValue == 'string' && (
              this.reactiveValue?.startsWith('{') || this.reactiveValue?.startsWith('[')
          )) {
            this.nextTick(() => {
              const reactiveValue = JSON.parse(this.reactiveValue)?.filter((v: any) => v.key != e.detail?.data?.key)
              if (!reactiveValue?.length && this.reactiveValue != '[]') {
                this.reactiveValue = '[]'
                this.tagify.removeAllTags()
                this.$emit('change', this.value = [])
              }
            }, 4)
          }

          this.nextTick(() => () => (
              this.$el?.querySelector(`#${this.randKey}`) as HTMLInputElement
          )?.focus(), 5)
        }
      },
      templates: {
        // 1. Общая обертка (контейнер)
        wrapper(inputElement, settings: {[k:string]: any}) {
          const { classNames, mode, readonly, disabled, required } = settings
          const modeClass = mode ? classNames[`${mode}Mode`] : ""
          const isSelect = mode === 'select'

          return `
            <tags class="${classNames.namespace} ${modeClass} ${inputElement.className}"
                ${readonly ? "readonly" : ""}
                ${disabled ? "disabled" : ""}
                ${required ? "required" : ""}
                ${isSelect ? 'spellcheck="false"' : ""}
                tabIndex="-1" title="">
              ${(this.settings.templates as any)?.input?.call(this)}
            </tags>
          `
        },

        // @ts-ignore
        input() { // @ts-ignore
          const { settings } = this
          const { classNames, a11y, mode, placeholder } = settings;
          const isEditable = !settings.readonly && settings.userInput;

          return `
            <span ${isEditable ? "contenteditable" : ""}
                  data-can-editable
                  tabIndex="0"
                  data-placeholder="${placeholder || ""}"
                  aria-placeholder="${placeholder || ""}"
                  class="${classNames.input}"
                  role="textbox"
                  autocapitalize="false"
                  autocorrect="off"
                  spellcheck="false"
                  aria-label="${a11y.inputAriaLabel}"
                  aria-autocomplete="both"
                  aria-multiline="${mode === 'mix'}"></span>
          `
        },

        // 3. Шаблон тега
        tag(tagData, { settings: s }) {
          const isFocusable = !!s?.a11y?.focusableTags
          const isSelectMode = s.mode === 'select' && s.userInput

          return `
            <tag
                 contenteditable="false"
                 tabIndex="${isFocusable}"
                 class="${s.classNames.tag} ${tagData.class || ""}"
                 ${this.getAttributes(tagData)}>

              <x title=""
                 tabIndex="${isFocusable}"
                 class="${s.classNames.tagX}"
                 role="button"
                 aria-label="remove tag"></x>

              <div>
                <span class="${s.classNames.tagText}"
                      contenteditable="${isSelectMode ? 'true' : 'false'}"
                      autocapitalize="false"
                      autocorrect="off"
                      spellcheck="false">
                  ${tagData[s.tagTextProp] || tagData.value}
                </span>
              </div>
            </tag>
          `.replace(/\s+/g, ' ').trim()
        },


        // 4. Обертка выпадающего списка
        // dropdown({ settings: s }) {
        //   const isManual = s.dropdown.position === 'manual'
        //   const className = isManual ? "" : s.classNames.dropdown
        //
        //   return `
        //     <div class="${className} ${s.dropdown.classname}"
        //          role="listbox"
        //          aria-labelledby="dropdown"
        //          dir="${s.dropdown.RTL ? "rtl" : ""}">
        //       <div data-selector="tagify-suggestions-wrapper"
        //            class="${s.classNames.dropdownWrapper}"></div>
        //     </div>
        //   `
        // },

        // 5. Контент выпадающего списка
        dropdownContent(suggestionsHTML) {
          const { templates: t } = this.settings // @ts-ignore
          const suggestions = this.state.dropdown.suggestions

          return `
            ${t.dropdownHeader.call(this, suggestions)}
            ${suggestionsHTML}
            ${t.dropdownFooter.call(this, suggestions)}
          `.replace(/\s+/g, ' ').trim()
        },

        // 6. Элемент списка (Suggestion)
        dropdownItem(item) {
          const { classNames } = this.settings
          const isSelected = this.isTagDuplicate(item.value)

          return `<div ${this.getAttributes(item)}
             class="${classNames.dropdownItem} ${
              isSelected ? classNames.dropdownItemSelected : ''
            } ${item.class || ''}"
             tabindex="0"
             role="option">
          ${item.mappedValue || item.value}
          </div>`.replace(/\s+/g, ' ').trim()
        },

        // 7. Шапка списка
        dropdownHeader(suggestions) {
          return `<header data-selector="tagify-suggestions-header" class="${
            this.settings.classNames.dropdownHeader
          }"></header>`.replace(/\s+/g, ' ').trim()
        },

        // 8. Подвал списка (счетчик оставшихся элементов)
        dropdownFooter(suggestions) {
          const diff = suggestions.length - this.settings.dropdown.maxItems
          return diff > 0
            ? `<footer data-selector="tagify-suggestions-footer" class="${this.settings.classNames.dropdownFooter}">
                ${diff} more items. Refine your search.
             </footer>`.replace(/\s+/g, ' ').trim()
            : ''
        },
      },
    }
    if (this.mode !== 'tags') {
      settings.editTags = false
    }
    else {
      if (this.inputValidatePattern?.trim?.()) {
        settings.pattern = new RegExp(this.inputValidatePattern.trim(), 'i')
        settings.editTags = {
          clicks: 1,
          keepInvalid: true
        }
      }
    }
    this.tagify = new TagifyEsm(this.$el.querySelector(`#${this.randKey}`), settings)
    this.tagify.setDisabled(this.disabled)
    this.tagify.loading(this.loading)
    this.tagify.on('input', (e:any) => {
      this.$emit('input', this.currentSearchValue = e?.detail?.value ?? '')
    })
    this.tagify.on('blur', (e:any) => { // Оставляем загрузку, если включена
      this.nextTick(() => {
        this.tagify?.loading?.(this.loading)
        this.tagify?.setDisabled?.(this.disabled)
      })
    })
    this.setTags()
  }
  currentSearchValue: string = ''

  setTags() {
    // console.log('set tags', this)
    this.tagify?.removeAllTags?.()
    if (this.mode == 'select'){
      // console.log('select tags', this)
      const value = (
        this.itemsInner.find(v => (v?.key || v?.value) === (this.inputValue || this.modelValue))?.value ?? null
      )
      if (value) {
        this.isFirstValueSet = true
        this.value = value
        this.tagify?.addTags(this.value ?? '')
      }
    }
    else if (this.mode == 'multi'){
      const val = this.inputValue || this.modelValue
      if (Array.isArray(val)) {
        this.isFirstValueSet = true
        this.value = JSON.parse(JSON.stringify(this.itemsInner))?.filter((v: any) => val.includes(v?.key))
        this.tagify?.addTags(this.value ?? '')
      }
    }
    else if (this.mode == 'tags'){
      const val =  this.inputValue || this.modelValue
      if (Array.isArray(val)) {
        this.isFirstValueSet = true
        this.value = JSON.parse(JSON.stringify(this.itemsInner))?.filter(
          (v: any) => val?.some(vl => (vl?.key || vl?.value) == (v?.key || v?.value))
        )
        this.tagify?.addTags(this.value ?? '')
      }
    }
  }

  @Watch('items', true, true) itemsWatch(items: any) {
    this.itemsInner = JSON.parse(JSON.stringify(items))
    if (this.tagify) {
      this.tagify.whitelist = this.itemsInner
    }
  }
  @Watch({deep: true}) watchValue(value: any) {
    if (this.isFirstValueSet) return this.isFirstValueSet = false
    this.$emit('update:modelValue', value)
  }
  @Watch('modelValue', true) modelValueWatch(modelValue: any) {
    if (this.isIgnoreSetTags) return this.isIgnoreSetTags = false
    this.nextTick(() => this.setTags())
  }
  @Watch('disabled', true, true) disabledWatch(disabled: boolean) {
    this.tagify?.setDisabled?.(disabled)
    if (disabled && !this.value && (this.inputValue || this.modelValue)) {
      if ((this.value = this.inputValue || this.modelValue)) {
        this.nextTick(() =>
          this.tagify?.addTags(
            this.mode == 'select'
              ? this.itemsInner?.find?.(v => v.key == this.value)?.value ?? ''
              : this.itemsInner?.filter?.(v => this.value?.includes(v.key))
          )
        )
      }
    }
  }

  @Watch watchLoading(inLoading: boolean) {
    this.tagify?.loading?.(inLoading)
    if (!inLoading && this.items?.length) {
      this.nextTick(() => this.tagify?.dropdown.show(this.currentSearchValue))
    }
  }
}
</script>

<style lang="sass">
@import './tagify.css'
.tagify__dropdown
  @apply mt4px! border-0!
  &.tagify__dropdown__openInModal
    @apply z-999999!

  &.tagify__dropdown__openInOI
    @apply z-999999!

.tagify__dropdown__wrapper
  @apply rounded-lg!
  border-color: transparent !important
  box-shadow: none
  border-width: 0 1px 1px
  background: #fff repeating-linear-gradient(45deg, transparent, transparent 10px, #fafffd 10px, #fafffd 20px) !important

.tagify__dropdown__item
  @apply px12px! py8px! my2px fs-1rem
  border: 1px solid rgba(152, 177, 169, 0.37)

.tagify__dropdown__item--active
  background: #fffecd !important
  color: #000 !important
  border-color: #f6f2a7

  *
    color: #fff !important

.tagify__tag__removeBtn
  @apply h25px! w25px text-stone!
  //content: url("ban.svg") !important
  mask-image: url("ban.svg")
  -webkit-mask-size: contain
  mask-size: contain
  mask-repeat: no-repeat

  /* Цвет иконки */
  @apply bg-stone
  &:hover
    @apply scale-130
    transition: box-shadow .03s !important

.tagify__tag__removeBtn:after
  transition: .03s, color 0s !important
  content: "" !important

.tagify--loading .tagify__input:empty::after
  @apply top-30%

.tagify__dropdown__item--selected
  background: #ffe37a
  color: #1e1e1e
  font-weight: bolder
  padding-top: 7px !important

  &:before
    content: ""
.vst-select-field
  &.vst-select-multi
    .tagify__tag-text
      @apply max-w-max-content;

  .tagify
    outline: 2px solid transparent !important
    @apply min-h44px! flex! items-center justify-center rounded-3xl
    --tags-border-color: #c1c7cf !important
    --tag-hide-transition: .1ms !important
    transition: 100ms !important
    overflow: hidden
    background: #fff
    margin: 0 !important
    border-color: #c1c7cf !important
    padding: 0 0 0 10px !important

  .tagify__input
    @apply min-w80px! fs-1rem duration-0!
    transition: 100ms !important
    padding: .3em .5em !important
    //font-size: 13px

  .tagify--empty
    .tagify__input:before
      @apply color-#c1c7cf!

  .tagify--empty.tagify--select
    @apply text-stone
    padding: 2px 0 0 15px !important

  .tagify__tag
    @apply fs-1rem!

  .tagify--focus
    @apply outline-stone-400! outline-2px outline-color-#c1c7cf! border-color-#c1c7cf border-solid border-1px!

  :not(.vst-select-multi)
    .tagify--focus.tagify--noTags
      @apply pt2px! min-h40px!
    .tagify--select:not(.tagify--empty)
      @apply min-h40px! mt5px

  .vst-select-multi
    .tagify__tag
      @apply mt6px!

    .tagify--empty
      //@apply min-w120px!
      padding: 5px 0 0 15px !important
</style>
