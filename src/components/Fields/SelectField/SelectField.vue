<template lang="pug">
  .vst-select-field(
    class="d-inline-block mx2px my1px w100%"
    :class=`{
      'vst-select-multi': mode == 'multi' || mode == 'tags',
      'min-h45px' : size == 'lg',
      'min-h24px': size == 'sm',
      'min-h35px': size == 'md',
      ['vst-select-'+randKey]: true,
    }`
  )
    input(ref="selectInput" :id="`vst-s-${randKey}`" :value="reactiveValue" :autofocus)
    component(is="style" v-if="(size == 'md' || size == 'sm')").
      .vst-select-field.vst-select-{{randKey}} .tagify {
        {{ mode != 'select' && value && value?.toString?.()?.trim?.()?.length ? 'min-' : '' }}height: 35px !important;
        min-height: auto !important;
        padding-left: 12px !important;
        padding-top: 2px !important;
        border-color: #a8a29e99 !important;
      }
      .vst-select-field.vst-select-{{randKey}} .tagify__tag {
        height: 28px !important;
      }
      .vst-select-field.vst-select-{{randKey}} .tagify__input {
        height: 20px !important;
        padding: 0 !important;
      }
      .vst-select-field.vst-select-{{randKey}} .tagify--loading .tagify__input {
        margin: 0 !important;
        padding: 4px 7px !important;
      }
      .vst-select-field.vst-select-{{randKey}} .tagify__tag-text {
        padding: 0 0 0 0 !important;
      }
      .vst-select-dropdown-{{randKey}} .tagify__dropdown__item  {
        height: 32px !important;
        line-height: 29px !important;
        padding: 1px 7px 3px  !important;
      }
      .vst-select-field.vst-select-{{randKey}} .tagify--select tag > div,
      .vst-select-field.vst-select-{{randKey}} .tagify--select tag,
      .vst-select-field.vst-select-{{randKey}} .tagify__tag,
      {
        padding: 0 !important;
        margin: 0 !important;
        height: 20px !important;
      }
    component(is="style" v-if="size == 'lg' && mode == 'select'").
      .vst-select-{{randKey}} .tagify tag {
        height: 37px !important;
        margin-top: 6px;
        margin-left: 10px;
      }
      .vst-select-{{randKey}} .tagify tag x {
        height: 35px !important;
        margin-top: 4px;
        margin-left: 10px;
      }
      .vst-select-{{randKey}} .tagify span.tagify__input {
        height: 10px !important;
      }
    component(is="style" v-if="mode == 'multi'").
      .vst-select-{{randKey}} .tagify__tag {
        background: #e5e5e5;
      }
    component(is="style" v-if="mode == 'select'").
      .vst-select-{{randKey}} .tagify__tag-text {
        white-space: nowrap;
        position: absolute;
        top: 5px;
        left: 3px;
        width: 75% !important;
      }
    component(is="style").
      .vst-select-field.vst-select-{{randKey}} .tagify--empty .tagify__input:before {
        max-width: {{ maxPlaceholderWidth ? maxPlaceholderWidth+'px' : 'auto' }};
      }
    component(is="style" v-if="disabled").
      .vst-select-field.vst-select-{{randKey}} .tagify--empty .tagify__input:before {
        color: #3a3535 !important;
      }
</template>


<script lang="ts">
import Tagify from '@yaireo/tagify' // @ts-ignore
import TagifyEsm from './tagify.esm.js'

import {Prop, Component, Watch} from '../../../core'
import FieldComponent from '../../../replaceable/FieldComponent.vue'


/**
 * Выпадающий список на базе Tagify
 * @author CHORNY
 * @copyright https://smartrus.org
 */
