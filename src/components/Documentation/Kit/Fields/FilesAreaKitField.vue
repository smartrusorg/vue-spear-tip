<template lang="pug">
  FilesAreaKit
</template>

<script lang="ts">
import {VST, BaseComponent} from '../../../../core'
import GuidesMenu from '../../../../components/Documentation/GuidesMenu.vue'
import FilesAreaKit from '../../../Fields/FilesArea/FilesAreaKit.vue'

/**
 * TextKitField
 * @author CHORNY
 * @copyright https://smartrus.org
 */
@VST export default class TextKitField extends BaseComponent {
  components = {GuidesMenu, FilesAreaKit}
}
</script>

