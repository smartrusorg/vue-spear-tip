import {Temporal} from 'temporal-polyfill'

export interface IGlobalVST {
  $r: IGlobalReactiveElements
  $on(event: string, callback: (message: any) => any): void
  $off(event: string, callback: (message: any) => any): void
  $emit(event: string, message?: any): void
  DT(dateTimeString?: string|number|Temporal.ZonedDateTime|Date, timeZone?: string): Temporal.ZonedDateTime
  copyToClipboard(text: string): void
  /**
   * Генерация случайного сложного пароля
   * @param length Длина, по умолчанию 18
   */
  generateSecurePassword(length?: number): string
  /**
   * Генерация случайного ключа
   * @param length
   */
  generateRandomKey(length?: number): string
  
  /**
   * Сериализация данных с исключением рекурсий
   * @param any
   */
  safeStringify(any: any): string
  
  /** Default time zone on $VST.DT() method (like Europe/Moscow). As default use browser tz */
  DT_TZ?: string
}

/** Интерфейс реактивных глобальных элементов доступных в любом компоненте наследуемым от BaseComponent */
interface IGlobalReactiveElements {
  locale: string
  isMobile: boolean
  isTablet: boolean
  isNotebook: boolean
  isDesktop: boolean
  /** Тип экрана пользователя */
  viewPortType: 'mobile'|'tablet'|'notebook'|'desktop'
  /** Длина экрана пользователя в пикселях */
  viewPortWidth: number
  /** Высота экрана пользователя в пикселях */
  viewPortHeight: number
}