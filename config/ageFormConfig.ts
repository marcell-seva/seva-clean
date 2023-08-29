import { AgeGroup } from 'utils/enum'

type RadioOptionType = {
  value: string
  label: string
}
interface AgeFormConfig {
  id: string
  label: string
  placeholderLabel: string
  options: RadioOptionType[]
}

export const ageFormConfig: AgeFormConfig = {
  id: 'ageGroup',
  label: 'Halo, berapa umur kamu?',
  placeholderLabel: 'Pilih',
  options: [
    {
      value: AgeGroup.From18to27,
      label: AgeGroup.From18to27,
    },
    {
      value: AgeGroup.From28to34,
      label: AgeGroup.From28to34,
    },
    {
      value: AgeGroup.From35to50,
      label: AgeGroup.From35to50,
    },
    {
      value: AgeGroup.OlderThan50,
      label: AgeGroup.OlderThan50,
    },
  ],
}
