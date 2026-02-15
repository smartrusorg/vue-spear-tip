<template v-once lang="pug">
  .vst-select-field(
    class="d-inline-block mx2px my1px w100%"
    :class=`{
      'vst-select-multi': mode == 'multi' || mode == 'tags',
    }`
  )
    input(ref="selectInput" :id="_randKey" :value="reactiveValue" :disabled :autofocus)

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

// 3. Html выборка
// 4. Html отображение значения

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
  _randKey: string = ''
  createdParent() {
    this._randKey = 'vst-select-'+this.VST.generateRandomKey()
  }

  beforeMountParent() {
    this.randomClass = 'vst-select-'+Math.random().toString().split('.')[1]
    this.itemsInner = this.items ?? []
    this._isFirstValueSet = false
    this._isIgnoreSetTags = false
  }

  private _isFirstValueSet: boolean = false
  private _isIgnoreSetTags: boolean = false
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
                const value = (JSON.parse(JSON.stringify((this.itemsInner.find(
                        v => (v?.key) === modelValue)?.value ?? null
                ))))
                console.log(value)
                if (value || value === 0) {
                  this.tagify.addTags(this.reactiveValue = value)
                  this.$emit('change', this.value = modelValue ?? null)
                }
              })
            }
            else if (this.mode == 'multi') {
              this.tagify.removeAllTags()
              modelValue = JSON.parse(e.detail?.value)
              modelValue = Array.isArray(modelValue) ? modelValue.map(v => v.key) : [modelValue]
              this.tagify.addTags(JSON.parse(e.detail?.value))
              this.nextTick(() => {
                this.$emit('change',  this.value = modelValue)
                this.reactiveValue = e.detail?.value
              })
            }
            else if (this.mode == 'tags'){
              this.tagify.removeAllTags()
              modelValue = JSON.parse(e.detail?.value)
              this.tagify.addTags(modelValue)
              this.nextTick(() => {
                this.reactiveValue = e.detail?.value
                this.nextTick(() => {
                  this._isIgnoreSetTags = true
                  this.$emit('change',  this.value = modelValue ?? null)
                })
              })
            }
          }
        },
        remove: (e: any) => {
          if (this.mode == 'select' && !(e.detail?.tagify?.value ?? []).length && this.value !== null) {
            this.tagify.removeAllTags()
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
              this.$el?.querySelector(`#${this._randKey}`) as HTMLInputElement
          )?.focus(), 5)
        }
      },
      templates: {
        // todo доработать вставку html замену шаблона элементов, идеально если через слоты можно было бы шаблон указать
        // tag(tagData, tagify){
        //   return `<tag title="${(tagData.title || tagData.value)}"
        //             contenteditable='false'
        //             spellcheck='false'
        //             tabIndex="${this.settings.a11y.focusableTags ? 0 : -1}"
        //             class="${this.settings.classNames.tag} ${tagData.class ? tagData.class : ""}"
        //             ${this.getAttributes(tagData)}>
        //     <x title='' class="${this.settings.classNames.tagX}" role='button' aria-label='remove tag'></x>
        //     <div>
        //         <span class="${this.settings.classNames.tagText}">${tagData[this.settings.tagTextProp] || tagData.value}</span>
        //     </div>
        //   </tag>`
        // }
        //   tag: (t, i) => {
        //     let value: any  = t.value?.value ?? t.value;
        //     if (this.mode == 'select' && (value = i?.DOM?.originalInput?.getAttribute?.('value')?.trim?.())?.length) {
        //       if (value?.startsWith('{') || value?.startsWith('[')) {
        //         value = JSON.parse(value)
        //         value = value?.[0]?.htmlValue || value
        //       }
        //     }
        //     console.log('valu2e', value)
        //     return `<tag title="${t.title || t.value}" contenteditable="false" tabIndex="-1" class="tagify__tag">
        //       <x title='' class="tagify__tag__removeBtn" tabIndex="-1" role='button' aria-label='remove tag'></x>
        //       <div><span contenteditable="${
        //         this.mode == 'select' ? 'true' : 'false'
        //       }" autocapitalize="false" autocorrect="off" spellcheck="false" class="tagify__tag-text">${
        //         value
        //     }</span></div></tag>`
        //   },
        //
        //   // dropdownItem: (t, i) => {
        //   // todo найти в исходниках tagify оригинальный шаблон
        //   //   return `<div class='tagify__dropdown'>${t.value}</div>`
        //   // }
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
    this.tagify = new TagifyEsm(this.$refs.selectInput, settings)
    this.tagify.setDisabled(this.disabled)
    this.tagify.loading(this.loading)
    this.tagify.on('input', (e:any) => {
      this.$emit('input', this.currentSearchValue = e?.detail?.value ?? '')
    })
    this.tagify.on('blur', (e:any) => { // Оставляем загрузку, если включена
      this.nextTick(() => this.tagify?.loading?.(this.loading))
    })
    this.setTags()
  }
  currentSearchValue: string = ''

  setTags() {
    this.tagify?.removeAllTags?.()
    if (this.mode == 'select'){
      const value = (this.itemsInner.find(v => (v?.key || v?.value) === (this.modelValue || this.inputValue))?.value ?? null)
      if (value) {
        this.nextTick(() => {
          this._isFirstValueSet = true
          this.tagify?.addTags(this.value = value ?? '')
        }, 2)
      }
    }
    else if (this.mode == 'multi'){
      const val = this.modelValue || this.inputValue
      if (Array.isArray(val)) {
        this._isFirstValueSet = true
        this.value = JSON.parse(JSON.stringify(this.itemsInner))?.filter((v: any) => val.includes(v?.key))
        this.nextTick(() => {
          this.tagify?.addTags(this.value ?? '')
        }, 2)
      }
    }
    else if (this.mode == 'tags'){
      const val = this.modelValue || this.inputValue
      if (Array.isArray(val)) {
        this._isFirstValueSet = true
        this.value = JSON.parse(JSON.stringify(this.itemsInner))?.filter((v: any) => val?.some(vl => (vl?.key || vl?.value) == (v?.key || v?.value)))
        this.nextTick(() => {
          this.tagify?.addTags(this.value ?? '')
        }, 2)
      }
    }
  }

  @Watch('items', true) _itemsWatch(items: any) {
    this.itemsInner = JSON.parse(JSON.stringify(items))
    if (this.tagify) {
      this.tagify.whitelist = this.itemsInner
    }
  }
  @Watch('value', true) _valueWatch(value: any) {
    if (this._isFirstValueSet) return this._isFirstValueSet = false
    this.$emit('update:modelValue', value)
  }
  @Watch('modelValue', true) _modelValueWatch(modelValue: any) {
    if (this._isIgnoreSetTags) return this._isIgnoreSetTags = false
    this.nextTick(() => this.setTags())
  }
  @Watch('disabled', true, true) _disabledWatch(disabled: boolean) {
    this.tagify?.setDisabled?.(disabled)
  }

  @Watch('loading') _loadingWatch(inLoading: boolean) {
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
