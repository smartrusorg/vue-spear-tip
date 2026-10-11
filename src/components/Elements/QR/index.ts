import { defineAsyncComponent } from 'vue'
import type StringFieldClass from './QR.vue'
export default defineAsyncComponent(() => import('./QR.vue')) as unknown as InstanceType<typeof StringFieldClass>
