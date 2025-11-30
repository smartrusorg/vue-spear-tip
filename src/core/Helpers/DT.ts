import { Temporal } from 'temporal-polyfill'
/**
 * Функция для работы с датами и временем возвращая Temporal.ZonedDateTime
 * @param dateTimeString 
 * @param timeZone 
 * @returns ${Temporal.ZonedDateTime}
 */
function DT (dateTimeString?: string|number|Temporal.ZonedDateTime|Date, timeZone?: string): Temporal.ZonedDateTime {
  if (dateTimeString instanceof Temporal.ZonedDateTime) return dateTimeString // @ts-ignore
  if (dateTimeString instanceof Date) return $VST.DT(dateTimeString.getTime())
  if (!timeZone) { // @ts-ignore
    timeZone = $VST.DTTZ ?? Temporal.Now.timeZoneId()
  }
  timeZone = timeZone as string
  if (typeof dateTimeString == 'number') {
    return Temporal.Instant.fromEpochMilliseconds(dateTimeString).toZonedDateTimeISO(timeZone)
  }
  if (!dateTimeString) {
    return Temporal.Now.zonedDateTimeISO(timeZone)
  }
  
  try {
    let isoDateTimeString = ''
    // todo Если строка содержит пробел и не содержит временной зоны, парсим как локальное время в указанной зоне
    if (typeof dateTimeString == 'string') {
      try {
        return Temporal.PlainDateTime.from(dateTimeString).toZonedDateTime(timeZone)
      } catch (e: any) {
        isoDateTimeString = dateTimeString
      }
    }
    
    try {
      return Temporal.Instant.from(dateTimeString.includes(' ')
        ? (dateTimeString.replace(' ', 'T')+'Z')
        : dateTimeString).toZonedDateTimeISO(timeZone)
    } catch (e: any) {
      try {
        return Temporal.PlainDate.from(dateTimeString).toZonedDateTime(timeZone)
      } catch (e: any) {
        // dateTimeString = dateTimeString?.toString?.() ?? ''
        // Если строка содержит пробел между датой и временем
        if (dateTimeString.includes(' ')) {
          isoDateTimeString = dateTimeString.replace(' ', 'T')
        }
        
        // Добавляем миллисекунды, если их нет
        if (!isoDateTimeString.includes('.') && !isoDateTimeString.includes('Z') &&
          !isoDateTimeString.includes('+')) {
          isoDateTimeString += '.000'
        }
        
        // Если нет временной зоны, добавляем Z
        if (!isoDateTimeString.endsWith('Z') &&
          !(/[+-]\d{2}(:?\d{2})?$/.test(isoDateTimeString))) {
          isoDateTimeString += 'Z'
        }
        
        // Для формата с +ЧЧ добавляем :00
        if (/[+-]\d{2}$/.test(isoDateTimeString)) {
          isoDateTimeString += ':00'
        }
      }
      
      return Temporal.Instant.from(isoDateTimeString).toZonedDateTimeISO(timeZone)
    }
  } catch (e: any) { 
    const error = 'Не удалось преобразовать строку в формат ISO 8601' // @ts-ignore
    console.error?.(error, e)
    return Temporal.Now.zonedDateTimeISO(timeZone)
  }
}
export default DT