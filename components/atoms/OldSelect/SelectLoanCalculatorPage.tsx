import React, {
  ChangeEvent,
  ReactElement,
  SelectHTMLAttributes,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { colors, transparent } from '../../../styles/colors'
import { createPortal } from 'react-dom'
import { FormControlValue, Option } from 'utils/types'
import { client } from 'utils/helpers/const'

interface SelectProps<T extends FormControlValue>
  extends SelectHTMLAttributes<HTMLSelectElement> {
  options: Option<T>[] | undefined
  onChoose: (value: FormControlValue) => void
  placeholder?: string
  enableSearch?: boolean
  floatDropdown?: boolean
  onSearch?: (value: string) => void
  prefixIcon?: ({ color }: any) => JSX.Element
  suffixIcon?: ({ color }: any) => JSX.Element
  errorIcon?: ({ color }: any) => JSX.Element
  isShowDropDownByValue?: boolean
  noOptionText?: string
  dropdownBackground?: string
  disabled?: boolean
  isFloatAtBottom?: boolean
  isNewRegularPage?: boolean
  isTabCreditV2?: boolean
  isTabCreditDesktop?: boolean
  isError?: boolean
  onOptionOpen?: (value: boolean) => void
  name?: string
}

interface InputProps {
  inputValue: string
  hasOptions?: boolean
  isNoOptionMode?: boolean
  isNewRegularPage?: boolean
  isTabCreditV2?: boolean
  isTabCreditDesktop?: boolean
  isError?: boolean
  onOptionOpen?: (value: boolean) => void
}

export const SelectLoanCalculatorPage = <T extends FormControlValue>({
  options,
  placeholder,
  value,
  onChoose,
  enableSearch = false,
  floatDropdown = false,
  onSearch,
  prefixIcon,
  suffixIcon,
  isShowDropDownByValue = false,
  errorIcon,
  noOptionText,
  dropdownBackground = colors.white,
  isFloatAtBottom = true,
  disabled,
  isNewRegularPage = false,
  isTabCreditV2 = false,
  isError = false,
  isTabCreditDesktop = false,
  onOptionOpen,
  name,
}: SelectProps<T>): ReactElement => {
  const { t } = useTranslation()
  const inputRef = useRef() as React.MutableRefObject<HTMLInputElement>
  const getOptionLabel = (valueParam: FormControlValue) => {
    const labelKey = options?.find((option) => {
      return option.value === valueParam
    })?.label
    return t(labelKey || '')
  }
  const [showOptionArea, setShowOptionArea] = useState(false)
  const [inputValue, setInputValue] = useState(
    () => getOptionLabel(value) || '',
  )
  const [isNoOptionMode, setIsNoOptionMode] = useState(false)
  const onSelect = ({ value: valueParam }: Option<T>) => {
    onChoose(valueParam)
    setInputValue(getOptionLabel(valueParam))
  }
  useEffect(() => setInputValue(getOptionLabel(value)), [value])
  useEffect(() => {
    if (showOptionArea) {
      onOptionOpen && onOptionOpen(true)
    } else {
      onOptionOpen && onOptionOpen(false)
    }
  }, [showOptionArea])

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const currentInputValue = event.target.value
    setInputValue(currentInputValue)
    onSearch && onSearch(currentInputValue)
  }
  const renderDropdown = () => {
    const domEl = document.querySelector('body')
    const rect = inputRef.current?.getBoundingClientRect()
    const dropdownComponent = (
      <StyledOptionArea
        bgColor={dropdownBackground}
        floatDropdown={floatDropdown}
      >
        {options?.map((option, index) => (
          <StyledOption
            key={index}
            isSelected={t(option.label) === inputValue}
            onMouseDown={() => {
              onSelect(option)
            }}
            className={'loan-calc-select-item-element'}
            isNewRegularPage={isNewRegularPage}
          >
            {enableSearch ? option.label : t(option.label)}
          </StyledOption>
        ))}
      </StyledOptionArea>
    )
    return floatDropdown && domEl
      ? createPortal(
          <StyledFloatDropdown
            rect={rect}
            isFloatAtBottom={isFloatAtBottom}
            className={'loan-calc-select-item-group-element'}
          >
            {dropdownComponent}
          </StyledFloatDropdown>,
          domEl,
        )
      : dropdownComponent
  }
  const noOptionFoundWithInputValue = inputValue && options?.length == 0

  return (
    <SelectContainer>
      <SelectAndIconContainer
        ref={inputRef}
        inputValue={inputValue}
        hasOptions={options && options?.length > 0}
        isNoOptionMode={isNoOptionMode && inputValue !== ''}
        isNewRegularPage={isNewRegularPage}
        isTabCreditV2={isTabCreditV2}
        isTabCreditDesktop={isTabCreditDesktop}
        isError={isError}
      >
        {prefixIcon ? (
          <StyledPrefixIconContainer>
            <span className={'defaultPrefixIcon'}>
              {prefixIcon({ color: '#05256e' })}
            </span>
            <span className={'selectedPrefixIcon'}>
              {prefixIcon({ color: '#05256e' })}
            </span>

            <span className={'focusedPrefixIcon'}>
              {prefixIcon({ color: '#05256e' })}
            </span>
          </StyledPrefixIconContainer>
        ) : null}
        <StyledSelect
          data-testid={name}
          value={inputValue}
          type="text"
          onBlur={() => {
            setTimeout(() => {
              setShowOptionArea(false)
            }, 100)
            setIsNoOptionMode(true)
          }}
          onFocus={() => {
            setShowOptionArea(true)
            setIsNoOptionMode(true)
          }}
          onChange={handleInputChange}
          readOnly={!enableSearch}
          placeholder={placeholder || t('common.select')}
          inputValue={inputValue}
          disabled={disabled}
          className={'loan-calc-select-element'}
          isTabCreditDesktop={isTabCreditDesktop}
          isNewRegularPage={isNewRegularPage}
        />
        {suffixIcon && options && options.length > 0 && (
          <StyledSuffixIconContainer isOpen={showOptionArea}>
            <span className={'defaultSuffixIcon'}>
              {suffixIcon({ color: '#05256e' })}
            </span>
            <span className={'focusedSuffixIcon'}>
              {suffixIcon({ color: '#05256e' })}
            </span>
          </StyledSuffixIconContainer>
        )}
        {errorIcon && noOptionFoundWithInputValue && (
          <StyledErrorIconContainer>
            {errorIcon({ color: colors.error })}
          </StyledErrorIconContainer>
        )}
      </SelectAndIconContainer>
      {showOptionArea &&
        options &&
        options.length > 0 &&
        (!isShowDropDownByValue || !!inputValue) &&
        renderDropdown()}

      {noOptionFoundWithInputValue && isNoOptionMode && (
        <StyledOptionArea
          bgColor={dropdownBackground}
          floatDropdown={floatDropdown}
        >
          <NoOptionText>
            <StyledTextNoOption>{t(noOptionText || '')}</StyledTextNoOption>
          </NoOptionText>
        </StyledOptionArea>
      )}
    </SelectContainer>
  )
}

