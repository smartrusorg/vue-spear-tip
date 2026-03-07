<template lang="pug">
  .image-file-preview(
    class="top-50px bg-white b-t-solid b-t-1px b-t-amber-300"
    :style=`{
      'user-drag': 'element',
      '-webkit-user-drag': 'element',
    }`
  )
    div(class="w100% h100% flex justify-center bg-[conic-gradient(#e5e7eb_25%,transparent_25%_50%,#e5e7eb_50%_75%,transparent_75%)] bg-[length:20px_20px] bg-[position:0_0,0_10px,10px_-10px,-10px_0px]")
      Zoomable(
        class="cursor-move"
        :initialZoom="0.5"
        :wheelZoomStep="2"
        :initialPanY="90"
        :wheelEnabled="true"
        :pan=`{
          x: -(VST.viewPortHeight/2),
          y: 0,
          deltaX: 0,
          deltaY: 0,
        }`
        typ="mouse"
      )
        img(:src="uri" class="w100%")
    component(is="style").
      .simplebar-track.simplebar-vertical {
        display: none;
      }
</template>

<script lang="ts">
import Zoomable from 'vue-zoomable'
import {Prop, BaseComponent, VST} from '../../../../../core'
import "vue-zoomable/dist/style.css"

@VST export default class ImageViewerFilesField extends BaseComponent {
  components = {Zoomable}
  @Prop(String) readonly uri: string = ''
  @Prop(String) readonly ext: string = ''
  @Prop(String) readonly fileName: string = ''

  beforeMount() {
    const buttonsOi = window?.top!?.document?.getElementById?.('OIElement')?.querySelector?.('div')
    if (buttonsOi) {
      buttonsOi.style.display = 'none'
      this.hookWhenComponentDestroy(() => buttonsOi.style.display = 'flex')
    }
  }
}
</script>
<style lang="sass">
.image-file-preview
  @apply w100% h[calc(100%-50px)] flex flex-col fixed top-50px left-0
  -webkit-user-drag: element !important
</style>
