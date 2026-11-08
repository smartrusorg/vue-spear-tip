/**
 * Геометрия вьюпорта: единый источник размеров и «устоявшегося» сигнала.
 *
 * Зачем отдельный класс. `resize`/`orientationchange` приходят серией и ДО того, как
 * браузер довёл layout до финальных размеров (iOS Safari при повороте присылает
 * промежуточные `innerWidth`/`innerHeight`). Компонент, который считает геометрию прямо
 * в обработчике `resize`, получает промежуточные числа и «залипает» с ними до
 * следующего события — отсюда визуальные сдвиги «через раз».
 *
 * Контракт (события шины VST):
 *  - `$VST.viewPortResize`      — как было: на каждое событие окна (троттлинг по кадру);
 *  - `$VST.viewPortModeChange`  — сменились режим (mobile/tablet/notebook/desktop) или
 *    ориентация: сброс состояний панелей, «какие ветки UI включены»;
 *  - `$VST.viewPortSettled`     — размеры устоялись (тишина `SETTLE_DELAY` после последнего
 *    события) и Vue уже применил классы режима: только здесь можно мерить DOM и писать высоты.
 *
 * Единицы измерения. `width`/`height` — visual viewport (`window.inner*`), `layoutWidth`/
 * `layoutHeight` — layout viewport (`document.documentElement.client*`).
 * `getBoundingClientRect()` отдаёт координаты layout-вьюпорта: смешивать оба набора
 * в одной формуле (высота от `innerHeight`, а верх — от `rect.top`) нельзя.
 */

/** Режим экрана — по тем же порогам, что `$reactive.isMobile/isTablet/isNotebook/isDesktop` */
export type ViewPortMode = 'mobile' | 'tablet' | 'notebook' | 'desktop'

/** Ориентация окна */
export type ViewPortOrientation = 'portrait' | 'landscape'

export interface IViewPortInfo {
  /** Ширина visual viewport (`window.innerWidth`) */
  width: number
  /** Высота visual viewport (`window.innerHeight`) */
  height: number
  /** Ширина layout viewport (`documentElement.clientWidth`) */
  layoutWidth: number
  /** Высота layout viewport (`documentElement.clientHeight`) */
  layoutHeight: number
  /** Режим экрана */
  mode: ViewPortMode
  /** Ориентация */
  orientation: ViewPortOrientation
  /** Номер «устоявшегося» состояния: растёт на каждый settled */
  sequence: number
}

export interface IViewPort {
  start(): void
  stop(): void
  info(): IViewPortInfo
}

/** Порог «мобилы» по ширине (`$reactive.isMobile`, первая часть условия) */
const MOBILE_WIDTH = 768
/** Порог «мобилы» по высоте (узкое/низкое окно) */
const MOBILE_HEIGHT = 768
/** Ширина, до которой низкое окно всё ещё считается мобилой (телефон в ландшафте) */
const MOBILE_LANDSCAPE_WIDTH = 1000
const TABLET_WIDTH = 1280
const NOTEBOOK_WIDTH = 1366

export default class ViewPort implements IViewPort {
  /**
   * Тишина после последнего события, мс.
   * На iOS поворот «доигрывает» раскладку 100–200 мс: короткая пауза ловит промежуточный
   * layout, длинная — заметная задержка перерисовки.
   */
  static readonly SETTLE_DELAY = 150

  private readonly emit: (event: string, payload?: any) => void
  private readonly listeners: {target: any; type: string; handler: (e: any) => void}[] = []
  private settleTimer: number = 0
  private resizeFrame: number = 0
  private settleFrame: number = 0
  private sequence: number = 0
  private mode: ViewPortMode = 'desktop'
  private orientation: ViewPortOrientation = 'landscape'
  private started: boolean = false

  constructor(emit: (event: string, payload?: any) => void) {
    this.emit = emit
    // Стартовое состояние запоминаем, чтобы первый settled не считался сменой режима.
    const start = this.read()
    this.mode = start.mode
    this.orientation = start.orientation
  }

