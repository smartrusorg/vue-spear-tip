<script lang="ts">
import {reactive, computed, ref} from 'vue'
import {IBaseVueComponent, BaseComponentEventInput, BaseComponentEvents} from '../Interfaces/IBaseVueComponent'
import {VueClass} from '../core'
import {IGlobalVST} from '../Interfaces/IGlobalVST'
import {IHammerManager} from '../Interfaces/IHammer'

/** Base component */
export default abstract class BaseComponent extends VueClass implements IBaseVueComponent {
  readonly VST: IGlobalVST

  readonly Settings: {
    directives: {
      clickTap: boolean|string
    }
  } = {
    directives: {
      clickTap: 'onViewPortResize'
    }
  }

  emitsParent = ['update:modelValue', 'clickTap']
  declare readonly $root: {
    [key: string]: any
  }

  constructor() {
    super()
    this.VST = globalThis.$VST
    if (!this.VST.$reactive) { // Единоразовая настройка реактивных параметров
      const windowWidth = ref(window.innerWidth)
      const windowHeight = ref(window.innerHeight)
      const isAndroid = this.VST.device().osName()?.toLowerCase().includes('android')
      const isApple = this.VST.device().deviceVendor() == 'Apple'
      const hasTouchpad = () => 'ontouchstart' in window || navigator.maxTouchPoints > 0 || (navigator as any).msMaxTouchPoints > 0
      const isIphone =
      this.VST.device().osName()?.toLowerCase().includes('ios')
        || this.VST.device().deviceModel()?.toLowerCase().includes('iphone')
        || (
          this.VST.device().browserEngine()?.toLowerCase().includes('safari')
          && this.VST.device().device() == 'mobile'
        )

      this.VST.$reactive = reactive({
        locale: (Intl ? ((new Intl.DateTimeFormat())?.resolvedOptions?.()?.locale) : navigator.language) || 'en',
        isMobile: computed(() => windowWidth.value < 768 || (windowHeight.value < 768 && windowWidth.value < 1000)),
        isMobileHorizontal: computed(() => windowHeight.value < windowWidth.value && windowHeight.value < 768 && windowWidth.value < 1000),
        isTablet: computed(() => windowWidth.value < 1280 && windowWidth.value >= 768),
        isNotebook: computed(() => windowWidth.value <= 1366 && windowWidth.value >= 1280),
        isDesktop: computed(() => windowWidth.value > 1366),
        viewPortType: computed(() => (
          windowWidth.value < 768 || (
            // Мобильник в повёрнутом состоянии в большинстве случаев
            windowHeight.value < 768 && windowWidth.value < 1000
          ))
            ? 'mobile'
            : hasTouchpad() && windowWidth.value < 1440 // Планшет в режиме desktop
              ? 'tablet'
              : ((windowWidth.value < 1280)
                ? 'tablet'
                : (
                  (windowWidth.value < 1366)
                    ? 'notebook'
                    : 'desktop'
                )),
        ),
        get isIphone() {
          return isIphone
        },
        get isApple() {
          return isApple
        },
        get isAndroid() {
          return isAndroid
        },
        get hasTouchpad() {
          return hasTouchpad()
        },
        viewPortWidth: computed(() => windowWidth.value),
        viewPortHeight: computed(() => windowHeight.value),
      }) as any

      window.addEventListener('resize', () => {
        windowWidth.value = window.innerWidth
        windowHeight.value = window.innerHeight
      })
    }
  }

  /**
   * Свойство с динамическими данными, специфичными для компонента
   * @private
   */
  private readonly __VSTBaseComponent: IVSTBaseBaseComponent = {} as IVSTBaseBaseComponent


  beforeCreateParent() { // @ts-ignore need always update
    this['__VSTBaseComponent'] = {
      hammer: [],
      endCallbacks: [],
      keyBindingsCallbacks: {},
      clickTapComponentCallback: () => this.onComponentClickOrTap(),
    }
  }
  createdParent() { // @ts-ignore need always update
    this['__VSTBaseComponent'] = {
      hammer: [],
      endCallbacks: [],
      keyBindingsCallbacks: {},
      clickTapComponentCallback: () => this.onComponentClickOrTap(),
    }
    this.VST.$on('$VST.viewPortResize', this.onViewPortResize)
    this.hookWhenComponentDestroy(() => this.VST.$off('$VST.viewPortResize', this.onViewPortResize))
  }

