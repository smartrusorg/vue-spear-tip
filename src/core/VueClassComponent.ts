import VueClass from './VueClass'
import type {IGlobalVST} from '../Interfaces/IGlobalVST'

import {
  defineComponent, reactive, computed, toRef, watch, nextTick, onMounted, onUpdated, onUnmounted, onBeforeMount,
  onBeforeUpdate, onBeforeUnmount, onErrorCaptured, onRenderTracked, onRenderTriggered, onDeactivated, onActivated,
  getCurrentInstance, watchEffect, watchPostEffect, watchSyncEffect, isRef
} from 'vue'
import { metadataRegistry } from './registry'
import {IVSTContext} from '../Interfaces/IVSTContext'


/** Параметры readonly из экземпляра vue */
const vueDefaultProps = [
  '$attrs', '$data', '$el', '$off', '$on','$emit',  '$forceUpdate',
  '$nextTick', '$options', '$parent', '$props',  '$refs',
  '$root', '$slots', '$watch', '$',
]

function createComponent(constructor: any, decoratorParams: any) {
  const schema = buildFullSchema(constructor)
  const inst = new constructor

  let propsOuter: any = {}
  for (const p of new Set([...getObjProps(schema.props)/*, ...getObjProps(inst)*/])) {
    if (
      [
        'provide', 'provideParent', 'inject', 'injectParent', 'emits', 'emitsParent',
        'mixins', 'mixinsParent', 'instance'
      ].includes(p)
      || typeof inst[p] === 'function'
    ) continue
    if (schema.props?.[p]) {
      propsOuter[p] = {
        type: schema.props[p].type,
        default: inst[p],
      }
    }
    else {
      propsOuter[p] = {
        type: [String, Number, Array, Boolean, Object, Date, Function, Symbol, Error, null],
        default: inst[p],
      }
    }
  }
  
  return (() => {
    return defineComponent({
      name: constructor.name || 'AnonymousComponent',
      props: propsOuter,
      components: {...inst.componentsParent, ...inst.components},
      inject: {...inst.injectParent, ...inst.inject},
      provide: {...inst.provideParent, ...inst.provide},
      emits: [...new Set([...(inst.emitsParent || []), ...(inst.emits || []), ...['update:modelValue']])],
      setup(props, context) {
        const vm = getCurrentInstance()! // Получаем внутренний экземпляр Vue
        const instance = new constructor()
        const state = reactive(instance)
        
        const computedState: any = {}
        const descriptors = getAllDescriptors(instance)
        
        const thisProxy: any = new Proxy({}, {
          get(t, prop) {
            if (prop in state) { // Приоритет: данные класса
              const value = state[prop]
              return isRef(value) ? value.value : value // Автоматически разворачиваем ref
            }
            return (vm.proxy as any)[prop]
          },
          set(t, prop, value) {
            if (prop in state) {
              const current = state[prop]
              if (isRef(current)) {
                current.value = value
                return true
              }
              else {
                state[prop] = value
                return true
              }
            }
            (vm.proxy as any)[prop] = value
            return true
          }
        })
        
        // Автоматическое создание computed из геттеров
        for (const key in descriptors) {
          if (typeof descriptors[key]?.get === 'function' /*typeof descriptors[key].value === 'function' && key !== 'constructor'*/) {
            schema.computed[key] = true
            computedState[key] = computed(() => {
              const latestProto = constructor.prototype
              const latestDescriptor = Object.getOwnPropertyDescriptor(latestProto, key)
              
              if (latestDescriptor && latestDescriptor.get) {
                return latestDescriptor.get.call(thisProxy)
              }
              return descriptors[key].get!.call(thisProxy)
            })
          }
        }
        
        
        if (schema.watchEffect && Array.isArray(schema.watchEffect)) {
          schema.watchEffect.forEach((effect) => {
            const { methodName } = effect
            watchEffect((onCleanup) => {
              const latestMethod = constructor.prototype[methodName]
              if (typeof latestMethod === 'function') {
                latestMethod.call(thisProxy, onCleanup)
              }
            })
          })
        }
        if (schema.watchPostEffect && Array.isArray(schema.watchPostEffect)) {
          schema.watchPostEffect.forEach((effect) => {
            const { methodName } = effect
            watchPostEffect((onCleanup) => {
              const latestMethod = constructor.prototype[methodName]
              if (typeof latestMethod === 'function') {
                latestMethod.call(thisProxy, onCleanup)
              }
            })
          })
        }
        if (schema.watchSyncEffect && Array.isArray(schema.watchSyncEffect)) {
          schema.watchSyncEffect.forEach((effect) => {
            const { methodName } = effect
            watchSyncEffect((onCleanup) => {
              const latestMethod = constructor.prototype[methodName]
              if (typeof latestMethod === 'function') {
                latestMethod.call(thisProxy, onCleanup)
              }
            })
          })
        }
        // Прокидываем свойства через дескрипторы
        for (const key of vueDefaultProps) {
          Object.defineProperty(state, key, {
            get: () => {
              if (key === '$nextTick') return nextTick
              if (key === '$emit') return context.emit
              if (key === '$slots') return context.slots
              if (key === '$attrs') return context.attrs
              if (key === '$refs') return vm.refs
              if (key === '$parent') return vm?.parent?.proxy
              if (key === '$props') return props
              return (vm.proxy as any)[key]
            },
            enumerable: false, // Чтобы не засорять логи и циклы
            configurable: true
          })
        }
        
        let toReturn: any = {}
        
        let setupProps = {}
        const computedKeys = []
        for (const f in computedState) computedKeys.push(f)
        const VSTContext: IVSTContext = {
          computedKeys
        }
        if (instance.setupParent) {
          setupProps = {...setupProps, ...(instance.setupParent.call(thisProxy, props, context, state, VSTContext) ?? {})}
        }
        if (instance.setup) {
          setupProps = {...setupProps, ...(instance.setup.call(thisProxy, props, context, state, VSTContext) ?? {})}
        }
        toReturn = {...setupProps}
        
        const isComputedProperty = (prop: string) => (
          computedState?.[prop] !== undefined
          || !!(toReturn?.[prop] && toReturn?.[prop]?.effect && toReturn?.[prop]?.__v_isRef)
        )
        toReturn.isComputedProperty = isComputedProperty
        // Привязка методов (чтобы не писать .value и не терять this)
        const methods: any = {isComputedProperty}
        for (const key in descriptors) {
          if (typeof descriptors[key].value === 'function' && key !== 'constructor') {
            instance[key] = methods[key] = descriptors[key].value.bind(thisProxy)
          }
        }
        Object.assign(state, methods)
        state.name = constructor.name
        
        // Обработка прослушивателей
        if ((schema as WatchSchemeReal).watch) {
          for (const methodName in schema.watch) {
            watch(
              () => thisProxy?.[schema.watch[methodName].propertyName],
              // обработчик
              (newValue, oldValue) => {
                const method = constructor.prototype[methodName]
                if (typeof method === 'function') {
                  method.call(thisProxy, newValue, oldValue)
                }
              },
              {
                immediate: schema.watch[methodName].immediate,
                deep: schema.watch[methodName].deep
              }
            )
          }
        }
        
        // Отслеживание v-model
        watch(() => thisProxy.modelValue, (val, oldVal) => { // @ts-expect-error
          if (val !== oldVal && val !== props?.['modelValue']) {
            context.emit('update:modelValue', val?.value ?? val ?? null)
          }
        }, {immediate: true}) // @ts-expect-error
        watch(() => props?.modelValue, (val, oldVal) => {
          thisProxy.modelValue = val
        }, {immediate: true})
        
        
        /**
         * Рекурсивный пропуск шагов
         * @see $nextTick
         * @param {Function|Promise} callback
         * @param {Number} steps Количество шагов, которые нужно пропустить
         */
        state.nextTick = function (callback: () => void, steps: number = 1) {
          let currentStep = 0
          
          const stepRunner = () => {
            currentStep++
            if (currentStep < steps) {
              nextTick(stepRunner)
            }
            else {
              // Вызываем финальный колбэк один раз в конце цепочки
              if (typeof callback === 'function' && !(callback instanceof Promise)) {
                callback.call(thisProxy)
              }
            }
          }
          
          nextTick(stepRunner)
        }.bind(thisProxy)
        
        // Синхронизация props (без .value!)
        watch(props, function (newProps: any) {
          for (const key in newProps) {
            if (
              key in state && propsOuter?.[key]
              && state[key] !== newProps?.[key]
              && !schema.computed?.[key]
              && !schema.watch?.[key]
              && !isComputedProperty(key)
              && ![
                'provide', 'provideParent', 'inject', 'injectParent', 'emits', 'emitsParent',
                'mixins', 'mixinsParent', 'instance', 'nextTick', '$refs'
              ].includes(key)
            ) {
              if (key == 'modelValue') {
                instance[key] = newProps[key]
              }
              else {
                const current = state[key]
                if (isRef(current)) {
                  current.value = newProps[key]
                }
                else {
                  state[key] = newProps[key]
                }
                instance[key] = newProps[key]
              }
            }
          }
        }.bind(thisProxy), { immediate: true })
        
        let dataForTemplate: any = {}
        for (const key in state) {
          if (!key.startsWith('$') && !key.startsWith('_')) {
            dataForTemplate[key] = toRef(state, key)
          }
        }
        
        if (instance.beforeCreateParent) instance.beforeCreateParent.call(thisProxy)
        if (instance.beforeCreate) instance.beforeCreate.call(thisProxy)
        
        // onActivated(() => {})
        // onDeactivated(() => {})
        onMounted(function () {
          if (instance.mountedParent) instance.mountedParent.call(thisProxy)
          if (instance.mounted) instance.mounted.call(thisProxy)
        }.bind(thisProxy))
        onBeforeUpdate(function () {
          if (instance.beforeUpdateParent) instance.beforeUpdateParent.call(thisProxy)
          if (instance.beforeUpdate) instance.beforeUpdate.call(thisProxy)
        }.bind(thisProxy))
        onBeforeUnmount(function () {
          if (instance.beforeUnmountParent) instance.beforeUnmountParent.call(thisProxy)
          if (instance.beforeUnmount) instance.beforeUnmount.call(thisProxy)
        }.bind(thisProxy))
        onErrorCaptured(function(callback: any) {
          if (instance.onErrorCapturedParent) instance.onErrorCapturedParent.call(thisProxy, callback)
          if (instance.onErrorCaptured) instance.onErrorCaptured.call(thisProxy, callback)
        }.bind(thisProxy))
        onRenderTracked(function(callback: any) {
          if (instance.onRenderTrackedParent) instance.onRenderTrackedParent.call(thisProxy, callback)
          if (instance.onRenderTracked) instance.onRenderTracked.call(thisProxy, callback)
        }.bind(thisProxy))
        onRenderTriggered(function(callback: any) {
          if (instance.onRenderTriggeredParent) instance.onRenderTriggeredParent.call(thisProxy, callback)
          if (instance.onRenderTriggered) instance.onRenderTriggered.call(thisProxy, callback)
        }.bind(thisProxy))
        onUpdated(function(callback: any) {
          if (instance.updatedParent) instance.updatedParent.call(thisProxy, callback)
          if (instance.updated) instance.updated.call(thisProxy, callback)
        }.bind(thisProxy))
        onUnmounted(function(callback: any) {
          if (instance.unmountedParent) instance.unmountedParent.call(thisProxy, callback)
          if (instance.unmounted) instance.unmounted.call(thisProxy, callback)
        }.bind(thisProxy))
        onBeforeMount(function(callback: any) {
          if (instance.beforeMountParent) instance.beforeMountParent.call(thisProxy, callback)
          if (instance.beforeMount) instance.beforeMount.call(thisProxy, callback)
        }.bind(thisProxy))
        
        
        if (instance.createdParent) instance.createdParent.call(thisProxy)
        if (instance.created) instance.created.call(thisProxy)
        return {
          ...dataForTemplate,
          ...computedState,
          ...toReturn,
          ...methods
        }
      }
    })
  })()
}


