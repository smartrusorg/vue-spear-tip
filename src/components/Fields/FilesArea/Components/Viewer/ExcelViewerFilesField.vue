<template lang="pug">
  #excelView(ref="excelView" class="mt150px") Скоро будет!
</template>

<script lang="ts">
import {Prop, BaseComponent, VST} from '../../../../../core'

// import ExcelViewer from 'excel-viewer'
import { FileFieldItemInterface } from '../FileItem.vue'

@VST export default class ExcelViewerFilesField extends BaseComponent {
  @Prop(Object, null) readonly file: FileFieldItemInterface = {} as FileFieldItemInterface

  // fixme https://oss.sheetjs.com/ 
  // fixme сделать свою таблицу с зумом и вкладками для чтения значений

  mounted() {
    // const container = this.$refs.excelView
    // axios({
    //     url: `https://${location.hostname}${this.file.uri}`,
    //     method: "GET",
    //     // headers: { "Authorization": "Your Authorization Token" }, // authorization token
    //     responseType: "arraybuffer"
    // }).then(res => {
    //     new ExcelViewer(container, res.data, {
    //     theme: "light",
    //     // lang: "ru_ru",
    //     themeBtn: false,
    // });
    // })
  }
}
</script>
<style lang="sass"></style>
