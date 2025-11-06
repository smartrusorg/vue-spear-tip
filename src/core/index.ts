import IGlobalVST from '../Interfaces/IGlobalVST'
type VSTType = {
  _dynamic: {
    _vueClassInstances: Record<string, any>
    _vueClassProps: Record<string, any>
    _vueClassWatchers: Record<string, any>
    _vueComputed: Record<string, any>
  }
} & IGlobalVST
declare global {
  var $VST: VSTType
}
globalThis.$VST = {
  _dynamic: {
    _vueClassInstances: {},
    _vueClassProps: {},
    _vueClassWatchers: {},
    _vueComputed: {},
  }
} as VSTType

// -----------------------
// Встроенный менеджер событий
// -----------------------
import eventManager from './EventManager'
globalThis.$VST.$on = (event: string, callback: (message: any) => any) => {
  eventManager.addEventListener(event, callback)
}
globalThis.$VST.$off = (event: string, callback: (message: any) => any) => {
  eventManager.removeEventListener(event, callback)
}
globalThis.$VST.$emit = (event: string, message?: any) => {
  eventManager.dispatchEvent(event, message)
}

// -----------------------
// Работа с датами
// -----------------------
import DT from './DT'
globalThis.$VST.DT = DT


// -----------------------
// Копирование текста в буфер обмена
// -----------------------
globalThis.$VST.copyToClipboard = (text: string): void => {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text)
      .then(() => {
        // console.log('Текст скопирован в буфер обмена')
      })
      .catch(err => {
        console.error('Ошибка при копировании текста: ', err)
      })
  } else {
    const el = document.createElement('textarea')
    el.value = text
    el.setAttribute('readonly', '')
    el.style.position = 'absolute'
    el.style.left = '-9999px'
    document.body.appendChild(el)
    const selected = // @ts-ignore
      document.getSelection()?.rangeCount > 0
        ? document.getSelection()?.getRangeAt(0)
        : false
    el.select()
    const success = document.execCommand('copy')
    document.body.removeChild(el)
    if (selected) {
      document.getSelection()?.removeAllRanges()
      document.getSelection()?.addRange(selected)
    }
    if (success) {
      // console.log('Текст скопирован в буфер обмена')
    } else {
      console.error('Не удалось скопировать текст')
    }
  }
}


// -----------------------
// Генерация надёжного пароля
// -----------------------
globalThis.$VST.generateSecurePassword = (length: number = 18): string => {
  const pass: string = [...Array(length)].map(
    (_, i, arr) => (i < 4 ?
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!%^()_+[]{}|;:<>?'
        [Math.floor(Math.random() * (i === 0 ? 26 : i === 1 ? 26 : i === 2 ? 10 : 32))] :
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!%^()_+[]{}|;:<>?'
        [Math.floor(Math.random() * 72)])).sort(() => Math.random() - 0.5).join('')
  if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{12,}$/.test(pass)) {
    return $VST.generateSecurePassword(length)
  }
  return pass
}


// -----------------------
// Генерация случайного ключа из цифр и букв разного регистра
// -----------------------
globalThis.$VST.generateRandomKey = (length: number = 32): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let key = ''
  for (let i = 0; i < length; i++) {
    key += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return key
}


// -----------------------
// Сериализация данных с исключением рекурсий
// -----------------------
globalThis.$VST.safeStringify = (message: any) => {
  if (typeof message !== "object" || message === null) return message
  try {
    const stack: any[] = []
    const keys: string[] = []
    let isInitialCall = true
    
    function replacer(this: any, key: string, value: any): any {
      if (stack.length > 0) {
        const thisPos = stack.indexOf(this)
        if (thisPos !== -1) {
          stack.splice(thisPos + 1)
          keys.splice(thisPos + 1, keys.length)
        } else {
          stack.push(this)
          keys.push(key)
        }
        
        if (value && typeof value === "object") {
          if (stack.indexOf(value) !== -1) {
            return "[Circular]"
          }
        }
      } else if (isInitialCall) {
        stack.push(value)
        isInitialCall = false
      }
      return value
    }
    
    return JSON.stringify(message, replacer)
  } catch (error: any) {
    return `{"error": "Failed to stringify: ${error.message}"}`
  }
}

export * from '../Interfaces/IVueClass'
export * from './VueClassComponent'
export * from './VueClass'
export * from './Props'
export * from './Watch'
export * from './Computed'
import BaseComponent from '../components/BaseComponent.vue'
import {VueClassComponent} from './VueClassComponent'
const VST = VueClassComponent
export {BaseComponent, VST, VSTType, IVueClass}

window.addEventListener('resize', (event: Event) => $VST.$emit('$VST.viewPortResize'))

