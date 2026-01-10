// biome-ignore assist/source/organizeImports: <Нужно для глобального экспорта>
import type {IVueClass} from './IVueClass'
import type {IGlobalVST} from './IGlobalVST'
import {HammerEvents, HammerInput} from './IHammer'

export default interface IBaseVueComponent extends IVueClass {
  readonly VST: IGlobalVST
  readonly $root: {
    [key:string]:any
  }
  /** Event on window change */
  onViewPortResize(): void
  
  /** Event when user click or tap on component. Generate @clickTap event by default. */
  onComponentClickOrTap(): void
  
  
  /**
   * Хук-синтаксический сахар, для группировки отписок пред размонтированием компонента.
   * @param end Метод, который будет выполнен, перед размонтированием.
   */
  hookWhenComponentDestroy(end: () => any): void
  
  /**
   * Регистрация события на сочетания клавиш. Заменит действие по умолчанию. Повторная регистрация комбинации
   * заменяет прошлую. Будет отключена при размонтировании или удалении компонента со страницы.
   * e.preventDefault() может привести к ошибкам
   * @param key Название клавиши на английском языке в нижнем регистре
   * @param callback Метод выполняющийся при нажатии клавиши
   * @param ctrlOrCommand Удерживается ли CTRL или COMMAND на Mac OS. По умолчанию отслеживание включено.
   * @param alt Удерживается ли alt
   * @param shift Удерживается ли shift
   * @protected
   * @example
   * this.registerHotKey('k', (e: KeyboardEvent) => console.log('CTRL+K pressed'))
   * this.registerHotKey('f', (e: KeyboardEvent) => console.log('ALT+F pressed'), false, false, true)
   * this.registerHotKey('f12', (e: KeyboardEvent) => console.log('CTRL+SHIFT+F12 pressed'), true, true)
   */
  registerHotKey(key:
     '1'|'2'|'3'|'4'|'5'|'6'|'7'|'8'|'9'|'-'|'='|'q'|'w'|'e'|'r'|'t'|'y'|'u'|'i'|'o'|'p'|'['|']'|'a'|'s'|'d'|
     'f'|'g'|'h'|'j'|'k'|'l'|';'|"'"|'\\'|'z'|'x'|'c'|'v'|'b'|'n'|'m'|','|'.'|'/'|'f1'|'f2'|'f3'|'f4'|'f5'|'f6'|
     'f7'|'f8'|'f9'|'f10'|'f11'|'f12',
   callback: (e: Event) => any,
   ctrlOrCommand: boolean,
   alt: boolean,
   shift: boolean,
  ): void
  
  /**
   * Регистрация пользовательских реактивных событий с автоматическим отключением при размонтировании
   * @param event Название события
   * @param componentSelector Селектор элемента, который будет захвачен при ренеринге/ререндеринге
   * @param callback
   */
  registerReactiveEvent(event: BaseComponentEvents, componentSelector: string, callback: () => any): void
}

type BaseComponentEvents = HammerEvents
interface BaseComponentEventInput extends HammerInput {}
export {BaseComponentEvents, BaseComponentEventInput}