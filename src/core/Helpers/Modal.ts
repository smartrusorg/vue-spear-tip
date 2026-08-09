export default function Modal() { // @ts-expect-error
  const iModal = $VST._modal
  const modal = iModal.display // @ts-expect-error
  delete $VST._modal // @ts-expect-error
  $VST.modal = {} // @ts-expect-error
  window['alert'] = $VST.modal.info = (content:any, onOk = undefined) => {
    modal({
      ...{
        content: (content?.message || content?.content) ?? typeof content == 'string' 
          ? `<div style="text-align: center">${content}</div>` : '',
        onOk: content?.onOk ?? onOk,
        onOpen: content?.onOpen,
        onMount: content?.onMount,
        type: 'info',
      },
      ...(typeof content == 'object' ? content : {}),
    })
  } // @ts-expect-error
  $VST.modal.warning = (content:any, onOk = undefined) => {
    modal({
      ...{
        content: (content?.message || content?.content) ?? typeof content == 'string' 
          ? `<div style="text-align: center">${content}</div>` : '',
        onOk: content?.onOk ?? onOk,
        type: 'warning',
      },
      ...(typeof content == 'object' ? content : {}),
    })
  } // @ts-expect-error
  $VST.modal.error = $VST.modal.danger = $VST.modal.error = (content:any, onOk = undefined) => {
    modal({
      ...{
        content: (content?.message || content?.content) ?? typeof content == 'string' 
          ? `<div style="text-align: center">${content}</div>` : '',
        onOk: content?.onOk ?? onOk,
        onOpen: content?.onOpen,
        onMount: content?.onMount,
        type: 'danger',
      },
      ...(typeof content == 'object' ? content : {}),
    })
  } // @ts-expect-error
  $VST.modal.success = (content:any, onOk = undefined) => {
    modal({
      ...{
        content: (content?.message || content?.content) ?? typeof content == 'string' 
          ? `<div style="text-align: center">${content}</div>` : '',
        onOk: content?.onOk ?? onOk,
        onOpen: content?.onOpen,
        onMount: content?.onMount,
        type: 'success',
      },
      ...(typeof content == 'object' ? content : {}),
    })
  } // @ts-expect-error
  $VST.modal.question = (content:any, onOk = undefined) => {
    modal({
      ...{
        content: (content?.message || content?.content) ?? typeof content == 'string' 
          ? `<div style="text-align: center">${content}</div>` : '',
        onOk: content?.onOk ?? onOk,
        onOpen: content?.onOpen,
        onMount: content?.onMount,
        type: 'question',
      },
      ...(typeof content == 'object' ? content : {}),
    })
  } // @ts-expect-error
  $VST.modal.confirmInfo = (content:any, onConfirm = () => {}, onCancel = {}) => {
    modal({
      ...{
        content: (content?.message || content?.content) ?? typeof content == 'string' 
          ? `<div style="text-align: center">${content}</div>` : '',
        onConfirm: content?.onConfirm ?? onConfirm,
        onCancel: content?.onCancel ?? onCancel,
        onOpen: content?.onOpen,
        onMount: content?.onMount,
        type: 'info',
      },
      ...(typeof content == 'object' ? content : {}),
    })
  } // @ts-expect-error
  $VST.modal.confirmWarning = (content:any, onConfirm = () => {}, onCancel = {}) => {
    modal({
      ...{
        content: (content?.message || content?.content) ?? typeof content == 'string' 
          ? `<div style="text-align: center">${content}</div>` : '',
        onConfirm: content?.onConfirm ?? onConfirm,
        onCancel: content?.onCancel ?? onCancel,
        onOpen: content?.onOpen,
        onMount: content?.onMount,
        type: 'warning',
      },
      ...(typeof content == 'object' ? content : {}),
    })
  } // @ts-expect-error
  $VST.modal.confirmError = $VST.modal.confirmDanger = (
    content: any,
    onConfirm = () => {},
    onCancel = {}
  ) => {
    modal({
      ...{
        content: (content?.message || content?.content) ?? typeof content == 'string' ? `<div style="text-align: center">${content}</div>` : '',
        onConfirm: content?.onConfirm ?? onConfirm,
        onCancel: content?.onCancel ?? onCancel,
        onOpen: content?.onOpen,
        onMount: content?.onMount,
        type: 'danger',
      },
      ...(typeof content == 'object' ? content : {}),
    })
  } // @ts-expect-error
  $VST.modal.confirmSuccess = (content:any, onConfirm = () => {}, onCancel = {}) => {
    modal({
      ...{
        content: (content?.message || content?.content) ?? typeof content == 'string' ? `<div style="text-align: center">${content}</div>` : '',
        onConfirm: content?.onConfirm ?? onConfirm,
        onCancel: content?.onCancel ?? onCancel,
        onOpen: content?.onOpen,
        onMount: content?.onMount,
        type: 'success',
      },
      ...(typeof content == 'object' ? content : {}),
    })
  } // @ts-expect-error
  $VST.modal.confirmQuestion = (content:any, onConfirm = () => {}, onCancel = {}) => {
    modal({
      ...{
        content: (content?.message || content?.content) ?? typeof content == 'string' ? `<div style="text-align: center">${content}</div>` : '',
        onConfirm: content?.onConfirm ?? onConfirm,
        onCancel: content?.onCancel ?? onCancel,
        onOpen: content?.onOpen,
        onMount: content?.onMount,
        type: 'question',
      },
      ...(typeof content == 'object' ? content : {}),
    })
  }
  const prompt = (data: any) => {
    let vError: any
    if (typeof data?.validateError != 'function') {
      // @ts-ignore
      vError = function (val) {
        if (!val.length) {
          return null
        }
      }
    }
    else {
      vError = data.validateError
    }
    const tempId = Date.now() + Math.ceil(Math.random() * 100000)
    const input = `<div class="form-group mx-4" style="margin-top: 5px;">
      ${data?.asTextarea
      ? `<textarea
            id="sm-modal-prompt-input" class="form-control" placeholder="Введите текст"
            style="padding: 8px; min-height: 280px; min-width: 280px"
          ></textarea>`
      : `<input type="text" placeholder="Введите текст" id="sm-modal-prompt-input" class="form-control">`}
        <div id="sm-modal-prompt-error" class="text-danger" style="display: none; font-size: 11px"></div>
    </div>`
    const obj = {
      ...(typeof data == 'object' ? data : {}),
      ...{
        id: tempId,
        content: (typeof data == 'string' ? data : data?.content ?? '') + input,
        onCancel: data?.onCancel,
        confirmCloseDisable: true,
        onOpen(modal: any) { // Гига чат помогал от jquery отвязать, протестировать если что и глянуть по истории
          let confirmButton: HTMLInputElement | null
          let inputField: HTMLInputElement | null
          if (typeof vError == 'function') {
            let error: any
            let confirmed: boolean = false
            const confirm = (sendConfirm: boolean = false) => {
              if (!confirmed && sendConfirm) {
                confirmed = true
                if (typeof data.onConfirm == 'function') {
                  data.onConfirm(modal, inputField?.value)
                }
              }
              $VST.vueModalComponent!.closeModal(tempId)
            } // @ts-expect-error
            
            confirmButton = document.getElementById(`modal-${tempId}`) as HTMLDivElement
            if (confirmButton) {
              confirmButton.classList.add('sm-modal-confirm-button')
              confirmButton.removeEventListener('click', () => {})
              confirmButton.removeEventListener('keyup', () => {})
              confirmButton.removeEventListener('keydown', () => {})
            }
            
            inputField = document.getElementById('sm-modal-prompt-input')! as HTMLInputElement
            if (inputField) {
              inputField.value = data?.defaultValue ?? ''
              inputField.removeEventListener('click', () => {})
              inputField.removeEventListener('keyup', () => {})
              inputField.removeEventListener('keydown', () => {})
              if (confirmButton) {
                confirmButton.disabled = !inputField.value.length
              }
              
              inputField.addEventListener('input', (e) => {
                error = vError(inputField!.value.trim(), inputField, confirmButton)
                
                inputField!.addEventListener('keydown', (e) => {
                  if (
                    e.key.toLowerCase() === 'enter'
                    && ((data?.asTextarea && e.ctrlKey) || !data?.asTextarea)
                    && error === false
                  ) {
                    confirm(true)
                  }
                  if (e.key.toLowerCase() === 'escape') {
                    $VST.vueModalComponent!.closeModal(tempId)
                  }
                })
                
                if (error) {
                  if (confirmButton) {
                    confirmButton.disabled = true
                  }
                  inputField!.classList.add('sm-is-invalid')
                  if (typeof error === 'string') {
                    const errorElement = document.getElementById('sm-modal-prompt-error')
                    if (errorElement) {
                      errorElement.innerHTML = error
                      errorElement.style.display = 'block'
                    }
                  }
                  return false
                }
                if (error === null) {
                  if (confirmButton) { // @ts-ignore
                    confirmButton.disabled = true
                  }
                  const errorElement = document.getElementById('sm-modal-prompt-error')
                  if (errorElement) {
                    errorElement.innerHTML = ''
                    errorElement.style.display = 'none'
                  }
                  inputField!.classList.remove('sm-is-invalid')
                } else {
                  if (confirmButton) { // @ts-ignore
                    confirmButton.disabled = false
                  }
                  const errorElement = document.getElementById('sm-modal-prompt-error')
                  if (errorElement) {
                    errorElement.innerHTML = ''
                    errorElement.style.display = 'none'
                  }
                  inputField!.classList.remove('sm-is-invalid')
                  
                  confirmButton?.removeEventListener('click', () => {})
                  confirmButton?.addEventListener('click', (e) => {
                    e.preventDefault()
                    confirm()
                  })
                }
              })
              
              inputField.focus()
            }
            
            if (data?.defaultValue?.length) {
              inputField?.dispatchEvent(new Event('keyup'))
            }
          }
        },
      },
    }
    modal(obj)
  } // @ts-expect-error
  $VST.modal.promptInfo = (content:any, validateError = undefined, onConfirm = () => {}, onCancel = {}) =>
    prompt({
      ...{
        content: (content?.message || content?.content) ?? typeof content == 'string' ? `<div style="text-align: center">${content}</div>` : '',
        validateError: content?.validateError ?? validateError,
        onConfirm: content?.onConfirm ?? onConfirm,
        onCancel: content?.onCancel ?? onCancel,
        type: 'info',
      },
      ...(typeof content == 'object' ? content : {}),
    }) // @ts-expect-error
  $VST.modal.promptWarning = (content:any, validateError = undefined, onConfirm = () => {}, onCancel = {}) =>
    prompt({
      ...{
        content: (content?.message || content?.content) ?? typeof content == 'string' ? `<div style="text-align: center">${content}</div>` : '',
        validateError: content?.onConfirm ?? onConfirm,
        onConfirm: content?.onConfirm ?? onConfirm,
        onCancel: content?.onCancel ?? onCancel,
        type: 'warning',
      },
      ...(typeof content == 'object' ? content : {}),
    }) // @ts-expect-error
  
  $VST.modal.promptError = $VST.modal.promptDanger = (
    content: any,
    validateError: any = undefined,
    onConfirm = () => {},
    onCancel = {}
  ) =>
    prompt({
      ...{
        content: (content?.message || content?.content) ?? typeof content == 'string' ? `<div style="text-align: center">${content}</div>` : '',
        validateError: content?.validateError ?? validateError,
        onConfirm: content?.onConfirm ?? onConfirm,
        onCancel: content?.onCancel ?? onCancel,
        type: 'danger',
      },
      ...(typeof content == 'object' ? content : {}),
    }) // @ts-expect-error
  $VST.modal.promptSuccess = (content:any, validateError = undefined, onConfirm = () => {}, onCancel = {}) =>
    prompt({
      ...{
        content: (content?.message || content?.content) ?? typeof content == 'string' ? `<div style="text-align: center">${content}</div>` : '',
        validateError: content?.validateError ?? validateError,
        onConfirm: content?.onConfirm ?? onConfirm,
        onCancel: content?.onCancel ?? onCancel,
        type: 'success',
      },
      ...(typeof content == 'object' ? content : {}),
    }) // @ts-expect-error
  $VST.modal.promptQuestion = (content:any, validateError = undefined, onConfirm = () => {}, onCancel = {}) =>
    prompt({
      ...{
        content: (content?.message || content?.content) ?? typeof content == 'string' ? `<div style="text-align: center">${content}</div>` : '',
        validateError: content?.validateError ?? validateError,
        onConfirm: content?.onConfirm ?? onConfirm,
        onCancel: content?.onCancel ?? onCancel,
        type: 'question',
      },
      ...(typeof content == 'object' ? content : {}),
    }) // @ts-expect-error
  
  $VST.modal.closeAllModals = () => iModal.closeAllModals()
  
}