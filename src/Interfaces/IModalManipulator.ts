import {VueClass} from '../core'

interface IModalManipulator {
  component?: typeof VueClass
  value?: any
  close(): void
  error(newError: string): void
  breakCancel(): void
  closeAllModals(): void
}

export {IModalManipulator}