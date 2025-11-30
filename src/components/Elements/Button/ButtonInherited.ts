import {VueClass, Prop, Watch} from '../../../core'
import BaseComponent from '../../BaseComponent.vue'

export default abstract class ButtonInherited extends BaseComponent {
  emits = [
    'click',
    'touchstart',
    'touchend',
    'mousedown',
    'mouseup',
    'clickTap',
    'clickTouch',
    'clickOrTouchstart',
    'clickOrTouchend',
    'mousedownOrTouchstart',
    'mouseupOrTouchend',
    'keydownEnter',
  ]
  @Prop(String) readonly icon: string = ''
  @Prop(String) readonly iconRight: string = ''
  @Prop(String) readonly badge: string = ''
  @Prop(String) readonly badgeBg: string | null = null
  @Prop(String) readonly badgeColor: string | null = null
  @Prop(Object) readonly style: Partial<CSSStyleDeclaration> = {}
  
  @Prop(String, null) readonly bg: string | null = null
  @Prop(String, null) readonly color: string | null = null
  @Prop(String, null) readonly borderColor: string | null = null
  @Prop(String, null) readonly bgActive: string | null = null
  @Prop(String, null) readonly colorActive: string | null = null
  @Prop(String, null) readonly colorHover: string | null = null
  @Prop(String, null) readonly borderColorActive: string | null = null
  @Prop(String, null) readonly boxShadowColor: string | null = null
  
  @Prop(String) readonly fontSize: string | null = '1rem'
  @Prop(String) readonly size: string | null = 'lg'
  @Prop(String) readonly fontFamily: string | null = null
  
  // @Prop(String) readonly bgHover: string = '#333'
  
  @Prop(String) readonly bgGradientTop: string | null = null // '#d2d2d2'
  @Prop(String) readonly bgGradientBottom: string | null = null // '#ccc'
  @Prop(Boolean) readonly disabled: boolean = false
  @Prop(Boolean) readonly shine: boolean = false
  @Prop(String) readonly type: string = 'button'
  
  @Prop(String) readonly title: string | null = null
  @Prop(String) readonly disabledTitle: string | null = null
  @Prop(String) readonly dataTheme: string = 'black'
  @Prop(String) readonly dataDisabledTheme: string = 'gray'
  @Prop(String) readonly dataPlacement: string = 'top'
  @Prop(String) readonly dataOffset: string = 'top'
  @Prop(String) readonly width: string = 'calc(100% - 8px)'
  @Prop(String) readonly borderRadius: string = '3px'
  /** Открыть ссылку при нажатии, если начинается с http или https будет открыто в новом окне */
  @Prop(String) readonly link: string | null = null
  /** Для открытия локальных ссылок в новом окне и внешних в текущем, будет проигнорирован при указанном link */
  @Prop(String) readonly linkRevert: string | null = null
  
  @Prop(String, null) readonly theme:
    'success' | 'default' | 'primary' | 'warning' | 'danger' | 'info' | 'pink' | 'purple' | 'indigo' | 'grey' | 'white' |
    'yellow' | 'black' | null = 'default'
  
  backgroundCss: string = ''
  boxShadowCss: string = ''
  isOnHover: boolean = false
  isButtonActive: boolean = false
  randomClass: string = ''
  dataThemeInner: string = ''
  showButton: boolean = true
  
  currentBg: string | null = null
  currentColor: string | null = null
  currentColorHover: string | null = null
  currentBorderColor: string | null = null
  currentBgActive: string | null = null
  currentBorderColorActive: string | null = null
  currentBoxShadowColor: string | null = null
  currentColorActive: string | null = null
  innerTitle: string | null = null
  hasTouchpad: boolean = false // TODO добавить проверку и Hammer
  mountedParent() {
    // this.showButton = true
    this.randomClass = 'button-c'+Math.random().toString().split('.')[1]
    this.updateTheme()
    if (this.$refs?.button){ // @ts-ignore
      // const hammer = new window['Hammer'](this.$refs?.button)
      // hammer.off('tap')
      // hammer.on('tap', (e: any) => {
      //   if (this.hasTouchpad) {
      //     this.$emit('clickTap', e, this)
      //     if (
      //       (this.link && (this.link?.startsWith('http') || this.link?.startsWith('//')))
      //       || (
      //         this.link && this.linkRevert && !this.linkRevert?.startsWith('http') && !this.linkRevert?.startsWith('//')
      //       )
      //     ) {
      //       this.$refs.link?.click()
      //     }
      //     else if (this.link || this.linkRevert) {
      //       Engine.openPage(this.link || this.linkRevert!)
      //     }
      //   }
      // })
    }
  }
  
