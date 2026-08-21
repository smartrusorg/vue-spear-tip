<template lang="pug">
  template(v-for="m in modals" v-if="modals?.length")
    .sm-modal(
      :class="{'d-none':!modals.length}"
      :id="`modal-${m?.id}`"
      :style="m?.styleModal"
    )
      .sm-modal-content(
        :style="(m?.width ? `width: ${m.width};` : '') + m?.style"
        :class="{'sm-modal-content-mobile':VST.$reactive.viewPortType == 'mobile'}"
      )
        .sm-modal-title(
          :class="{'sm-modal-title-mobile':VST.$reactive.viewPortType == ''}"
          :style=`{
            backgroundColor: m?.titleBgColor,
            color: m?.titleColor,
          }`
          v-if="m?.title"
        )
          span(
            :class=`{
              'me-2': m?.title,
            }`
            v-html="m?.title"
          )
          i.sm-modal-icon.fa(
            :style="'color: ' + m?.color"
            :class="'fa-' + m?.icon"
          )
        div(
          v-if="m?.data && !m?.component"
          v-html="m?.data ? m.data : ''"
          class="d-inline-block"
        )
        template(v-if="m?.component")
          component(:is="m.component" ref="component" v-bind="m?.componentParams ?? {}")
        .sm-modal-footer(
          :class=`{
            'sm-modal-footer-not-one-but': m?.confirmEnable || m?.denyEnable,
          }`
        )
          VSTButton(
            :disabled="!buttonsEnable"
            size="md"
            v-if="m?.confirmEnable"
            :color="m?.color"
            :borderColor="m?.confirmButtonBorderColor"
            :icon="m?.icon"
            :bg="m?.titleBgColor"
            fontSize="1rem"
            @click="closeModal(m?.id, 'confirm')"
          )
            span &nbsp;
            span(v-html="m?.confirmText || 'Подтвердить'")
            span &nbsp;
          VSTButton(
            :disabled="!buttonsEnable"
            size="md"
            v-if="m?.denyEnable"
            :icon="m?.icon"
            :shine="m?.denyShine"
            :color="m?.denyColor ?? m?.color"
            :bg="m?.denyBgColor ?? m?.titleBgColor"
            fontSize="1rem"
            @click="closeModal(m?.id, 'deny')"
          )
            span &nbsp;
            span(v-html="m?.denyText || 'Отказаться'")
            span &nbsp;
          VSTButton(
            size="md"
            ref="cancelBtn"
            :disabled="!buttonsEnable"
            :icon="m?.icon"
            fontSize="1rem"
            @click="closeModal(m?.id, 'cancel')"
          )
            span &nbsp;
            span(v-html="m?.cancelText || m?.confirmText || 'Отмена'")
            span &nbsp;
      .sm-modal-base(:id="`modal-base-${m?.id}`") &nbsp;
</template>


<script lang="ts">
import {BaseComponent, Prop, Component, Watch} from '../../../core'
import {default as VSTButton} from '../Button'
import {ModalManipulator, ModalStyles} from '../../../Interfaces/IModalObject'
import ModalComponent from './ModalComponent.vue'

/**
 * Модальные окна
 * @author CHORNY (created 25.06.2026 4:32)
 * @copyright https://smartrus.org
 */
@Component export default class Modals extends BaseComponent {
  declare $refs: {component: ModalComponent[], cancelBtn: VSTButton}
  components = {VSTButton}
  modals: ModalConfig[] = []
  
  created() {
    $VST._modal = this
  }
  
  mounted() {
    this.display.bind(this)
  }
  
  buttonsEnable: boolean = true
  disableButtons() {
    this.buttonsEnable = false
  }
  
  enableButtons() {
    this.buttonsEnable = true
  }
  
