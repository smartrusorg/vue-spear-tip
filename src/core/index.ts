// import {IGlobalVST} from '../Interfaces/IGlobalVST'
// declare global {var $VST: IGlobalVST}

import VSTLib from './VST.lib'
globalThis.$VST = {...VSTLib}

// Только так получается совмещать разработку с практикой
export * from '../Interfaces/IVueClass'
export * from '../Interfaces/IBaseVueComponent'

export * from '../Interfaces/IFieldComponent'
export * from '../Interfaces/IVSTContext'

export * from './VueClassComponent'
export * from './VueClass'
export * from './Decorators/Props'
export * from './Decorators/Watch'
export * from './Decorators/Computed'
export * from '../types/VueSetupContext'

import {VueClassComponent} from './VueClassComponent'
import BaseComponent from '../replaceable/BaseComponent.vue'

const VST = VueClassComponent

export {BaseComponent, VST, /* IGlobalVST*/}
