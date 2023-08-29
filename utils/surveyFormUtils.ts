import { FormControlValue } from './types'

export const isDataValid = (value: FormControlValue): boolean =>
  Array.isArray(value) ? value.length > 0 : !!value
