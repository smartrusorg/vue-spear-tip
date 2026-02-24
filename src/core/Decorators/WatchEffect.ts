import {getMeta} from '../registry'

/**
 * Трансформация метода в vue watchEffect(...) функцию.
 *
 * ```js
 * @VST export default class Component extends BaseComponent {
 *  // Автоматически начинает отслеживать параметр "loading"
 *  @WatchEffect watchLoading(inLoading: boolean) {
 *     // Действия при изменении this.loading
 *   }
 * }
 * ```
 * @constructor
 */

export function WatchEffect(target: any, methodName: string): void {
  const meta = getMeta(target.constructor)
  if (!meta.watchEffect) meta.watchEffect = []
  
  meta.watchEffect.push({ methodName })
}
