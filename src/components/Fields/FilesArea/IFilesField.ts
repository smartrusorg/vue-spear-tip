/** Информация о файле оперируемым формой (используется для поля файлов) */
export default interface IFilesField {
  /** Расширение файла */
  ext: string
  /** MD5 сумма */
  hash: string
  /** MIME тип */
  mime: string
  /** Название */
  name: string
  /** Относительный путь */
  uri: string
  /** Размер в байтах */
  size: number
  /** Кодировка */
  encoding?: string
  /** Последнее изменение файла */
  lastModified?: number
  /** Путь на сервере */
  path?: string
  /** Является новым файлом */
  new?: boolean
  /** Возможны прочие параметры */
  [key: string]: any
}
