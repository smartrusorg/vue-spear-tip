<template lang="pug">
  SwitchKit
</template>

<script lang="ts">
import {VST, Prop, BaseComponent} from '../../../../core'
import SwitchKit from '../../../Fields/SwitchField/SwitchKit.vue'

/**
 * ButtonKitElement
 * @author CHORNY
 * @copyright https://smartrus.org
 */
@VST export default class SwitchKitField extends BaseComponent {
  components = {SwitchKit}
}
</script>

