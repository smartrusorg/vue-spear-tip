/** SSR-признак: код библиотеки должен импортироваться и в Node/Bun без DOM (ED-58). */
export const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined'

/** Безопасный `window`: на сервере — undefined (обращения только под `isBrowser`). */
export const safeWindow: any = isBrowser ? window : undefined

/** Безопасный `document`: на сервере — undefined. */
export const safeDocument: any = isBrowser ? document : undefined

/** Безопасный `navigator`: на сервере — заглушка, чтобы `userAgent`/`language` не падали. */
export const safeNavigator: any = typeof navigator !== 'undefined'
  ? navigator
  : {userAgent: 'SSR', language: 'en', languages: ['en'], maxTouchPoints: 0}

/**
 * Размеры окна с серверными значениями по умолчанию (0 = «неизвестно»).
 * SSR-разметка не зависит от размера: классы режима проставит клиент после гидратации.
 */
export const viewportSize = (): {width: number, height: number} => isBrowser
  ? {width: window.innerWidth, height: window.innerHeight}
  : {width: 0, height: 0}
