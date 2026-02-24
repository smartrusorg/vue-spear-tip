type VuePropsTypes = typeof String | typeof Number | typeof Array | typeof Boolean | typeof Object |
  typeof Date | typeof Function | typeof Symbol | null // @ts-ignore

import {DebuggerEvent} from 'vue/dist/vue.esm-bundler'

type WatchCallback<T> = (
  value: T,
  oldValue: T,
  onCleanup: (cleanupFn: () => void) => void
) => void

interface VuePropObj {
  type: VuePropsTypes | VuePropsTypes[],
  validator?: Function,
  default?: any,
  required?: boolean,
  event?: string,
  deep?: boolean, // default: false
  handler?: WatchCallback<any> | string
  immediate?: boolean // default: false
  flush?: 'pre' | 'post' | 'sync' // default: 'pre'
  onTrack?: (event: DebuggerEvent) => void
  onTrigger?: (event: DebuggerEvent) => void
}

import { getMeta } from '../registry'

/**
 * Объявление параметра класса vue prop
 * ```js
 * @VST export default class Component extends BaseComponent {
 *   // String, Number, Array, Boolean, Object, Date, Function, Symbol, null
 *   @Prop(Boolean) readonly loading: boolean = false
 *   @Prop(Boolean) readonly autofocus: boolean = false
 *   @Prop(String, null) readonly inputValidatePattern: string|null = null
 * }
 * 
 * ```
 * @param type Ожидаемый тип параметра
 *
 * *(String, Number, Array, Boolean, Object, Date, Function, Symbol, null)*
 * @param types Дополнительные типы
 *
 * *(String, Number, Array, Boolean, Object, Date, Function, Symbol, null)*
 * @constructor
 */
export const Prop = (
  type: VuePropsTypes | VuePropObj, ...types: (VuePropsTypes)[]
) => (target: any, key: string) => {
  const meta = getMeta(target.constructor)
  meta.props[key] = typeof type == 'object' ? type : {...{
    type: [type, ...types]
  }}
}