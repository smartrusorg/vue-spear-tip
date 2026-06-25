<template lang="pug">
  .tabs
    .tabs__headers
      template(
        v-for="(slot, name) in $slots"
      )
        .tabs__header(
          v-if="name.startsWith('$title-')"
          :class="{ 'tabs__header--active': currentTab === name.split('-')[1] }"
          @click="setCurrentTab(name.split('-')[1])"
        )
          slot(:name="name")

      template(
        v-for="(slot, name) in $slots"
      )
        .tabs__header(
          v-if="!name.startsWith('$title') && !$slots?.[`$title-${name}`]"
          :class="{ 'tabs__header--active': currentTab === name }"
          @click="setCurrentTab(name)"
        ) {{ name }}

    template(
      v-for="(slot, name) in $slots"
    )
      .tabs__content(
        v-if="!name.startsWith('$')"
        v-show="currentTab == name"
      )
        slot(:name="name")
      //slot(v-if="showDefaultSlot")
</template>


<script lang="ts">
import {BaseComponent, Component, Prop, Watch} from '../../../core'

interface TabSlot {
  props?: {
    title?: string;
  };
}

/**
 * Кнопка (наследуемая)
 * @author CHORNY (created 02.03.2024 4:32)
 * @copyright https://smartrus.org
 */
@Component export default class Tabs extends BaseComponent {

  currentTab = 'default'
  CommentT: typeof Comment = Comment
  mounted() {
    // console.log('Tabs', this.tabSlots)
    // super.mounted()
  }

  // declare tabSlots: TabSlot[]; @Computed('tabSlots') _tabSlotsComputed(): TabSlot[] {
  //   const slots = this.$slots
  //   return (slots?.filter(node =>
  //       node.type === Comment &&
  //       node.props?.title
  //   ) || []) as TabSlot[]
  // }

  // get currentTabName(): string {
  //   return `tab-${this.currentTab}`
  // }
  //
  // get showDefaultSlot(): boolean {
  //   return this.currentTab === 0 && this.tabSlots.length === 0
  // }

  setCurrentTab(name: string): void {
    this.currentTab = name;
  }

  getTabTitle(tab: TabSlot): string {
    return tab.props?.title || 'Без названия'
  }
}
</script>

<style scoped lang="sass">
.tabs
  width: 100%

  &__headers
    display: flex
    border-bottom: 1px solid #e0e0e0
    margin-bottom: 3px
    background-color: #fafafa

  &__header
    padding: 0.75rem 1.5rem
    cursor: pointer
    border-bottom: 2px solid transparent
    transition: all 0.3s ease
    user-select: none

    &:hover
      background-color: #f0f0f0

    &--active
      border-bottom-color: #42b883
      color: #42b883
      font-weight: 600
      background-color: white

  &__content
    padding: 1rem
    min-height: 200px
    //border: 1px solid #e0e0e0
    border-radius: 4px
    background-color: white
</style>
