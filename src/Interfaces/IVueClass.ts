import {LooseRequired} from '@vue/shared'
import {SetupContext, VNode} from '@vue/runtime-core'
import {VueClass} from '../core'
import {IFieldComponent} from './IFieldComponent'

/**
 * Наследуемый интерфейс компонента vue
 * @interface IVueClass
 * @typedef {Function} mounted Mount
 */
export interface IVueClass {
  readonly mixins: Array<any>
  readonly components: {[key:string|symbol|number]:any}
  readonly componentsParent: {[key:string|symbol|number]:any}
  readonly emits: Array<string>
  readonly emitsParent: Array<string>
  readonly inject: Array<string>
  readonly injectParent: Array<string>
  readonly provide: {[key:string]:any}
  readonly provideParent: {[key:string]:(...args: any) => any}
  
  /**
   * Название компонента. Определяется автоматически по названию класса если наследовать от IVueClass.
   */
  readonly name: string
  
  /**
   * Экземпляр класса. Учтите, что контекст this не будет содержать vue элементов.
   */
  readonly instance?: this
  
  /**
   * Содержит привязки атрибутов и события в родительском компоненте,
   * которые не были распознаны (и исключены) как
   * [входные параметры](https://v3.ru.vuejs.org/ru/api/options-data.html#props)
   * компонента или пользовательские события.
   * Если компонент не объявляет входные параметры или
   * [пользовательские события](https://v3.ru.vuejs.org/ru/api/options-data.html#emits),
   * тут будут все привязки из родительского компонента,
   * которые можно передать через v-bind="$attrs" внутреннему компоненту —
   * удобно при создании компонентов высшего порядка (HOC, High Order Components).
   *
   * **См. также**
   *
   * [$attrs](https://v3.ru.vuejs.org/ru/api/instance-properties.html#attrs)
   *
   * [Передача обычных атрибутов](https://v3.ru.vuejs.org/ru/guide/component-attrs.html)
   *
   * [Options API / Разное — inheritAttrs](https://v3.ru.vuejs.org/ru/api/options-misc.html#inheritattrs)
   */
  readonly $attrs: Object
  
  /**
   * Объект с данными, за которыми осуществляет наблюдение экземпляр компонента.
   * Экземпляр компонента проксирует доступ к свойствам объекта данных.
   *
   * **См. также**
   *
   * [$data](https://v3.ru.vuejs.org/ru/api/instance-properties.html#data)
   *
   * [Options API / Локальное состояние — data](https://v3.ru.vuejs.org/ru/api/options-data.html#data)
   */
  readonly $data: Object
  
  /**
   * Корневой элемент DOM, которым управляет экземпляр компонента.
   *
   * Для компонентов использующих [фрагменты](https://v3.ru.vuejs.org/ru/guide/migration/fragments.html),
   * `$el` будет узлом DOM, с помощью которого Vue будет отслеживать место компонента в DOM.
   * Рекомендуется использовать ссылки на элементы шаблона для доступа к элементам DOM напрямую,
   * а не полагаться на `$el`
   *
   * **См. также**
   *
   * [$el](https://v3.ru.vuejs.org/ru/api/instance-properties.html#el)
   */
  readonly $el: HTMLElement
  
  /**
   * Опции инициализации, используемые для текущего экземпляра компонента.
   * Полезно, если потребуется добавить пользовательские свойства в опции:
   *
   * **См. также**
   *
   * [$options](https://v3.ru.vuejs.org/ru/api/instance-properties.html#options)
   */
  readonly $options: {
    __scopeId: string
    __file: string
  }
  
  /**
   * Родительский экземпляр, если таковой имеется
   *
   * **См. также**
   *
   * [$parent](https://v3.ru.vuejs.org/ru/api/instance-properties.html#parent)
   */
  readonly $parent: IVueClass|null
  
  /**
   * Объект, содержащий текущие входные параметры, которые получил компонент.
   * Экземпляр компонента проксирует доступ к свойствам объекта входных параметров.
   *
   * **См. также**
   *
   * [$props](https://v3.ru.vuejs.org/ru/api/instance-properties.html#props)
   */
  readonly $props: {[key:string]:any}
  
