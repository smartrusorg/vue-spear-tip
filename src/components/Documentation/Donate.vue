<template lang="pug">
  div(class="mx-auto max-w1440px w100% min-h100% user-select-auto!")
    h3(class="px20px py15px text-center") If you like Vue Spear Tip, you can donate for developmentin the following ways:
    .row(class="w100%")
      .col-6
        div(
          class="p40px"
        )
          b Crypto wallets
          div
            b(class="text-amber-500") BTC&nbsp;
            span 1FZ11aFGQQzvm7Y7JGZYPq1UAip8eo3tZ7
          div
            b(class="text-emerald-500 user-select-auto!") USDT TRC20&nbsp;
            span TBQGoQwuoeK5xX4S6dSozGiU6UBsJwZpTV
          div
            b(class="text-emerald-500 user-select-none") USDT ERC20&nbsp;
            span 0x67AE41dBe771380784194Aac6661b70eA42D34A6
          div
            b(class="text-emerald-500 user-select-none") USDT TON&nbsp;
            span UQBCvVree-8XUzHXUOq9HpROAbwC_26GPOgwAJJXYlgNCj2L
          div
            b(class="text-emerald-500 user-select-none") USDT SOL&nbsp;
            span 7wL7NdCBF9USuAAapCr1zJ7oKpkSRw7xumA6YUXW4o9N
      .col-6
        div(
          class="p40px"
        )
          b From Russia (из России)
          div По номеру карты
          div
            b(class="text-red-600 user-select-none") Альфа-Банк&nbsp;
            span 2200 1545 9034 5772
          //div
          //  b(class="text-blue-600 user-select-none") ВТБ&nbsp;
          //  span 2200 2459 1048 6252
    h3(class="px20px py15px text-center").
      Other donate channels - later. For questions&nbsp;<a href="mailto:support@smartrus.org">support@smartrus.org</a>
</template>


<script lang="ts">
import {VST, Prop, BaseComponent} from '../../core'

/**
 * Example
 * @author CHORNY
 * @copyright https://smartrus.org
 */
@VST export default class Donate extends BaseComponent {
  @Prop(String) readonly text: string = ''
  selectOnce: number|null = 2
  selectOnceItems: any[] = [{key:1, value: 'Test'}, {key:2, value: 'Second value'}, ]
  selectMulti: number[]|null = [2,1]
  selectMultiItems: any[] = [{key:1, value: 'Test'}, {key:2, value: 'Second value'}, {key:3, value: 'Third'}]
  selectTags: {value:string, key?:string|number}[]|null = [{key:4, value: 'Fourth'}]
  beforeMount() {
    // setTimeout(() => this.selectOnce = 3, 2000)
    // setTimeout(() => this.selectMulti = [1,3], 1000)
    // setTimeout(() => this.selectOnceItems.push({ "key": 3, "value": "S3" }), 1000)
    // setTimeout(() => this.selectTags = [ { "key": 2, "value": "Second value" }], 3000)
  }
  menu = [
    { name: 'About', url: '/' },
    // { name: 'Examples', url: '#' },
    { name: 'Documentation', url: '/documentation' },
    { name: 'Library', url: '#' },
    { name: 'Donate', url: '#' },
  ]
  sections = [
    {
      title: 'Начало работы',
      links: [
        { name: 'Установка', url: '#', active: true },
        { name: 'Быстрый старт', url: '#' },
        { name: 'Миграция с Vue 2', url: '#' }
      ]
    },
    {
      title: 'Основы',
      links: [
        { name: 'Создание компонента', url: '#' },
        { name: 'Жизненный цикл', url: '#' },
        { name: 'Пропсы и данные', url: '#' }
      ]
    }
  ]
  cards = [
    {
      title: 'Быстрый старт',
      description: 'Узнайте, как быстро подключить и начать использовать библиотеку в вашем проекте.'
    },
    {
      title: 'Миграция с Vue 2',
      description: 'Пошаговое руководство по переходу с классического подхода на современный.'
    },
    {
      title: 'API Reference',
      description: 'Полное описание всех методов, свойств и возможностей библиотеки.'
    },
    {
      title: 'Лучшие практики',
      description: 'Рекомендации по эффективному использованию библиотеки в реальных проектах.'
    }
  ]
}
</script>

<style lang="sass">
body, html
  @apply p0 m0 box-sizing-border-box
  font-family: "Nunito Sans", sans-serif
a
  @apply decoration-none! hover:decoration-underline!
</style>

<style lang="sass" scoped>
//span
//  @apply bg-red-200!
</style>

