<script lang="ts">
import {BaseComponent, Prop, Watch} from '../core'
import {IFieldComponent} from '../Interfaces/IFieldComponent'

/** Базовый компонент поля */
export default abstract class FieldComponent extends BaseComponent implements IFieldComponent {
  declare readonly $root: {
    [key: string]: any
  }
  emitsParent = ['update:modelValue']

  /** Входящее значение */
  @Prop(String, Number, Array, Object, Boolean, null) readonly inputValue: any = null
  /** Значение v-model */
  @Prop(String, Number, Array, Object, Boolean, null) readonly modelValue: any = null
  /** Значение по умолчанию */
  @Prop(String, Number, Array, Object, Boolean) readonly default?: any = null
  @Prop(Boolean) readonly disabled?: boolean = false
  /** Размер поля */
  @Prop(String) readonly size: 'sm'|'md'|'lg' = 'lg'
  /** Заполнитель (Текст-подсказка) */
  @Prop(String, Object) readonly placeholder: string|{[k:string]:string} = ''

  /** Динамическое значение поля */
  value: any = null
  constructor() {
    super()
  }
  createdParent() {
    this.value = this.modelValue || this.inputValue || null
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