const screenHeight = client ? document.documentElement.clientHeight : 0

const StyledSelect = styled.input<InputProps>`
  font-family: 'OpenSans';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0px;

  height: ${({ isNewRegularPage, isTabCreditDesktop }) =>
    isNewRegularPage && !isTabCreditDesktop
      ? '72px'
      : !isNewRegularPage && isTabCreditDesktop
      ? '48px'
      : '56px'};
  width: 100%;
  border: none;
  border-radius: ${({ isNewRegularPage }) =>
    isNewRegularPage ? '16px' : '8px'};
  padding-right: 22px;
  padding-left: 23px;
  font-size: ${({ isNewRegularPage, isTabCreditDesktop }) =>
    isNewRegularPage ? '24px' : isTabCreditDesktop ? '16px' : '18px'};
  font-family: ${({ isTabCreditDesktop }) =>
    isTabCreditDesktop ? 'OpenSans' : 'Kanyon'};
  color: #05256e;
  &::placeholder {
    color: ${colors.placeholder};
  }
  :focus {
    &::placeholder {
      color: ${colors.placeholder};
    }
  }

  @media (max-width: 1024px) {
    font-size: 16px;
    font-size: 14px;
    height: 56px;
  }
  @media (max-width: 320px) {
    height: 40px;
  }
`

const selectedStyle = css`
  background-color: ${transparent('primarySky', 1)};
  color: #05256e;
  font-weight: 600;
`

const StyledOption = styled.div<{
  isSelected: boolean
  isNewRegularPage: boolean
}>`
  font-family: 'OpenSans';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0px;

  height: 50px;
  width: 100%;
  color: #05256e;
  border-radius: 8px;
  :hover {
    ${selectedStyle}
  }
  font-size: ${({ isNewRegularPage }) => (isNewRegularPage ? '24px' : '16px')};
  ${({ isSelected }) => isSelected && selectedStyle};
  flex-shrink: 0;
  line-height: 50px;
  padding: 0 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  :not(:last-child) {
    margin-bottom: 2px;
  }
  @media (max-width: 1024px) {
    font-size: 16px;
  }
`
const NoOptionText = styled.div`
  width: 100%;
  border-radius: 15px;
  padding: 12px 5px;
`