  display(
    content : ModalConfig | string,
    onConfirm: ModalOnConfirm | undefined = undefined,
    onCancel: ModalOnCancel| undefined = undefined
  ) : number {
    let data: ModalConfig = {content: undefined, message: undefined},
      tempId : number = Date.now() + Math.ceil(Math.random() * 100000)
    if(typeof content == 'string' || typeof content == 'number') {
      data.message = data.content = `<div  style="text-align: center">${content}</div>`
      data.onConfirm = onConfirm
      data.onCancel  = onCancel
    }
    else {
      data = content
    }
    let icon = data?.icon,
      type = data?.type ?? 'info',
      color,
      titleBgColor,
      denyColor,
      denyBgColor,
      denyShine,
      confirmButtonBorderColor,
      titleColor
    if(type == 'info') {
      color = '#f1fbff'
      titleColor = '#fff'
      titleBgColor = '#3EB2E6FF'
      confirmButtonBorderColor = '#2ba7d6'
      if (icon == 'info'){
        icon = 'circle-check'
      }
    }
    else if(type == 'success') {
      titleColor = '#134a06'
      color = '#134a06'
      titleBgColor = '#4cd964'
      confirmButtonBorderColor = '#69c259'
      if (icon == 'info'){
        icon = 'circle-check'
      }
    }
    else if(type == 'warning') {
      color = '#ffffc3'
      titleColor = '#fff'
      titleBgColor = '#ff9500'
      confirmButtonBorderColor = '#ff9500'
      if (icon == 'info'){
        icon = 'triangle-exclamation'
      }
    }
    else if(type == 'danger') {
      color = '#fff'
      titleColor = '#fff'
      titleBgColor = '#ff473c'
      confirmButtonBorderColor = '#ff1d1d'
      if (icon == 'info') {
        icon = 'triangle-exclamation'
      }
    }
    else if(type == 'question') {
      color = '#e8edef'
      titleColor = '#fff'
      titleBgColor = '#87adbd'
      if (icon == 'info') {
        icon = 'circle-question'
      }
    }
    let m = [...this.modals]
    let styles: ModalStyles = {
      icon,
      color,
      titleBgColor,
      titleColor,
      denyColor,
      denyBgColor,
      denyShine,
    }
    for (const n in styles) { // @ts-ignore Подстановка стилей из начтроек скрипта
      styles[n] = (data?.styles?.[n as any] || styles[n])
    }
    
    m.push({...{
        data : `<span id="modal-content-${tempId}">${(data?.message || data?.content)?.toString?.() ?? ''}</div></span>`,
        title : data?.title,
        confirmEnable : data?.confirmEnable !== undefined ? data.confirmEnable : !!data?.onConfirm,
        confirmText : data?.confirmText ?? (data?.confirmEnable !== undefined ? 'Подтвердить' : 'Ок'),
        confirmCloseDisable : data?.confirmCloseDisable ?? false,
        denyCloseDisable : data?.denyCloseDisable ?? false,
        denyEnable : data?.denyEnable !== undefined ? data.denyEnable : !!data?.onDeny,
        denyText : data?.denyText,
        cancelText : data?.cancelText ?? (data?.confirmEnable || !!data?.onConfirm ? 'Отмена' : 'Ок'),
        width : data?.width,
        style : data?.style,
        component : data?.component,
        componentParams : data?.componentParams,
        escapeExit : data?.escapeExit ?? false,
        styleModal : data?.styleModal,
        onConfirm : data?.onConfirm ?? onConfirm,
        onCancel : data?.onCancel ?? onCancel,
        onMount : data?.onMount ?? null,
        onOpen : data?.onOpen ?? null,
        onOk : data?.onOk ?? (() => {}),
        onDeny : data?.onDeny,
        type : type,
        id : data?.id ?? tempId,
        content : '',
        message : '',
        confirmButtonBorderColor
      }, ...styles})
    
    const currentIndex = m.length - 1
    
    $VST.vueModalComponent = this
    this.nextTick(() => {
      this.modals = m
      // Подключаем глобальные vue компоненты в открытое окно
      const self = this
      this.$watch(() => document.querySelector(`#modal-content-${tempId}`), () => {
        this.$nextTick(() => {
          setTimeout(() => self.$refs?.cancelBtn?.[0]?.focus?.(), 100)
          setTimeout(() => self.$refs?.cancelBtn?.[0]?.focus?.(), 400)
          setTimeout(() => self.$refs?.cancelBtn?.[0]?.focus?.(), 1000)
        })
      })
      
      data?.onOpen?.(data?.componentParams)
      data?.onMount?.(data?.componentParams)
    }, 20)
    
    // Добавляем анимацию появления фона
    const basEl = this.$el?.nextElementSibling!?.querySelector?.(`#modal-base-${tempId}`)
    if (basEl) {
      basEl.classList.add('modalBackFadeIn')
    }
    else {
      setTimeout(() => { // @ts-ignore
        const basEl = this.$el?.nextElementSibling?.querySelector?.(`#modal-base-${tempId}`)
        if (basEl) {
          basEl.classList.add('modalBackFadeIn')
        }
        else {
          setTimeout(() => { // @ts-ignore
            const basEl = this.$el?.nextElementSibling?.querySelector?.(`#modal-base-${tempId}`)
            if (basEl) {
              basEl.classList.add('modalBackFadeIn')
            }
          }, 400)
        }
      }, 100)
    }
    return tempId
  }
  
