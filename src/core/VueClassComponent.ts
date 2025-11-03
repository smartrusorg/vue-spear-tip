import {defineComponent, getCurrentInstance, nextTick} from 'vue' // @ts-ignore
import VueClass from "./VueClass.ts"
import {VSTType} from './index'

/**
 * Параметры readonly из экземпляра vue
 */
const vueDefaultProps = [
  '$attrs', '$data', '$el', '$off', '$on','$emit',  '$forceUpdate',
  '$nextTick', '$options', '$parent', '$props',  '$refs',
  '$root', '$slots', '$watch'
]

type VueProps = {
  /** Название компонента */
  name?: string
}

// Объявляем типы для глобального хранилища
declare global {
  var $VST: VSTType
}

// Инициализация глобальных объектов, если они не существуют
if (typeof globalThis.$VST === 'undefined') {
  globalThis.$VST = {} as any
}
if (typeof globalThis.$VST._dynamic === 'undefined') {
  globalThis.$VST._dynamic = {} as any
}
if (typeof globalThis.$VST._dynamic._vueClassInstances === 'undefined') {
  globalThis.$VST._dynamic._vueClassInstances = {}
}
if (typeof globalThis.$VST._dynamic._vueClassProps === 'undefined') {
  globalThis.$VST._dynamic._vueClassProps = {}
}
if (typeof globalThis.$VST._dynamic._vueClassWatchers === 'undefined') {
  globalThis.$VST._dynamic._vueClassWatchers = {}
}
if (typeof globalThis.$VST._dynamic._vueComputed === 'undefined') {
  globalThis.$VST._dynamic._vueComputed = {}
}

/**
 * Декоратор для создания компонента на основе класса VueClass
 * @param options - опции компонента или конструктор класса
 * @example
 * \@VueClassComponent ComponentNameWebview extends VueClass {
 *
 * }
 * @example
 * \@VueClassComponent({
 *
 * }) ComponentNameWebview extends VueClass {
 *
 * }
 * @returns - декоратор для класса
 */
function VueClassComponentDecorator<P = {}>(
  options: P | (new (...args: any[]) => any)
): any {
  // Если передан конструктор (используется как @VueClassComponent)
  if (typeof options === 'function') { // @ts-ignore
    return createComponent(options)
  }

  // Если передан объект с опциями (используется как @VueClassComponent(options))
  return function(constructor: new (...args: any[]) => any) { // @ts-ignore
    return createComponent(constructor, options)
  }
}


