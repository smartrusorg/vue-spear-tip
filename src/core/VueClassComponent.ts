import VueClass from './VueClass'
import type {IGlobalVST} from '../Interfaces/IGlobalVST'

import {
  defineComponent, reactive, computed, toRefs, watch, nextTick, onMounted, onUpdated, onUnmounted, onBeforeMount,
  onBeforeUpdate, onBeforeUnmount, onErrorCaptured, onRenderTracked, onRenderTriggered, onDeactivated, onActivated,
  getCurrentInstance
} from 'vue'
import { metadataRegistry } from './registry'


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
        type: [String, Number, Array, Boolean, Object, Date, Function, Symbol, null],
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
      emits: [...new Set([...(inst.emitsParent || []), ...(inst.emits || [])])],
      setup(props, context) {
        const vm = getCurrentInstance()! // Получаем внутренний инстанс Vue
        const instance = new constructor()
        instance.$props = props || {}
        instance.$emit = context.emit
        const state = reactive(instance)
        
        // Не пробрасывает
        watch(() => state.modelValue, (val, oldVal) => {
          if (val !== oldVal) {
            context.emit('update:modelValue', val)
          }
        })
        
        const computedState: any = {}
        const proto = Object.getPrototypeOf(instance)
        const descriptors = Object.getOwnPropertyDescriptors(proto)
        
        // fixme поддержка @Computed, удалить в версии 1 оставив геттеры
        for (const [vueName, originalKey] of Object.entries(schema.computed)) {
          computedState[vueName] = computed(() => {
            // Вызываем оригинальный метод из реактивного инстанса
            return state[originalKey].call(state)
          })
        }
        
        // Автоматическое создание computed из геттеров
        for (const key in descriptors) {
          const descriptor = descriptors[key]
          if (typeof descriptors[key]?.get === 'function' /*typeof descriptors[key].value === 'function' && key !== 'constructor'*/) {
            schema.computed[key] = true
            // Оборачиваем геттер класса в Vue Computed
            // bind(state) важен, чтобы внутри геттера this указывал на Proxy
            computedState[key] = computed(() => descriptor.get!.call(state))
          }
        }
        
        
        if ((schema as WatchSchemeReal).watch) {
          for (const methodName in schema.watch) {
            if (!schema.computed?.[methodName] && !computedState?.[methodName]) {
              // Создаем вочер
              watch(
                // Источник: если это свойство в классе, берем из state
                function() {
                  return schema.watch[methodName].propertyName in state
                    ? state[schema.watch[methodName].propertyName]
                    : (
                      schema.watch[methodName].propertyName in props
                        ? props[schema.watch[methodName].propertyName as any]
                        : null
                    )
                }.bind(state),
                // Вызываем метод класса
                (newValue: any, oldValue: any) => {
                  state[methodName].call(state, newValue, oldValue)
                },
                {
                  immediate: schema.watch[methodName].immediate,
                  deep: schema.watch[methodName].deep
                }
              )
            }
          }
        }
        
        Object.defineProperty(state, '$el', {
          get: () => vm.proxy?.$el, // proxy.$el появится сразу после Mount
          enumerable: false,
          configurable: true
        })
        
        // Прокидываем свойства через дескрипторы
        for (const key of vueDefaultProps) {
          Object.defineProperty(state, key, {
            get: () => {
              // Берем актуальное значение из Proxy-контекста Vue
              if (key === '$nextTick') return nextTick
              if (key === '$emit') return context.emit
              if (key === '$slots') return context.slots
              if (key === '$attrs') return context.attrs
              
              // Для остальных (refs, root, parent и т.д.) берем из proxy инстанса
              return (vm.proxy as any)[key]
            },
            enumerable: false, // Чтобы не засорять логи и циклы
            configurable: true
          })
        }
        
        
        // Привязка методов (чтобы не писать .value и не терять this)
        const methods: any = {}
        for (const key in descriptors) {
          if (typeof descriptors[key].value === 'function' && key !== 'constructor') {
            instance[key] = methods[key] = descriptors[key].value.bind(state)
          }
        }
        Object.assign(state, methods)
        state.name = constructor.name
        
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
              requestAnimationFrame(stepRunner)
            } else {
              // Вызываем финальный колбэк один раз в конце цепочки
              if (typeof callback === 'function' && !(callback instanceof Promise)) {
                callback.call(state)
              }
            }
          }
          
          requestAnimationFrame(stepRunner)
        }.bind(state)
        
        // Синхронизация props (без .value!)
        watch(props, function (newProps: any) {
          for (const key in newProps) {
            if (
              key in state && propsOuter?.[key]
              && !schema.computed?.[key]
              && !schema.watch?.[key]
              && !computedState?.[key]
              && ![
                'provide', 'provideParent', 'inject', 'injectParent', 'emits', 'emitsParent', 'mixins', 'mixinsParent',
                'instance', 'nextTick'
              ].includes(key)
            ) {
              instance[key] = state[key] = newProps?.[key]
            }
          }
        }.bind(state), {immediate: true})
        
        
        
        if (instance.setup) instance.setup.call(state, props, context, state)
        if (instance.setupParent) instance.setupParent.call(state, props, context, state)
        
        
        if (instance.beforeCreateParent) instance.beforeCreateParent.call(state)
        if (instance.beforeCreate) instance.beforeCreate.call(state)
        
        // onActivated(() => {})
        // onDeactivated(() => {})
        onMounted(function () {
          if (instance.mountedParent) instance.mountedParent.call(state)
          if (instance.mounted) instance.mounted.call(state)
        }.bind(state))
        onBeforeUpdate(function () {
          if (instance.beforeUpdateParent) instance.beforeUpdateParent.bind(state)()
          if (instance.beforeUpdate) instance.beforeUpdate.bind(state)()
        }.bind(state))
        onBeforeUnmount(function () {
          if (instance.beforeUnmountParent) instance.beforeUnmountParent.bind(state)()
          if (instance.beforeUnmount) instance.beforeUnmount.bind(state)()
        }.bind(state))
        onErrorCaptured(function(callback: any) {
          if (instance.onErrorCapturedParent) instance.onErrorCapturedParent.bind(state)(callback)
          if (instance.onErrorCaptured) instance.onErrorCaptured.bind(state)(callback)
        }.bind(state))
        onRenderTracked(function(callback: any) {
          if (instance.onRenderTrackedParent) instance.onRenderTrackedParent.bind(state)(callback)
          if (instance.onRenderTracked) instance.onRenderTracked.bind(state)(callback)
        }.bind(state))
        onRenderTriggered(function(callback: any) {
          if (instance.onRenderTriggeredParent) instance.onRenderTriggeredParent.bind(state)(callback)
          if (instance.onRenderTriggered) instance.onRenderTriggered.bind(state)(callback)
        }.bind(state))
        onUpdated(function(callback: any) {
          if (instance.updatedParent) instance.updatedParent.bind(state)(callback)
          if (instance.updated) instance.updated.bind(state)(callback)
        }.bind(state))
        onUnmounted(function(callback: any) {
          if (instance.unmountedParent) instance.unmountedParent.bind(state)(callback)
          if (instance.unmounted) instance.unmounted.bind(state)(callback)
        }.bind(state))
        onBeforeMount(function(callback: any) {
          if (instance.beforeMountParent) instance.beforeMountParent.bind(state)(callback)
          if (instance.beforeMount) instance.beforeMount.bind(state)(callback)
        }.bind(state))
        
        
        if (instance.createdParent) instance.createdParent.call(state)
        if (instance.created) instance.created.call(state)
        
        
        return {
          ...toRefs(state),   // Обычные свойства (data)
          ...computedState,   // Геттеры ставшие computed
          ...methods,         // Методы
        }
      }
    })
  })()
}


type WatchScheme = {
  props: Record<string, any>,
  watch: Record<string, any>,
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

export const VueClassComponent = VueClassComponentDecorator

export {
  VueClass
}
