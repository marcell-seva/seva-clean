import { FormControlValue, Option } from 'utils/types'

export const getOptionLabel = (
  options: Option<FormControlValue>[],
  valueParam: FormControlValue,
) => {
  const labelKey = options?.find((option) => {
    return option.value === valueParam
  })?.label
  return labelKey
}

export const getOptionValue = (
  options: Option<FormControlValue>[],
  labelParam: FormControlValue,
) => {
  const valueKey = options?.find((option) => {
    return option.label === labelParam
  })?.value
  return valueKey
}
