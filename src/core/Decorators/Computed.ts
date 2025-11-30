let VstPrepareClassInstance: {[k:string]: any} = {}

/**
 * Трансформация метода в vue computed функцию
 * @param {String} propertyName Название свойства
 * @constructor
 */
export const Computed = function(propertyName: string): any {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    let VST = target.constructor?.___VST ?? {}
    if (!VST.computed) VST.computed = {}
    if(!VstPrepareClassInstance[target.constructor.name]) {
      VstPrepareClassInstance[target.constructor.name] = new target.constructor
      VstPrepareClassInstance[target.constructor.name].name = 'test'
      VstPrepareClassInstance[target.constructor.name].name =
        VstPrepareClassInstance[target.constructor.name]?.constructor?.name?.toString()
        ?? VstPrepareClassInstance[target.constructor.name]['name']
        ??  ''
    }
    if(!target?.constructor?.prototype?.__vue_computed__) {
      target.constructor.prototype.__vue_computed__ = {}
    }
    if(!target?.constructor?.prototype?.__vue_computed__[target.constructor.name]) {
      target.constructor.prototype.__vue_computed__[target.constructor.name] = {}
    }
    target.constructor.prototype.__vue_computed__[target.constructor.name][propertyName ?? propertyKey] 
      = VstPrepareClassInstance[target.constructor.name][propertyKey]

   
    if(!VST.computed[target.constructor.name]) {
      VST.computed[target.constructor.name] = {}
    }

   
    let callback = VstPrepareClassInstance[target.constructor.name][propertyKey]
    VstPrepareClassInstance[target.constructor.name][propertyKey] = undefined
    delete VstPrepareClassInstance[target.constructor.name][propertyKey]
    VST.computed[target.constructor.name][propertyName ?? propertyKey] = {
      get: callback
    }
    target.constructor.___VST = VST
  }
}
