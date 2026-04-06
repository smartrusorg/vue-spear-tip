<template lang="pug">
  div(class="flex px20px py15px")
    div
      img(src="../../resources/VST_LOGO.png" class="w100px")
    div
      h1 What is the Vue Spear Tip?

      span.
        Vue Spear Tip - is a global wrapper library for Vue 3 components using decorators.
        It allows you to describe a Vue component as an object-oriented class with inheritance,
        as well as provides a set of pre-built fields and components assembled from various open-source
        libraries that we constantly update. We are always looking for ways to improve our offerings.
        Supporteb by SMARTRUS.ORG®
      //  Supporteb by <a class="text-lightblue-500" href="https://smartrus.org">SMARTRUS.ORG®</a>
      div(class="text-left w100% ")
        b Why? -&nbsp;
        b(
          class="text-green-600 underline underline-double underline-amber-200"
        ) Easy to use with support on any device 📱🔳💻🖥️
  //h3(class="text-center") Elements
  div(class="flex flex-col items-center justify-center w[calc(100%-80px)] mx40px!")
    h4(class="text-center") Reactive select fields (with v-model)
    .row(class="p5px w100%")
      .col-4(class="px30px")
        b Single select
        SelectField(
          placeholder="Select one value"
          v-model="selectOnce"
          :items="selectOnceItems"
        )
        div(
          class="mx-20px bg-amber-100 my8px px15px py7px rounded-lg"
        )
          div
            b v-model =&nbsp;
            span {{ selectOnce }}
          div(class="mt5px bg-amber-50 p10px")
            b :items =&nbsp;
            span {{ selectOnceItems }}
      .col-4(class="px30px")
        b Multi select
        SelectField(
          mode="multi"
          placeholder="Select multi value"
          v-model="selectMulti"
          :items="selectMultiItems"
        )
        div(
          class="mx-20px bg-amber-100 my8px px15px py7px rounded-lg"
        )
          div
            b v-model =&nbsp;
            span {{ selectMulti }}
          div(class="mt5px bg-amber-50 p10px")
            b :items =&nbsp;
            span {{ selectMultiItems }}
      .col-4(class="px30px")
        b Tags select with presets
        SelectField(
          mode="tags"
          placeholder="Select tags values with preset"
          v-model="selectTags"
          :items="selectTagsItems"
        )
        div(
          class="mx-20px bg-amber-100 my8px px15px py7px rounded-lg"
        )
          div
            b v-model =&nbsp;
            span {{ selectTags }}
          div(class="mt5px bg-amber-50 p10px")
            b :items =&nbsp;
            span {{ selectTagsItems }}
    h4(class="text-center") Buttons
    div(class="m10px flex flex-wrap gap-y-6px items-center justify-center")
      Button(

      ) Default
      Button(
        theme="black"
        iconRight=`<img style="height: 20px" src="/VST_LOGO.png"/>`
      ) Black
      Button(
        theme="yellow"
      ) Yellow
      Button(
        theme="white"
        icon=`<img style="height: 20px" src="/VST_LOGO.png"/>`
      ) White
      Button(
        theme="grey"
      ) Grey
      Button(
        theme="indigo"
      ) Indigo
      Button(
        theme="purple"
      ) Purple
      StringField(
        class="w320px"
        placeholder="Type text"
      )
      Button(
        theme="pink"
      ) Pink
      Button(
        theme="info"
      ) Info
      Button(
        theme="danger"
      ) Danger
      Button(
        theme="warning"
      ) Warning
      Button(
        theme="primary"
      ) Primary
      Button(
        theme="success"
      ) Success
    h4(class="text-center").
      Auto resizable window and container grid elements (And much more. See the
      <router-link to="/guide">documentation</router-link>)
    div(class="w100% flex")
      #blockAnimationResize
      .row-wrapper(class="flex w100%")
        .row-wrapper(class="w100%")
          .row
            .col-1
              .col-example-block .col-1
            .col-1
              .col-example-block .col-1
            .col-1
              .col-example-block .col-1
            .col-1
              .col-example-block .col-1
            .col-1
              .col-example-block .col-1
            .col-1
              .col-example-block .col-1
            .col-1
              .col-example-block .col-1
            .col-1
              .col-example-block .col-1
            .col-1
              .col-example-block .col-1
            .col-1
              .col-example-block .col-1
            .col-1
              .col-example-block .col-1
            .col-1
              .col-example-block .col-1
            .col-2
              .col-example-block .col-2
            .col-2
              .col-example-block .col-2
            .col-2
              .col-example-block .col-2
            .col-2
              .col-example-block .col-2
            .col-2
              .col-example-block .col-2
            .col-2
              .col-example-block .col-2
            .col-3
              .col-example-block .col-3
            .col-3
              .col-example-block .col-3
            .col-3
              .col-example-block .col-3
            .col-3
              .col-example-block .col-3
            .col-4
              .col-example-block .col-4
            .col-4
              .col-example-block .col-4
            .col-4
              .col-example-block .col-4
            .col-5
              .col-example-block .col-5
            .col-5
              .col-example-block .col-5
            .col-2
              .col-example-block .col-2
            .col-6
              .col-example-block .col-6
            .col-6
              .col-example-block .col-6
            .col-7
              .col-example-block .col-7
            .col-5
              .col-example-block .col-5
            .col-8
              .col-example-block .col-8
            .col-4
              .col-example-block .col-4
            .col-9
              .col-example-block .col-9
            .col-3
              .col-example-block .col-3
            .col-10
              .col-example-block .col-10
            .col-2
              .col-example-block .col-2
            .col-11
              .col-example-block .col-11
            .col-1
              .col-example-block .col-1
            .col-12
              .col-example-block .col-12