  declare $refs: {
    button: HTMLButtonElement
    link: HTMLLinkElement
  }
  
  updateTheme() {
    const bg: string = '#ccc'
    const color: string = '#000'
    const borderColor: string = '#cacaca'
    const bgActive: string = '#ccc'
    const borderColorActive: string = '#b6b6b6'
    const currentBoxShadowColor: string = '#5b5a5a'
    const colorActive: string | null = null
    this.currentBgActive
    this.currentBorderColor = this.currentColor = this.currentBg = this.currentColorActive = null
    if (this.theme == 'primary'){
      this.currentBg = '#005bbf'
      this.currentColor = '#fff'
      this.currentBorderColor = '#0367d5'
      this.currentBgActive = '#005fc8'
      this.currentBorderColorActive = '#0871e3'
      this.currentBoxShadowColor = '#065e8d'
      this.currentColorActive = '#fff'
      this.currentColorHover = '#fff'
    }
    if (this.theme == 'success'){
      this.currentBg = '#0aa86d'
      this.currentColor = '#fff'
      this.currentBorderColor = '#24a876'
      this.currentBgActive = '#0b9762'
      this.currentBorderColorActive = '#0b9762'
      this.currentBoxShadowColor = '#31735b'
      this.currentColorActive = '#fff'
      this.currentColorHover = '#fff'
    } else if (this.theme == 'danger'){
      this.currentBg = '#FF3B30'
      this.currentColor = '#fff'
      this.currentBorderColor = '#FF3B30'
      this.currentBgActive = '#FF3B30'
      this.currentBorderColorActive = '#FF3B30'
      this.currentBoxShadowColor = '#ff8179'
      this.currentColorActive = '#fff'
      this.currentColorHover = '#fff'
    } else if (this.theme == 'pink'){
      this.currentBg = '#ff6161'
      this.currentColor = '#fff'
      this.currentBorderColor = '#ff4741c9'
      this.currentBgActive = '#ff6a60'
      this.currentBorderColorActive = '#ff4141'
      this.currentBoxShadowColor = '#ff6a60'
      this.currentColorActive = '#fff'
      this.currentColorHover = '#fff'
    } else if (this.theme == 'warning'){
      this.currentBg = '#FF9500'
      this.currentColor = '#fff'
      this.currentBorderColor = '#FF9500'
      this.currentBgActive = '#ffb546'
      this.currentBorderColorActive = '#ffb546'
      this.currentBoxShadowColor = '#ffbe64'
      this.currentColorActive = '#fdff98'
      this.currentColorHover = '#fff8e8'
    } else if (this.theme == 'info'){
      this.currentBg = '#78d9ff'
      this.currentColor = '#203464'
      this.currentColorHover = '#34aff1'
      this.currentBorderColor = '#3db0ee'
      this.currentBgActive = '#78d9ff'
      this.currentBorderColorActive = '#78d9ff'
      this.currentBoxShadowColor = '#78d9ff'
      this.currentColorActive = '#fff'
      this.currentColorHover = '#304460'
    } else if (this.theme == 'yellow'){
      this.currentBg = '#ffd900'
      this.currentColor = '#444'
      this.currentBorderColor = '#ffd900'
      this.currentBgActive = '#ffc400'
      this.currentBorderColorActive = '#f3c922'
      this.currentBoxShadowColor = '#cac838'
      this.currentColorActive = '#fff'
    } else if (this.theme == 'white'){
      this.currentBg = '#ffffff'
      this.currentColor = '#444'
      this.currentColorHover = '#164205'
      this.currentBorderColor = '#cacaca'
      this.currentBgActive = '#efede7'
      this.currentBorderColorActive = '##cacaca'
      this.currentBoxShadowColor = '#b3b3ab'
      this.currentColorActive = '#164205'
    } else if (this.theme == 'purple'){
      this.currentBg = '#942cdd'
      this.currentColor = '#fff'
      this.currentColorHover = '#e7c0ff'
      this.currentBorderColor = '#a539f3'
      this.currentBgActive = '#b755ff'
      this.currentBorderColorActive = '#b755ff'
      this.currentBoxShadowColor = '#7f18c5'
      this.currentColorActive = '#ffffff'
    } else if (this.theme == 'indigo'){
      this.currentBg = '#5b2cdd'
      this.currentColor = '#fff'
      this.currentColorHover = '#e7c0ff'
      this.currentBorderColor = '#6b39f3'
      this.currentBgActive = '#8855ff'
      this.currentBorderColorActive = '#6f55ff'
      this.currentBoxShadowColor = '#5a18c5'
      this.currentColorActive = '#ffffff'
    } else if (this.theme == 'black'){
      this.currentBg = '#32383e'
      this.currentColor = '#fff'
      this.currentColorHover = '#ebf8b3'
      this.currentBorderColor = '#32383e'
      this.currentBgActive = '#3b4249'
      this.currentBorderColorActive = '#3b4249'
      this.currentBoxShadowColor = '#32383e'
      this.currentColorActive = '#ffffff'
    } else if (this.theme == 'grey'){
      this.currentBg = '#5f6163'
      this.currentColor = '#fff'
      this.currentColorHover = '#cec6c4'
      this.currentBorderColor = '#898d90'
      this.currentBgActive = '#878c92'
      this.currentBorderColorActive = '#686c71'
      this.currentBoxShadowColor = '#626a71'
      this.currentColorActive = '#ffffff'
    }
    this.currentBg = this.bg ?? (this.currentBg ?? bg)
    this.currentColor = this.color ?? (this.currentColor ?? color)
    this.currentBorderColor = this.borderColor ?? (this.currentBorderColor ?? borderColor)
    this.currentBgActive = this.bgActive ?? (this.currentBgActive ?? bgActive)
    this.currentBorderColorActive = this.borderColorActive ?? (this.currentBorderColorActive ?? borderColorActive)
    this.currentBoxShadowColor = this.boxShadowColor ?? (this.currentBoxShadowColor ?? currentBoxShadowColor)
    this.currentColorActive = this.colorActive ?? (this.currentColorActive ?? colorActive)
    this.boxShadowCss = this.disabled ? 'box-shadow: none' : `box-shadow: 0px 1px 2px 0px ${this.currentBoxShadowColor}`
    
    this.dataThemeInner = this.disabled ? this.dataDisabledTheme : this.dataTheme
    this.backgroundCss = 'background: ' + (
      this.bgGradientTop && this.bgGradientBottom
        ? `linear-gradient(to bottom, ${this.bgGradientTop}, ${this.bgGradientBottom})`
        : this.bg
    )
  }
  
