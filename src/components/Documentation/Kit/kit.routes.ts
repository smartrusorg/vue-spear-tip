import GridKit from '../Kit/GridKit.vue'
import ButtonKitElement from './Elements/ButtonKitElement.vue'
import QRCodeKitElement from './Elements/QRCodeKitElement.vue'
import BarcodeKitElement from './Elements/BarcodeKitElement.vue'
import SelectKitField from './Fields/SelectKitField.vue'
import DateKitField from './Fields/DateKitField.vue'
import StringKitField from './Fields/StringKitField.vue'
import TabsKit from '../../Elements/Tabs/TabsKit.vue'
import TextKitField from './Fields/TextKitField.vue'
import SwitchKitField from './Fields/SwitchKitField.vue'
import ScrollbarKit from '../../Elements/Scrollbar/ScrollbarKit.vue'

export default [
  {
    name: '<hr style="border: solid #ccc; border-width: 1px 0 0">',
  },
  {
    name: '<b>Styles</b>',
  },
  {
    path: '/grid',
    name: 'Grid',
    component: GridKit
  },
  // {
  //   path: '/code-highlighter',
  //   name: 'Code Highlighter',
  //   component: CodeHighlighterGuide
  // },
  {
    name: '<hr style="border: solid #ccc; border-width: 1px 0 0">',
  },
  {
    name: '<b>Elements</b>',
  },
  {
    path: '/elements/button',
    name: 'Button',
    component: ButtonKitElement
  },
  {
    path: '/elements/tabs',
    name: 'Tabs',
    component: TabsKit
  },
  {
    path: '/elements/scrollbar',
    name: 'Scrollbar',
    component: ScrollbarKit
  },
  // {
  //   path: '/elements/qr',
  //   name: 'QR Code',
  //   component: QRCodeKitElement
  // },
  // {
  //   path: '/elements/barcode',
  //   name: 'Barcode',
  //   component: BarcodeKitElement
  // },
  // {
  //   path: '/grid',
  //   name: 'Tabs',
  //   component: GridKit
  // },
  {
    name: '<hr style="border: solid #ccc; border-width: 1px 0 0">',
  },
  {
    name: '<b>Fields</b>',
  },
  {
    path: '/fields/date',
    name: 'Date',
    component: DateKitField
  },
  {
    path: '/fields/select',
    name: 'Select',
    component: SelectKitField
  },
  {
    path: '/fields/string',
    name: 'String',
    component: StringKitField
  },
  {
    path: '/fields/switch',
    name: 'Switch <small>(Checkbox)</small>',
    component: SwitchKitField
  },
  {
    path: '/fields/text',
    name: 'Text',
    component: TextKitField
  },
  {
    name: '<hr style="border: solid #ccc; border-width: 1px 0 0">',
  },
  {
    name: '<b>Widgets</b>',
  },
  {
    name: '<b style="color: #ccc;">Soon</b>',
  },
  {
    name: '<hr style="border: solid #ccc; border-width: 1px 0 0">',
  },
  {
    name: '<b>Helpers</b>',
  },
  {
    name: '<b style="color: #ccc;">Soon</b>',
  },
  {
    name: '<b style="color: #ccc;">DT (datetime)</b>',
  },
  {
    name: '<b style="color: #ccc;">Toasts (Soon)</b>',
  },
  {
    name: '<b style="color: #ccc;">Modals (Soon)</b>',
  },
  {
    name: '<b style="color: #ccc;">AutoDocs by Class (Soon)</b>',
  },
]
