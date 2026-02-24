# [<img src="https://vue-spear-tip.smartrus.org/VST_LOGO.png" height="50"/>](https://vue-spear-tip.smartrus.org) Vue Spear Tip
#### Reactive OOP frontend programming library on Vue

Vue 3 TypeScript Class Components with @Watch, Computed (as getter), @Prop decorators. 
And UI KIT on them.

## What is the [Vue Spear Tip](https://www.npmjs.com/package/vue-spear-tip)?
**[Vue Spear Tip](https://github.com/smartrusorg/vue-spear-tip)** - is a global wrapper library for Vue 3 components using decorators. It allows you to describe a Vue component as an object-oriented class with inheritance, as well as provides a set of pre-built fields and components assembled from various open-source libraries that we constantly update. We are always looking for ways to improve our offerings.

Built documentation with examples: [vue-spear-tip.smartrus.org](https://vue-spear-tip.smartrus.org "Open demo with docs")

VST uses the Composition API and works with a js proxy. 
Which makes it compatible with current versions of vue.

#### Install
With [Bun.JS](https://bun.sh)
```
bun add vue-spear-tip
```
or with npm
```
npm install vue-spear-tip
```

[//]: # (Use with vite + html/pug + typescript classes + sass/scss)

Need enable experimental decorators in `tsconfig.json`:

```json5
{
  "compilerOptions": {
    // ... another
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true
  }
}
```

Need keep names in `vite.config.ts`:

```json5
{
  // ... another
  esbuild: {
    keepNames : true,
  },
}
```

#### Add kit components styles
```ts
import 'vue-spear-tip/style'
// If need auto resizable .row .col-* styles
import 'vue-spear-tip/grid'
```

#### Use

```vue
<template lang="pug">
  div
    div(class="h30px w200px m10px")
      Button(
        @clickTap="test = 'test'"
      ) Example
</template>


<script lang="ts">
  import {VST, Prop, Watch, BaseComponent, Button} from 'vue-spear-tip'

  /**
   * Component example
   * @author CHORNY
   * @copyright https://smartrus.org
   */
  @VST export default class Example extends BaseComponent {
    components = {Button}
    @Prop(String, null) readonly text: string = ''
    test: string = ''
    anotherParam: string = ''
    
    beforeMount() {
      console.log('test')
    }

    // Declare computed prop
    get computedProp(): boolean {
      return true
    }

    @Watch({deep: true, immediate: true}) watchTest(newVal: string) {
      console.log('test variable changed', newVal)
    }
    
    @Watch watchAnotherParam(newVal: string) {
      console.log('watch anotherParam', newVal)
    }
  }
</script>

<style lang="sass" scoped>
  span
    @apply bg-red-200
</style>

```

