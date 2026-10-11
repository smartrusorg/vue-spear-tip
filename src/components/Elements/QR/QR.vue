<template lang="pug">
  div(class="flex items-center justify-center w100% h100%")
    .qrcode
</template>


<script lang="ts">

import {Prop, Component, Watch} from '../../../core'
import FieldComponent from '../../../replaceable/FieldComponent.vue'
import './QRCreator.js'

/**
 * QR Код
 * @author CHORNY (created 28.09.2024 2:11)
 * @copyright https://smartrus.org
 */
@Component export default class QR extends FieldComponent {
  declare $refs: {
    qrCode: HTMLInputElement
  }
  /**
   * метод кодирования
   * 1 - числовой,
   * 2 - буквенно-цифровой,
   * 4 - октетный,
   * если не указан или -1,
   * то выбирается допустимый способ кодирования.
   */
  @Prop(Number) readonly mode: -1|1|2|4 = 4
  
  @Prop(String, Number, Object) readonly data: number|string|{[p:string]:any}|any[] = ''
  
  /** Обновляем QR код при изменении данных */
  @Watch('data', true) onDataChange(newData: number|string|{[p:string]:any}|any[]) {
    this.reCreate(newData)
  }
  reCreate(data: number|string|{[p:string]:any}|any[]) {
    const qr = this.$el.querySelector('.qrcode')!
    qr.innerHTML = '' // @ts-ignore
    qr.append(window?.['QRCreator'](
      ['string', 'number'].includes(typeof data)
        ? data?.toString()
        : JSON.stringify(data)
    ).result)
  }
}
</script>

<style scoped lang="sass">
//.vst-select-multi
//  @apply min-w220px! min-h44px! flex! items-center justify-center rounded-3xl
</style>
