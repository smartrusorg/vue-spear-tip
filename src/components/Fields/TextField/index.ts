import { defineAsyncComponent } from 'vue'
import type StringFieldClass from './TextField.vue'
export default defineAsyncComponent(() => import('./TextField.vue')) as unknown as InstanceType<typeof StringFieldClass>
