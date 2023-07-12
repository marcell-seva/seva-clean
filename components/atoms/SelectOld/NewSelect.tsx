import React, {
  ChangeEvent,
  ReactElement,
  SelectHTMLAttributes,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { colors, transparent } from 'styles/colors'
import { createPortal } from 'react-dom'
import elementId from 'helpers/elementIds'
import { FormControlValue, PropsIcon, Option } from 'utils/types'
import { client } from 'const/const'

export interface SelectProps<T extends FormControlValue>
  extends SelectHTMLAttributes<HTMLSelectElement> {
  options: Option<T>[] | undefined
  onChoose: (value: FormControlValue, label: string) => void
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
  isError?: boolean
  overrideBorder?: string
  dropdownStyle?: Omit<DropdownProps, 'rect' | 'isFloatAtBottom'>
  className?: string
  name?: string
  idDropdown?: string
}

interface InputProps {
  inputValue: string
  hasOptions?: boolean
  isNoOptionMode?: boolean
  showOptionArea?: boolean
  overrideBorder?: string
  isError?: boolean
  disabled?: boolean
}

export const NewSelect = <T extends FormControlValue>({
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
  isError = false,
  overrideBorder = colors.label,
  dropdownStyle,
  className,
  name,
  idDropdown,
}: SelectProps<T>): ReactElement => {
  const { t } = useTranslation()
  const inputRef = useRef() as React.MutableRefObject<HTMLInputElement>
  const writeRef = useRef() as React.MutableRefObject<HTMLInputElement>

  const getOptionLabel = (valueParam: FormControlValue) => {
    const labelKey = options?.find((option) => {
      if (typeof option.value === 'number') {
        return option.value === Number(valueParam)
      }
      return option.value === valueParam
    })?.label
    return t(labelKey || '')
  }

  const getOptionValue = (labelParam: FormControlValue) => {
    const valueKey = options?.find((option) => {
      if (typeof option.label === 'string' && typeof labelParam === 'string') {
        return option.label.toLowerCase() === labelParam.toLowerCase()
      }

      return option.label === labelParam
    })?.value
    return valueKey || ''
  }

  const [showOptionArea, setShowOptionArea] = useState(false)
  const [inputValue, setInputValue] = useState(
    () => getOptionLabel(value) || '',
  )
  const [isNoOptionMode, setIsNoOptionMode] = useState(false)
  const [rect, setRect] = useState<any>()
  const domEl = client && document.querySelector('body')

  const onSelect = ({ value: valueParam, label: labelParam }: Option<T>) => {
    setTimeout(() => {
      setInputValue(getOptionLabel(valueParam))
      setShowOptionArea(false)
      onChoose(valueParam, labelParam)
    }, 200)
  }

  const [dataTest, setDataTest] = useState('')
  const [dataTestDropdown, setDataTestDropdown] = useState('')

  useEffect(() => setInputValue(getOptionLabel(value)), [value, options])

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const currentInputValue = event.target.value
    setInputValue(currentInputValue)
    onSearch && onSearch(currentInputValue)
    const optValue = getOptionValue(currentInputValue)
    if (optValue) onChoose(optValue, currentInputValue)
  }

  useEffect(() => {
    setRect(inputRef.current?.getBoundingClientRect())
  }, [showOptionArea])

  useEffect(() => {
    if (name === 'downPaymentAmount') {
      setDataTest(elementId.Homepage.CarSearchWidget.DpOption + inputValue)
      setDataTestDropdown(elementId.FilterMaxDP)
    } else if (name === 'income') {
      setDataTest(elementId.Homepage.CarSearchWidget.DropdownIncomeRange)
      setDataTestDropdown(elementId.FilterIncomeRate)
    } else if (name === 'age') {
      setDataTest(elementId.Homepage.CarSearchWidget.DropdownAgeRange)
      setDataTestDropdown(elementId.FilterAgeRate)
    } else if (name === 'sort') {
      setDataTestDropdown(elementId.FilterPriceRange)
    }
  }, [name])

  useEffect(() => {
    const renderResize = () => {
      setRect(inputRef.current?.getBoundingClientRect())
    }

    window.addEventListener('keydown', renderResize)
    window.addEventListener('resize', renderResize)

    return () => {
      window.removeEventListener('keydown', renderResize)
      window.removeEventListener('resize', renderResize)
    }
  }, [])

  const listOption = useMemo(() => {
    if (enableSearch && inputValue) {
      return options
        ?.filter((x) =>
          String(x.label).toLowerCase().includes(inputValue.toLowerCase()),
        )
        .filter((y) => y.value)
    }

    return options?.filter((y) => y.value)
  }, [inputValue, options])

  const renderDropdown = () => {
    const dropdownComponent = (
      <StyledOptionArea
        bgColor={dropdownBackground}
        floatDropdown={floatDropdown}
      >
        {listOption?.map((option, index) => (
          <StyledOption
            data-testid={dataTestDropdown + t(option.label)}
            key={index}
            isSelected={t(option.label) === inputValue}
            onMouseDown={() => {
              onSelect(option)
            }}
            className={'select-item-element'}
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
            className={'select-item-group-element'}
            {...dropdownStyle}
          >
            {dropdownComponent}
          </StyledFloatDropdown>,
          domEl,
        )
      : dropdownComponent
  }

  const renderDropdownNotAvailable = () => {
    const dropdownNotAvailableComponent = (
      <StyledOptionArea
        bgColor={dropdownBackground}
        floatDropdown={floatDropdown}
      >
        <NoOptionText>
          <span>{noOptionText}</span>
          <label
            onMouseDown={() => {
              setTimeout(() => {
                writeRef.current?.focus()
              }, 200)
              setInputValue('')
            }}
          >
            Cari yang lain
          </label>
        </NoOptionText>
      </StyledOptionArea>
    )

    return floatDropdown && domEl
      ? createPortal(
          <StyledFloatDropdown
            rect={rect}
            isFloatAtBottom={isFloatAtBottom}
            {...dropdownStyle}
          >
            {dropdownNotAvailableComponent}
          </StyledFloatDropdown>,
          domEl,
        )
      : dropdownNotAvailableComponent
  }

  const noOptionFoundWithInputValue = useMemo(() => {
    const notFound = inputValue && listOption?.length == 0
    return notFound
  }, [inputValue, listOption])

  return (
    <SelectContainer className={className}>
      <SelectAndIconContainer
        ref={inputRef}
        inputValue={inputValue}
        hasOptions={options && options?.length > 0}
        isNoOptionMode={isNoOptionMode && inputValue !== ''}
        overrideBorder={overrideBorder}
        isError={isError}
        disabled={disabled}
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
          ref={writeRef}
          value={inputValue}
          type="text"
          onBlur={() => {
            setTimeout(() => {
              if (!inputValue) {
                setInputValue(getOptionLabel(''))
                onChoose('', '')
              }

              if (!getOptionLabel(inputValue)) {
                if (value && !noOptionFoundWithInputValue) {
                  setInputValue(getOptionLabel(value))
                } else {
                  setInputValue(getOptionLabel(''))
                  onChoose('', '')
                }
              }

              setShowOptionArea(false)
              setIsNoOptionMode(false)
            }, 100)
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
          className={'select-element'}
          data-testid={dataTest || name}
        />
        {suffixIcon && options && options.length > 0 && (
          <StyledSuffixIconContainer
            data-testid={idDropdown}
            isOpen={showOptionArea}
            rotateSuffixIcon={rotateSuffixIcon}
          >
            <span
              className={'defaultSuffixIcon'}
              onClick={() => writeRef.current?.focus()}
            >
              {suffixIcon({
                color: isError
                  ? colors.primaryRed
                  : disabled
                  ? colors.placeholder
                  : colors.placeholder,
              })}
            </span>
            <span className={'focusedSuffixIcon'}>
              {suffixIcon({
                color: isError
                  ? colors.primaryRed
                  : disabled
                  ? colors.placeholder
                  : colors.primary1,
              })}
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

      {noOptionFoundWithInputValue &&
        isNoOptionMode &&
        renderDropdownNotAvailable()}
    </SelectContainer>
  )
}

const screenHeight = client ? document.documentElement.clientHeight : 0

const SelectFont = css`
  font-family: 'OpenSans';
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 22px;
  letter-spacing: 0px;
  color: ${colors.label};
`

const StyledSelect = styled.input<InputProps>`
  ${SelectFont}
  height: 38px;
  width: 100%;
  border: none;
  border-radius: 16px;
  padding: 9px;
  background: ${colors.white};
  outline: none;
  &::placeholder {
    color: ${colors.label};
    opacity: 0.5;
  }
  :focus {
    &::placeholder {
      color: ${colors.placeholder};
    }
  }
  :disabled {
    background-color: #f5f5f5;
    color: ${colors.placeholder};
    &::placeholder {
      color: ${colors.placeholder};
    }
  }
`

const selectedStyle = css`
  background-color: ${transparent('primarySky', 1)};
  border-radius: 4px;
`

const StyledOption = styled.div<{ isSelected: boolean }>`
  ${SelectFont};
  height: 33px;
  width: 100%;
  :hover {
    ${selectedStyle}
  }
  ${({ isSelected }) => isSelected && selectedStyle};
  flex-shrink: 0;
  padding: 5px 8px 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  :not(:last-child) {
    margin-bottom: 2px;
  }
  text-align: left;
`

const NoOptionText = styled.div`
  width: 100%;
  border-radius: 4px;
  padding: 5px 8px 6px 0;

  font-family: 'OpenSans';
  font-style: normal;
  font-size: 12px;
  line-height: 22px;

  span {
    font-weight: 400;
    color: ${colors.placeholder};
  }

  label {
    font-weight: 600;
    color: ${colors.primaryBlue};
    margin-left: 5px;
  }
`

interface DropdownProps {
  rect: DOMRect
  isFloatAtBottom: boolean
  borderColor?: string
}

const StyledFloatDropdown = styled.div<DropdownProps>`
  position: absolute;
  ${({ isFloatAtBottom }) =>
    isFloatAtBottom ? StyledFloatAtBottomCss : StyledFloatAtTopCss};
  left: ${({ rect }) => rect.left}px;
  width: ${({ rect }) => rect.width}px;
  z-index: 25;
  background: ${colors.white};
  border: 0.5px solid ${({ borderColor }) => borderColor || colors.label};
  border-radius: 4px;
  margin-top: 4px;
  padding-right: 5px;
`

const StyledFloatAtTopCss = css<{ rect: DOMRect }>`
  bottom: ${({ rect }) =>
    client ? screenHeight - rect.top - window.scrollY + 16 : 0}px;
`

const StyledFloatAtBottomCss = css<{ rect: DOMRect }>`
  top: ${({ rect }) => (client ? window.scrollY + rect.bottom : 0)}px;
`

const getStyledOptionAreaMaxHeight = (floatDropdown: boolean) => {
  if (floatDropdown) {
    return '180px'
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
  overflow-y: scroll;

  &::-webkit-scrollbar {
    width: 3px;
  }

  /* Handle */
  &::-webkit-scrollbar-thumb {
    background: ${colors.line};
    border-radius: 8px;
  }

  overflow-x: hidden;
  background: ${({ bgColor }) => bgColor};
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 4px;
  margin-top: 4px;
  padding: 4px 11px 13px;
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
  cursor: pointer;
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
  height: 40px;
  position: relative;
  border-radius: 4px;
  border: 0.5px solid ${({ overrideBorder }) => overrideBorder};
  background-color: ${({ disabled }) => (disabled ? '#F5F5F5' : colors.white)};
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
  border-color: ${({ overrideBorder, hasOptions, isNoOptionMode, isError }) =>
    isError
      ? colors.error
      : !hasOptions && isNoOptionMode
      ? colors.error
      : overrideBorder};
  :focus-within {
    border-color: ${({ overrideBorder, hasOptions, isNoOptionMode, isError }) =>
      isError
        ? colors.error
        : !hasOptions && isNoOptionMode
        ? colors.error
        : overrideBorder};
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
