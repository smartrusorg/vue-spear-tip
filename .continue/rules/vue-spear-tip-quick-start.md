---
globs: |
  **/*.vue
  **/*.ts
  **/*.js
description: "Quick start guide for Vue Spear Tip - essential rules for immediate productivity"
alwaysApply: true
---

# Vue Spear Tip - Quick Start

## 🎯 Immediate Rules for Agents

### 1. Component Structure (MUST FOLLOW)
```typescript
@VST export default class ComponentName extends BaseComponent {
  components = {ChildComponent}      // Register child components
  
  @Prop(String) readonly title: string = ''     // Props ALWAYS readonly
  count: number = 0                             // Regular data properties
  
  declare isActive: boolean                     // Computed pattern: declare
  @Computed('isActive') _isActiveComputed(): boolean {  // + method with _ prefix
    return this.count > 0
  }
  
  @Watch('count') _countWatch(newVal: number) { // Watchers ALWAYS _ prefix
    console.log('Count changed:', newVal)
  }
  
  // Lifecycle hooks (Parent versions called first)
  created() {}
  createdParent() {}
  mounted() {}
  mountedParent() {}
}
```

### 2. Template & Style Rules
- Use **Pug** templates: `template(lang="pug")`
- Use **Sass/SCSS** styles: `<style lang="sass" scoped>`
- Component names in kebab-case in templates
- Events use kebab-case: `@click-tap` not `@clickTap`

### 3. Field Components (for forms)
- Extend `FieldComponent` not `BaseComponent`
- Use `emitsParent = ['update:modelValue']` for v-model
- Implement `onValueChange(value)` for value handling

### 4. Global Utilities
- Access via `$VST` global object
- Events: `$VST.$on`, `$VST.$off`, `$VST.$emit`
- Date utils: `$VST.DT`
- Clipboard: `$VST.copyToClipboard(text)`

## 🚨 Critical Don'ts
- ❌ NEVER edit `src/replaceable/` (auto-generated)
- ❌ NEVER forget `@VST` decorator
- ❌ NEVER forget `readonly` on props
- ❌ NEVER forget `_` prefix on watchers
- ❌ NEVER use regular Vue components without decorators

## 🔧 Project Structure Quick Reference
- `src/core/` - Decorators & base classes
- `src/components/` - UI components (Elements/Fields)
- `src/kit/` - Library exports
- `src/replaceable/` - ⚠️ DO NOT EDIT
- `src/Documentation/` - Examples & docs

## 💡 When Creating Components
1. Choose base: `BaseComponent` (UI) or `FieldComponent` (forms)
2. Follow exact decorator patterns
3. Create documentation example in `Documentation/Kit/`
4. Export in relevant `kit/index.ts`

## 🆘 Common Issues Fix
- Decorators not working? Check `keepNames: true` in vite.config.ts and tsconfig.json
- Props not reactive? Verify `readonly` and default values
- Computed not updating? Check `declare` + `@Computed` pattern

This quick start covers 95% of daily development scenarios. For advanced patterns, refer to other rules-robot files.