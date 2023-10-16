import { IconRemove, IconSearch } from 'components/atoms'
import clsx from 'clsx'
import {
  FormControlValue,
  OptionWithImage,
  OptionWithText,
  Option,
} from 'utils/types'
import React, { ChangeEvent, ForwardedRef, forwardRef, useState } from 'react'
import styles from '../../../styles/components/atoms/inputSelect.module.scss'
import Image from 'next/image'

interface Props<T extends FormControlValue> {
  value: string
  options: Option<T>[] | OptionWithImage<T>[] | OptionWithText<T>[]
  onChange: (value: string) => void
  onChoose?: (item: Option<T>) => void
  inputType?: string
  placeholderText?: string
  isAutoFocus?: boolean
  noOptionsText?: string
  onBlurInput?: React.FocusEventHandler<HTMLInputElement>
  onReset?: () => void
  rightIcon?:
    | React.ReactNode
    | ((state: { isOpen: boolean }) => React.ReactNode)
  showDropdownImage?: boolean
  disabled?: boolean
  maxHeightDropdown?: string
  disableDropdownText?: string
  isError?: boolean
  isSearchable?: boolean
  isClearable?: boolean
  id?: string
  name?: string
  isOpen?: boolean
  onOpen?: (isOpen: boolean) => void
  showValueAsLabel?: boolean
  highlightSelectedOption?: boolean
  disableIconClick?: boolean
  datatestid?: string
  optionTestid?: string
  prefix?: string
  onShowDropdown?: () => void
}

