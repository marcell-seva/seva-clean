import React, {
  ChangeEvent,
  ReactElement,
  SelectHTMLAttributes,
  useEffect,
  useRef,
  useState,
} from 'react'
import styled, { css } from 'styled-components'
import { colors, transparent } from '../../../styles/colors'
import { createPortal } from 'react-dom'
import { FormControlValue, Option, PropsIcon } from 'utils/types'
import { TextLegalMedium } from 'utils/typography/TextLegalMedium'
import { TextMediumRegularStyle } from '../typography/TextMediumRegular'
import { screenSize } from 'utils/window'
import { screenHeight } from 'styles/globalStyle'

interface SelectProps<T extends FormControlValue>
  extends SelectHTMLAttributes<HTMLSelectElement> {
  options: Option<T>[] | undefined
  onChoose: (value: FormControlValue) => void
  placeholder?: string
  enableSearch?: boolean
  floatDropdown?: boolean
  onSearch?: (value: string) => void
  prefixIcon?: ({ color }: PropsIcon) => JSX.Element
  suffixIcon?: ({ color }: PropsIcon) => JSX.Element
  errorIcon?: ({ color }: PropsIcon) => JSX.Element
  isShowDropDownByValue?: boolean
  noOptionText?: string
  dropdownBackground?: string
  disabled?: boolean
  isFloatAtBottom?: boolean
  rotateSuffixIcon?: boolean
}

interface InputProps {
  inputValue: string
  hasOptions?: boolean
  isNoOptionMode?: boolean
}

export const SelectCameraKtp = <T extends FormControlValue>({
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
  rotateSuffixIcon = true,
}: SelectProps<T>): ReactElement => {
  const inputRef = useRef() as React.MutableRefObject<HTMLInputElement>
  const getOptionLabel = (valueParam: FormControlValue) => {
    const labelKey = options?.find((option) => {
      return option.value === valueParam
    })?.label
    return labelKey || ''
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
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const currentInputValue = event.target.value
    setInputValue(currentInputValue)
    onSearch && onSearch(currentInputValue)
  }
  const renderDropdown = () => {
    const domEl = document.querySelector('body')
    const rect = inputRef.current?.getBoundingClientRect()
    const sortedOptions = [...(options ?? [])]
    const selectedIndex = options?.findIndex(
      (option) => option.label === inputValue,
    )

    if (selectedIndex !== undefined && selectedIndex !== -1) {
      const selectedOption = sortedOptions.splice(selectedIndex, 1)[0]
      sortedOptions.unshift(selectedOption)
    }

    const dropdownComponent = (
      <StyledOptionArea
        bgColor={dropdownBackground}
        floatDropdown={floatDropdown}
      >
        {sortedOptions.map((option, index) => (
          <StyledOption
            key={index}
            isSelected={option.label === inputValue}
            onMouseDown={() => {
              onSelect(option)
            }}
            className={'select-item-element'}
          >
            {option.label}
          </StyledOption>
        ))}
      </StyledOptionArea>
    )
    return floatDropdown && domEl
      ? createPortal(
          <StyledFloatDropdown
            rect={rect}
            isFloatAtBottom={isFloatAtBottom}
            className={'select-item-group-element'}
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
      >
        {prefixIcon ? (
          <StyledPrefixIconContainer>
            <span className={'defaultPrefixIcon'}>
              {prefixIcon({ color: colors.placeholder })}
            </span>
            <span className={'selectedPrefixIcon'}>
              {prefixIcon({ color: colors.title })}
            </span>

            <span className={'focusedPrefixIcon'}>
              {prefixIcon({ color: colors.primary1 })}
            </span>
          </StyledPrefixIconContainer>
        ) : null}
        <StyledSelect
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
          placeholder={placeholder || 'Pilih'}
          inputValue={inputValue}
          disabled={disabled}
          className={'select-element'}
        />
        {suffixIcon && options && options.length > 0 && (
          <StyledSuffixIconContainer
            isOpen={showOptionArea}
            rotateSuffixIcon={rotateSuffixIcon}
          >
            <span className={'defaultSuffixIcon'}>
              {suffixIcon({ color: colors.placeholder })}
            </span>
            <span className={'focusedSuffixIcon'}>
              {suffixIcon({ color: colors.primary1 })}
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
            <TextLegalMedium>{noOptionText || ''}</TextLegalMedium>
          </NoOptionText>
        </StyledOptionArea>
      )}
    </SelectContainer>
  )
}

const StyledSelect = styled.input<InputProps>`
  ${TextMediumRegularStyle};
  height: 56px;
  width: 100%;
  border: none;
  border-radius: 16px;
  padding-right: 22px;
  padding-left: 12px;
  &::placeholder {
    color: ${colors.placeholder};
  }
  :focus {
    &::placeholder {
      color: ${colors.placeholder};
    }
  }
  @media (max-width: ${screenSize.mobileS}) {
    height: 40px;
  }
`

const selectedStyle = css`
  background-color: ${transparent('primarySky', 1)};
  color: ${colors.title};
  font-weight: 600;
`

const StyledOption = styled.div<{ isSelected: boolean }>`
  ${TextMediumRegularStyle};
  height: 30px;
  width: 100%;
  border-radius: 8px;
  :hover {
    ${selectedStyle}
  }
  ${({ isSelected }) => isSelected && selectedStyle};
  flex-shrink: 0;
  line-height: 30px;
  padding: 0 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  :not(:last-child) {
    margin-bottom: 2px;
  }

  /* Scrollbar styles */
  ::-webkit-scrollbar {
    width: 10px;
    background-color: #f1f1f1;
  }

  ::-webkit-scrollbar-thumb {
    background-color: #888;
  }

  ::-webkit-scrollbar-thumb:hover {
    background-color: #555;
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
  overflow: scroll;
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
    return '80px'
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
  display: flex;
  overflow-y: scroll;
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

const StyledSuffixIconContainer = styled.div<{
  isOpen: boolean
  rotateSuffixIcon: boolean
}>`
  margin-right: 10px;
  ${({ isOpen, rotateSuffixIcon }) =>
    isOpen &&
    rotateSuffixIcon &&
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
  border-radius: 16px;
  border: 1px solid ${colors.placeholder};
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
  border-color: ${({ hasOptions, isNoOptionMode }) =>
    !hasOptions && isNoOptionMode ? colors.error : colors.placeholder};
  :focus-within {
    border-color: ${({ hasOptions, isNoOptionMode }) =>
      !hasOptions && isNoOptionMode ? colors.error : colors.label};
    input {
      color: ${colors.title};
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
`
