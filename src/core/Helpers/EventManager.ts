/** Класс для управления событиями */
class EventManager {
  private listeners: { [event: string]: ((message: any) => void)[] } = {}
  
  /**
   * Добавление слушателя события
   * @param event
   * @param handler
   */
  addEventListener(event: string, handler: (message: any) => void) {
    if (!this.listeners[event]) {
      this.listeners[event] = []
    }
    this.listeners[event].push(handler)
  }
  
  /**
   * Удаление слушателя события
   * @param event
   * @param handler
   */
  removeEventListener(event: string, handler: (message: any) => void) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(listener => listener !== handler)
    }
  }
  
  /**
   * Генерация пользовательского события
   * @param event
   * @param eventData
   */
  dispatchEvent(event: string, eventData: any) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(listener => listener(eventData))
    }
  }
}
const eventManager = new EventManager()
export default eventManager
