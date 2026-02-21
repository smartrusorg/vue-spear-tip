# [<img src="https://vue-spear-tip.smartrus.org/VST_LOGO.png" height="50"/>](https://vue-spear-tip.smartrus.org) Vue Spear Tip
#### Reactive OOP frontend programming library on Vue

Vue 3 TypeScript Class Components with @Watch, @Computed, @Prop decorators. 
And UI KIT on them.

## What is the Vue Spear Tip?
**Vue Spear Tip** - is a global wrapper library for Vue 3 components using decorators. It allows you to describe a Vue component as an object-oriented class with inheritance, as well as provides a set of pre-built fields and components assembled from various open-source libraries that we constantly update. We are always looking for ways to improve our offerings.

Built documentation with examples: [vue-spear-tip.smartrus.org](https://vue-spear-tip.smartrus.org "Open demo with docs")

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
    
    beforeMount() {
      console.log('test')
    }
    
    @Watch('test', false /* deep */, false /* immediate */) watchTest(newVal: string) {
      console.log('test variable changed', newVal)
    }
    
    // Declare computed prop
    get computedProp(): boolean {
      return true
    }
  }
</script>

<style lang="sass" scoped>
  span
    @apply bg-red-200
</style>

```