  click(e: Event) {
    if (!this.disabled){
      this.$emit('click', e, this)
      if (!this.hasTouchpad){
        this.$emit('clickTouch', e, this)
        this.$emit('clickOrTouchstart', e, this)
        this.$emit('clickTap', e, this)
        if (
          (this.link && (this.link?.startsWith('http') || this.link?.startsWith('//')))
          || (
            this.link && this.linkRevert && !this.linkRevert?.startsWith('http') && !this.linkRevert?.startsWith('//')
          )
        ){
          this.$refs.link?.click()
        } else if (this.link || this.linkRevert){ // @ts-ignore
          window.pjax(this.link || this.linkRevert!)
        }
      }
    }
  }
  
  touchstart(e: Event) {
    if (!this.disabled){
      this.$emit('touchstart', e, this)
      if (this.hasTouchpad){
        this.$emit('clickTouch', e, this)
        this.$emit('clickOrTouchstart', e, this)
      }
    }
  }
  
  touchend(e: Event) {
    if (!this.disabled){
      this.$emit('touchend', e, this)
      if (!this.hasTouchpad){
        this.$emit('clickOrTouchend', e, this)
      }
    }
  }
  
  mouseup(e: Event) {
    if (!this.disabled){
      this.$emit('mouseup', e, this)
      this.$emit('mouseupOrTouchend', e, this)
      this.$emit('clickOrTouchend', e, this)
    }
  }
  
  mousedown(e: Event) {
    if (!this.disabled){
      this.$emit('mousedown', e, this)
      // if (this.hasTouchpad) {
      this.$emit('mousedownOrTouchstart', e, this)
      // }
    }
  }
  
  keydownEnter(e: Event) {
    if (!this.disabled){
      // this.$emit('clickOrTouchstart', e, this)
      // this.$emit('clickOrTouchend', e, this)
      // this.$emit('mouseupOrTouchend', e, this)
      // this.$emit('mousedownOrTouchstart', e, this)
      this.$emit('keydownEnter', e, this)
    }
  }
  
  focus() {
    this.$refs?.button?.focus()
  }
  
  @Watch('theme') private _onThemeChanged() {
    this.updateTheme()
  }
  
  @Watch('title', false, true) private _onTitleChanged(title: string) {
    this.innerTitle = null
    if (title){
      this.nextTick(() => this.innerTitle = title)
    }
  }
  
  
  @Watch('disabled') private _onDisabledChanged(disabled: boolean) {
    this.dataThemeInner = disabled ? this.dataDisabledTheme : this.dataTheme
    this.showButton = false
    this.nextTick(() => this.showButton = true)
  }
}
