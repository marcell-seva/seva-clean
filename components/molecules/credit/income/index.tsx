import React, { useState } from 'react'
import Input from 'components/atoms/input/default'
import styles from 'styles/components/molecules/dp/dpform.module.scss'
import clsx from 'clsx'
import elementId from 'helpers/elementIds'

interface PropsIncomeInput extends React.ComponentProps<'input'> {
  defaultValue?: number
  value?: number
  title?: string
  name?: string
  handleChange: (name: string, value: any) => void
  isErrorTooLow: boolean
  emitOnBlurInput: () => void
}

const IncomeForm = ({
  value,
  title = 'Pendapatan Bulanan',
  name,
  handleChange,
  defaultValue,
  isErrorTooLow,
  emitOnBlurInput,
  ...inputProps
}: PropsIncomeInput): JSX.Element => {
  const [formattedValue, setFormattedValue] = useState<string>(() => {
    if (value) {
      return value.toLocaleString('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
      })
    }
    return ''
  })

  const formatIncome = (value: number | string) => {
    const parsedInput = value?.toString().replaceAll(/\D/g, '')
    const formattedInput = `Rp${Number(parsedInput).toLocaleString('id-ID', {
      minimumFractionDigits: 0,
    })}`

    return { formattedInput, parsedInput }
  }

  React.useEffect(() => {
    if (defaultValue) {
      const income = formatIncome(defaultValue)
      setFormattedValue(income.formattedInput)
    }
  }, [defaultValue])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value
    const income = formatIncome(input)
    setFormattedValue(income.formattedInput)
    handleChange(name || '', income.parsedInput)
  }

  return (
    <div style={{ marginTop: '24px' }}>
      <Input
        {...inputProps}
        value={formattedValue}
        onChange={handleInputChange}
        title={title}
        placeholder="Masukkan pendapatan bulanan anda"
        type="tel"
        maxLength={14} // include symbol and thousand separator
        className={clsx(styles.input, isErrorTooLow && styles.error)}
        onBlur={emitOnBlurInput}
        dataTestId={elementId.Field.Income}
      />
    </div>
  )
}

export default IncomeForm
