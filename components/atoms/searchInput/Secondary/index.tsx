import React, { ChangeEvent, InputHTMLAttributes, useRef } from 'react'
import {
  IconSearch,
  IconClose,
  IconLocationLine,
  IconRemove,
} from 'components/atoms/icon'
import { Input } from './input'
interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  onSearchInputChange?: (value: string) => void
  onIconSearchClick?: (value: string) => void
  searchInputValue: string
  placeholder?: string
  height?: number
  enablePrefixIcon?: boolean
  searchIconSuffix?: boolean
  overrideHeightMobile?: boolean
  citySelectorMobile?: boolean
  handleCloseModal: () => void
}

export const SearchInputSecondary = ({
  onSearchInputChange,
  onIconSearchClick,
  searchInputValue,
  placeholder = '',
  height = 50,
  enablePrefixIcon = true,
  searchIconSuffix = false,
  overrideHeightMobile = false,
  citySelectorMobile = false,
  handleCloseModal,
  ...restProps
}: SearchInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    onSearchInputChange && onSearchInputChange(event.target.value)
  }

  const prefixIcon = () =>
    enablePrefixIcon ? (
      <div
        onClick={() => {
          onIconSearchClick && onIconSearchClick(searchInputValue)
        }}
      >
        <IconSearch width={24} height={24} />
      </div>
    ) : (
      <></>
    )

  const prefixIconCitySelector = () =>
    enablePrefixIcon ? <IconLocationLine width={24} height={24} /> : <></>

  const suffixIconClick = () => {
    onSearchInputChange && onSearchInputChange('')
    onIconSearchClick && onIconSearchClick('')

    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  const suffixWhenEmpty = () =>
    searchIconSuffix ? (
      <div onClick={handleCloseModal}>
        <IconRemove width={24} height={24} color="#13131B" />
      </div>
    ) : (
      <></>
    )

  const suffixIcon = () =>
    searchInputValue ? (
      <div onClick={suffixIconClick}>
        <IconRemove width={24} height={24} color="#13131B" />
      </div>
    ) : (
      suffixWhenEmpty()
    )

  return (
    <Input
      value={searchInputValue}
      onChange={onInputChange}
      prefixComponent={citySelectorMobile ? prefixIconCitySelector : prefixIcon}
      suffixIcon={citySelectorMobile ? undefined : suffixIcon}
      placeholder={placeholder}
      ref={inputRef}
      type={'text'}
      height={height}
      prefixMarginRight={citySelectorMobile ? 9 : 6}
      citySelectorMobile={citySelectorMobile}
      overrideHeightMobile={overrideHeightMobile}
      {...restProps}
    />
  )
}
