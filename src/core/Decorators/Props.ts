import VueClass from '../VueClass'

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

let VstPrepareClassInstance: {[k:string]: any} = {}

/**
 * Трансформация свойства во vue property
 * @param propDataOrType
 * @param types
 * @constructor
 */
export const Prop = (propDataOrType: VuePropsTypes | VuePropObj, ...types: (VuePropsTypes)[]): any => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    if (typeof target?.constructor?.name != 'string') return
    let VST = target.constructor?.___VST ?? {}
    if (!VST.props) VST.props = {}
    if(!VstPrepareClassInstance[target.constructor.name]) {
      VstPrepareClassInstance[target.constructor.name] = new target.constructor
      VstPrepareClassInstance[target.constructor.name].name =
        VstPrepareClassInstance?.[target.constructor.name]?.constructor?.name?.toString()
        ?? VstPrepareClassInstance?.[target.constructor.name]?.['name']
        ??  ''
    }
    
    let TypeObj: any = typeof propDataOrType == 'object' ? propDataOrType : {...{
      type: [propDataOrType, ...types]
    }}
    if(VstPrepareClassInstance[target.constructor.name][propertyKey]) {
      TypeObj.default = VstPrepareClassInstance[target.constructor.name][propertyKey]
    }

    if(!VST.props[target.constructor.name]) {
      VST.props[target.constructor.name] = {}
    }
    
    const parents = [];
    let proto = Object.getPrototypeOf(target.constructor)
    
    while (proto && proto.constructor !== Object) {
      if (proto.name) parents.push(proto.name)
      proto = Object.getPrototypeOf(proto)
    }
    
    VST.parents = parents
    VST.props[target.constructor.name][propertyKey] = TypeObj
    target.constructor.___VST = VST
  }
}
// ... existing code ..."