interface DropdownProps {
  rect: DOMRect
  isFloatAtBottom: boolean
}

const StyledFloatDropdown = styled.div<DropdownProps>`
  position: absolute;
  ${({ isFloatAtBottom }) =>
    isFloatAtBottom ? StyledFloatAtBottomCss : StyledFloatAtTopCss};
  left: ${({ rect }) => rect.left}px;
  width: ${({ rect }) => rect.width}px;
  z-index: 100;
  background: ${colors.white};
  box-shadow: 0 8px 16px rgba(17, 17, 17, 0.04);
  border-radius: 15px;
`

const StyledFloatAtTopCss = css<{ rect: DOMRect }>`
  bottom: ${({ rect }) => screenHeight - rect.top - window.scrollY + 16}px;
`

const StyledFloatAtBottomCss = css<{ rect: DOMRect }>`
  top: ${({ rect }) => window.scrollY + rect.bottom}px;
`

const getStyledOptionAreaMaxHeight = (floatDropdown: boolean) => {
  if (floatDropdown) {
    return '288px'
  } else if (screenHeight > 650) {
    return '245px'
  } else {
    return '195px'
  }
}

const StyledOptionArea = styled.div<{
  bgColor: string
  floatDropdown: boolean
}>`
  width: 100%;
  max-height: ${({ floatDropdown }) =>
    getStyledOptionAreaMaxHeight(floatDropdown)};
  overflow: scroll;
  background: ${({ bgColor }) => bgColor};
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 8px 16px ${transparent('title', 0.1)};
  border-radius: 16px;
  margin-top: 13px;
  div:first-child {
    margin-top: 13px;
  }
  padding: 0 12px 12px;
`

const StyledSuffixIconContainer = styled.div<{ isOpen: boolean }>`
  margin-right: 18px;
  ${({ isOpen }) =>
    isOpen &&
    css`
      transform: rotate(180deg);
    `};
`
const StyledErrorIconContainer = styled.div`
  margin-right: 10px;
`

const StyledPrefixIconContainer = styled.div`
  margin-left: 12px;
  padding-right: 6px;
`

const SelectContainer = styled.div`
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
`

const SelectAndIconContainer = styled.div<InputProps>`
  width: 100%;
  position: relative;
  border-radius: ${({ isNewRegularPage }) =>
    isNewRegularPage ? '16px' : '8px'};
  border: ${({ isTabCreditV2 }) => (isTabCreditV2 ? '1.5px' : '1px')} solid
    ${colors.placeholder};
  background-color: ${colors.white};
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: space-between;
  ${StyledPrefixIconContainer} {
    .focusedPrefixIcon {
      display: none;
    }
    .defaultPrefixIcon {
      display: ${({ inputValue }) =>
        inputValue === '' ? 'inline-block' : 'none'};
    }
    .selectedPrefixIcon {
      display: ${({ inputValue }) =>
        inputValue === '' ? 'none' : 'inline-block'};
    }
  }
  ${StyledSuffixIconContainer} {
    .focusedSuffixIcon {
      display: none;
    }
    .defaultSuffixIcon {
      display: inline-block;
    }
  }
  border-color: ${({
    hasOptions,
    isNoOptionMode,
    isTabCreditV2,
    isError,
    isTabCreditDesktop,
  }) =>
    !hasOptions && isNoOptionMode && !isTabCreditV2
      ? colors.error
      : isTabCreditV2 && isError
      ? colors.secondary
      : isTabCreditDesktop
      ? '#E4E9F1'
      : colors.placeholder};
  :focus-within {
    border-color: ${({ hasOptions, isNoOptionMode }) =>
      !hasOptions && isNoOptionMode ? colors.error : colors.label};
    input {
      color: #05256e;
    }

    ${StyledSuffixIconContainer} {
      .focusedSuffixIcon {
        display: inline-block;
      }
      .defaultSuffixIcon {
        display: none;
      }
    }
    ${StyledPrefixIconContainer} {
      .focusedPrefixIcon {
        display: inline-block;
      }
      .defaultPrefixIcon,
      .selectedPrefixIcon {
        display: none;
      }
    }
  }

  @media (min-width: 1025px) {
    padding: ${({ isTabCreditDesktop }) => isTabCreditDesktop && '0px 6.5px'};
  }
`

const StyledTextNoOption = styled.span`
  font-family: 'OpenSans';
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 18px;
  letter-spacing: 0px;
`