function createComponent<T extends { new(...args: any[]): {} }>(
  constructor: T,
  options: any = {}
): T & VueClass {
  // Создаем инстанс класса или получаем существующий
  let vueClassInstance = globalThis.$VST._dynamic?._vueClassInstances[constructor.name] ?? new constructor()

  // Проверка наследования от VueClass
  if (!(vueClassInstance instanceof VueClass)) {
    throw `Класс ${constructor.name} должен наследоваться от класса VueClass или его потомков`
  }

  // Сохраняем инстанс, если его еще нет
  if (!globalThis.$VST._dynamic?._vueClassInstances[constructor.name]) {
    globalThis.$VST._dynamic._vueClassInstances[constructor.name] = vueClassInstance
  }

  // Получаем методы
  const methods = {}
  const VCC = new VueClassChild()
  for (let m of arrayDiff(getMethods(vueClassInstance), getMethods(VCC, true))) { // @ts-ignore
    methods[m] = vueClassInstance[m]
  }

  // Обработка props
  const dataProps = {}
  let props = Object.assign({}, (globalThis.$VST._dynamic._vueClassProps[constructor.name] ?? {}))
  let pProps = Object.getPrototypeOf(vueClassInstance)

  do {
    props = Object.assign(props, (globalThis.$VST._dynamic._vueClassProps[pProps.constructor.name] ?? {}))
  } while ((pProps = Object.getPrototypeOf(pProps)) instanceof VueClass)

  // Обработка свойств объекта
  for (let p of getObjProps(vueClassInstance)) {
    if (!props[p]) { // @ts-ignore
      dataProps[p] = vueClassInstance[p]
    }
  }

  // Обработка watchers
  let watch = Object.assign({}, (globalThis.$VST._dynamic._vueClassWatchers[constructor.name] ?? {}))
  let pWatch = Object.getPrototypeOf(vueClassInstance)

  do {
    watch = Object.assign(watch, (globalThis.$VST._dynamic._vueClassWatchers[pWatch.constructor.name] ?? {}))
  } while ((pWatch = Object.getPrototypeOf(pWatch)) instanceof VueClass)

  // Обработка computed свойств
  let computed = Object.assign({}, (globalThis.$VST._dynamic._vueComputed[constructor.name] ?? {}))
  for (let name in computed) { // @ts-ignore
    delete vueClassInstance[name]
  }

  let componentOutHandlers: string[] = []

  // @ts-ignore Возвращаем Vue компонент
  return defineComponent({
    props,
    watch,
    computed,
    name: vueClassInstance['name'] ?? vueClassInstance['instance']?.constructor?.name,
    mixins: vueClassInstance.mixins,
    components: {...(vueClassInstance.componentsParent ?? {}), ...vueClassInstance.components},
    emits: vueClassInstance.emits.concat(vueClassInstance.emitsParent),
    inject: vueClassInstance.inject.concat(vueClassInstance.injectParent),
    provide: {...vueClassInstance.provideParent, ...vueClassInstance.provide},
    beforeCreate: function() {
      // @ts-ignore
      // console.log(this.$parent?.$options.__scopeId, this.$options.__scopeId)
      // @ts-ignore Пересоздаём экземпляр, так как функция декоратора вызывается один раз
      vueClassInstance = new constructor()
      // console.log(getCurrentInstance()?.parent?.vnode?.type?.__scopeId)
      vueClassInstance.$options = this.$options
      vueClassInstance.$parent = this.$parent
      vueClassInstance.$root = this.$root
      vueClassInstance.$slots = this.$slots
      // console.log(vueClassInstance, vueClassInstance.__vue_props__)

      // @ts-ignore
      vueClassInstance['instance'] = vueClassInstance // @ts-ignore
      this.name = vueClassInstance['name'] ?? vueClassInstance['instance']?.constructor.name
      /**
       * Рекурсивный пропуск шагов
       * @see $nextTick
       * @param {Function} callback
       * @param {Number} steps Количество шагов, которые нужно пропустить
       */ // @ts-ignore
      this.nextTick = vueClassInstance.nextTick = (callback: () => void, steps: number = 1) => {
        const recursiveNextTick = (remainingSteps: number) => {
          this.$nextTick(() => {
            if (remainingSteps > 1) {
              recursiveNextTick(remainingSteps - 1)
            }
            else if (typeof callback == 'function' && !(callback instanceof Promise)) {
              callback?.call?.(this)
            }
          })
        }
        recursiveNextTick(steps)
      }
      vueClassInstance.beforeCreateParent.call(this)
      vueClassInstance.beforeCreate.call(this)
    },
    created: function() { // @ts-ignore
      this.name = vueClassInstance['name'] ?? vueClassInstance['instance']?.constructor.name
      for(let method in methods) { // @ts-ignore
        this[method] = vueClassInstance?.[method].bind?.(this);
      }
      vueClassInstance.createdParent.call(this)
      vueClassInstance.created.call(this)
    },
    beforeMount: function() {
      vueClassInstance.beforeMountParent.call(this)
      vueClassInstance.beforeMount.call(this)
      const updateEventHandlers = () => {
        const instance = getCurrentInstance() // @ts-ignore
        if (instance && instance.vnode.props) { // @ts-ignore
          componentOutHandlers = Object.keys(instance.vnode.props)
            .filter(key => key.startsWith('on'))
            .map(key => key.slice(2).toLowerCase())
        }
      }

      updateEventHandlers()

      // Дополнительная проверка после монтирования
      nextTick(() => {
        updateEventHandlers()
      }) // @ts-ignore
      this['hasExternalHandlerEvent'] = (event: string) => componentOutHandlers.includes(event)
    },
    mounted: function() {
      vueClassInstance.mountedParent.call(this)
      vueClassInstance.mounted.call(this)
      // console.log(this.computed)
    },
    beforeUpdate: function() {
      vueClassInstance.beforeUpdateParent.call(this)
      vueClassInstance.beforeUpdate.call(this)
      const updateEventHandlers = () => {
        const instance = getCurrentInstance() // @ts-ignore
        if (instance && instance.vnode.props) { // @ts-ignore
          componentOutHandlers = Object.keys(instance.vnode.props)
            .filter(key => key.startsWith('on'))
            .map(key => key.slice(2).toLowerCase())
        }
      }

      updateEventHandlers()

      // Дополнительная проверка после монтирования
      nextTick(() => {
        updateEventHandlers()
      }) // @ts-ignore
      this['hasExternalHandlerEvent'] = (event: string) => componentOutHandlers.includes(event)
    },
    updated: function() {
      vueClassInstance.updatedParent.call(this)
      vueClassInstance.updated.call(this)
    },
    beforeUnmount: function() {
      vueClassInstance.beforeUnmountParent.call(this)
      vueClassInstance.beforeUnmount.call(this)
    },
    unmounted: function() {
      vueClassInstance.unmountedParent.call(this)
      vueClassInstance.unmounted.call(this)
    },
    data: function() {
      return {...dataProps, ...{__vue_class_instance__:null}}
    },
  })
}

