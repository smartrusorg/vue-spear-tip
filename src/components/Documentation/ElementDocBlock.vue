<template lang="pug">
  //div(class="flex flex-col fixed")
  div
    div
      Tabs
        template(#$title-default)
          slot(name="$title-default")
            div Examples
        template(#default)
          slot
            div No content Examples

        template(#$title-props)
          slot(name="$title-props")
            div @Props
        template(#props)
          slot(name="props")
            div Props not set

        template(#$title-events)
          slot(name="$title-events")
            div @Events
        template(#events)
          slot(name="events") Events not set

        template(#$title-methods)
          slot(name="$title-events")
            div Methods
        template(#methods)
          slot(name="methods")
            div Methods not set

        template(#$title-refs)
          slot(name="$title-refs")
            div Referenses
        template(#refs)
          slot(name="refs")
            div List of references not set

    //div(class="mt20px")
    //  div Template example
    //  CodeHighlight(
    //    lang="pug"
    //    class="h35px mb50px"
    //    :code=`[
    //      {
    //        copy: true,
    //        lang: 'bash',
    //        title: 'PUG',
    //        code: "curl -fsSL https://bun.com/install | bash # for macOS, Linux, and WSL'm"
    //      },
    //      {
    //        copy: true,
    //        lang: 'bash',
    //        title: 'HTML',
    //        code: 'powershell -c "irm bun.sh/install.ps1|iex"'
    //      }
    //    ]`
    //  )
    //
    //div
    //  div Include in component
    //  CodeHighlight(
    //    lang="pug"
    //    class="h35px mb50px"
    //    :code=`[
    //      {
    //        copy: true,
    //        lang: 'bash',
    //        title: '@VST TS',
    //        code: "curl -fsSL https://bun.com/install | bash # for macOS, Linux, and WSL'm"
    //      },
    //      {
    //        copy: true,
    //        lang: 'bash',
    //        title: 'Composition API',
    //        code: 'powershell -c "irm bun.sh/install.ps1|iex"'
    //      },
    //      {
    //        copy: true,
    //        lang: 'bash',
    //        title: 'Options API',
    //        code: 'powershell -c "irm bun.sh/install.ps1|iex"'
    //      }
    //    ]`
    //  )
</template>


<script lang="ts">
import {VST, Prop, VueClass} from '../../core'

/**
 * Блок с отображением
 * @author CHORNY
 * @copyright https://smartrus.org
 */
@VST export default class ElementDocBlock extends VueClass {
  @Prop(Boolean) readonly vModelSupport: boolean = false
  beforeMount() {
    // this.routes = [...GuidesRoutes, ...KitRoutes]
  }
}

export interface IElementDocBlockData {

}

</script>

<style lang="sass" scoped>
//span
//  @apply bg-red-200!
</style>

