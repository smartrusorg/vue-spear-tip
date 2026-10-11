import { defineAsyncComponent } from 'vue'
import type StringFieldClass from './QRField.vue'
export default defineAsyncComponent(() => import('./QRField.vue')) as unknown as InstanceType<typeof StringFieldClass>
