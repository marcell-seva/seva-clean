import { DownOutlined } from 'components/atoms'
import { NewInput } from 'components/atoms/input/newInput'
import { NewSelect } from 'components/atoms/SelectOld/NewSelect'
import { Shimmer } from 'components/atoms/shimmerOld'
import { useFunnelQueryData } from 'services/context/funnelQueryContext'
import React, { ChangeEvent, useEffect, useState } from 'react'
import { getIncomeList } from 'services/recommendations'
import styled from 'styled-components'
import { LanguageCode } from 'utils/enum'
import { getConvertFilterIncomeToRange } from 'utils/filterUtils'
import { replacePriceSeparatorByLocalization } from 'utils/numberUtils/numberUtils'
import { filterNonDigitCharacters } from 'utils/stringUtils'
import { FormControlValue } from 'utils/types'

export enum IncomeFieldType {
  freeText = 'freeText',
  selectOption = 'selectOption',
}

interface IncomeProps {
  isError?: boolean
  type?: IncomeFieldType
  onCarResultFIlter?: boolean
  customMargin?: string
  placeholder?: string
}

export function MonthlyIncome({
  isError = false,
  type = IncomeFieldType.freeText,
  onCarResultFIlter = false,
  customMargin = '0 0 8px 0',
  placeholder,
}: IncomeProps) {
  const [income, setIncome] = useState('')
  const { funnelQuery, patchFunnelQuery } = useFunnelQueryData()
  const [incomeOptions, setIncomeOptions] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (type === IncomeFieldType.selectOption) {
      setIsLoading(true)
      getIncomeList().then((res) => {
        const dataUpdate = res.map((item: { label: string; value: any }) => {
          return {
            label: item.label.replace(' - ', '-') + '/bulan',
            value: item.value,
          }
        })
        setIncomeOptions(dataUpdate)
        setIsLoading(false)
      })
    }
  }, [])

  const oChangeIncome = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value

    const digit = filterNonDigitCharacters(value)

    const formatValue = replacePriceSeparatorByLocalization(
      digit,
      LanguageCode.id,
    )

    patchFunnelQuery({ monthlyIncome: digit })
    setIncome('Rp ' + formatValue)

    if (formatValue.length === 0) {
      setIncome('')
    }
  }

  const handleOnChoose = (value: FormControlValue) => {
    patchFunnelQuery({
      monthlyIncome: value as string,
    })
  }

  return (
    <>
      {type === IncomeFieldType.freeText ? (
        <InputIncome
          type="text"
          value={income}
          maxLength={14}
          placeholder="Pilih kisaran pendapatanmu per bulan"
          onChange={oChangeIncome}
          overrideRedBorder={isError}
          customMargin={customMargin}
        />
      ) : !onCarResultFIlter ? (
        <StyledSelect
          className={`downpayment-amount-select-element ${
            isError ? 'shake-animation-X' : ''
          }`}
          customMargin={customMargin}
        >
          {isLoading || incomeOptions.length === 0 ? (
            <ShimmerBox height={40} />
          ) : (
            <NewSelect
              value={getConvertFilterIncomeToRange(funnelQuery.monthlyIncome)}
              options={incomeOptions}
              name={'income'}
              onChoose={handleOnChoose}
              suffixIcon={DownOutlined}
              floatDropdown={true}
              placeholder={
                placeholder || 'Pilih kisaran pendapatanmu per bulan'
              }
              isError={isError}
            />
          )}
        </StyledSelect>
      ) : (
        <StyledSelect customMargin={customMargin}>
          <NewSelect
            value={getConvertFilterIncomeToRange(funnelQuery.monthlyIncome)}
            options={incomeOptions}
            name={'income'}
            onChoose={handleOnChoose}
            suffixIcon={DownOutlined}
            floatDropdown={true}
            placeholder={placeholder || 'Pilih kisaran pendapatanmu per bulan'}
            isError={isError}
          />
        </StyledSelect>
      )}
    </>
  )
}

const InputIncome = styled(NewInput)<{
  customMargin: string
}>`
  margin: ${({ customMargin }) => customMargin};
`

const StyledSelect = styled.div<{
  customMargin: string
}>`
  width: 100%;
  margin: ${({ customMargin }) => customMargin};
`

export const ShimmerBox = styled(Shimmer)<{
  width?: string
  height: number
  marginBottom?: number
}>`
  height: ${({ height }) => height}px;
  width: ${({ width }) => width};
  margin-bottom: ${({ marginBottom }) => marginBottom}px;
`
