<template lang="pug">
  TextFieldKit
</template>

<script lang="ts">
import {VST, BaseComponent} from '../../../../core'
import TextFieldKit from '../../../Fields/TextField/TextFieldKit.vue'
import GuidesMenu from '../../../../components/Documentation/GuidesMenu.vue'

/**
 * TextKitField
 * @author CHORNY
 * @copyright https://smartrus.org
 */
@VST export default class TextKitField extends BaseComponent {
  components = {GuidesMenu, TextFieldKit}
}
</script>

