import { getMeta } from '../registry'

/**
 * Трансформация метода в vue computed функцию
 *
 * @deprecated Используйте геттеры, поддержка свойства будет удалена в версии 1
 * ```ts
 * @VST export default class DataCompanyOrgField extends Field {
 *   get test(): { some: string } {
 *     return {some: 'test'}
 *   }
 * }
 * ```
 *
 * @param {String} propertyName Название свойства
 * @constructor
 */
export const Computed = function(propertyName: string): any {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const meta = getMeta(target.constructor)
    
    if (!meta.computed) meta.computed = {}
    meta.computed[propertyName] = propertyKey
  }
}
