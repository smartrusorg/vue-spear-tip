<template lang="pug">
  div(class="mx-auto max-w1024px w100% min-h100% flex")
    div(class="flex px20px py15px w220px min-h100%!")
      GuidesMenu
    div(class="w[calc(100%-260px)]")
      h1 Guide
      h4 Explanation
      p.
        The main goal is to make developers' lives easier. With a basic understanding of
        OOP (Object-Oriented Programming) and reactivity, developers can write complex inheritance frontend components or
        libraries.
      p.
        We assume that you have a basic understanding of reactivity, in particular, the principles of
        <router-link to="/guides/config/vue" class="fw-bold">Vue</router-link>
        (Watch, Computed) and how class inheritance works. You should also be familiar with
        <router-link to="/guides/config/typescript" class="fw-bold">TypeScript</router-link>
        and understand how preprocessors such as Scss/Stylus or Sass work.
        It would be helpful if you understood how
        <router-link to="/guides/config/unocss" class="fw-bold">UnoСss or TainwindCss</router-link>
        work.

      //p Пример с созданием простого компонента, можно с подключением кнопки, но показать красоту unocss посредством обёртки
      h4 Abstract <code class="text-emerald-500 fs-1rem">Example.vue</code> component template
      .row(class="gap-y-25px gap-x-1px")
        .col-8(class="relative")
          div(
            class="absolute text-stone! z3000 top--8px bg-#282c34 px5px ml2px l-0 rounded-t-lg user-select-none"
          ) &lt;template lang="pug">
          div(
            class="absolute text-stone! z3000 bottom--15px bg-#282c34 px5px ml2px l-0 rounded-b-lg user-select-none"
          ) &lt;/template>
          CodeHighlight(
            lang="pug"
            code=`
  h2(class="absolute l-25 t-2 bg-stone-100 px9px py2px rounded-md") Result:
  div(class="flex items-center justify-center h100%")
    .title
      div(class="h90px m20px")
        div Test: {{ test }}
        Button(
          class="h30px"
          fontSize="14px"
          @clickTap="test = test == 'test' ? 'test 2' : 'test'"
        ) Toggle title
        Button(
          class="h30px"
          fontSize="12px"
          theme="danger"
          @clickTap="test = ''"
        ) Reset
        div(class="mt7px")
          small(class="text-stone") Computed: {{ computed }}
            `
          )
        .col-4(class="relative")
          h2(class="absolute l-25 t-2 bg-stone-100 px9px py2px rounded-md") Result:
          div(class="flex items-center justify-center h100%")
            .title
              div(class="h90px m20px")
                div Test: {{ test }}
                Button(
                  class="h30px"
                  fontSize="14px"
                  @clickTap="test = test == 'test' ? 'test 2' : 'test'"
                ) Toggle title
                Button(
                  class="h30px"
                  fontSize="12px"
                  theme="danger"
                  @clickTap="test = ''"
                ) Reset
                div(class="mt7px")
                  small(class="text-stone") Computed: {{ computedProp }}
        .col-8(class="relative")
          div(
            class="absolute text-stone! z3000 top--8px bg-#282c34 px5px ml2px l-0 rounded-t-lg user-select-none"
          ) &lt;script lang="ts">
          div(
            class="absolute text-stone! z3000 bottom--15px bg-#282c34 px5px ml2px l-0 rounded-b-lg user-select-none"
          ) &lt;/script>
          CodeHighlight(
            lang="ts"
            code=`
  import {VST, Prop, Watch, Computed, Button} from 'vue-spear-tip'

  import BaseComponent from './BaseComponent.vue'

  @VST export default class Example extends BaseComponent {
    components = {Button}
    @Prop(String, null) readonly text: string = ''
    test: 'test'|'test 2'|'' = ''

    beforeMount() {
      this.test = this.text
    }

    // Define computed property
    get computed(): boolean {
      return !this.test ? 'TEST EMPTY'
        : (this.test == 'test' ? 'First test' : 'Second test')
    }

    @Watch('test', false /* deep */, false /* immediate */)
    watchTest(newVal: string) {
      console.log('test variable changed', newVal)
    }
  }
            `
          )
        .col-4(class="relative")
          div(
            class="absolute text-stone! z3000 top--8px bg-#282c34 px5px ml2px l-0 rounded-t-lg user-select-none"
          ) &lt;style lang="sass">
          div(
            class="absolute text-stone! z3000 bottom--15px bg-#282c34 px5px ml2px l-0 rounded-b-lg user-select-none"
          ) &lt;/style>
          CodeHighlight(
            lang="sass"
            code=`
  .title
    @apply bg-yellow-100 m10px
    @apply hover:bg-yellow-200
    @apply rounded-xl
            `
          )
      p(class="mt30px").
        You can also use regular HTML instead of Pug. Similarly, you can use regular CSS instead of
        <a href="https://sass-lang.com/guide/" class="fw-bold" target="_blank">Sass</a>. And don't inclue
        <a href="https://unocss.dev/" class="fw-bold" target="_blank">UnoCss</a> / <a
          href="https://tailwindcss.com/" class="fw-bold" target="_blank"
        >Tailwindcss</a>
        We don't want to force you to use our preferred syntax.
        We only chose this syntax because it has a more compact style (without closing tags) and
        <a href="https://pugjs.org/language/mixins.html" class="fw-bold" target="_blank">Pug Mixin Blocks</a>,
        which can be useful when writing certain library components.

      h4(class="mt30px") Example abstract <code class="text-emerald-500 fs-1rem">BaseComponent.vue</code> inherited component
      div(class="h470px relative mb30px!")
        div(
          class="absolute text-stone! z3000 top--8px bg-#282c34 px5px ml2px l-0 rounded-t-lg user-select-none"
        ) &lt;script lang="ts">
        div(
          class="absolute text-stone! z3000 bottom--15px bg-#282c34 px5px ml2px l-0 rounded-b-lg user-select-none"
        ) &lt;/script>
        CodeHighlight(
            lang="ts"
            code=`
  import IBaseVueComponent from '../Interfaces/IBaseVueComponent'
  import {VueClass, Prop} from 'vue-spear-tip'

  /** Base component */
  export default abstract class BaseComponent extends VueClass implements IBaseVueComponent {
    // default props
    @Prop(string) readonly testDefault: 'test'|'test 2'|'' = ''
    // default emits
    emitsParent = ['update:modelValue']
    declare readonly $root: {
      [key: string]: any
    }
    constructor() {
      super()
      // enable some global child component variables, etc.
    }

    // The method with the "Parent" suffix will be executed before the corresponding stages
    // of the Vue component (created, beforeMount, mount, etc.).
    mountedParent() {

    }

    // It can also possess measurable and monitored characteristics by default.
    // declare computed: boolean @Computed('computed') _computedComputed(): boolean {return false}
    // @Watch('test', false /* deep */, false /* immediate */) testWatch(newVal: string) {return ''}
  }
              `
          )
      h3 We recommend using TypeScript classes at the top level and in the frontend for three main reasons:
      p.
        1. Classes can be inherited, along with properties and methods, making it easier to maintain and extend
        code.<br>
        2. TypeScript has a flexible interface description model similar to JSON, allowing developers to see potential
        errors in their code before compilation and execution. This helps to catch mistakes early on and avoid bugs
        in production. Additionally, there is no need to install or develop complex plugins in the integrated
        development environment (IDE).<br>
        3. If TypeScript is used on both the frontend and backend, common interfaces can be defined, and only the
        necessary data is sent to the frontend using the <a
          href="https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys" target="_blank"
          class="fw-bold"
        >Omit</a> operator. This makes it easier to share code and
        maintain consistency across the application. Overall, TypeScript can serve as a universal language for
        building applications.<br>

      h3 Lib
      p.
        Additionally, following this approach, we write a set of components in a consistent style.
        We are constantly trying to enhance it with useful practices for creating fully functional cross-platform
        web applications. You can see in left menu.
      h3 Why was it called "Spear Tip"?
      p.
        Because the library not only contains a set of components for all devices,
        but it also uses the most efficient technologies from the perspective of applied tasks.
        This allows the same or more complex functionality to be written in a more optimal and concise manner.



</template>


<script lang="ts">
import {VST, Prop, VueClass, Watch} from '../../core'
import 'uno.css'
import GuidesMenu from './GuidesMenu.vue'

/**
 * Example
 * @author CHORNY
 * @copyright https://smartrus.org
 */
@VST export default class Guides extends VueClass {
  components = {GuidesMenu}
  @Prop(String) readonly text: string = ''
  GuidesRoutes: any
  test: 'test'|'test 2'|'' = ''
  beforeMount() {
  }

  get computedProp(): string {
    return !this.test
        ? 'TEST EMPTY'
        : (this.test == 'test' ? 'First test' : 'Second test')
  }


  @Watch('test', false /* deep */, false /* immediate */)
  testWatch(newVal: string) {
    console.log('test variable changed', newVal)
  }
}
</script>

<style lang="sass">
body, html
  @apply p0 m0 box-sizing-border-box
  font-family: "Nunito Sans", sans-serif
a
  @apply decoration-none! hover:decoration-underline!
</style>

<style lang="sass" scoped>
.title
  @apply bg-yellow-100 m10px rounded-xl hover:bg-yellow-200
</style>

