import React, { useState, useEffect } from 'react'
import styled, { css } from 'styled-components'
import { colors } from 'styles/colors'
import { trackLandingPageAdvanceSearchClick } from 'helpers/amplitude/seva20Tracking'
import elementId from 'helpers/elementIds'
import { DownOutlined } from 'components/atoms'
import { FieldWrapper, MandatoryText, Title } from '../searchWidget'
import { IncomeFieldType, MonthlyIncome } from './income'
import { Age } from './age'
import { TextLegalMediumStyle } from 'utils/typography/TextLegalMedium'

type AdvSearchError = {
  income: boolean
  age: boolean
}

interface AdvancedSearchProps {
  isError: AdvSearchError
  onChangeDropdown: (open: boolean) => void
}

export function AdvancedSearch({
  isError,
  onChangeDropdown,
}: AdvancedSearchProps) {
  const [open, setOpen] = useState(false)
  const { income, age } = isError

  const handleClick = () => {
    trackLandingPageAdvanceSearchClick()
    setOpen(!open)
  }

  useEffect(() => {
    onChangeDropdown(open)
  }, [open])

  return (
    <>
      <StyledAdvancedSearch>
        <AdvancedSearchText
          data-testid={elementId.Homepage.CarSearchWidget.AdvanceSearch}
          onClick={handleClick}
        >
          Advanced search
        </AdvancedSearchText>
        <StyledIconWrapper open={open} onClick={handleClick}>
          <DownOutlined width={10} height={5} color={colors.primaryBlue} />
        </StyledIconWrapper>
      </StyledAdvancedSearch>
      <FormWrapper open={open}>
        <FieldWrapper>
          <Title>Kisaran pendapatan</Title>
          <MonthlyIncome
            type={IncomeFieldType.selectOption}
            isError={income}
            customMargin={'0'}
            placeholder="2-4 juta/bulan"
          />
          {income && (
            <MandatoryText
              data-testid={
                elementId.Homepage.CarSearchWidget.ErrorMessageIncome
              }
            >
              *Wajib diisi
            </MandatoryText>
          )}
        </FieldWrapper>
        <FieldWrapper>
          <Title>Rentang usia</Title>
          <Age isError={age} placeholder="18-27" />
          {age && (
            <MandatoryText
              data-testid={elementId.Homepage.CarSearchWidget.ErrorMessageAge}
            >
              *Wajib diisi
            </MandatoryText>
          )}
        </FieldWrapper>
      </FormWrapper>
    </>
  )
}

const StyledAdvancedSearch = styled.div`
  margin: 10px 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 6px;
`

const AdvancedSearchText = styled.span`
  ${TextLegalMediumStyle}
  line-height: 22px;
  text-decoration: underline;
  cursor: pointer;
  color: ${colors.primaryBlue};
`

export const rotate = css`
  transform: rotate(180deg);
`

const StyledIconWrapper = styled.div<{ open: boolean }>`
  ${({ open }) => open && rotate}
  transition: transform 150ms ease;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`

const FormWrapper = styled.div<{ open: boolean }>`
  max-height: ${({ open }) => (open ? '114px' : 0)};
  padding-bottom: ${({ open }) => (open ? '16px' : 0)};
  overflow-x: hidden;
  transition: all 150ms ease-in-out;
  width: 100%;
  text-align: left;

  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 14px;
`
