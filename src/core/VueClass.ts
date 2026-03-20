import { VNode, TriggerOpTypes, TrackOpTypes, ReactiveEffect } from 'vue'
import {IVueClass} from '../Interfaces/IVueClass'
import {VueSetupContext} from '../types/VueSetupContext'
import {IVSTContext} from '../Interfaces/IVSTContext'

export default abstract class VueClass implements IVueClass {
  public readonly mixins: Array<any> = []
  public readonly components: {[key:string|symbol|number]:any} = {}
  public readonly componentsParent: {[key:string|symbol|number]:any} = {}
  public readonly emits: Array<string> = []
  public readonly emitsParent: Array<string> = []
  
  declare readonly name: string
  readonly instance?: this = this
  readonly $attrs: {[key:string]:any} = {}
  readonly $data: {[key:string]:any} = {}
  declare readonly $el: HTMLElement // $I.Frontend.HTML.Element
  declare readonly $options: {
    __scopeId: string
    __file: string
  }
  declare readonly $parent?: any
  declare readonly $props: {[key:string]:any}
  declare readonly $refs: {[key:string]:any}
  readonly $root: {[key:string]:any}|this|any
  declare readonly $slots: {default: () => VNode[]} & {[key: string]: (() => VNode[]) | undefined}

  $emit(eventName: string, ...args: any[]): void {}
  $forceUpdate(callback?: Function): void {}
  $watch(source?: string | Function, callback?: Function | object, options?: any /* VueWatchOptions */): void {}
  $nextTick(callback?: Function): void {}

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
  } = {} as any

  setup(
    props?: {[key:string]: any},
    context?: VueSetupContext,
    self?: IVueClass,
    vst?: IVSTContext,
  ): {[k:string]:any}|void {}
  beforeCreate() {}
  created() {}
  beforeMount() {}
  mounted() {}
  beforeUpdate() {}
  updated() {}
  beforeUnmount() {}
  unmounted() {}
  
  setupParent(
    props?: {[key:string]: any},
    context?: VueSetupContext,
    self?: IVueClass,
    vst?: IVSTContext,
  ): {[k:string]:any}|void {}
  beforeCreateParent() {}
  createdParent() {}
  beforeMountParent() {}
  mountedParent() {}
  beforeUpdateParent() {}
  updatedParent() {}
  beforeUnmountParent() {}
  unmountedParent() {}
  
  declare isComputedProperty: (prop: string) => boolean
  
  onErrorCaptured<T = this>(callback: (error: {
    err: unknown,
    instance: T | null,
    info: string
  }) => boolean | void): void {}
  
  
  onErrorCapturedParent<T = this>(callback: (error: {
    err: unknown,
    instance: T | null,
    info: string
  }) => boolean | void): void {}
  
  onRenderTracked(callback: {
    effect: ReactiveEffect
    target: object
    type: TrackOpTypes
    key: any
  }): void {}
  
  onRenderTrackedParent(callback: {
    effect: ReactiveEffect
    target: object
    type: TrackOpTypes
    key: any
  }): void {}
  
  onRenderTriggered(callback: {
    effect: ReactiveEffect
    target: object
    type: TriggerOpTypes
    key: any
    newValue?: any
    oldValue?: any
    oldTarget?: Map<any, any> | Set<any>
  }): void {}
  
  onRenderTriggeredParent(callback: {
    effect: ReactiveEffect
    target: object
    type: TriggerOpTypes
    key: any
    newValue?: any
    oldValue?: any
    oldTarget?: Map<any, any> | Set<any>
  }): void {}
  
  
  nextTick(callback: () => void, steps: number = 1) {}
}

