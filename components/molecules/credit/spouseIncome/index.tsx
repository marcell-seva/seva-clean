import React, { useState } from 'react'
import Input from 'components/atoms/input/default'
import styles from 'styles/components/molecules/dp/dpform.module.scss'
import clsx from 'clsx'

interface PropsIncomeInput {
  defaultValue?: number
  value?: number
  title?: string
  name?: string
  handleChange: (name: string, value: any) => void
  isErrorTooLow: boolean
  emitOnBlurInput: () => void
}

const SpouseIncomeForm = ({
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
    const income = formatIncome(Number(defaultValue) || 0)
    setFormattedValue(income.formattedInput)
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
        placeholder="Rp 0"
        type="tel"
        className={clsx(styles.input, isErrorTooLow && styles.error)}
        onBlur={emitOnBlurInput}
      />
    </div>
  )
}

export default SpouseIncomeForm