</template>


<script lang="ts">
import {VST, Prop, VueClass} from '../../core'
import 'uno.css'

/**
 * Example
 * @author CHORNY
 * @copyright https://smartrus.org
 */
@VST export default class About extends VueClass {
  @Prop(String) readonly text: string = ''
  selectOnce: number|null = 2
  selectOnceItems: any[] = []
  selectMulti: number[]|null = [2,1]
  selectMultiItems: any[] = []
  selectTags: {value:string, key?:string|number}[]|null = [{key:4, value: 'Fourth'}]
  selectTagsItems: {value:string, key?:string|number}[]|null = []
  beforeMount() {
    this.selectOnceItems = [{key:1, value: 'Test'}, {key:2, value: 'Second value'}, ]
    this.selectMultiItems = [{key:1, value: 'Test'}, {key:2, value: 'Second value'}, {key:3, value: 'Third'}]
    this.selectTagsItems = [{key:1, value: 'Test'}, {key:2, value: 'Second value'}, {key:4, value: 'Fourth'}]
    setTimeout(() => this.selectOnce = 3, 2000)
    setTimeout(() => this.selectOnce = 1, 5000)
    setTimeout(() => this.selectMulti = [1,3], 1000)
    setTimeout(() => this.selectOnceItems.push({ "key": 3, "value": "S3" }), 1000)
    setTimeout(() => this.selectOnceItems.push({ "key": 9, "value": "Some 9" }), 6000)
    setTimeout(() => this.selectTags = [ { "key": 2, "value": "Second value" }], 3000)
  }
}
</script>

<style lang="sass" scoped>
.col-example-block
  @apply m5px shadow-sm shadow-amber-200 mb10px! bg-amber-100 p20px rounded-lg
// Базовые стили для блока
#blockAnimationResize
  flex-shrink: 0
  width: 100% // Для мобильных устройств

  @media (max-width: 767px)
    display: none
  // Анимация только для экранов больше 767px
  @media (min-width: 768px)
    width: 0
    animation: resizeBlock 20s infinite
    animation-delay: 3s

// Ключевые кадры анимации
@keyframes resizeBlock
  0%
    width: 0
    animation-timing-function: cubic-bezier(0.4, 0, 1, 1) // Разгон в начале

  30% // 6сек / 20сек * 100% = 30%
    width: calc(100% - 767px)
    animation-timing-function: ease-in-out // Плавное замедление

  50% // Пауза после расширения (4сек)
    width: calc(100% - 767px)

  80% // 6сек обратно / 20сек * 100% = 30% + 50% = 80%
    width: 0
    animation-timing-function: cubic-bezier(0.4, 0, 1, 1) // Разгон при сжатии

  100%
    width: 0

// Альтернативный вариант с более точным контролем временных функций
//#blockAnimationResize
//  width: 100%
//
//  @media (min-width: 500px)
//    width: 0
//    animation: resizeBlockAlt 2s infinite
//    animation-delay: 40s
//
//@keyframes resizeBlockAlt
//  // Начальная задержка 4с (0%-20%)
//  0%, 20%
//    width: 0
//    animation-timing-function: ease-in // Плавное начало
//
//  // Расширение 6с (20%-50%)
//  20%
//    animation-timing-function: cubic-bezier(0.2, 0.8, 0.4, 1.2) // Неравномерное ускорение
//
//  50%
//    width: calc(100% - 1500px)
//
//  // Пауза 4с (50%-70%)
//  50%, 70%
//    width: calc(100% - 500px)
//    animation-timing-function: ease-out
//
//  // Сжатие 6с (70%-100%)
//  70%
//    animation-timing-function: cubic-bezier(0.3, 0.9, 0.6, 1.1) // Неравномерное ускорение назад
//
//  100%
//    width: 0
</style>