  /** Режим экрана по размерам окна (пороги совпадают с `$reactive`). */
  static mode(width: number, height: number): ViewPortMode {
    if (width < MOBILE_WIDTH || (height < MOBILE_HEIGHT && width < MOBILE_LANDSCAPE_WIDTH)) {
      return 'mobile'
    }
    if (width < TABLET_WIDTH) return 'tablet'
    if (width <= NOTEBOOK_WIDTH) return 'notebook'
    return 'desktop'
  }

  /** Текущая геометрия (без ожидания settled). */
  info(): IViewPortInfo {
    return {...this.read(), sequence: this.sequence}
  }

  start(): void {
    if (this.started || typeof window === 'undefined') return
    this.started = true
    this.listen(window, 'resize', () => this.onEvent())
    // iOS: `orientationchange` приходит до/вместо resize, размеры к этому моменту уже новые.
    this.listen(window, 'orientationchange', () => this.onEvent())
    // Схлопывание панели браузера на мобиле: меняется именно visual viewport.
    this.listen(window.visualViewport, 'resize', () => this.onEvent())
    // Возврат на вкладку: пока она была скрыта, окно могло измениться без событий.
    this.listen(document, 'visibilitychange', () => {
      if (!document.hidden) this.onEvent()
    })
  }

  stop(): void {
    this.listeners.forEach(({target, type, handler}) => target?.removeEventListener?.(type, handler))
    this.listeners.length = 0
    if (this.settleTimer) clearTimeout(this.settleTimer)
    if (this.resizeFrame) cancelAnimationFrame(this.resizeFrame)
    if (this.settleFrame) cancelAnimationFrame(this.settleFrame)
    this.settleTimer = this.resizeFrame = this.settleFrame = 0
    this.started = false
  }

  private listen(target: any, type: string, handler: (e: any) => void): void {
    if (!target?.addEventListener) return
    target.addEventListener(type, handler, {passive: true})
    this.listeners.push({target, type, handler})
  }

  private read(): Omit<IViewPortInfo, 'sequence'> {
    const width = window.innerWidth
    const height = window.innerHeight
    const root = document.documentElement
    return {
      width,
      height,
      layoutWidth: root?.clientWidth || width,
      layoutHeight: root?.clientHeight || height,
      mode: ViewPort.mode(width, height),
      orientation: width > height ? 'landscape' : 'portrait',
    }
  }

  /** Событие окна: «сырой» сигнал сразу (совместимость) + перезапуск ожидания тишины. */
  private onEvent(): void {
    if (this.resizeFrame) cancelAnimationFrame(this.resizeFrame)
    this.resizeFrame = requestAnimationFrame(() => {
      this.resizeFrame = 0
      this.emit('$VST.viewPortResize', this.info())
    })
    if (this.settleTimer) clearTimeout(this.settleTimer)
    this.settleTimer = window.setTimeout(() => this.settle(), ViewPort.SETTLE_DELAY)
  }

  /**
   * Размеры устоялись.
   *
   * 1) режим/ориентация изменились — сообщаем сразу: компоненты сбрасывают состояния,
   *    Vue в этом же такте (микрозадача) применит классы режима;
   * 2) `settled` отдаём через два кадра: к этому моменту раскладка пересчитана, и
   *    обработчик может безопасно мерить DOM и писать inline-высоты.
   */
  private settle(): void {
    this.settleTimer = 0
    const info = this.read()
    const modeChanged = info.mode !== this.mode || info.orientation !== this.orientation
    this.mode = info.mode
    this.orientation = info.orientation
    this.sequence++

    if (modeChanged) this.emit('$VST.viewPortModeChange', this.info())

    // Новое событие во время ожидания кадров отменит это сообщение (sequence изменится).
    const sequence = this.sequence
    if (this.settleFrame) cancelAnimationFrame(this.settleFrame)
    this.settleFrame = requestAnimationFrame(() => {
      this.settleFrame = requestAnimationFrame(() => {
        this.settleFrame = 0
        if (sequence !== this.sequence) return
        this.emit('$VST.viewPortSettled', this.info())
      })
    })
  }
}
