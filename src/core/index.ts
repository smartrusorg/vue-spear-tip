// import {IGlobalVST} from '../Interfaces/IGlobalVST'
// declare global {var $VST: IGlobalVST}

import IBaseVueComponent from '../Interfaces/IBaseVueComponent'
import VSTLib from './VST.lib'
globalThis.$VST = {...VSTLib}

// Только так получается совмещать разработку с практикой
export * from '../Interfaces/IVueClass'
export * from '../Interfaces/IFieldComponent'

export * from './VueClassComponent'
export * from './VueClass'
export * from './Decorators/Props'
export * from './Decorators/Watch'
export * from './Decorators/Computed'

import BaseComponent from '../components/BaseComponent.vue'
import {VueClassComponent} from './VueClassComponent'
const VST = VueClassComponent
export {BaseComponent, VST,/* IGlobalVST*/}
