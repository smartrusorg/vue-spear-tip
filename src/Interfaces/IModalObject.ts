export default interface IModalObject {
  /**
   * Всплывающее блокирующее окно с уведомлением (Информация)
   *
   * @param {String|ModalConfig} contentOrConfig Текст во всплывающем окне или настройки {ModalConfig}
   * @param {() => any} onOk
   * @example
   * Engine.modal.info('Текст всплывающего окна', () => console.log('ok clicked'))
   * @example
   * Engine.modal.info({
   *     content: 'Содержание уведомления',
   *     title: 'Содержание уведомления',
   *     ...
   * })
   */
  info(contentOrConfig: string | ModalConfig, onOk?: () => void): void
  
  /**
   * Всплывающее блокирующее окно с уведомлением (Успех)
   *
   * @param {String|ModalConfig} contentOrConfig Текст во всплывающем окне или настройки {ModalConfig}
   * @param {() => any} onOk
   * @example
   * Engine.modal.success('Текст всплывающего окна', () => console.log('ok clicked'))
   * @example
   * Engine.modal.success({
   *     content: 'Содержание уведомления',
   *     title: 'Содержание уведомления',
   *     ...
   * })
   */
  success(contentOrConfig: string | ModalConfig, onOk?: () => any): void
  
  /**
   * Всплывающее блокирующее окно с уведомлением (Предупреждение)
   *
   * @param {String|ModalConfig} contentOrConfig Текст во всплывающем окне или настройки {ModalConfig}
   * @param {() => any} onOk
   * @example
   * Engine.modal.warning('Текст всплывающего окна', () => console.log('ok clicked'))
   * @example
   * Engine.modal.warning({
   *     content: 'Содержание уведомления',
   *     title: 'Содержание уведомления',
   *     ...
   * })
   */
  warning(contentOrConfig: string | ModalConfig, onOk?: () => any): void
  
  /**
   * Всплывающее блокирующее окно с уведомлением (Ошибка)
   *
   * @param {String|ModalConfig} contentOrConfig Текст во всплывающем окне или настройки {ModalConfig}
   * @param {() => any} onOk
   * @example
   * Engine.modal.error('Текст всплывающего окна', () => console.log('ok clicked'))
   * @example
   * Engine.modal.error({
   *     content: 'Содержание уведомления',
   *     title: 'Содержание уведомления',
   *     ...
   * })
   */
  error(contentOrConfig: string | ModalConfig, onOk?: () => any): void
  
  /**
   * Всплывающее блокирующее окно с уведомлением (Вопрос)
   *
   * @param {String|ModalConfig} contentOrConfig Текст во всплывающем окне или настройки {ModalConfig}
   * @param {() => any} onOk
   * @example
   * Engine.modal.question(
   *     'Текст всплывающего окна',
   *     () => console.log('ok clicked')
   * )
   * @example
   * Engine.modal.success({
   *     content: 'Содержание уведомления',
   *     title: 'Содержание уведомления',
   *     ...
   * })
   */
  question(contentOrConfig: string | ModalConfig, onOk?: () => any): void
  
  /**
   * Всплывающее блокирующее окно уведомления с подтверждением действия (Информация)
   *
   * @param {String|ModalConfig} contentOrConfig Текст во всплывающем окне или настройки {ModalConfig}
   * @param {() => any} onCancel Метод вызываемый при подтверждении
   * @param {() => any} onConfirm Метод вызываемый при отмене
   * @example
   * Engine.modal.confirmInfo(
   *     'Текст всплывающего окна',
   *     () => console.log('confirmed'),
   *     () => console.log('canceled')
   * )
   * @example
   * Engine.modal.confirmInfo({
   *     content: 'Содержание уведомления',
   *     title: 'Содержание уведомления',
   *     ...
   * })
   */
  confirmInfo(
    contentOrConfig: string | ModalConfig,
    onConfirm?: undefined | (() => any),
    onCancel?: undefined | (() => any),
  ): void
  
  /**
   * Всплывающее блокирующее окно уведомления с подтверждением действия (Успех)
   *
   * @param {String|ModalConfig} contentOrConfig Текст во всплывающем окне или настройки {ModalConfig}
   * @param {() => any} onCancel Метод вызываемый при подтверждении
   * @param {() => any} onConfirm Метод вызываемый при отмене
   * @example
   * Engine.modal.confirmSuccess(
   *     'Текст всплывающего окна',
   *     () => console.log('confirmed'),
   *     () => console.log('canceled')
   * )
   * @example
   * Engine.modal.confirmSuccess({
   *     content: 'Содержание уведомления',
   *     title: 'Содержание уведомления',
   *     ...
   * })
   */
  confirmSuccess(
    contentOrConfig: string | ModalConfig,
    onConfirm?: undefined | (() => any),
    onCancel?: undefined | (() => any),
  ): void
  
  /**
   * Всплывающее блокирующее окно уведомления с подтверждением действия (Предупреждение)
   *
   * @param {String|ModalConfig} contentOrConfig Текст во всплывающем окне или настройки {ModalConfig}
   * @param {() => any} onCancel Метод вызываемый при подтверждении
   * @param {() => any} onConfirm Метод вызываемый при отмене
   * @example
   * Engine.modal.confirmError(
   *     'Текст всплывающего окна',
   *     () => console.log('confirmed'),
   *     () => console.log('canceled')
   * )
   * @example
   * Engine.modal.confirmError({
   *     content: 'Содержание уведомления',
   *     title: 'Содержание уведомления',
   *     ...
   * })
   */
  confirmWarning(
    contentOrConfig: string | ModalConfig,
    onConfirm?: undefined | (() => any),
    onCancel?: undefined | (() => any),
  ): void
  
  /**
   * Всплывающее блокирующее окно уведомления с подтверждением действия (Ошибка)
   *
   * @param {String|ModalConfig} contentOrConfig Текст во всплывающем окне или настройки {ModalConfig}
   * @param {() => any} onCancel Метод вызываемый при подтверждении
   * @param {() => any} onConfirm Метод вызываемый при отмене
   * @example
   * Engine.modal.confirmError(
   *     'Текст всплывающего окна',
   *     () => console.log('confirmed'),
   *     () => console.log('canceled')
   * )
   * @example
   * Engine.modal.confirmError({
   *     content: 'Содержание уведомления',
   *     title: 'Содержание уведомления',
   *     ...
   * })
   */
  confirmError(
    contentOrConfig: string | ModalConfig,
    onConfirm?: undefined | (() => any),
    onCancel?: undefined | (() => any),
  ): void
  
  /**
   * Всплывающее блокирующее окно уведомления с подтверждением действия (Вопрос)
   *
   * @param {String|ModalConfig} contentOrConfig Текст во всплывающем окне или настройки {ModalConfig}
   * @param {() => any} onCancel Метод вызываемый при подтверждении
   * @param {() => any} onConfirm Метод вызываемый при отмене
   * @example
   * Engine.modal.confirmQuestion(
   *     'Текст всплывающего окна',
   *     () => console.log('confirmed'),
   *     () => console.log('canceled')
   * )
   * @example
   * Engine.modal.confirmQuestion({
   *     content: 'Содержание уведомления',
   *     title: 'Содержание уведомления',
   *     ...
   * })
   */
  confirmQuestion(
    contentOrConfig: string | ModalConfig,
    onConfirm?: undefined | (() => any),
    onCancel?: undefined | (() => any),
  ): void
  
  /**
   * Всплывающее блокирующее prompt окно уведомления с подтверждением действия (Информация)
   *
   * @param {String|ModalConfig} contentOrConfig Текст во всплывающем окне или настройки {ModalConfig}
   * @param {() => any|undefined} validateError Валидация входящего текста
   * @see {ModalPromptConfig.validateError}
   * @param {() => any} onCancel Метод вызываемый при подтверждении
   * @param {() => any} onConfirm Метод вызываемый при отмене
   * @example
   * Engine.modal.promptInfo(
   *     'Текст всплывающего окна',
   *     (input: string, $input: any, $confirmButton: any) => {
   *        return !input?.trim().length ? 'Необходимо заполнить поле' : false
   *     },
   *     () => console.log('confirmed'),
   *     () => console.log('canceled')
   * )
   * @example
   * Engine.modal.promptInfo({
   *     title : 'Заголовок окна',
   *     validateError(input: string, $input: any, $confirmButton: any) {
   *        return !input?.trim().length ? 'Необходимо заполнить поле' : false
   *     },
   *     ...
   * })
   */
  promptInfo(
    contentOrConfig: ModalPromptConfig | string,
    validateError?: (input: string, $input: any, $confirmButton: any) => {},
    onConfirm?: undefined | (() => any),
    onCancel?: undefined | (() => any),
  ): void
  
  /**
   * Всплывающее блокирующее prompt окно уведомления с подтверждением действия (Успех)
   *
   * @param {String|ModalConfig} contentOrConfig Текст во всплывающем окне или настройки {ModalConfig}
   * @param {() => any|undefined} validateError Валидация входящего текста
   * @see {ModalPromptConfig.validateError}
   * @param {() => any} onCancel Метод вызываемый при подтверждении
   * @param {() => any} onConfirm Метод вызываемый при отмене
   * @example
   * Engine.modal.promptSuccess(
   *     'Текст всплывающего окна',
   *     (input: string, $input: any, $confirmButton: any) => {
   *        return !input?.trim().length ? 'Необходимо заполнить поле' : false
   *     },
   *     () => console.log('confirmed'),
   *     () => console.log('canceled')
   * )
   * @example
   * Engine.modal.promptSuccess({
   *     title : 'Заголовок окна',
   *     validateError(input: string, $input: any, $confirmButton: any) {
   *        return !input?.trim().length ? 'Необходимо заполнить поле' : false
   *     },
   *     ...
   * })
   */
  promptSuccess(
    contentOrConfig: ModalPromptConfig | string,
    validateError?: (input: string, $input: any, $confirmButton: any) => {},
    onConfirm?: undefined | (() => any),
    onCancel?: undefined | (() => any),
  ): void
  
  /**
   * Всплывающее блокирующее prompt окно уведомления с подтверждением действия (Предупреждение)
   *
   * @param {String|ModalConfig} contentOrConfig Текст во всплывающем окне или настройки {ModalConfig}
   * @param {() => any|undefined} validateError Валидация входящего текста
   * @see {ModalPromptConfig.validateError}
   * @param {() => any} onCancel Метод вызываемый при подтверждении
   * @param {() => any} onConfirm Метод вызываемый при отмене
   * @example
   * Engine.modal.promptWarning(
   *     'Текст всплывающего окна',
   *     (input: string, $input: any, $confirmButton: any) => {
   *        return !input?.trim().length ? 'Необходимо заполнить поле' : false
   *     },
   *     () => console.log('confirmed'),
   *     () => console.log('canceled')
   * )
   * @example
   * Engine.modal.promptWarning({
   *     title : 'Заголовок окна',
   *     validateError(input: string, $input: any, $confirmButton: any) {
   *        return !input?.trim().length ? 'Необходимо заполнить поле' : false
   *     },
   *     ...
   * })
   */
  promptWarning(
    contentOrConfig: ModalPromptConfig | string,
    validateError?: (input: string, $input: any, $confirmButton: any) => {},
    onConfirm?: undefined | (() => any),
    onCancel?: undefined | (() => any),
  ): void
  
  /**
   * Всплывающее блокирующее prompt окно уведомления с подтверждением действия (Ошибка)
   *
   * @param {String|ModalPromptConfig} contentOrConfig Текст во всплывающем окне или настройки {ModalConfig}
   * @param {ModalPromptConfig.validateError|undefined} validateError Валидация входящего текста
   * @param {() => any} onCancel Метод вызываемый при подтверждении
   * @param {() => any} onConfirm Метод вызываемый при отмене
   * @example
   * Engine.modal.promptError(
   *     'Текст всплывающего окна',
   *     (input: string, $input: any, $confirmButton: any) => {
   *        return !input?.trim().length ? 'Необходимо заполнить поле' : false
   *     },
   *     () => console.log('confirmed'),
   *     () => console.log('canceled')
   * )
   * @example
   * Engine.modal.promptError({
   *     title : 'Заголовок окна',
   *     validateError(input: string, $input: any, $confirmButton: any) {
   *        return !input?.trim().length ? 'Необходимо заполнить поле' : false
   *     },
   *     ...
   * })
   */
  promptError(
    contentOrConfig: ModalPromptConfig | string,
    validateError?: (input: string, $input: any, $confirmButton: any) => {},
    onConfirm?: undefined | (() => any),
    onCancel?: undefined | (() => any),
  ): void
  
  /**
   * Всплывающее блокирующее prompt окно уведомления с подтверждением действия (Вопрос)
   *
   * @param {String|ModalConfig} contentOrConfig Текст во всплывающем окне или настройки {ModalConfig}
   * @param {() => any|undefined} validateError Валидация входящего текста
   * @see {ModalPromptConfig.validateError}
   * @param {() => any} onCancel Метод вызываемый при подтверждении
   * @param {() => any} onConfirm Метод вызываемый при отмене
   * @example
   * Engine.modal.promptQuestion(
   *     'Текст всплывающего окна',
   *     (input: string, $input: any, $confirmButton: any) => {
   *        return !input?.trim().length ? 'Необходимо заполнить поле' : false
   *     },
   *     () => console.log('confirmed'),
   *     () => console.log('canceled')
   * )
   * @example
   * Engine.modal.promptQuestion({
   *     title : 'Заголовок окна',
   *     validateError(input: string, $input: any, $confirmButton: any) {
   *        return !input?.trim().length ? 'Необходимо заполнить поле' : false
   *     },
   *     ...
   * })
   */
  promptQuestion(
    contentOrConfig: ModalPromptConfig | string,
    validateError?: (input: string, $input: any, $confirmButton: any) => {},
    onConfirm?: undefined | (() => any),
    onCancel?: undefined | (() => any),
  ): void
}


