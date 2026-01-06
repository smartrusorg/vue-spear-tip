import {Temporal} from 'temporal-polyfill'
import IDeviceInfo from './IDeviceInfo'
import IHammer from './IHammer'

export interface IGlobalVST {
  /** Параметры, которые будут отработаны реактивно внутри шаблонов */
  $reactive: IGlobalReactiveElements
  
  /**
   * Подписаться на событие
   * @param event
   * @param callback
   */
  $on(event: string, callback: (message: any) => any): void
  
  /**
   * Отписаться от события
   * @param event
   * @param callback
   */
  $off(event: string, callback: (message: any) => any): void
  
  /**
   * Эмиттировать событие (запустить)
   * @param event
   * @param message
   */
  $emit(event: string, message?: any): void
  
  /**
   * Работа со временем
   * @param dateTimeString
   * @param timeZone
   * @constructor
   */
  DT(dateTimeString?: string|number|Temporal.ZonedDateTime|Date, timeZone?: string): Temporal.ZonedDateTime
  
  /**
   * Скопировать текст в буфер обмена
   * @param text
   */
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
  
  /** Информация об устройстве  */
  device(): IDeviceInfo
  
  /** Default time zone on $VST.DT() method (like Europe/Moscow). As default use browser tz */
  DT_TZ?: string
  
  /** Класс для обработки событий на базе Hammer.js */
  readonly Hammer: IHammer
  
  /** Зарегистрированные замыкания на горячие клавиши внутри компонентов. Системное свойство. */
  readonly __REGISTERED_HOTKEYS: {
    [k:string]: {
      callback: (e: KeyboardEvent) => void
      ctrlOrCommand: boolean
      alt: boolean
      shift: boolean
    }
  }
}

/** Интерфейс реактивных глобальных элементов доступных в любом компоненте наследуемым от BaseComponent */
interface IGlobalReactiveElements {
  /** Локаль браузера */
  readonly locale: string
  /** Отображается ли компонент в мобильной версии экрана */
  readonly isMobile: boolean
  /** Отображается ли компонент в планшетной версии экрана */
  readonly isTablet: boolean
  /** Отображается ли компонент в версии экрана для ноутбука */
  readonly isNotebook: boolean
  /** Отображается ли компонент в планшетной версии экрана */
  readonly isDesktop: boolean
  /** Присутствует ли тачпад */
  readonly hasTouchpad: boolean
  /** Определено ли устройство как iPhone */
  readonly isIphone: boolean
  /** Определено ли устройство как Apple (используется WebKit движок) */
  readonly isApple: boolean
  /** Определено ли устройство как Android */
  readonly isAndroid: boolean
  /** Тип экрана пользователя */
  readonly viewPortType: 'mobile'|'tablet'|'notebook'|'desktop'
  /** Длина экрана пользователя в пикселях */
  readonly viewPortWidth: number
  /** Высота экрана пользователя в пикселях */
  readonly viewPortHeight: number
}
