<template lang="pug">
  div(class="mx-auto max-w1024px w100% min-h100% flex")
    div(class="flex px20px py15px w220px min-h100%!")
      GuidesMenu
    div(class="w[calc(100%-260px)]")
      h1
        span FilesAreaKit
        sup(class="text-amber-500")  Beta
      div
        FilesArea(
          :inputValue="files"
        )
</template>


<script lang="ts">
import {VST, Prop, BaseComponent} from '../../../core'
import GuidesMenu from '../../../components/Documentation/GuidesMenu.vue'

/**
 * Button documentation with examples
 * @author CHORNY
 * @copyright https://smartrus.org
 */
@VST
export default class FilesAreaKit extends BaseComponent {
  files: any[] = [
    {
      loaded: 0.01,
      'ext': 'webp',
      'uri': '/uploads/e/2024/7/23/Fncxsd0VLTm5TuqeZGvsWM737MXPnRs7.webp',
      'data': {
        'isDoc': false,
        'isExcel': false,
        'isImage': true,
        'isArchive': false,
        'imageWidth': 500,
        'thumbnails': {
          '60x60': {
            'ext': 'webp',
            'uri': '/uploads/e/2024/7/23/0fDxEDl5rnhJpm2VT073thyFIm8fIKL3tFRfHYAuu8qqyFV8Yz1LD5E9G.webp',
            'size': 1332,
            'width': 60,
            'height': 60,
          },
          '120x120': {
            'ext': 'webp',
            'uri': '/uploads/e/2024/7/23/CiEadwSGutyIgPdKELIADLYd0fWhqwQX3FdpGOL9X5rHtP5ZceAYBqmI.webp',
            'size': 3840,
            'width': 120,
            'height': 120,
          },
          '500x500': {
            'ext': 'webp',
            'uri': '/uploads/e/2024/7/23/Fncxsd0VLTm5TuqeZGvsWM737MXPnRs7.webp',
            'size': 28410,
            'width': 500,
            'height': 500,
          },
        },
        'imageHeight': 500,
      },
      'hash': '247bade384afea3fd38e333c1b755e97',
      'mime': 'image/webp',
      'name': '1.webp',
      'path': '/var/www/storage/uploads/engine/2024/7/23/Fncxsd0VLTm5TuqeZGvsWM737MXPnRs7.webp',
      'size': 28410,
      'sizeNamed': '27.74 Кб',
    }, {
      'ext': 'webp',
      'uri': '/uploads/e/2024/7/23/qjZbTcyuQDg2kUoExDzWqIZKosyTePFGPK1jjmSBUbRC.webp',
      'data': {
        'isDoc': false,
        'isExcel': false,
        'isImage': true,
        'isArchive': false,
        'imageWidth': 500,
        'thumbnails': {
          '60x60': {
            'ext': 'webp',
            'uri': '/uploads/e/2024/7/23/D7gUZYHjxQYhDDQhaJKkFDgleoSNPIoN3ApnHoOhxwKlqAH3BJZk4.webp',
            'size': 1804,
            'width': 60,
            'height': 60,
          },
          '120x120': {
            'ext': 'webp',
            'uri': '/uploads/e/2024/7/23/JrlG6K9eFJHwjrIX2I9ibJOxGpkAfx.webp',
            'size': 4950,
            'width': 120,
            'height': 120,
          },
          '500x500': {
            'ext': 'webp',
            'uri': '/uploads/e/2024/7/23/qjZbTcyuQDg2kUoExDzWqIZKosyTePFGPK1jjmSBUbRC.webp',
            'size': 36678,
            'width': 500,
            'height': 500,
          },
        },
        'imageHeight': 500,
      },
      'hash': '0fb53f2e49e601e4925e97954d8d4dee',
      'mime': 'image/webp',
      'name': '2.webp',
      'path': '/var/www/storage/uploads/engine/2024/7/23/qjZbTcyuQDg2kUoExDzWqIZKosyTePFGPK1jjmSBUbRC.webp',
      'size': 36678,
      'sizeNamed': '35.82 Кб',
    }, {
      'ext': 'webp',
      'uri': '/uploads/e/2024/7/23/Md7o6PykprHXuLVcDf7bU9mDUhZ2.webp',
      'data': {
        'isDoc': false,
        'isExcel': false,
        'isImage': true,
        'isArchive': false,
        'imageWidth': 500,
        'thumbnails': {
          '60x60': {
            'ext': 'webp',
            'uri': '/uploads/e/2024/7/23/fcWcyeuoORI8qiyzeoXe.webp',
            'size': 260,
            'width': 60,
            'height': 60,
          },
          '120x120': {
            'ext': 'webp',
            'uri': '/uploads/e/2024/7/23/b2OGwrkHlYrF6bPqkVj5ATEguCpKmjFuyy3kWT98ZagJ0gNjoZSv.webp',
            'size': 536,
            'width': 120,
            'height': 120,
          },
          '500x500': {
            'ext': 'webp',
            'uri': '/uploads/e/2024/7/23/Md7o6PykprHXuLVcDf7bU9mDUhZ2.webp',
            'size': 2386,
            'width': 500,
            'height': 500,
          },
        },
        'imageHeight': 500,
      },
      'hash': 'd3c7c715f2cc1f914c47c6fd107de91e',
      'mime': 'image/webp',
      'name': '3.webp',
      'path': '/var/www/storage/uploads/engine/2024/7/23/Md7o6PykprHXuLVcDf7bU9mDUhZ2.webp',
      'size': 2386,
      'sizeNamed': '2.33 Кб',
    }, {
      'ext': 'webp',
      'uri': '/uploads/e/2024/7/23/KeAITsvAnQKIVjdtlBeQpDJ4o5dGMU.webp',
      'data': {
        'isDoc': false,
        'isExcel': false,
        'isImage': true,
        'isArchive': false,
        'imageWidth': 500,
        'thumbnails': {
          '60x60': {
            'ext': 'webp',
            'uri': '/uploads/e/2024/7/23/YS7nZJqnjrGZt7nANRpWmXTkdmXr8mpVMW4ww.webp',
            'size': 1788,
            'width': 60,
            'height': 60,
          },
          '120x120': {
            'ext': 'webp',
            'uri': '/uploads/e/2024/7/23/0GJlQmeULHvr7uVDwj2VNMpoeQpLjlujoSwtJosbJrV8ShfV3fUq6jxDqsYY.webp',
            'size': 4576,
            'width': 120,
            'height': 120,
          },
          '500x500': {
            'ext': 'webp',
            'uri': '/uploads/e/2024/7/23/KeAITsvAnQKIVjdtlBeQpDJ4o5dGMU.webp',
            'size': 33170,
            'width': 500,
            'height': 500,
          },
        },
        'imageHeight': 500,
      },
      'hash': '8c8b65b2862ea3fdbbeb7db2108d68d3',
      'mime': 'image/webp',
      'name': '4.webp',
      'path': '/var/www/storage/uploads/engine/2024/7/23/KeAITsvAnQKIVjdtlBeQpDJ4o5dGMU.webp',
      'size': 33170,
      'sizeNamed': '32.39 Кб',
    },
  ]
  components = {GuidesMenu}
}
</script>

<style lang="sass" scoped>
//span
//  @apply bg-red-200!
</style>