/**
 * Конфигурация модального окна
 */
export interface ModalConfig {
  /**
   * Содержание модального окна, можно использовать глобальные vue компоненты
   */
  content?: string
  /**
   * Заголовок окна
   */
  title?: string
  /**
   * Класс иконки отображаемый в заголовке
   * По умолчанию отображаются иконки согласно типу окна
   */
  icon?: string
  /**
   * Функция срабатывающая после открытия окна и монтирования vue элементов
   * @param {object} modal Vue из контента модального окна
   * @param {object} vueComponents объявленные vue компоненты в глобальной переменной
   * @param {number} id Идентификатор окна
   */
  onMount?(/*modal: $I.Frontend.Components.Modal, vueComponents?: IModalComponent, id?: number*/): any
  /**
   * @alias onMount
   */
  onOpen?(/*modal: $I.Frontend.Components.Modal, vueComponents?: IModalComponent, id?: number*/): any
  /**
   * Функция срабатывающая при подтверждении
   * @param {IModalComponent} vueComponent Vue из контента модального окна
   * @param {object} vueComponentParams Props
   */
  onConfirm?(/*modal: $I.Frontend.Components.Modal, vueComponents?: IModalComponent, id?: number*/): any
  /**
   * @alias onCancel так же срабатывает ак onConfirm при открытом окне с одной кнопкой
   */
  onOk?(/*modal: $I.Frontend.Components.Modal, vueComponentParams?: {[key: string]: any}*/): any
  /**
   * Включена ли кнопка подтверждения, если указан onConfirm и confirmEnable не указан явно,
   * то включена, иначе false
   */
  confirmEnable?: boolean
  /**
   * Закрывать ли модальное окно по клику на confirm, по умолчанию false
   */
  confirmCloseDisable?: boolean
  /**
   * Текст на кнопке подтверждения, по умолчанию "Подтвердить"
   */
  confirmText?: string
  /**
   * Функция срабатывающая при отмене действия
   * @param {IModalComponent} vueComponent Vue из контента модального окна
   * @param {object} vueComponentParams Props
   * @return Если вернуть false то окно закрыто не будет
   */
  onCancel?(/*vueComponent?: IModalComponent, vueComponentParams?: {[key: string]: any}*/): false|void
  /**
   * Текст на кнопке подтверждения, по умолчанию "Отмена" если кнопка одна то "Ок"
   */
  cancelText?: string
  /**
   * Функция срабатывающая при нажатии на среднюю кнопку
   * @param {vueComponent} vueComponent Vue из контента модального окна
   * @param {object} vueComponentParams объявленные vue компоненты в глобальной переменной
   */
  onDeny?(/*vueComponent?: IModalComponent, vueComponentParams?: {[key: string]: any}*/): any
  /**
   * Включена ли средняя подтверждения, если указан onDeny и onDeny не указан явно, то включена, иначе false
   */
  denyEnable?: boolean
  /**
   * Закрывать ли модальное окно по клику на deny, по умолчанию false
   */
  denyCloseDisable?: boolean
  /**
   * Текст на кнопке подтверждения, по умолчанию "Отказаться"
   */
  denyText?: string
  
