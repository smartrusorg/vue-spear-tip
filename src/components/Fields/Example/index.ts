import { defineAsyncComponent } from 'vue'
import type StringFieldClass from './Example.vue'
export default defineAsyncComponent(() => import('./Example.vue')) as unknown as InstanceType<typeof StringFieldClass>
