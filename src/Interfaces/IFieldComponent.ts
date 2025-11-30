import type IBaseVueComponent from './IBaseVueComponent'

interface IFieldComponent extends IBaseVueComponent {
  readonly disabled?: boolean
  readonly placeholder?: string|{[k:string]:string}
  onValueChange(value: any): void
  getValue(): any
  setValue(value: any): any
}

export type {IFieldComponent}