<template lang="pug">
  div(class="mx-auto max-w1024px w100% min-h100% flex")
    div(class="flex px20px py15px w220px min-h100%!")
      GuidesMenu
    div(class="w[calc(100%-260px)]")
      h1 ButtonKitElement
      .row(class="gap-3")
        .col-2
          Button(
            size="lg"
          ) Default (lg)
        .col-2
          Button(
            size="md"
          ) Default (md)
        .col-2(class="flex")
          Button(
            size="sm"
          ) Default (sm)
        .col-2(class="flex")
          Button(
            size="lg"
            theme="black"
          ) Black (lg)
        .col-2(class="flex")
          Button(
            size="md"
            theme="black"
          ) Black (md)
        .col-2(class="flex")
          Button(
            size="sm"
            theme="black"
          ) Black (sm)
        .col-2(class="flex")
          Button(
            size="lg"
            theme="primary"
          ) Primary (lg)
        .col-2(class="flex")
          Button(
            size="md"
            theme="primary"
          ) Primary (md)
        .col-2(class="flex")
          Button(
            size="sm"
            theme="primary"
          ) Primary (sm)
        .col-2(class="flex")
          Button(
            size="lg"
            theme="success"
          ) Success (lg)
        .col-2(class="flex")
          Button(
            size="md"
            theme="success"
          ) Success (md)
        .col-2(class="flex")
          Button(
            size="sm"
            theme="success"
          ) Success (sm)

        //.col-1(class="flex")
        //  Button(
        //    size="md"
        //  )
        //  Button(
        //    theme="yellow"
        //  ) Yellow
        //  Button(
        //    theme="white"
        //  ) White
        //  Button(
        //    theme="grey"
        //  ) Grey
        //  Button(
        //    theme="indigo"
        //  ) Indigo
        //  Button(
        //    theme="purple"
        //  ) Purple
        //  Button(
        //    theme="pink"
        //  ) Pink
        //  Button(
        //    theme="info"
        //  ) Info
        //  Button(
        //    theme="danger"
        //  ) Danger
        //  Button(
        //    theme="warning"
        //  ) Warning
        //  Button(
        //    theme=""
        //  )
        //  Button(
        //    theme=""
        //  )
</template>


<script lang="ts">
import {VST, Prop, BaseComponent} from '../../../core'
import GuidesMenu from '../../../components/Documentation/GuidesMenu.vue'

/**
 * Button documentation with examples
 * @author CHORNY
 * @copyright https://smartrus.org
 */
@VST export default class ButtonKit extends BaseComponent {
  components = {GuidesMenu}
}
</script>

<style lang="sass" scoped>
//span
//  @apply bg-red-200!
</style>

