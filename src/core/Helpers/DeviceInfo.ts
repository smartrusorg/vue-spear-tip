// @ts-ignore
import '../MIT/ua-parser-v.1.0.41.mit.pack'
import IDeviceInfo from '../../Interfaces/IDeviceInfo' // @ts-ignore

const UAParser = globalThis.UAParser // @ts-ignore
delete globalThis.UAParser

export default class DeviceInfo implements IDeviceInfo {
  #userAgent: string
  #parser: any
  constructor() {
    this.#userAgent = navigator.userAgent
    this.#parser = new UAParser(navigator.userAgent ?? 'unknown').getResult()
    this.#inst = this
  }
  
  #inst: DeviceInfo|null = null
  #instance(): DeviceInfo {
    if (!this.#inst || this.#inst.#userAgent != navigator.userAgent) {
      this.#inst = new DeviceInfo
    }
    return this.#inst
  }
  
  userAgentData(): {[key: string]: any} {
    return {...this.#instance().#parser}
  }
  
  browserName(): string{
    return this.#instance().#parser.browser.name ?? 'unknown'
  }
  
  browserVersion(): string{
    return this.#instance().#parser.browser.version ?? 'unknown'
  }
  
  browserMajor(): string{
    return this.#instance().#parser.browser.major ?? 'unknown'
  }
  
  browserEngine(): string{
    return this.#instance().#parser.engine.name ?? 'unknown'
  }
  
  browserEngineVersion(): string{
    return this.#instance().#parser.engine.version ?? 'unknown'
  }
  
  device(): 'desktop'|'mobile'|'tablet' {
    return this.#instance().#parser.device.type ?? 'desktop'
  }
  
  deviceModel(): string {
    return this.#instance().#parser.device.model ?? 'unknown'
  }
  
  deviceVendor(): string {
    return this.#instance().#parser.device.vendor ?? 'unknown'
  }
  
  osName(): string {
    return this.#instance().#parser.os.name ?? 'unknown'
  }
  
  osVendor(): string {
    return this.#instance().#parser.os.vendor ?? 'unknown'
  }
  
  osVersion(): string {
    return this.#instance().#parser.os.version ?? 'unknown'
  }
  
  cpuArchitecture(): string {
    return this.#instance().#parser.cpu.architecture ?? 'unknown'
  }
}