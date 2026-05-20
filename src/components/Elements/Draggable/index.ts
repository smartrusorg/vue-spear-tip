import { defineAsyncComponent } from 'vue'
import type StringFieldClass from './Draggable.vue'
export default defineAsyncComponent(() => import('./Draggable.vue')) as unknown as InstanceType<typeof StringFieldClass>
