import {getMeta} from '../registry'

/**
 * Трансформация метода в vue watchSyncEffect(...) функцию.
 *
 * ```js
 * @VST export default class Component extends BaseComponent {
 *  // Автоматически начинает отслеживать параметр "loading"
 *  @WatchSyncEffect watchLoading() {
 *     // при использовании переменных из класса в этом месте декорируемый метод будет вызван
 *   }
 * }
 * ```
 * @constructor
 */

export function WatchSyncEffect(target: any, methodName: string): void {
  const meta = getMeta(target.constructor);
  if (!meta.watchSyncEffect) meta.watchSyncEffect = []
  
  meta.watchSyncEffect.push({ methodName })
}
