---
globs: |
  **/*.vue
  **/components/**/*.ts
description: "Component development rules for Vue Spear Tip - patterns for creating and editing components"
alwaysApply: true
---

# Vue Spear Tip - Component Development Rules

## 🎯 Component Creation Pattern

### Standard Component Structure
```typescript
@VST export default class ComponentName extends BaseComponent {
  // 1. Component registration
  components = {ChildComponent1, ChildComponent2}
  
  // 2. Props (ALWAYS readonly)
  @Prop(String) readonly title: string = ''
  @Prop(Number) readonly count: number = 0
  @Prop(Boolean) readonly disabled: boolean = false
  
  // 3. Data properties
  localData: string = 'initial value'
  
  // 4. Computed properties (SPECIAL PATTERN)
  declare isActive: boolean
  @Computed('isActive') _isActiveComputed(): boolean {
    return this.count > 0 && !this.disabled
  }
  
  // 5. Watchers (PREFIX WITH _)
  @Watch('count') _countWatch(newVal: number, oldVal?: number) {
    console.log('Count changed from', oldVal, 'to', newVal)
  }
  
  @Watch('localData', true) _localDataDeepWatch(newVal: string) {
    // deep: true for object/array watching
  }
  
  // 6. Methods
  handleClick() {
    this.localData = 'updated'
    this.$emit('custom-event', this.localData)
  }
  
  // 7. Lifecycle hooks (Parent versions called FIRST)
  created() {
    // Component initialization
  }
  
  createdParent() {
    // Parent initialization (runs before created)
  }
  
  mounted() {
    // DOM access safe
  }
  
  mountedParent() {
    // Parent DOM setup (runs before mounted)
  }
}
```

### Field Component Structure (for forms)
```typescript
@VST export default class FieldComponentName extends FieldComponent {
  // Field components inherit from FieldComponent
  components = {SomeChild}
  
  // Additional props for fields
  @Prop(String) readonly placeholder: string = ''
  
  // Required for v-model support
  emitsParent = ['update:modelValue']
  
  // Field-specific methods
  onValueChange(value: any) {
    // Handle value changes
    this.setValue(value)
    this.$emit('update:modelValue', value)
  }
  
  getValue(): any {
    return this.value
  }
}
```

## 📝 Template Rules

### Pug Template Structure
```pug
template(lang="pug")
  .component-class(
    :class="{ 'is-active': isActive }"
    v-if="shouldRender"
  )
    //- Use kebab-case for component names
    child-component(
      :prop-name="localData"
      @custom-event="handleChildEvent"
    )
    
    //- Field components use v-model
    string-field(
      v-model="fieldValue"
      :placeholder="'Enter text'"
      :disabled="isDisabled"
    )
    
    //- Events use kebab-case
    button(@click-tap="handleClick") Click me
    
    //- Slots support
    slot(name="default")
    slot(name="footer")
```

### Style Rules
```sass
<style lang="sass" scoped>
.component-class
  // Use SASS features
  padding: 1rem
  
  &.is-active
    background: #e3f2fd
  
  // UnoCSS utilities can be used
  @apply flex items-center gap-2
}
</style>
```

## 🔧 Component Development Workflow

### Creating New Components
1. **Choose base class**: `BaseComponent` (regular) or `FieldComponent` (forms)
2. **Create component file**: `src/components/Elements/NewComponent/NewComponent.vue`
3. **Add documentation**: `src/components/Documentation/Kit/Elements/NewComponentKit.vue`
4. **Export in kit**: Update relevant `index.ts` in `src/kit/`

### Component Documentation Pattern
```vue
<template lang="pug">
.new-component-kit
  h2 NewComponent
  p Description of the component
  
  .examples
    h3 Basic Usage
    NewComponent(
      :title="'Example Title'"
      @click-tap="handleExampleClick"
    )
    
    h3 With Props
    NewComponent(
      :title="'Disabled Example'"
      :disabled="true"
    )
</template>

<script lang="ts">
import {VST, BaseComponent, NewComponent} from 'vue-spear-tip'

@VST export default class NewComponentKit extends BaseComponent {
  components = {NewComponent}
  
  handleExampleClick() {
    console.log('Example clicked')
  }
}
</script>
```

## 🚨 Common Pitfalls & Solutions

### ❌ Incorrect Prop Declaration
```typescript
// WRONG - missing readonly
@Prop(String) title: string = ''

// WRONG - incorrect default value syntax
@Prop(String) readonly title: string

// CORRECT
@Prop(String) readonly title: string = ''
```

### ❌ Incorrect Computed Pattern
```typescript
// WRONG - missing declare and incorrect method name
get isActive(): boolean {
  return this.count > 0
}

// WRONG - incorrect computed decorator usage
@Computed _isActiveComputed(): boolean {
  return this.count > 0
}

// CORRECT
declare isActive: boolean
@Computed('isActive') _isActiveComputed(): boolean {
  return this.count > 0
}
```

### ❌ Incorrect Watcher Pattern
```typescript
// WRONG - missing _ prefix
@Watch('count') countWatch(newVal: number) {
  // ...
}

// CORRECT
@Watch('count') _countWatch(newVal: number) {
  // ...
}
```

## 🔄 Inheritance Patterns

### Parent Component Props/Methods
```typescript
@VST export default class ParentComponent extends BaseComponent {
  @Prop(String) readonly parentProp: string = ''
  
  parentMethod() {
    console.log('Parent method')
  }
}

@VST export default class ChildComponent extends ParentComponent {
  // Inherits parentProp and parentMethod automatically
  @Prop(Number) readonly childProp: number = 0
  
  // Can override parent methods
  parentMethod() {
    super.parentMethod() // Call parent if needed
    console.log('Child override')
  }
}
```

## 🎯 Best Practices

1. **Keep components focused** - one primary responsibility
2. **Use meaningful prop names** - descriptive and consistent
3. **Document complex props** - JSDoc comments for non-obvious behavior
4. **Test with documentation** - ensure examples in Kit components work
5. **Follow naming conventions** - PascalCase for components, camelCase for props/methods

## 🔍 Debugging Tips

- Check that `@VST` decorator is present
- Verify inheritance from correct base class
- Ensure props are `readonly`
- Confirm watcher methods have `_` prefix
- Check computed property pattern (declare + @Computed)