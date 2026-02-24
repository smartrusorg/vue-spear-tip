/**
 * Регистрация метаданных компонентов в памяти
 */

export const metadataRegistry = new WeakMap<any, any>()

export function getMeta(constructor: any) {
  if (!metadataRegistry.has(constructor)) {
    metadataRegistry.set(constructor, {
      props: {}, watch: {}, watchEffect: {}, watchEffectPost: {}, computed: {},
      emits: [], emitsParent: [], provide: [], provideParent: [],
      inject: [], injectParent: [], components: [], componentsParent: [],
    })
  }
  return metadataRegistry.get(constructor)
}
