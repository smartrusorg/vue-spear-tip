import {IVueClass} from './IVueClass'
import IGlobalVST from './IGlobalVST'

export default interface IBaseVueComponent extends IVueClass {
  readonly VST: IGlobalVST
  readonly $root: {
    [key:string]:any
  }
  /** Event on window change */
  onViewPortResize(): void
}
