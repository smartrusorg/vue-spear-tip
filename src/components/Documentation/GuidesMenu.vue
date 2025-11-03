<template lang="pug">
  div(class="flex flex-col fixed")
    div(
      v-for="route in routes"
      :class=`{
        'fw-bold': $route.path == route?.path
      }`
    )
      template(v-if="route.component")
        RouterLink(
          :to="route.path"
          v-html="route.name"
        )
      div(v-else)
        span(v-html="route.name")
</template>


<script lang="ts">
import {VST, Prop, VueClass} from '../../core'
import {GuidesRoutes, KitRoutes} from './router'

/**
 * Example
 * @author CHORNY
 * @copyright https://smartrus.org
 */
@VST export default class GuidesMenu extends VueClass {
  @Prop(String) readonly text: string = ''
  routes: any
  beforeMount() {
    this.routes = [...GuidesRoutes, ...KitRoutes]
  }
}
</script>

<style lang="sass" scoped>
//span
//  @apply bg-red-200!
</style>

