---
globs: |
  **/*.vue
  **/*.ts
  **/*.js
description: "Technical implementation guide for Vue Spear Tip - build process, global state, and advanced patterns"
alwaysApply: true
---

# Vue Spear Tip - Technical Implementation Guide

## 🔧 Build & Development Process

### Development Commands
```bash
# Development (examples)
npm run examples-docs-dev     # Develop documentation
npm run examples-dev          # Develop examples

# Build
npm run examples-docs-build   # Build documentation
npm run examples-build        # Build examples  
npm run build                 # Build library

# Publishing
npm npm publish               # Publish to npm
```
### Publishing Process
1. **Update version synchronization**:
    - Update version in `src/package.json` to match root `package.json` version
    - Keep all other fields in `src/package.json` unchanged

2. **Version checking**:
    - If version ends with `-beta.X` (e.g., `0.2.15-beta.0`) → use `npm publish --tag beta`
    - If stable version (no `-beta` suffix) → use `npm publish`

### Key Build Configuration
- **Vite** with `keepNames: true` (essential for decorators)
- **TypeScript** with `experimentalDecorators: true`
- Output formats: ES module, CommonJS, TypeScript definitions
- Styles: Separate CSS files for main library and grid system

## 🌐 Global State Architecture

### $VST Global Object Structure
```typescript
globalThis.$VST = {
  // Event system
  $on(event: string, callback: Function),
  $off(event: string, callback: Function), 
  $emit(event: string, message?: any),
  
  // Utilities
  DT,                            // Date utilities
  copyToClipboard(text: string),
  generateSecurePassword(len?: number),
  generateRandomKey(len?: number),
  safeStringify(obj: any),
  
  // Internal metadata storage
  _dynamic: {
    _vueClassInstances: {[className: string]: any},
    _vueClassProps: {[className: string]: any},
    _vueClassWatchers: {[className: string]: any},
    _vueComputed: {[className: string]: any}
  }
}
```

### Decorator Internal Mechanics

#### @VST (VueClassComponent)
- Creates Vue component via `defineComponent()`
- Processes inheritance chain for props/watchers/computed
- Sets up dual lifecycle hooks (Parent + regular)
- Handles component registration and mixins

#### @Prop Internal Flow
1. Stores prop metadata in `constructor.___VST.props`
2. Automatically extracts default values from class initialization
3. Supports multiple types: `@Prop(String, Number)`
4. Handles inheritance through prototype chain

#### @Watch Internal Flow  
1. Registers watcher in `globalThis.$VST._dynamic._vueClassWatchers`
2. Supports deep watching and immediate execution
3. Binds method context to component instance

#### @Computed Internal Flow
1. Uses special pattern: `declare` + method with `_` prefix
2. Stores computed getter in `globalThis.$VST._dynamic._vueComputed`
3. Removes original method from instance to avoid conflicts

## 🔄 Component Inheritance System

### Inheritance Chain Processing
```typescript
// VueClassComponent.ts - Inheritance resolution
let props = {}
let currentClass = constructor

do {
  // Collect props from entire inheritance chain
  props = Object.assign(props, allProps?.[currentClass.name] ?? {})
  currentClass = Object.getPrototypeOf(currentClass)
} while (currentClass instanceof VueClass)
```

### Parent vs Child Lifecycle
```typescript
// Execution order:
beforeCreateParent()  // Parent first
beforeCreate()        // Then child
createdParent()       // Parent first  
created()            // Then child
// ... continues for all hooks
```

## 📦 Library Integration Patterns

### Installation & Usage
```bash
npm install vue-spear-tip
```

```typescript
// Main application setup
import { createApp } from 'vue'
import App from './App.vue'
import 'vue-spear-tip/style'    // Main styles
import 'vue-spear-tip/grid'     // Optional grid system

const app = createApp(App)
app.mount('#app')
```

### Component Usage in Projects
```vue
<template lang="pug">
.user-form
  StringField(
    v-model="user.email"
    :mask-preset="'email'"
    placeholder="Enter email"
  )
  Button(@click-tap="submitForm") Submit
</template>

<script lang="ts">
import {VST, BaseComponent, StringField, Button} from 'vue-spear-tip'

@VST export default class UserForm extends BaseComponent {
  components = {StringField, Button}
  
  user = {
    email: ''
  }
  
  submitForm() {
    console.log('Form submitted:', this.user)
  }
}
</script>
```

## 🎨 Styling Architecture

### CSS Strategy
- **Sass/SCSS** for component-specific styles
- **UnoCSS** for utility classes and design system
- **CSS Variables** planned for theming
- **Scoped styles** by default in components

### Replaceable Components System
- `src/replaceable/` contains base components
- Auto-replaced during build based on configuration
- Supports different styling approaches (UnoCSS vs traditional)
- ⚠️ **DO NOT EDIT** - these are generated files

## 🔍 Advanced Patterns

### Custom Base Components
```typescript
// Creating project-specific base component
@VST export default abstract class ProjectBaseComponent extends BaseComponent {
  // Add project-wide functionality
  protected projectMethod() {
    // Common logic for all project components
  }
  
  // Override lifecycle if needed
  created() {
    super.created()
    // Project-specific initialization
  }
}
```

### Complex Field Components
```typescript
@VST export default class AdvancedField extends FieldComponent {
  @Prop(String) readonly validationRule: string = ''
  
  declare isValid: boolean
  @Computed('isValid') _isValidComputed(): boolean {
    // Complex validation logic
    return this.validateField(this.value)
  }
  
  private validateField(value: any): boolean {
    // Implementation using validationRule
    return true
  }
  
  // Custom event handling
  onValueChange(value: any) {
    if (this.isValid) {
      this.setValue(value)
      this.$emit('update:modelValue', value)
      this.$emit('valid-input', value)
    } else {
      this.$emit('invalid-input', value)
    }
  }
}
```

## 🐛 Debugging & Troubleshooting

### Common Issues

#### Decorators Not Working
```typescript
// Check tsconfig.json
{
  "compilerOptions": {
    "experimentalDecorators": true, // ← CRITICAL
    "emitDecoratorMetadata": true, // ← CRITICAL
    "keepNames": true  // ← CRITICAL
  }
}

// Check vite.config.ts
{
  esbuild: {
    keepNames: true  // ← CRITICAL
  }
}
```

#### Props Not Reactive
- Verify `readonly` keyword is used
- Check prop types are correctly specified
- Ensure default values are provided

#### Computed Properties Not Updating
- Verify `declare` + `@Computed` pattern
- Check method has `_` prefix
- Ensure dependencies are reactive properties

### Development Tools
- Vue DevTools work normally with VST components
- Console warnings indicate missing decorators
- TypeScript provides full intellisense for class-based components

## 🚀 Performance Considerations

### Bundle Size Optimization
- Lazy loading via `defineAsyncComponent`
- Tree-shaking supported (ES module format)
- External dependencies loaded only when used
- ~200-300KB total bundle size (acceptable for target use cases)

### Runtime Performance
- No observable performance difference vs standard Vue components
- Decorators process at compile/load time, not runtime
- Inheritance resolution happens once per component type

## 🔮 Future Development Directions

### Planned Features
- **Auto-documentation** via class metadata parsing
- **CSS Variables** for theming system
- **Enhanced TypeScript** support for better intellisense
- **More UI Components** as needed by real projects

### Integration with Engine
- Planned integration with TypeScript-based modular engine
- Support for complex cross-platform forms
- Unified architecture for monolith applications
- Module isolation with API-based communication

This technical guide provides the implementation details needed for advanced development and troubleshooting in the Vue Spear Tip ecosystem.