const forwardedInputSelect = <T extends FormControlValue>(
  {
    value,
    options,
    onChange,
    onChoose,
    inputType = 'text',
    placeholderText = '',
    isAutoFocus = false,
    noOptionsText = '',
    onBlurInput,
    onReset,
    rightIcon,
    showDropdownImage,
    disabled,
    maxHeightDropdown,
    disableDropdownText,
    isError,
    isSearchable = true,
    isClearable = true,
    id,
    name,
    isOpen,
    onOpen,
    showValueAsLabel,
    highlightSelectedOption = false,
    disableIconClick = false,
    datatestid,
    optionTestid,
    prefix,
    onShowDropdown,
  }: Props<T>,
  ref?: ForwardedRef<HTMLInputElement>,
) => {
  const [isOpenDropdown, setIsOpenDropdown] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [currentValue, setCurrentValue] = useState('')

  const openDropdown = () => {
    return {
      open: isOpen === undefined ? isOpenDropdown : isOpen,
      onOpen: (isOpen: boolean) => {
        onOpen === undefined ? setIsOpenDropdown(isOpen) : onOpen(isOpen)
      },
    }
  }

  const onClickReset = (event: any) => {
    // use onMouseDown & preventDefault to keep input focus
    event.preventDefault()
    onChange('')
    onReset && onReset()
  }

  const onChooseItem = (item: Option<T>) => {
    // onChange(item.label)
    if (showValueAsLabel) {
      setCurrentValue(item.value as string)
      onChange(item.value as string)
    } else {
      setCurrentValue(item.label)
      onChange(item.label)
    }
    onChoose && onChoose(item)
  }

  const onBlurHandler = (e: React.FocusEvent<HTMLInputElement>) => {
    // setIsOpenDropdown(false)
    openDropdown().onOpen(false)
    setIsFocused(false)
    if (
      !options.some(
        (x) => x.label?.toLowerCase() === currentValue.toLowerCase(),
      ) ||
      !options.some((x) =>
        typeof x.value === 'string'
          ? x.value.toLowerCase() === currentValue.toLowerCase()
          : x.value === currentValue,
      )
    ) {
      onChange(currentValue)
    }

    onBlurInput && onBlurInput(e)
  }

  const onFocus = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault()
    const inputRef: any = ref
    setIsFocused(true)
    inputRef.current.focus()
  }

  const inputValue = () => {
    if (showValueAsLabel) {
      return options.find((item) => item.value === value)?.label || ''
    }
    return value
  }

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    if (showValueAsLabel) {
      const item = options.find(
        (item: { label: string }) => item.label === e.target.value,
      )
      onChange((item?.value as string) || '')
    } else {
      onChange(e.target.value)
    }
  }

  const handleClickNoOption = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    return e.preventDefault()
  }

  return (
    <div className={styles.container}>
      <div
        className={clsx({
          [styles.inputArea]: true,
          [styles.disabled]: disabled,
          [styles.error]: !isFocused && isError,
          ['shake-animation-X']: isError,
        })}
      >
        {prefix && <span className={styles.prefix}>{prefix}</span>}
        <input
          ref={ref}
          value={inputValue()}
          type={inputType}
          onChange={onChangeHandler}
          className={styles.inputField}
          placeholder={placeholderText}
          onFocus={() => {
            setIsFocused(true)
            openDropdown().onOpen(true)
            onShowDropdown && onShowDropdown()
          }}
          onBlur={onBlurHandler}
          autoFocus={isAutoFocus}
          disabled={disabled}
          readOnly={!isSearchable}
          id={id}
          name={name}
          data-testid={datatestid}
        />
        <div
          className={clsx({
            [styles.iconWrapper]: true,
            [styles.disableClick]: disableIconClick && !isOpenDropdown,
          })}
        >
          {value.length > 0 && isClearable ? (
            // use onMouseDown & preventDefault to keep input focus
            <div
              onMouseDown={onClickReset}
              onClick={onClickReset}
              style={{ cursor: 'pointer' }}
            >
              <IconRemove width={24} height={24} color={'#13131B'} />
            </div>
          ) : rightIcon ? (
            typeof rightIcon === 'function' ? (
              rightIcon({ isOpen: openDropdown().open })
            ) : (
              rightIcon
            )
          ) : (
            <IconSearch
              width={24}
              height={24}
              color={'#13131B'}
              alt="SEVA Dropdown Icon"
            />
          )}
        </div>
      </div>

      <div
        className={`${styles.dropdown} ${
          openDropdown().open && styles.dropdownActive
        }`}
        style={{
          maxHeight: openDropdown().open ? maxHeightDropdown || '300px' : 0,
        }}
      >
        {options.length > 0
          ? options.map((item, index) => (
              <div
                className={clsx({
                  [styles.dropdownItem]: true,
                  [styles.dropdownItemTextContainer]: !!(
                    item as OptionWithText<string>
                  ).text,
                  [styles.disabled]: (item as OptionWithImage<string>).disabled,
                  [styles.active]:
                    highlightSelectedOption &&
                    (item.value === value || item.label === value),
                })}
                key={index}
                onMouseDown={
                  (item as OptionWithImage<string>).disabled
                    ? (e) => onFocus(e)
                    : () => onChooseItem(item)
                }
                data-testid={
                  optionTestid ? optionTestid + item.value : undefined
                }
              >
                {(item as OptionWithText<string>).text && (
                  <p className={styles.dropdownItemAdditionalText}>
                    {(item as OptionWithText<string>).text}
                  </p>
                )}

                {showDropdownImage && (
                  <Image
                    src={(item as OptionWithImage<string>)?.image || ''}
                    alt={item.label}
                    className={styles.dropdownItemImage}
                    width="67"
                    height="48"
                  />
                )}

                <span
                  className={clsx({
                    [styles.dropdownItemText]: true,
                    [styles.disabled]: (item as OptionWithImage<string>)
                      .disabled,
                  })}
                >
                  {item.label}
                  {(item as OptionWithImage<string>).disabled && (
                    <p
                      className={clsx({
                        [styles.dropdownItemText]: true,
                        [styles.disableDropdownText]: true,
                        [styles.disabled]: (item as OptionWithImage<string>)
                          .disabled,
                      })}
                    >
                      {disableDropdownText}
                    </p>
                  )}
                </span>
              </div>
            ))
          : null}
        {options.length === 0 && noOptionsText.length > 0 ? (
          <div
            className={`${styles.dropdownItem} ${styles.dropdownNoOptionItem}`}
            onClick={(e) => handleClickNoOption(e)}
            onMouseDown={(e) => handleClickNoOption(e)}
          >
            <span className={styles.dropdownNoOptionText}>{noOptionsText}</span>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export const InputSelect = forwardRef(forwardedInputSelect)