  /**
   * Длина окна в css (например '100px'). По умолчанию подстраивается под длину контента, min-width: 40em;
   */
  width?: string
  
  /**
   * Css стиль применяемы блоку окна
   */
  style?: string
  
  styles?: ModalStyles
  
  /**
   * Css стиль применяемы ко всему блоку модального окна, вместе с фоном
   */
  styleModal?: string
  
  component?: string,
  componentParams?: {[key: string]: any},
  
  /** Выход по нажатию клавиши ESC. По умолчанию выключен. Применять для одиночных окон. */
  escapeExit?: true,
}

export interface ModalStyles {
  icon?: string
  color?: string
  titleBgColor?: string
  titleColor?: string
  denyColor?: string
  denyBgColor?: string
  denyShine?: true
  confirmButtonBorderColor?: string
}

export interface ModalPromptConfig extends ModalConfig {
  /**
   * Валидация данных из поля prompt перед подтверждением.
   * Если вернуть строку, она будет отображена как ошибка.
   * Если вернуть true или null, то кнопка подтвердить будет не активна.
   * При том, что если вернуть true будет подсвечено поле красным, если null то нет
   * Если вернуть false, значит ошибки нет и валидация корректна
   * @param {string} value Текстовое значение с применённым trim (value.trim()) на пробелы
   * @param {Element} promptInput Элемент input prompt окна
   * @param {Element} promptConfirmButton Элемент кнопки prompt окна
   */
  validateError?: ((value: string, promptInput?: Element, promptConfirmButton?: Element) => boolean | string | null) | undefined
  /** Значение вставляемое в поле prompt при открытии окна */
  defaultValue?: string
  /** Сделать форму ввода не input, а textarea */
  asTextarea?: boolean
  /**
   * Функция срабатывающая при подтверждении
   * @param {object} modal Vue из контента модального окна
   * @param {string} vueOrPromptValue возвращаемое значение из prompt
   */
  onConfirm?(modal?: {[key: string]: any}, vueOrPromptValue?: {[key: string]: any}|string/*|IModalComponent*/): any
}