import { defineAsyncComponent } from 'vue'
import type StringFieldClass from './Droppable.vue'
export default defineAsyncComponent(() => import('./Droppable.vue')) as unknown as InstanceType<typeof StringFieldClass>
