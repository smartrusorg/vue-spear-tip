import { VNode, SetupContext } from "@vue/runtime-core"
import {IVueClass} from '../Interfaces/IVueClass'
import {IFieldComponent} from '../Interfaces/IFieldComponent'
import {LooseRequired} from '@vue/shared'

export default abstract class VueClass implements IVueClass {
  public readonly mixins: Array<any> = []
  public readonly components: {[key:string|symbol|number]:any} = {}
  public readonly componentsParent: {[key:string|symbol|number]:any} = {}
  public readonly emits: Array<string> = []
  public readonly emitsParent: Array<string> = []
  public readonly inject: Array<string> = []
  public readonly injectParent: Array<string> = []
  public readonly provide: {[key:string]:any} = {}
  public readonly provideParent: {[key:string]:(...args: any) => any} = {}
  
  declare readonly name: string
  readonly instance?: this = this
  readonly $attrs: {[key:string]:any} = {}
  readonly $data: {[key:string]:any} = {}
  declare readonly $el: HTMLElement // $I.Frontend.HTML.Element
  declare readonly $options: {
    __scopeId: string
    __file: string
  }
  declare readonly $parent: VueClass|null
  declare readonly $props: Object
  declare readonly $refs: {
    [key:string]:
      HTMLElement|HTMLInputElement|HTMLElement[]|HTMLInputElement[]|IFieldComponent|IFieldComponent[]|
      IVueClass|VueClass|typeof VueClass
  }
  readonly $root: {
    // [key:string]:any
    readonly APP?: any
  }|this|any
  declare readonly $slots: {
    default: () => VNode[]
  } & {
    [key: string]: (() => VNode[]) | undefined
  }

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
    props?: LooseRequired<Readonly<{}> & Readonly<
      {[x: `on${Capitalize<string>}`]: ((...args: any[]) => any) | undefined}> & {}
    >,
    context?: SetupContext,
    self?: IVueClass
  ) {}
  beforeCreate() {}
  created() {}
  beforeMount() {}
  mounted() {}
  beforeUpdate() {}
  updated() {}
  beforeUnmount() {}
  unmounted() {}
  
  setupParent(
    props?: LooseRequired<Readonly<{}> & Readonly<
      {[x: `on${Capitalize<string>}`]: ((...args: any[]) => any) | undefined}> & {}
    >,
    context?: SetupContext,
    self?: IVueClass
  ) {}
  beforeCreateParent() {}
  createdParent() {}
  beforeMountParent() {}
  mountedParent() {}
  beforeUpdateParent() {}
  updatedParent() {}
  beforeUnmountParent() {}
  unmountedParent() {}

  nextTick(callback: () => void, steps: number = 1) {}
  hasExternalHandlerEvent(name: string): boolean {return false}
}
