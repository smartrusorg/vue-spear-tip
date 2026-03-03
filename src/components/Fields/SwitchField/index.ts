import { defineAsyncComponent } from 'vue'
import type StringFieldClass from './SwitchField.vue'
export default defineAsyncComponent(() => import('./SwitchField.vue')) as unknown as InstanceType<typeof StringFieldClass>