export const VueClassComponent = VueClassComponentDecorator

/**
 * Получение списка методов из класса
 * @param {Object} obj Запущенный экземпляр класса
 * @param {Boolean} ignoreVueClassBreak Игнорировать ли методы класса `VueClass`
 */
function getMethods(obj: object, ignoreVueClassBreak: boolean = false) {
  let properties = new Set()
  let currentObj = obj
  do {
    if(!ignoreVueClassBreak && currentObj.constructor.name == 'VueClass') {
      break
    }
    Object.getOwnPropertyNames(currentObj).map(item => properties.add(item))
  } while ((currentObj = Object.getPrototypeOf(currentObj))) // @ts-ignore
  return [...properties.keys()].filter((item: any) => typeof obj[item] === 'function' && typeof Object[item] != 'function')
}

/**
 * Получение списка параметров из класса
 * @param {Object} obj Запущенный экземпляр класса
 * @param {Boolean} ignoreVueClassBreak Игнорировать ли методы класса `VueClass`
 */
function getObjProps(obj: any, ignoreVueClassBreak: boolean = false): any[] {
  let properties = new Set()
  let currentObj = obj
  do {
    if(!ignoreVueClassBreak && currentObj.constructor.name == 'VueClass') {
      break
    }
    Object.getOwnPropertyNames(currentObj).map(item => properties.add(item))
  } while ((currentObj = Object.getPrototypeOf(currentObj))) // @ts-ignore
    return [...properties.keys()].filter((item: any) => {
      return vueDefaultProps.indexOf(item) == -1
        && item != '__vue_props__'
        && obj[item] !== 'function' // @ts-ignore
        && typeof Object[item] != 'function'
    }
  )
}

// /**
//  * Расширение Vue объекта
//  * @param vueInstance
//  * @param watch
//  * @param computed
//  */
// function extendVueInstance(vueInstance: any, watch: any, computed: any) {
//   const p = new Proxy(vueInstance, {
//     get(target, prop, receiver) {
//
//
//       // -----------------------------------
//       // Дополнение метода `$nextTick`
//       // -----------------------------------
//       if (prop === '$nextTick') {
//         return function(fn: () => void, steps: number = 1) {
//           const recursiveNextTick = function (remainingSteps: number) {
//             vueInstance.$nextTick(() => {
//               if (remainingSteps > 1) {
//                 recursiveNextTick(remainingSteps - 1)
//               }
//               else {
//                 fn.call(vueInstance)
//               }
//             })
//           }.bind(vueInstance)
//
//           recursiveNextTick(steps)
//         }.bind(vueInstance)
//       }
//
//       return target[prop]
//     }
//   })
//   for (let n in watch) {
//     watch[n].handler = watch[n].handler.bind(p)
//   }
//   for (let n in computed) {
//     computed[n].get = computed[n].get.bind(p)
//   }
//   return p
// }

/**
 * Получение различий из массивов
 * @param {Array} a
 * @param {Array} b
 */
function arrayDiff(a: any[], b: any[]): any[] {
  return a.filter((v) => !b.includes(v))
}


class VueClassChild extends VueClass {}


export {
  VueClass
}
