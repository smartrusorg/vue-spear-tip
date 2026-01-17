<template lang="pug">
  div(class="mx-auto max-w1024px w100% min-h100% flex")
    div(class="flex px20px py15px w220px min-h100%!")
      GuidesMenu
    div(class="w[calc(100%-260px)]")
      h1 DateField
      div(class="mb10px text-lightblue-400")
        div
      div(class="mb10px text-lightblue-400") With auto locales format

      ElementDocBlock(

      )
        //template(#$title-default) sadsdf
        template(#default)
          .row(class="gap-7")
            .col-12
              b.text-center Default date time field with auto language, locale, format detect
              DateField(
                :withTime="true"
              )
            .col-12
              b.text-center Default date field auto language, locale, format detect
              DateField(
                v-model="testVal"
                :ISO861UTCMode="true"
              )
              //div {{ testVal }}
            .col-6
              b.text-center European 24 hours format (Russia)
              DateField(
                :withTime="true"
                :withSeconds="true"
                locale="ru"
                ref="rus"
                :dayPreRender="preRenderRus"
              )
            .col-6
              b.text-center 12 hours (America en-US)
              DateField(
                :ISO861UTCMode="true"
                :withTime="true"
                inputValue="2012-12-12 00:01:22"
                locale="en-US"
              )
            .col-6
              b.text-center Disabled
              DateField(
                :disabled="true"
                :withTime="true"
                inputValue="2012-12-12 00:01:22"
              )
            .col-6
              span.text-center
                b InputMask StringField
                span  to check compatibility
              StringField(
                mask="+7 (999) 999-99-99"
                :alwaysCopyIcon="true"
              )
        //template(#$title-props) 123123
        template(#props)
          CodeHighlight(
            class="h100px mb20px"
            code=`/**
  * Глобальное название поля. Используется для ссылок на поля дат (этого же компонента), в которых указываются
  * минимальные/максимальные даты для текущего поля даты.
  * Внимание! Для сложных форм используйте префиксы.
  */
  @Prop(String) readonly fieldName: string = ''`
          ).
          div firstDayOfWeek: 'auto' | 1 | 2 | 3 | 4 | 5 | 6 | 7
          div disabledDays: number | string | Date[]
          div disableWeekends: boolean
          div disableDaysOfWeek
          div disabled
          div ISO861UTCMode
          div dayPreRender
          div max
          div min
          div maxField
          div minField
</template>


<script lang="ts">
import {VST, Prop, BaseComponent} from '../../../core'
import GuidesMenu from '../../../components/Documentation/GuidesMenu.vue'
import IDateField from './IDateField'
import ElementDocBlock, {IElementDocBlockData} from '../../Documentation/ElementDocBlock.vue'

/**
 * DateKit
 * @author CHORNY
 * @copyright https://smartrus.org
 */
@VST export default class DateKit extends BaseComponent {
  declare $refs: {
    rus: IDateField
  }
  components = {GuidesMenu, ElementDocBlock}

  testVal: string = '2012-12-12 00:01:22'

  // TODO подумать над автоматической hot генерацией json данных по классу
  dateData: IElementDocBlockData = {
    props: {

    },
    events: {

    },
    methods: {

    },
  }

  mounted() {
    // setTimeout(() => {
    //   console.log('upd', this.$refs.rus.DT?.add({hours: 5})?.toLocaleString())
    // }, 5000)
  }

  l(...args: any[]) {
    console.log('dk', ...args)
  }

  preRenderRus(el: HTMLElement, dt: Temporal.ZonedDateTime, currentNextOrPrev: boolean|null) {
    const now = $VST.DT()
    if (dt.startOfDay().epochMilliseconds == $VST.DT(`${now.year}-${now.month?.toString().padStart(2, '0')}-01`).epochMilliseconds) {
      el.style.background = currentNextOrPrev ? '#ff9393' : '#f75c5c'
      el.style.borderRadius = '4px'
      el.style.color = currentNextOrPrev ? '#000' : 'white'
      el.title = 'Demonstration custom day element'
    }
  }
}
</script>

<style lang="sass" scoped>
//span
//  @apply bg-red-200!
</style>

