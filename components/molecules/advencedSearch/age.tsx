import { DownOutlined } from 'components/atoms'
import { NewSelect } from 'components/atoms/SelectOld/NewSelect'
import { ageFormConfig } from 'config/ageFormConfig'
import { useFunnelQueryData } from 'context/funnelQueryContext/funnelQueryContext'
import React from 'react'
import styled from 'styled-components'
import { FormControlValue } from 'utils/types'

interface AgeProps {
  isError?: boolean
  customMargin?: string
  placeholder?: string
}

export const Age = ({
  isError = false,
  customMargin = '0',
  placeholder,
}: AgeProps) => {
  const { funnelQuery, patchFunnelQuery } = useFunnelQueryData()

  const handleOnChange = (value: FormControlValue) => {
    patchFunnelQuery({
      age: value as string,
    })
  }

  return (
    <StyledSelect
      className={`downpayment-amount-select-element ${
        isError ? 'shake-animation-X' : ''
      }`}
      customMargin={customMargin}
    >
      <NewSelect
        value={funnelQuery.age}
        options={ageFormConfig.options}
        name={'age'}
        onChoose={handleOnChange}
        suffixIcon={DownOutlined}
        floatDropdown={true}
        placeholder={placeholder || 'Pilih umur'}
        isError={isError}
      />
    </StyledSelect>
  )
}

const StyledSelect = styled.div<{
  customMargin: string
}>`
  width: 100%;
  margin: ${({ customMargin }) => customMargin};
`