type WatchScheme = {
  props: Record<string, any>,
  watch: Record<string, any>,
  watchEffect: Record<string, any>,
  watchPostEffect: Record<string, any>,
  watchSyncEffect: Record<string, any>,
  computed: Record<string, any>,
  emits: string[]
  emitsParent: string[]
  provide: string[]
  provideParent: string[]
  inject: string[]
  injectParent: string[]
  components: string[]
  componentsParent: string[]
}

interface WatchSchemeReal extends WatchScheme {
  watch: {
    [k:string]: {
      propertyName: string
      immediate: boolean
      deep: boolean
    }
  }
}

function buildFullSchema(constructor: any) {
  const schema: WatchScheme = {
    props: {} as any,
    watch: {} as any,
    watchEffect: [] as any,
    watchPostEffect: [] as any,
    watchSyncEffect: [] as any,
    computed: {} as any,
    emits: [] as string[],
    emitsParent: [] as string[],
    provide: [] as any[],
    provideParent: [] as any[],
    inject: [] as any[],
    injectParent: [] as any[],
    components: [] as any[],
    componentsParent: [] as any[],
  }
  
  // Формируем стек наследования (от текущего класса до базового)
  const inheritanceChain: any[] = []
  let current = constructor
  
  while (current && current !== Object.prototype) {
    inheritanceChain.push(current)
    current = Object.getPrototypeOf(current)
  }
  
  // Идем в ОБРАТНОМ порядке (от дедушек к внукам)
  // Чтобы дочерние свойства перезаписывали родительские через Object.assign
  for (let i = inheritanceChain.length - 1; i >= 0; i--) {
    const cls = inheritanceChain[i]
    const meta = metadataRegistry.get(cls)
    
    if (meta) {
      // Слияние пропсов
      if (meta.props) {
        Object.assign(schema.props, meta.props)
      }
      
      // Слияние watchers
      if (meta.watch) {
        Object.assign(schema.watch, meta.watch)
      }
      
      // Слияние старых @Computed методов
      if (meta.computed) {
        Object.assign(schema.computed, meta.computed)
      }
      
      // Прокидываем зависимости и параметры
      if (meta.emits) schema.emits = [...new Set([...schema.emits, ...meta.emits])]
      if (meta.emitsParent) schema.emitsParent = [...new Set([...schema.emitsParent, ...meta.emitsParent])]
      if (meta.provide) schema.provide = [...new Set([...schema.provide, ...meta.provide])]
      if (meta.provideParent) schema.provideParent = [...new Set([...schema.provideParent, ...meta.provideParent])]
      if (meta.inject) schema.inject = [...new Set([...schema.inject, ...meta.inject])]
      if (meta.injectParent) schema.injectParent = [...new Set([...schema.injectParent, ...meta.injectParent])]
      if (meta.components) schema.components = [...new Set([...schema.components, ...meta.inject])]
      if (meta.componentsParent) schema.componentsParent = [
        ...new Set([...schema.componentsParent, ...meta.componentsParent])
      ]
    }
  }
  
  return schema
}

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
        && obj[item] !== 'function' // @ts-ignore
        && typeof Object[item] !== 'function'
    }
  )
}

function getAllDescriptors(instance: object): PropertyDescriptorMap {
  let allDescriptors: PropertyDescriptorMap = {}
  let obj = instance
  const pipeline: PropertyDescriptorMap[] = []
  
  while (obj && obj !== Object.prototype) {
    const descriptors = Object.getOwnPropertyDescriptors(obj)
    // Оставляем только те ключи, которые не начинаются с _ или $
    // Также обычно исключают конструктор
    const filteredDescriptors: PropertyDescriptorMap = {}
    for (const key in descriptors) {
      if (!key.startsWith('_') && !key.startsWith('$') && key !== 'constructor' && key !== 'instance') {
        filteredDescriptors[key] = descriptors[key]
      }
    }
    
    pipeline.push(filteredDescriptors)
    obj = Object.getPrototypeOf(obj)
  }
  // Склеиваем от родителей к детям (у детей приоритет)
  for (let i = pipeline.length - 1; i >= 0; i--) {
    allDescriptors = { ...allDescriptors, ...pipeline[i] }
  }
  return allDescriptors
}


export const VueClassComponent = VueClassComponentDecorator

export {
  VueClass
}