  /**
   * Объект из DOM-элементов и экземпляров компонентов, зарегистрированных с помощью
   * [атрибутов ref](https://v3.ru.vuejs.org/ru/guide/component-template-refs.html).
   *
   * **См. также**
   *
   * [Ссылки на элементы шаблона](https://v3.ru.vuejs.org/ru/guide/component-template-refs.html)
   * [Специальные атрибуты — ref](https://v3.ru.vuejs.org/ru/api/special-attributes.html#ref)
   */
  readonly $refs: {
    [key:string]:HTMLElement|HTMLInputElement|undefined|
    HTMLElement[]|HTMLInputElement[]|IVueClass|typeof VueClass|VueClass
    |IFieldComponent[]|IFieldComponent
  }
  
  /**
   * Экземпляр корневого компонента текущего дерева компонентов.
   * Если у текущего экземпляра нет родителя, то значением будет он сам.
   */
  readonly $root: {
    // [key:string]:any
    readonly APP?: any
  }|this|any
  
  /**
   * Используется для программного доступа к содержимому, распределяемому с помощью слотов.
   * Каждый именованный слот имеет соответствующее свойство
   * (например, содержимое v-slot:foo будет доступно через this.$slots.foo()).
   */
  readonly $slots: {
    default: () => VNode[]
  } & {
    [key: string]: (() => VNode[]) | undefined
  }
  
  /**
   * Генерирует событие на текущем экземпляре.
   * Любые дополнительные аргументы будут переданы в callback функции прослушивания события.
   * @param {String} eventName Название события
   * @param {*} args Аргументы передаваемые в него
   */
  $emit(eventName: string, ...args: any[]): void
  
  /**
   * Откладывает вызов коллбэка до следующего цикла обновления DOM.
   * @param {Function} callback
   */
  $forceUpdate(callback?: Function): void
  
  /**
   * Отслеживание изменений реактивного свойства или функции вычисляемого свойства.
   * @param {String} source
   * @param {Function} callback
   * @param {VueWatchOptions} options
   */
  $watch(source?: string | Function, callback?: Function | object, options?: VueWatchOptions): void
  
  /**
   * Откладывает вызов коллбэка до следующего цикла обновления DOM.
   * @param {Function} callback
   */
  $nextTick(callback?: Function): void
  
  /** Параметры vue компонента */
  readonly $: {
    [key: string]: any,
    uid: number,
    app: {
      [key: string]: any,
      appContext: {
        [key: string]: any,
        version: string
      }
    },
    vnode: {
      [key: string]: any,
      scopeId: string,
    }
  }
  
  
  // Хуки жизненного цикла
  setup(
    props?: LooseRequired<Readonly<{}> & Readonly<{[x: `on${Capitalize<string>}`]: ((...args: any[]) => any) | undefined}> & {}>,
    context?: SetupContext,
    self?: IVueClass
  ): {[k:string]:any}|void
  beforeCreate(): void
  created(): void
  beforeMount(): void
  mounted(): void
  beforeUpdate(): void
  updated(): void
  beforeUnmount(): void
  unmounted(): void
  
  // Родительские хуки
  setupParent(
    props?: LooseRequired<Readonly<{}> & Readonly<{[x: `on${Capitalize<string>}`]: ((...args: any[]) => any) | undefined}> & {}>,
    context?: SetupContext,
    self?: IVueClass
  ): {[k:string]:any}|void
  beforeCreateParent(): void
  createdParent(): void
  beforeMountParent(): void
  mountedParent(): void
  beforeUpdateParent(): void
  updatedParent(): void
  beforeUnmountParent(): void
  unmountedParent(): void
  
  /**
   * Рекурсивный пропуск шагов
   * @param {Function} callback
   * @param {Number} steps Количество шагов (тиков, смен сцен), которые нужно пропустить
   */
  nextTick(callback: () => void, steps?: number): void
  
  /**
   * Проверка наличия внешнего обработчика события
   * @param name
   */
  hasExternalHandlerEvent(name: string): boolean
}

export interface VueWatchOptions {
  deep?: boolean,
  immediate?: boolean,
  once?: boolean,
  flush?: string,
}
