---
globs: |
  **/*.vue
  **/*.ts
  **/*.js
description: "Core context for Vue Spear Tip - Vue 3 OOP library with TypeScript decorators for backend developers"
alwaysApply: true
---

# Vue Spear Tip - Core Context

## 🎯 Project Philosophy
**Vue Spear Tip (VST)** is a Vue 3 wrapper library that provides object-oriented programming approach using TypeScript decorators. Designed specifically for **backend developers** to create functional interfaces quickly without deep Vue knowledge.

## 🎯 Target Audience & Use Cases
- **Backend developers** familiar with OOP
- **Monolithic applications**, admin panels, CRM systems
- **Mobile PWA applications** with management interfaces
- Projects where **business logic is primarily on backend**
- **Unified component approach** for team consistency

## 🏗️ Core Architecture

### Base Classes
- `VueClass` - Pure converter to Vue Options API + $VST global variable
- `BaseComponent` - For regular components (extends VueClass)
- `FieldComponent` - For form fields with unified interface (extends BaseComponent)

### Key Decorators
```typescript
// Component definition
@VST export default class MyComponent extends BaseComponent {
  // Props (always readonly)
  @Prop(String) readonly title: string = ''
  @Prop(String, Number) readonly value: string | number = null
  
  // Data properties
  count: number = 0
  
  // Computed properties (special pattern)
  declare computedProp: boolean
  @Computed('computedProp') _computedPropComputed(): boolean {
    return this.count > 0
  }
  
  // Watchers (prefix with _)
  @Watch('count') _countWatch(newVal: number) {
    console.log('Count changed:', newVal)
  }
  
  // Component registration
  components = {Button, StringField}
  
  // Lifecycle hooks (Parent versions called first)
  created() {}
  createdParent() {}
  mounted() {}
  mountedParent() {}
}
```

## 📁 Project Structure
```
src/
├── core/           # Decorators & base classes (@VST, @Prop, @Watch, @Computed)
├── components/     # UI components library
│   ├── Elements/   # Button, Tabs
│   ├── Fields/     # StringField, DateField, SwitchField, TextField, SelectField
│   └── Documentation/ # Usage examples + documentation
├── kit/            # Exports for library users
├── replaceable/    # ⚠️ DO NOT EDIT (auto-generated)
└── Interfaces/     # TypeScript interfaces
```

## 🔧 Global Utilities
```typescript
// Available via global $VST object
$VST.$on(event, callback)     // Event subscription
$VST.$off(event, callback)    // Event unsubscription  
$VST.$emit(event, message)    // Event emission
$VST.DT                       // Date utilities
$VST.copyToClipboard(text)    // Copy to clipboard
$VST.generateSecurePassword() // Password generation
```

## 🚀 Development Rules

### ✅ DO
- Always use `@VST` decorator for components
- Inherit from `BaseComponent` (regular) or `FieldComponent` (forms)
- Props always `readonly`
- Watcher methods prefixed with `_`
- Use Pug templates and Sass/SCSS styles
- Register child components in `components` property
- Use `emitsParent` for v-model events in fields

### ❌ DON'T
- Edit files in `src/replaceable/` (auto-generated)
- Forget `@VST` decorator
- Use regular Vue components without decorators
- Forget `readonly` on props
- Forget `_` prefix on watcher methods

## 🛠️ Technical Stack
- **Vue 3** + TypeScript + Decorators
- **Pug** templates, **Sass/SCSS** styles
- **UnoCSS** for utility classes
- **Vite** for building
- External libs: TipTap, Flatpickr, Tagify, IMask

## 📦 Integration
- Published on npm as `vue-spear-tip` (MIT license)
- Uses lazy loading via `defineAsyncComponent`
- Bundle size ~200-300KB (acceptable for target use cases)
- No performance difference vs standard Vue components observed

## 🎨 Component Development Pattern
Each component has:
1. Component itself (e.g., `StringField.vue`)
2. Documentation with usage examples (`StringKit.vue`) 
3. Lazy loading export (`index.ts`)