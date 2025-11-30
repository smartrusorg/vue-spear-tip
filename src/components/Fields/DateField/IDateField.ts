import {IFieldComponent} from '../../../Interfaces/IFieldComponent'
import {Temporal} from 'temporal-spec'

/** Date field interface */
export default interface IDateField extends IFieldComponent {
  /**
   *  @Prop {Boolean}
   *  Value of field returns as string format sql ISO861 dates and datetime (2012-12-12 00:01:22).
   *  By default value has unix timestamp number format.
   */
  readonly ISO861UTCMode: boolean
  
  /** Temporal.ZonedDateTime value reactive stamp (back reactivity not support in ECMAScript Temporal.ZonedDateTime) */
  readonly DT: Temporal.ZonedDateTime|null
}