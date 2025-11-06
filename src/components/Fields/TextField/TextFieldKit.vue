<template lang="pug">
  div(class="mx-auto max-w1024px w100% min-h100% flex")
    div(class="flex px20px py15px w220px min-h100%!")
      GuidesMenu
    div(class="w[calc(100%-260px)]")
      h1 TextField
      div
        TextField(
          inputValue=`Hey, try ***to*** select *some* text <b>here</b>.
  There will <https://smartrus.org> a menu for selecting some inline styles.
  Remember: you have full control about content and styling of this menu.

  Roadmap:
  - v-model
  - Ссылка, с возможностью редактирования
  - Ссылка на изображение, возможно дать вставлять base64, но автоматически конвертируемый и сжатый в webp
  - Нормальный скрол (вписывающийся, возможно через родительский элемент)
  - Кнопка clear
  - Отображение количества символов
          `
        )
</template>


<script lang="ts">
import {VST, Prop, BaseComponent} from '../../../core'
import GuidesMenu from '../../../components/Documentation/GuidesMenu.vue'

/**
 * Text field
 * @author CHORNY
 * @copyright https://smartrus.org
 */
@VST export default class ExampleKit extends BaseComponent {
  components = {GuidesMenu}
}
</script>

<style lang="sass" scoped>
//span
//  @apply bg-red-200!
</style>

