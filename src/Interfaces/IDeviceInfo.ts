export default interface IDeviceInfo {
  /** Полная информация */
  userAgentData(): {[key: string]: any}
  
  /** Название браузера */
  browserName(): string
  
  /** Версия браузера */
  browserVersion(): string
  
  /** Мажорная версия браузера */
  browserMajor(): string
  
  /** Движок браузера */
  browserEngine(): string
  
  /** Версия движка браузера */
  browserEngineVersion(): string
  
  /** Модель устройства */
  deviceModel(): string
  
  /** Поставщик устройства */
  deviceVendor(): string
  
  /** Операционная система */
  osName(): string
  
  /** Распознанный тип устройства по User Agent строке */
  device(): 'desktop'|'mobile'|'tablet'
  
  /** Поставщик операционной системы */
  osVendor(): string
  
  /** Версия операционной системы */
  osVersion(): string
  
  /** Архитектура процессора */
  cpuArchitecture(): string
}