<template lang="pug">
  div(class="p15px mt150px") Скоро
</template>

<script lang="ts">
import {Prop, BaseComponent, VST} from '../../../../../core'

import { FileFieldItemInterface } from '../FileItem.vue'

// fixme прочитать док в html и отобразить в виде страниц docx 
// fixme попробовать на базе https://github.com/mwilliamson/mammoth.js

@VST export default class DocxViewerFilesField extends BaseComponent {
  @Prop(Object, null) readonly file: FileFieldItemInterface = {} as FileFieldItemInterface
}
</script>
<style lang="sass"></style>
