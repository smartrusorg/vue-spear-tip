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

window.addEventListener('resize', (event: Event) => $VST.$emit('$VST.viewPortResize'))

export default VSTLib