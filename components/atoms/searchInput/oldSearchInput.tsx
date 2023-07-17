import React, { ChangeEvent, InputHTMLAttributes } from 'react'
import { LocationRed } from '../icon/LocationRed'
import { Close } from '../icon/OldClose'
import { Search } from '../icon/OldSearch'
import { Input } from '../OldInput/Input'

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
}

export const SearchInput = ({
  onSearchInputChange,
  onIconSearchClick,
  searchInputValue,
  placeholder = '',
  height = 50,
  enablePrefixIcon = true,
  searchIconSuffix = false,
  overrideHeightMobile = false,
  citySelectorMobile = false,
  ...restProps
}: SearchInputProps) => {
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
        <Search />
      </div>
    ) : (
      <></>
    )

  const prefixIconCitySelector = () =>
    enablePrefixIcon ? <LocationRed /> : <></>

  const suffixIconClick = () => {
    onSearchInputChange && onSearchInputChange('')
    onIconSearchClick && onIconSearchClick('')
  }

  const suffixWhenEmpty = () => (searchIconSuffix ? <Search /> : <></>)

  const suffixIcon = () =>
    searchInputValue ? (
      <div onClick={suffixIconClick}>
        <Close />
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
      type={'text'}
      height={height}
      prefixMarginRight={citySelectorMobile ? 9 : 6}
      citySelectorMobile={citySelectorMobile}
      overrideHeightMobile={overrideHeightMobile}
      {...restProps}
    />
  )
}
