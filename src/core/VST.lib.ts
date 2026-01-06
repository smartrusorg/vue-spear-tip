import {IGlobalVST} from '../Interfaces/IGlobalVST'

/** Непосредственно библиотека VST с глобальными вспомогательными методами */
let VSTLib: IGlobalVST = {} as IGlobalVST

// -----------------------
// Работа с датами
// -----------------------
import DT from './Helpers/DT'
VSTLib.DT = DT


// -----------------------
// Встроенный менеджер событий
// -----------------------
import eventManager from './Helpers/EventManager'
VSTLib.$on = (event: string, callback: (message: any) => any) => {
  eventManager.addEventListener(event, callback)
}
VSTLib.$off = (event: string, callback: (message: any) => any) => {
  eventManager.removeEventListener(event, callback)
}
VSTLib.$emit = (event: string, message?: any) => {
  eventManager.dispatchEvent(event, message)
}


// -----------------------
// Копирование текста в буфер обмена
// -----------------------
VSTLib.copyToClipboard = (text: string): void => {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text)
      .then(() => {
        // console.log('Текст скопирован в буфер обмена')
      })
      .catch(err => {
        console.error('Ошибка при копировании текста: ', err)
      })
  }
  else {
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
VSTLib.generateSecurePassword = (length: number = 18): string => {
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
VSTLib.generateRandomKey = (length: number = 32): string => {
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
VSTLib.safeStringify = (obj: any, space: string | number = 2, maxDepth: number = 20) => {
  const seen = new WeakSet()
  
  const stringifyWithDepth = (key: string, value: any, depth: number = 0): any => {
    if (depth > maxDepth) {
      return '[Max Depth Reached]'
    }
    
    if (value === null || typeof value !== 'object') {
      return value
    }
    
    if (seen.has(value)) {
      return '[Circular]'
    }
    
    if (value instanceof Date) {
      return value.toISOString()
    }
    if (value instanceof RegExp) {
      return value.toString()
    }
    if (value instanceof Error) {
      return {
        name: value.name,
        message: value.message,
        stack: value.stack
      }
    }
    seen.add(value)
    
    if (Array.isArray(value)) {
      return value.map((item, index) => stringifyWithDepth(String(index), item, depth + 1))
    }
    
    const result: any = {}
    for (const [k, v] of Object.entries(value)) {
      result[k] = stringifyWithDepth(k, v, depth + 1)
    }
    
    return result
  }
  
  try {
    const cleaned = stringifyWithDepth('', obj)
    return JSON.stringify(cleaned, null, space)
  } catch (error: any) {
    return `{"error": "Stringify failed: ${error.message}"}`
  }
}


// -----------------------
// Информация об устройстве
// -----------------------
import DeviceInfo from './Helpers/DeviceInfo'
VSTLib.device = () => new DeviceInfo


// -----------------------
// Hammer.js
// -----------------------
import Hammer from './Helpers/Hammer' // @ts-ignore
VSTLib['Hammer'] = Hammer


// -----------------------
// Глобальная, единоразовая подписка на изменения размера окна, для рекативных вычислений внутри базового
// -----------------------
window.addEventListener('resize', (event: Event) => $VST.$emit('$VST.viewPortResize')) // @ts-ignore

// -----------------------
// Регистрация горячих клавиш в компонентах
// -----------------------
VSTLib['__REGISTERED_HOTKEYS'] = {}
window.addEventListener('keydown', (e: KeyboardEvent) => {
  let keyName: string = ''
  let isCtrlOrCmdPressed: boolean = (e.key == 'Meta' && /Mac OS/.test(navigator.userAgent)) || e.ctrlKey
  if(e.code == 'Minus') {
    keyName = '-'
  }
  else if(e.code == 'Equal') {
    keyName = '='
  }
  else if(e.code == 'Enter') {
    keyName = 'enter'
  }
  else if(e.code == 'Escape' || e.key == 'Escape') {
    keyName = 'escape'
  }
  else if(e.code == 'BracketLeft') {
    keyName = '['
  }
  else if(e.code == 'BracketRight') {
    keyName = ']'
  }
  else if(e.code == 'Semicolon') {
    keyName = ';'
  }
  else if(e.code == 'Quote') {
    keyName = "'"
  }
  else if(e.code == 'Backslash') {
    keyName = '\\'
  }
  else if(e.code == 'Comma') {
    keyName = ','
  }
  else if(e.code == 'Period') {
    keyName = '.'
  }
  else if(e.code == 'Slash') {
    keyName = '/'
  }
  else if(e.code == 'Backquote') {
    keyName = '`'
  }
  else if(e.code == 'Unidentified' || e.code == 'f1') {
    keyName = 'f1'
  }
  else if(['f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8', 'f9', 'f10', 'f11', 'f12'].includes(e.code?.toLowerCase())) {
    keyName = e.code?.toLowerCase()
  }
  else {
    keyName = e.code?.toString().toLowerCase()
    if(typeof keyName == 'string') {
      if(keyName.startsWith('digit')) {
        keyName = keyName.slice(5)
      }
      else {
        keyName = keyName.slice(3)
      }
    }
    else {
      keyName = ''
    }
  }
  if(keyName) {
    const key = `${keyName}_${isCtrlOrCmdPressed ? 1 : 0}_${e.altKey ? 1 : 0}_${e.shiftKey ? 1 : 0}`
    if(VSTLib.__REGISTERED_HOTKEYS[key]) {
      e.preventDefault()
      VSTLib.__REGISTERED_HOTKEYS[key].callback(e)
    }
  }
})

export default VSTLib