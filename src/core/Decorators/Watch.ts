import {getMeta} from '../registry'

/**
 * Трансформация метода в vue watch функцию. Три варианта использования
 *
 * **Упрощённый**
 * ```js
 * @VST export default class Component extends BaseComponent {
 *  // Автоматически начинает отслеживать параметр "loading"
 *  @Watch watchLoading(inLoading: boolean) {
 *     // Действия при изменении this.loading
 *   }
 * }
 * ```
 * **Расширенный**
 * ```js
 * @VST export default class Component extends BaseComponent {
 *  // Автоматически начинает отслеживать параметр "loading"
 *  @Watch({deep: true, immediate: true}) watchLoading(inLoading: boolean) {
 *     // Действия при изменении this.loading
 *   }
 * }
 * ```
 * **Полный**
 * ```js
 * @VST export default class Component extends BaseComponent {
 *  // Автоматически начинает отслеживать параметр "Loading"
 *  @Watch{'Loading', true, true) anyMethodName(inLoading: boolean) {
 *     // Действия при изменении this.Loading. Для параметров начинающихся с большой буквы, например
 *   }
 * }
 * ```
 * @param {String|Object} propertyNameOrOptions Название свойства или параметры в виде объекта
 * @param {boolean} deepOrMethodName Следить ли за изменениями объекта в глубину
 * @param {boolean} immediateOrDescriptor Выполнить ли метод сразу, не учитывая есть ли изменения
 * @constructor
 */

export function Watch(
  propertyNameOrOptions?: string | { deep?: boolean; immediate?: boolean } | any,
  deepOrMethodName?: boolean | string,
  immediateOrDescriptor?: boolean | any
): any {
  const isFactory =
    typeof propertyNameOrOptions === 'string' ||
    propertyNameOrOptions === undefined ||
    (typeof propertyNameOrOptions === 'object' && propertyNameOrOptions.constructor === Object)
  
  const decorator = (target: any, methodName: string) => {
    const meta = getMeta(target.constructor)
    if (!meta.watch) meta.watch = []
    
    let propertyName: string
    let deep = false
    let immediate = false
    
    // Логика извлечения параметров
    if (typeof propertyNameOrOptions === 'string') {
      // Вариант: @Watch('someProp', true, false)
      propertyName = propertyNameOrOptions
      deep = !!deepOrMethodName
      immediate = !!immediateOrDescriptor
    }
    else if (
      propertyNameOrOptions && typeof propertyNameOrOptions === 'object' && propertyNameOrOptions.constructor === Object
    ) {
      // Вариант: @Watch({ deep: true })
      propertyName = '' // Вычислим ниже
      deep = !!propertyNameOrOptions.deep
      immediate = !!propertyNameOrOptions.immediate
    }
    else {
      // Вариант: @Watch без скобок
      propertyName = ''
    }
    
    // Если имя свойства не задано строкой, вычисляем его из метода
    if (!propertyName) {
      const rawName = methodName.startsWith('watch') ? methodName.slice(5) : methodName
      propertyName = rawName.charAt(0).toLowerCase() + rawName.slice(1)
    }
    
    meta.watch[methodName] = { propertyName, deep, immediate }
  }
  
  return isFactory ? decorator : decorator(propertyNameOrOptions, deepOrMethodName as string)
}
