<script lang="ts">
import {reactive, computed, ref} from 'vue'
import IBaseVueComponent from '../Interfaces/IBaseVueComponent'
import {VueClass} from '../core'
import {IGlobalVST} from '../Interfaces/IGlobalVST'

/** Base component */
export default abstract class BaseComponent extends VueClass implements IBaseVueComponent {
  readonly VST: IGlobalVST
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
      const isIphone =
      this.VST.device().osName()?.toLowerCase().includes('ios')
        || this.VST.device().deviceModel()?.toLowerCase().includes('iphone')
        || (
          this.VST.device().browserEngine()?.toLowerCase().includes('safari')
          && this.VST.device().device() == 'mobile'
        )

      this.VST.$reactive = reactive({
        locale: (Intl ? ((new Intl.DateTimeFormat())?.resolvedOptions?.()?.locale) : navigator.language) || 'en',
        isMobile: computed(() => windowWidth.value < 768),
        isTablet: computed(() => windowWidth.value < 1280 && windowWidth.value >= 768),
        isNotebook: computed(() => windowWidth.value <= 1366 && windowWidth.value >= 1280),
        isDesktop: computed(() => windowWidth.value > 1366),
        viewPortType: computed(() => (windowWidth.value < 768) ? 'mobile' : (
          (windowWidth.value < 1280)
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
          return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || (navigator as any).msMaxTouchPoints > 0
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
  private ___VST_BASE: {
    endCallbacks: (() => any)[]
    keyBindingsCallbacks: {[key:string]:{
      callback: (e: Event) => any,
      ctrlOrCommand: boolean,
      alt: boolean,
      shift: boolean,
    }}
  } = {} as BaseComponent['___VST_BASE']

  createdParent() {
    this.___VST_BASE = {
      endCallbacks: [],
      keyBindingsCallbacks: {},
    }

    this.VST.$on('$VST.viewPortResize', this.onViewPortResize)
    this.hookWhenComponentDestroy(() => this.VST.$off('$VST.viewPortResize', this.onViewPortResize))
  }

  mountedParent() {
    if (this.$el instanceof HTMLElement) {
      const componentHammer = new this.VST.Hammer(this.$el)
      componentHammer.on('tap', () => this.onComponentClickOrTap())
      this.hookWhenComponentDestroy(() => componentHammer.destroy())
    }
  }

  beforeUnmountParent() {
    for (const callback of this.___VST_BASE?.endCallbacks ?? []) callback()
    for (let hk in this.___VST_BASE.keyBindingsCallbacks ?? {}) { // @ts-ignore
      delete $VST.__REGISTERED_HOTKEYS[hk]
    }
  }

  onViewPortResize() {

  }
  onComponentClickOrTap() {
    this.$emit('clickTap', this.$el)
  }

  hookWhenComponentDestroy(end: () => any): void {
    this.___VST_BASE.endCallbacks.push(end)
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
    this.___VST_BASE.keyBindingsCallbacks[k] = $VST.__REGISTERED_HOTKEYS[k] = {
      callback,
      ctrlOrCommand,
      alt,
      shift
    }
  }
}
</script>
