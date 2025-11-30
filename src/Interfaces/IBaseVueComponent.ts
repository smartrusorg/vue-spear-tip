// biome-ignore assist/source/organizeImports: <Нужно для глобального экспорта>
import type {IVueClass} from './IVueClass'
import type {IGlobalVST} from './IGlobalVST'

export default interface IBaseVueComponent extends IVueClass {
  readonly VST: IGlobalVST
  readonly $root: {
    [key:string]:any
  }
  /** Event on window change */
  onViewPortResize(): void
}
