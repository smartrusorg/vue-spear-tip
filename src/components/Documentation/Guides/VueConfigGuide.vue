<template lang="pug">
  div(class="mx-auto max-w1024px w100% min-h100% flex")
    div(class="flex px20px py15px w220px min-h100%!")
      GuidesMenu
    div(class="w[calc(100%-260px)]")
      h1 Vue Config Guide
      div soon
      //- Должна быть максимально простая настройка, с возможностью подключения в проект.
      //- Вплоть до того, что пользователь указываетв какой/какие элементы смонтировать работу.
      //- +Указание файла, в котором подключаются глобальные ленивые компоненты экспортом.
</template>


<script lang="ts">
import {VST, Prop, BaseComponent} from '../../../core'
import GuidesMenu from '../GuidesMenu.vue'

/**
 * Example
 * @author CHORNY
 * @copyright https://smartrus.org
 */
@VST export default class VueConfigGuide extends BaseComponent {
  components = {GuidesMenu}
}
</script>

<style lang="sass" scoped>
//span
//  @apply bg-red-200!
</style>

