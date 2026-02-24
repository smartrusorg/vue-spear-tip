import {getMeta} from '../registry'

/**
 * Трансформация метода в vue watchPostEffect(...) функцию.
 *
 * ```js
 * @VST export default class Component extends BaseComponent {
 *  // Автоматически начинает отслеживать параметр "loading"
 *  @WatchPostEffect watchLoading() {
 *     // при использовании переменных из класса в этом месте декорируемый метод будет вызван
 *   }
 * }
 * ```
 * @constructor
 */

export function WatchPostEffect(target: any, methodName: string): void {
  const meta = getMeta(target.constructor);
  if (!meta.watchPostEffect) meta.watchPostEffect = []
  
  meta.watchPostEffect.push({ methodName })
}
