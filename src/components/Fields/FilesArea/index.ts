import { defineAsyncComponent } from 'vue'
import type StringFieldClass from './FilesArea.vue'
export default defineAsyncComponent(() => import('./FilesArea.vue')) as unknown as InstanceType<typeof StringFieldClass>
