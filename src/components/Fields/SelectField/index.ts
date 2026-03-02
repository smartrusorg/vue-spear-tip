import { defineAsyncComponent } from 'vue'
import type StringFieldClass from './SelectField.vue'
export default defineAsyncComponent(() => import('./SelectField.vue')) as unknown as InstanceType<typeof StringFieldClass>
