<script lang="ts">
import {reactive} from 'vue'
import IBaseVueComponent from '../Interfaces/IBaseVueComponent'
import {VueClass} from '../core'
import {IGlobalVST} from '../Interfaces/IGlobalVST'

/** Base component */
export default abstract class BaseComponent extends VueClass implements IBaseVueComponent {
  readonly VST: IGlobalVST
  emitsParent = ['update:modelValue']
  declare readonly $root: {
    [key: string]: any
  }
  constructor() {
    super()
    this.VST = globalThis.$VST
    this.VST.$r = reactive({
      locale: (Intl ? ((new Intl.DateTimeFormat())?.resolvedOptions?.()?.locale) : navigator.language) || 'en',
      isMobile: false,
      isTablet: false,
      isNotebook: false,
      isDesktop: false,
      viewPortType: (window.innerWidth < 768) ? 'mobile' : (
          (window.innerWidth < 1280)
              ? 'tablet'
              : (
                  (window.innerWidth < 1366)
                      ? 'notebook'
                      : 'desktop'
              )
      ),
      viewPortWidth: window.innerWidth,
      viewPortHeight: window.innerHeight,
    }) as any

  }
  createdParent() {
    this.VST.$on('$VST.viewPortResize', _VST_BaseComponentEventHelper.onWindowResizeCallback.bind(this))
    _VST_BaseComponentEventHelper.onWindowResizeCallback.bind(this)()
  }

  mountedParent() {

  }
  beforeUnmountParent() {
    this.VST.$off('$VST.viewPortResize', _VST_BaseComponentEventHelper.onWindowResizeCallback.bind(this))
  }
  onViewPortResize() {}
}

const _VST_BaseComponentEventHelper: {
  [k:string]: any
  VST: IGlobalVST
  onViewPortResize(): void
} = {
  onWindowResizeCallback(event?: Event) {
    this.VST.$r.viewPortWidth = window.innerWidth
    this.VST.$r.viewPortHeight = window.innerHeight
    this.VST.$r.isMobile = false
    this.VST.$r.isTablet = false
    this.VST.$r.isNotebook = false
    this.VST.$r.isDesktop = false

    if(this.VST.$r.viewPortWidth < 768) {
      this.VST.$r.isMobile = true
      this.VST.$r.viewPortType = 'mobile'
    }
    else if(this.VST.$r.viewPortWidth < 1280) {
      this.VST.$r.isTablet = true
      this.VST.$r.viewPortType = 'tablet'
    }
    else if(this.VST.$r.viewPortWidth <= 1366) {
      this.VST.$r.isNotebook = true
      this.VST.$r.viewPortType = 'notebook'
    }
    else if(this.VST.$r.viewPortWidth > 1366) {
      this.VST.$r.isDesktop = true
      this.VST.$r.viewPortType = 'desktop'
    }
    this.onViewPortResize()
  },
  VST: {} as IGlobalVST,
} as any
</script>