  mountedParent() {
    if (this.$el instanceof HTMLElement) {
      this.__VSTBaseComponent.clickTapHammer = new this.VST.Hammer(this.$el)
      this.__VSTBaseComponent.clickTapHammer.on('tap', this.__VSTBaseComponent.clickTapComponentCallback)
    }
    this.updatedParent()
  }

  updatedParent() {
    if (this.__VSTBaseComponent.clickTapHammer) {
      this.__VSTBaseComponent.clickTapHammer.off('tap', () => this.__VSTBaseComponent.clickTapComponentCallback)
      this.__VSTBaseComponent.clickTapHammer.destroy()
      this.__VSTBaseComponent.clickTapHammer = new this.VST.Hammer(this.$el)
      this.__VSTBaseComponent.clickTapHammer.on('tap', () => this.__VSTBaseComponent.clickTapComponentCallback)
    }
    for (const h of this.__VSTBaseComponent?.hammer ?? []) {
      h.instance?.destroy?.()
      const el = this.$el?.querySelector?.(h.selector)
      if (el instanceof HTMLElement || el instanceof SVGElement) {
        h.instance = new this.VST.Hammer(el) as any
        h.instance!.on(h.event, h.callback as any)
      }
    }
  }

  beforeUnmountParent() {
    for (const callback of this.__VSTBaseComponent?.endCallbacks ?? []) callback()
    for (let hk in this.__VSTBaseComponent.keyBindingsCallbacks ?? {}) {
      delete $VST.__REGISTERED_HOTKEYS[hk]
    }
    this.__VSTBaseComponent.clickTapHammer?.destroy?.()
    for (const h of this.__VSTBaseComponent?.hammer ?? []) {
      h.instance?.off?.(h.event, h.callback as any)
      h.instance?.destroy?.()
    }
  }

  registerReactiveEvent(event: BaseComponentEvents, componentSelector: string, callback: (e: BaseComponentEventInput) => any) {
    this.nextTick(() => {
      const el = this.$el?.querySelector?.(componentSelector)
      let hammer
      if (el instanceof HTMLElement || el instanceof SVGElement) {
        hammer = new this.VST.Hammer(el) as any
        hammer.on(event, callback)
      }
      this.__VSTBaseComponent.hammer.push({
        event,
        callback,
        instance: hammer,
        selector: componentSelector,
      })
    })
  }

  onViewPortResize() {

  }
  onComponentClickOrTap() {}

  hookWhenComponentDestroy(end: () => any): void {
    this.__VSTBaseComponent.endCallbacks.push(end)
  }

  registerHotKey(key:
     '1'|'2'|'3'|'4'|'5'|'6'|'7'|'8'|'9'|'-'|'='|'q'|'w'|'e'|'r'|'t'|'y'|'u'|'i'|'o'|'p'|'['|']'|'a'|'s'|'d'|
     'f'|'g'|'h'|'j'|'k'|'l'|';'|"'"|'\\'|'z'|'x'|'c'|'v'|'b'|'n'|'m'|','|'.'|'/'|'f1'|'f2'|'f3'|'f4'|'f5'|'f6'|
     'f7'|'f8'|'f9'|'f10'|'f11'|'f12',
   callback: (e: Event) => any,
   ctrlOrCommand: boolean,
   alt: boolean,
   shift: boolean,
  ): void {
    const k = `${key}_${ctrlOrCommand ? 1 : 0}_${alt ? 1 : 0}_${shift ? 1 : 0}`
    this.__VSTBaseComponent.keyBindingsCallbacks[k] = $VST.__REGISTERED_HOTKEYS[k] = {
      callback,
      ctrlOrCommand,
      alt,
      shift
    }
  }
}

interface IVSTBaseBaseComponent {
  hammer: {
    instance?: IHammerManager
    event: BaseComponentEvents
    selector: string
    callback: (e: BaseComponentEventInput) => void
  }[]
  clickTapHammer?: IHammerManager
  endCallbacks: (() => any)[]
  clickTapComponentCallback: (() => any)
  keyBindingsCallbacks: {[key:string]:{
    callback: (e: Event) => any
    ctrlOrCommand: boolean
    alt: boolean
    shift: boolean
  }}
}
</script>
