import { defineAsyncComponent } from 'vue'
import type StringFieldClass from './DateField.vue'
export default defineAsyncComponent(() => import('./DateField.vue')) as unknown as InstanceType<typeof StringFieldClass>