@Component export default class SelectField extends FieldComponent {
  emits = [
    'input',
    'change',
    'reset',
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
  itemsInner: any[] = []
  randKey: string = ''
  maxPlaceholderWidth: number = 0
  createdParent() {
    super.createdParent()
    this.value = this.inputValue || this.modelValue || null
    this.randKey = 'vst-select-'+this.VST.generateRandomKey()
  }
  
  setValue(value: any): any {
    if (['string', 'number'].includes(typeof value) || value === null || Array.isArray(value)) {
      super.setValue(value)
    }
  }
  
  beforeMountParent() {
    this.isFirstValueSet = false
    this.isIgnoreSetTags = false
  }

  isFirstValueSet: boolean = false
  isIgnoreSetTags: boolean = false
  currentSearchValue: string = ''

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
            const reactiveValue = JSON.parse(this.reactiveValue)
              ?.filter((v: any) => (v.key !== undefined ? v.key : v.value) != e.detail?.data?.key)
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
                 aria-label="remove tag"
                 onmousedown="this.closest('.vst-select-field').__vst_select.reset(this)"></x>

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

          return `<div class="vst-select-dropdown-${ // @ts-expect-error
              this.DOM.originalInput?.closest?.('.vst-select-field')?.__vst_select?.randKey
          }">
            ${t.dropdownHeader.call(this, suggestions)}
            ${suggestionsHTML}
            ${t.dropdownFooter.call(this, suggestions)}
          </div>`.replace(/\s+/g, ' ').trim()
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
    this.nextTick(() => {
      this.tagify = new TagifyEsm(this.$el.querySelector(`#vst-s-${this.randKey}`), settings)
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
    })
  }

  beforeUpdate() { // @ts-expect-error
    this.$el.__vst_select = this // @ts-expect-error
    const w = this.$el.querySelector?.('.tagify__input')?.closest?.('.vst-select-field')?.offsetWidth ?? 0
    if (w) {
      this.maxPlaceholderWidth = w - w * 0.25
    }
  }


  reset(tag: HTMLElement) {
    if (this.mode == 'select') {
      this.tagify?.removeAllTags?.()
      this.reactiveValue = null
    }
    else if(this.mode == 'multi') {
      const keyToDelete = tag?.parentElement?.getAttribute?.('key')
      if (keyToDelete) {
        const tagToRemove = this.tagify.value.find((tag: any) => tag.key == keyToDelete)
        if (tagToRemove) {
            this.tagify?.removeTags(tagToRemove.value)
        }
        this.nextTick(() => {
          if (this.tagify?.value?.length) {
            const newValues = []
            for (const v of this.tagify.value) {
              newValues.push({key: v.key, value: v.value})
            }
            this.reactiveValue = JSON.stringify(newValues)
          }
        })
      }
    }
    else if (this.mode == 'tags' && Array.isArray(this.value) && this.value.length == 1) {
      this.nextTick(() => this.tagify?.removeAllTags?.(), 15)
      this.value = []
    }
    this.nextTick(() => (this.$el?.querySelector?.(`.tagify__input`) as HTMLDivElement).focus?.(), 3)
    this.nextTick(() => {
      this.$emit('update:modelValue', this.value)
      this.$emit('change', this.value)
    }, 4)
    this.$emit('reset')
  }

  onViewPortResize() {
    this.setTags()
  }

  setTags(defaultValue?: any) {
    this.beforeUpdate()
    this.nextTick(() => {
      this.tagify?.removeAllTags?.()
      if (this.mode == 'select'){
        const item = this.itemsInner.find(v => (
          v?.key === 0 ? v?.key : (v?.key || v?.value)
        ) === (defaultValue ?? (this.inputValue || this.modelValue)))
        if (item?.key || item?.key === 0) {
          this.isFirstValueSet = true
          this.value = item.key ?? item.value ?? null
          this.tagify?.addTags?.((item.value ?? item.key ?? '').toString())
        }
      }
      else if (this.mode == 'multi'){
        const val = (defaultValue ?? (this.inputValue || this.modelValue))
        if (Array.isArray(val)) {
          this.isFirstValueSet = true
          const values = JSON.parse(JSON.stringify(this.itemsInner))?.filter((v) => val.includes(v?.key))
          this.value = values?.map(v => v?.key ?? v)
          this.nextTick(() => this.tagify?.addTags(values ?? []))
        }
      }
      else if (this.mode == 'tags'){
        const val =  (defaultValue ?? (this.inputValue || this.modelValue))
        if (Array.isArray(val)) {
          this.isFirstValueSet = true
          this.value = JSON.parse(JSON.stringify(this.itemsInner))?.filter(
              (v: any) => val?.some(vl => (vl?.key || vl?.value) == (v?.key || v?.value))
          ).map(v => {return {value: v.value}})
          this.nextTick(() => this.tagify?.addTags(this.value ?? []))
        }
      }
    })
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
    this.nextTick(() => this.setTags(modelValue), 2)
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
  mask-image: url("ban.svg")
  -webkit-mask-size: contain
  mask-size: contain
  mask-repeat: no-repeat
  touch-action: auto

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
    @apply flex! items-center justify-center rounded-3xl
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
      white-space: nowrap
      overflow: hidden
      text-overflow: ellipsis

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
