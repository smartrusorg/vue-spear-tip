import {getMeta} from '../registry'

/**
 * Трансформация метода в vue watch функцию
 * @param {String} propertyName Название свойства
 * @param {boolean} deep Следить ли за изменениями объекта в глубину
 * @param {boolean} immediate Выполнить ли метод сразу, не учитывая есть ли изменения
 * @constructor
 */

export const Watch = function(propertyName: string, deep: boolean = false, immediate: boolean = false): any {
  return (target: any, methodName: string) => {
    const meta = getMeta(target.constructor);
    if (!meta.watch) meta.watch = [];
    
    meta.watch[methodName] = {propertyName, deep, immediate}
  }
}