  closeModal(id?: number, type : string = '') {
    let m = [...this.modals]
    for(let i = 0; i < m.length; i++) {
      if(m[i].id == id) {
        let toClose = type != 'confirm'
        let fullClose = false
        const errors = []
        const params = [
          {
            component: this.$refs.component?.[i],
            value: this.$refs.component?.[i]?.getValue?.() ?? null,
            error(newError: string) {
              if (newError) {
                errors.push(newError)
              }
            },
            close() {
              toClose = true
            },
            breakCancel() {
              toClose = false
            },
            closeAllModals() {
              fullClose = true
            },
          },
          m[i]?.componentParams
          // Костыль для получения значения из prompt окна
          ?? document.getElementById?.('sm-modal-prompt-input')?.value ?? {}
        ]
        if(type == 'cancel' && (typeof m[i]?.onCancel == 'function' || typeof m[i]?.onOk == 'function')) {
          if(typeof m[i]?.onOk == 'function') {
            m[i]?.onOk?.apply?.(m[i], params)
          }
          if(typeof m[i]?.onCancel == 'function') {
            m[i]?.onCancel(params.value as any, m[i]?.componentParams ?? {})
          }
          if (fullClose) {
            this.nextTick(() => this.closeAllModals())
            break
          }
          if (!toClose) continue
        }
        else if(type == 'confirm' && typeof m[i]?.onConfirm == 'function') {
          m[i]?.onConfirm.apply(m[i], params)
          m[i]?.onOk?.apply?.(m[i], params)
          if (fullClose) {
            this.nextTick(() => this.closeAllModals())
            break
          }
          if (!toClose) continue
          if (errors.length) {
            $VST.modal!.error(' &#8226; ' + errors.join('<br> &#8226; '))
            continue
          }
        }
        else if(type == 'deny' && typeof m[i]?.onDeny  == 'function') {
          m[i]?.onDeny.apply(m[i], params)
          if (fullClose) {
            this.nextTick(() => this.closeAllModals())
            break
          }
          if (!toClose) continue
          if (errors.length) {
            $VST.modal!.error(' &#8226; ' + errors.join('<br> &#8226; '))
            continue
          }
        }
        if (fullClose) {
          this.nextTick(() => this.closeAllModals)
          break
        }
        if(
          (type == 'confirm' && m[i]?.confirmCloseDisable)
          || (type == 'deny' && m[i]?.denyCloseDisable)
        ) {
          break
        }
        m.splice(i, 1)
        break
      }
    }
    this.modals = m
  }
  
  closeAllModals() {
    this.modals = []
  }
}
type ModalOnConfirm = (manipulator: ModalManipulator, componentParams?: {}) => void
type ModalOnOpen = (componentParams?: {}) => void
type ModalOnCancel = (returnedValue: any, componentParams?: {}) => void

interface ModalConfig extends ModalStyles {
  content: string | undefined
  message: string | undefined
  onConfirm?: ModalOnConfirm
  onCancel?: ModalOnCancel
  onOk?: ModalOnConfirm
  onDeny?: ModalOnConfirm
  onMount?: ModalOnOpen
  onOpen?: ModalOnOpen
  title?: string
  type?: 'info' | 'success' | 'warning' | 'danger' | 'question'
  confirmEnable? : boolean
  confirmCloseDisable? : boolean
  confirmText?: string
  cancelText?: string
  denyEnable?: boolean
  denyText?: string
  denyCloseDisable?: boolean
  component?: string
  componentParams?: {[key:string]: any}
  
  escapeExit?: boolean
  
  width?: string
  style?: string
  styleModal?: string
  id?: number
  icon?: string
  vue?: any
  vueGlobals?: any
  data?: any
}

</script>


<style scoped lang="sass">
.sm-modal
  @apply py40px h[calc(100%-80px)] flex items-end justify-end
  max-width: 100vw
  position: fixed
  z-index: 999998
  left: 0
  top: 0
  width: 100%
  overflow: auto
  // background-color: rgba(70, 72, 74, 0.9)
  scrollbar-width: thin // "auto" or "thin"
  scrollbar-color: #444444 #e4e7e8 // scroll thumb and track
  *
    max-width: 100vw

.sm-modal-content
  @apply z-3
  max-width: 100vw
  display: grid
  grid-row: 1
  background-color: #fff
  color: #000
  border-radius: 28px
  padding: 16px 25px 18px
  margin: auto
  width: fit-content
  //min-width: 25em
  //max-height: 100%
  box-shadow: 0 1px 3px 3px rgb(154, 154, 154)
  animation-name: bounceInDown
  animation-duration: 0.25s
  &.sm-modal-content-mobile
    //position: absolute
    width: calc(100% - 80px)
//bottom: 20%
//margin: auto 20px

.sm-modal-base
  backdrop-filter: blur(2px)
  @apply fixed w100% h100% t-0 l-0 z-2
  background: rgba(50, 49, 49, 0.49)
  opacity: 0
  transition: opacity 200ms ease-in-out
  &.modalBackFadeIn
    opacity: 1 !important

.sm-modal-title
  @apply min-w280px user-select-none!
  font-size: 17px
  margin: -16px 0 15px -25px
  background: #34bbff
  padding: 10px 0
  flex-direction: column
  color: #000
  border-radius: 3px
  text-align: center
  width: calc(100% + 50px)
  &.sm-modal-title-mobile
    width: calc(100vw - 30px) !important


.sm-modal-footer
  margin-top: 10px
  text-align: center
  &.sm-modal-footer-not-one-but
    @apply pr12px

.sm-modal-icon
  animation-name: bounceInDown
  animation-duration: 0.35s

.sm-modal-confirm-button:not(:disabled)
  animation-name: bounceInLeft
  animation-duration: 0.35s

.sm-modal-deny-button:not(:disabled), .sm-modal-ok-button:not(:disabled)
  animation-name: bounceInUp !important
  animation-duration: 0.35s

</style>
