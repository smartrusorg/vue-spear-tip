<script lang="ts">
import {BaseComponent, Prop, Watch} from '../core'
import IFieldComponent from '../Interfaces/IFieldComponent'

/**
 * Базовый компонент поля.
 */
export default abstract class FieldComponent extends BaseComponent implements IFieldComponent {
  /** Входящее значение */
  @Prop(String, Number, Array, Object, Boolean, null) readonly inputValue: any = null
  @Prop(String, Number, Array, Object, Boolean, null) readonly modelValue: any = null
  /** Значение по умолчанию */
  @Prop(String, Number, Array, Object, Boolean) readonly default?: any = null
  @Prop(Boolean) readonly disabled?: boolean = false
  // TODO fix parent props replace to child and uncomment
  // @Prop(String) readonly placeholder: string = ''
  emitsParent = ['update:modelValue']
  /** Динамическое значение поля */
  value: any = null
  declare readonly $root: {
    [key: string]: any
  }
  constructor() {
    super()
  }
  mountedParent() {

  }

  onValueChange(value: any){}
  @Watch('value', true) _valueWatch(value: any) {
    this.onValueChange(value)
  }

  getValue() {
    return this.value
  }

  setValue(value: any) {
    this.value = value
  }
}
</script>
