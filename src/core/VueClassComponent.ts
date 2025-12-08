// biome-ignore assist/source/organizeImports: <Для использования vue экосистемы>
import {defineComponent, getCurrentInstance, nextTick, type SetupContext} from 'vue'
import type {LooseRequired} from '@vue/shared'
import VueClass from './VueClass'
import type {IVueClass} from './index'
import type {IGlobalVST} from '../Interfaces/IGlobalVST'

/**
 * Параметры readonly из экземпляра vue
 */
const vueDefaultProps = [
  '$attrs', '$data', '$el', '$off', '$on','$emit',  '$forceUpdate',
  '$nextTick', '$options', '$parent', '$props',  '$refs',
  '$root', '$slots', '$watch'
]

// Объявляем типы для глобального хранилища
declare global {
  var $VST: IGlobalVST
}

// Инициализация глобальных объектов, если они не существуют
if (typeof globalThis.$VST === 'undefined') {
  globalThis.$VST = {} as any
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
// biome-ignore lint/suspicious/noExplicitAny: <Becouse>
): any {
  // Если передан конструктор (используется как @VueClassComponent)
  if (typeof options === 'function') { // @ts-ignore
    return createComponent(options)
  }

  // Если передан объект с опциями (используется как @VueClassComponent(options))
  // biome-ignore lint/suspicious/noShadowRestrictedNames: <For custom libraries>
  // biome-ignore lint/suspicious/noExplicitAny: <For custom libraries>
    return (constructor: new (...args: any[]) => any) => createComponent(constructor, options)
}


