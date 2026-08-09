<script lang="ts">
import {BaseComponent, Prop, Component, Watch} from '../../../core'
import Modals from './Modals.vue'
import {ModalManipulator} from '../../../Interfaces/IModalObject'

/** Компонент из модального окна */
export default abstract class ModalComponent extends BaseComponent implements IModalComponent {
  declare $parent: Modals
  // Могут быть проброшены и свои параметры
  [key: string]: any
  
  @Prop(Function) manipulator: ModalManipulator & {component: undefined} = {} as ModalComponent['manipulator']
  @Prop(String, Object, Array, Number, Boolean, null) readonly inputValue: any = null
  value: any = null
  

  createdParent() {
    this.value = this.inputValue
  }
  
  close() {
  
  }
  
  getValue() {
    return this.value
  }
  
  
  // Пример отслеживания изменений свойства someInnerProp
  // @Watch watchSomeInnerProp(someInnerProp: boolean) {
  //
  // }
}

interface IModalComponent {
  [key: string]: any
}
</script>
