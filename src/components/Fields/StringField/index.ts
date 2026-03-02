import { defineAsyncComponent } from 'vue'
import type StringFieldClass from './StringField.vue'
export default defineAsyncComponent(() => import('./StringField.vue')) as unknown as InstanceType<typeof StringFieldClass>
