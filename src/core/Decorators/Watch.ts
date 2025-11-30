let VstPrepareClassInstance: {[k:string]: any} = {}

/**
 * Трансформация метода в vue watch функцию
 * @param {String} propertyName Название свойства
 * @param {boolean} deep Следить ли за изменениями объекта в глубину
 * @param {boolean} immediate Выполнить ли метод сразу, не учитывая есть ли изменения
 * @constructor
 */
export const Watch = function(propertyName: string, deep: boolean = false, immediate: boolean = false): any {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    let VST = target.constructor?.___VST ?? {}
    if (!VST.watch) VST.watch = {}
    if (!VstPrepareClassInstance[target.constructor.name]) {
      VstPrepareClassInstance[target.constructor.name] = new target.constructor
      VstPrepareClassInstance[target.constructor.name].name =
        VstPrepareClassInstance[target.constructor.name]?.constructor?.name?.toString()
        ?? VstPrepareClassInstance[target.constructor.name]['name']
        ??  ''
    }
    if(!target?.constructor?.prototype?.__vue_watch__) {
      target.constructor.prototype.__vue_watch__ = {}
    }
    if(!target?.constructor?.prototype?.__vue_watch__[target.constructor.name]){
      target.constructor.prototype.__vue_watch__[target.constructor.name] = {}
      target.constructor.prototype.__vue_watch__[target.constructor.name][propertyName]
        = VstPrepareClassInstance[target.constructor.name][propertyKey]
    }
    if(!VST.watch[target.constructor.name]) {
      VST.watch[target.constructor.name] = {}
    }
    
    VST.watch[target.constructor.name][propertyName] = {
      handler: VstPrepareClassInstance[target.constructor.name][propertyKey],
      deep: deep,
      immediate: immediate,
    }
    target.constructor.___VST = VST
  }
}
