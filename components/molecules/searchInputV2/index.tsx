import React, { ChangeEvent, InputHTMLAttributes } from 'react'
import { colors } from 'styles/colors'
import { useMediaQuery } from 'react-responsive'
import { Search } from 'components/atoms/icon/OldSearch'
import { Close } from 'components/atoms/icon/OldClose'
import { InputV2 } from 'components/atoms/inputV2'

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  onSearchInputChange: (value: string) => void
  searchInputValue: string
  placeholder?: string
  height?: number
  enablePrefixIcon?: boolean
  searchIconSuffix?: boolean
  isCarResultPage?: boolean
  name?: string
}

export const SearchInputV2 = ({
  onSearchInputChange,
  searchInputValue,
  placeholder = '',
  height = 48,
  name,
  enablePrefixIcon = true,
  searchIconSuffix = false,
  isCarResultPage = false,
  ...restProps
}: SearchInputProps) => {
  const isMobile = useMediaQuery({ query: '(max-width: 1024px)' })
  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    onSearchInputChange(event.target.value)
  }

  const prefixIcon = () =>
    enablePrefixIcon ? (
      <div>
        <Search
          width={isMobile ? 16 : 18}
          height={isMobile ? 16 : 18}
          color={colors.placeholder}
        />
      </div>
    ) : (
      <></>
    )

  const suffixIconClick = () => {
    onSearchInputChange('')
  }

  const suffixWhenEmpty = () =>
    searchIconSuffix ? (
      <div>
        <Search
          width={isMobile ? 16 : 18}
          height={isMobile ? 16 : 18}
          color={colors.placeholder}
        />
      </div>
    ) : (
      <></>
    )

  const suffixIcon = () =>
    searchInputValue ? (
      <div onClick={suffixIconClick}>
        <Close width={16} height={16} />
      </div>
    ) : (
      suffixWhenEmpty()
    )

  return (
    <InputV2
      name={name}
      value={searchInputValue}
      onChange={onInputChange}
      prefixComponent={prefixIcon}
      suffixIcon={suffixIcon}
      placeholder={placeholder}
      type={'text'}
      height={height}
      prefixMarginRight={isMobile ? 6 : 13}
      isCarResultPage={isCarResultPage}
      {...restProps}
    />
  )
}