function createComponent<T extends { new(...args: any[]): {} }>(
  // biome-ignore lint/suspicious/noShadowRestrictedNames: <For custom libraries>
  constructor: T,
  options: any = {
    autodoc: false, // fixme, делать автоматическую документацию компонента
    // autodoc: {
    //   group: 'Field',
    // }
    //
  }
): T & VueClass {
  let vueClassInstance: IVueClass = (new  constructor) as IVueClass
  // Возвращаем Vue компонент
  return ((() => { // biome-ignore lint/suspicious/noExplicitAny: <Becouse>
    let props: any = {} // @ts-ignore
    const allProps = constructor?.___VST?.props ?? {} // @ts-ignore
    const allWatch = constructor?.___VST?.watch ?? {} // @ts-ignore
    const allComputed = constructor?.___VST?.computed ?? {}
    
    // Обработка watchers
    const watch = Object.assign({}, (allWatch[constructor.name] ?? {}))

    // Собираем props в порядке наследования (от родителя к потомку)
    const inheritanceChain: string[] = []

    // Начинаем с самого старшего родителя и идем к текущему классу
    let currentClass = constructor
    while (currentClass && currentClass.name !== 'VueClass') {
      if (currentClass.name && !inheritanceChain.includes(currentClass.name)) {
        inheritanceChain.unshift(currentClass.name) // Добавляем в начало
      }
      currentClass = Object.getPrototypeOf(currentClass)
    }

    // Собираем props согласно цепочке наследования
    for (const className of inheritanceChain) {
      if (allProps?.[className]) {
        for (const prop in allProps[className]) {
          // Если prop еще не определен, добавляем его
          if (!props[prop]) {
            props[prop] = allProps[className][prop]
          }
        }
      }
      if (allWatch?.[className]) {
        for (const w in allWatch[className]) {
          // Если prop еще не определен, добавляем его
          if (!watch[w]) {
            watch[w] = allWatch[className][w]
          }
        }
      }
    }
    
    // Обработка props
    const dataProps = {}
    let pProps = Object.getPrototypeOf(vueClassInstance)
    
    do {
      props = Object.assign(props, (allProps?.[pProps.constructor.name] ?? {}))
    // biome-ignore lint/suspicious/noAssignInExpressions: <For extend support>
    } while ((pProps = Object.getPrototypeOf(pProps)) instanceof VueClass)
    
    
    // Обработка свойств объекта
    for (const p of getObjProps(vueClassInstance)) {
      if (!props[p]) { // @ts-ignore
        dataProps[p] = vueClassInstance[p]
      }
      else { // @ts-ignore установка значений свойств класса, как значения по умолчанию
        props[p].default = vueClassInstance[p]
      }
    }
    
    
    // Получаем методы
    const methods = {}
    const VCC = new VueClassChild()
    for (const m of arrayDiff(getMethods(vueClassInstance), getMethods(VCC, true))) { // @ts-ignore
      methods[m] = vueClassInstance[m]
    }
    for (const p of getObjProps(vueClassInstance)) {
      if (!props[p]) { // @ts-ignore
        dataProps[p] = vueClassInstance[p]
      }
      else { // @ts-ignore установка значений свойств класса, как значения по умолчанию
        props[p].default = vueClassInstance[p]
      }
    }
    
    
    // Обработка computed свойств
    const computed = Object.assign({}, (allComputed[constructor.name] ?? {}))
    for (const name in computed) { // @ts-ignore
      delete vueClassInstance[name]
    }
    
    let componentOutHandlers: string[] = [] // @ts-ignore
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
      setup: function(
        props: LooseRequired<Readonly<{}> & Readonly<{[x: `on${Capitalize<string>}`]: ((...args: any[]) => any) | undefined}> & {}>,
        context: SetupContext
      ) {
        // @ts-expect-error Пересоздаём экземпляр для каждого нового компонента, чтобы были корректные параметры (props)
        vueClassInstance = new constructor()
        
        const defaultsSetup = {
          ...(vueClassInstance.setupParent.bind(this)(props, context, vueClassInstance) || {}),
          ...(vueClassInstance.setup.bind(this)(props, context, vueClassInstance) || {}),
        }
        if (Object.keys(defaultsSetup).length) { // Для обратной совместимости с методами переданными из setup
          for (const name in defaultsSetup) { // @ts-ignore
            vueClassInstance[name] = defaultsSetup[name]
          }
        }
        return defaultsSetup
      },
      beforeCreate: function() {
        
        for (const p in this.$props) { // @ts-ignore
          vueClassInstance[p] = this.$props[p]
        } // @ts-ignore
        
        // fixme кода-нибудь реализовать через геттеры-сеттеры
        vueClassInstance['$options'] = this.$options // @ts-ignore
        vueClassInstance['$parent'] = this.$parent // @ts-ignore
        vueClassInstance['$root'] = this.$root // @ts-ignore
        vueClassInstance['$slots'] = this.$slots // @ts-ignore
        // vueClassInstance['modelValue'] = this.modelValue
        
        // @ts-expect-error
        vueClassInstance['instance'] = vueClassInstance // @ts-ignore
        this.name = vueClassInstance['name'] ?? vueClassInstance['instance']?.constructor.name
        /**
         * Рекурсивный пропуск шагов
         * @see $nextTick
         * @param {Function} callback
         * @param {Number} steps Количество шагов, которые нужно пропустить
         */
        this.nextTick = vueClassInstance.nextTick = (callback: () => void, steps: number = 1) => {
          const recursiveNextTick = (remainingSteps: number) => {
            this.$nextTick(() => {
              if (remainingSteps > 1) {
                recursiveNextTick(remainingSteps - 1)
              }
              else if (typeof callback === 'function' && !(callback instanceof Promise)) {
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
      },
      mounted: function() {
        vueClassInstance.mountedParent.call(this)
        vueClassInstance.mounted.call(this)
      },
      beforeUpdate: function() {
        vueClassInstance.beforeUpdateParent.call(this)
        vueClassInstance.beforeUpdate.call(this)
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
  })()) as any
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
    if(!ignoreVueClassBreak && currentObj.constructor.name === 'VueClass') {
      break
    }
    Object.getOwnPropertyNames(currentObj).map(item => properties.add(item))
  // biome-ignore lint/suspicious/noAssignInExpressions: <For custom libraries>
  } while ((currentObj = Object.getPrototypeOf(currentObj))) // @ts-ignore
  return [...properties.keys()].filter((item: any) => typeof obj[item] === 'function' && typeof Object[item] !== 'function')
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
    if(!ignoreVueClassBreak && currentObj.constructor.name === 'VueClass') {
      break
    }
    Object.getOwnPropertyNames(currentObj).map(item => properties.add(item))
  // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
  } while ((currentObj = Object.getPrototypeOf(currentObj))) // @ts-ignore
    return [...properties.keys()].filter((item: any) => {
      return vueDefaultProps.indexOf(item) === -1
        && item !== '__vue_props__'
        && obj[item] !== 'function' // @ts-ignore
        && typeof Object[item] !== 'function'
    }
  )
}

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
