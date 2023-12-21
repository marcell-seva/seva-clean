import React, { ChangeEvent, ForwardedRef, useState } from 'react'
import styles from 'styles/components/atoms/inputMultilineSelectV2.module.scss'
import { IconRemove, IconSearch } from 'components/atoms'

import clsx from 'clsx'
import {
  FormControlValue,
  OptionWithText,
  Option,
  OptionWithImage,
} from 'utils/types'

interface Props<T extends FormControlValue> {
  value: string
  options: OptionWithText<T>[]
  onChange: (value: any) => void
  onChoose?: (item: Option<T>) => void
  inputType?: string
  placeholderText?: string
  isAutoFocus?: boolean
  noOptionsText?: string
  noOptionsTextAsComponent?: () => JSX.Element
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
  highlightSelectedOption?: boolean
  datatestid?: string
  onShowDropdown?: () => void
  isAnimateShakeOnError?: boolean
  browserAutocomplete?: 'on' | 'off'
}

const forwardedInputSelectV2 = <T extends FormControlValue>(
  {
    value,
    options,
    onChange,
    onChoose,
    inputType = 'text',
    placeholderText = '',
    isAutoFocus = false,
    noOptionsText = '',
    noOptionsTextAsComponent,
    onBlurInput,
    onReset,
    rightIcon,
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
    highlightSelectedOption = false,
    datatestid,
    onShowDropdown,
    isAnimateShakeOnError = false,
    browserAutocomplete,
  }: Props<T>,
  ref?: ForwardedRef<HTMLInputElement>,
) => {
  const [isOpenDropdown, setIsOpenDropdown] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

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
    onChange(item.label)
    onChoose && onChoose(item)
  }

  const onBlurHandler = (e: React.FocusEvent<HTMLInputElement>) => {
    openDropdown().onOpen(false)
    setIsFocused(false)
    onBlurInput && onBlurInput(e)
  }

  const onFocus = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault()
    const inputRef: any = ref
    setIsFocused(true)
    inputRef.current.focus()
  }

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  const handleClickNoOption = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    return e.preventDefault()
  }

  const renderNoOptionsSection = () => {
    if (options.length === 0 && noOptionsText.length > 0) {
      return (
        <div
          className={`${styles.dropdownItem} ${styles.dropdownNoOptionItem}`}
          onClick={(e) => handleClickNoOption(e)}
          onMouseDown={(e) => handleClickNoOption(e)}
        >
          <span className={styles.dropdownNoOptionText}>{noOptionsText}</span>
        </div>
      )
    } else if (options.length === 0 && !!noOptionsTextAsComponent) {
      return noOptionsTextAsComponent()
    } else {
      return <></>
    }
  }

  return (
    <div className={styles.container}>
      <div
        className={clsx({
          [styles.inputArea]: true,
          [styles.hasNotSelectedValue]: isFocused || !value,
          [styles.disabled]: disabled,
          [styles.error]: !isFocused && isError,
          ['shake-animation-X']: isError && isAnimateShakeOnError,
        })}
      >
        <input
          ref={ref}
          value={value}
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
          autoComplete={browserAutocomplete}
        />
        <div
          className={clsx({
            [styles.iconWrapper]: true,
            // [styles.disableClick]: value.length === 0 || !isClearable,
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
            <IconSearch width={24} height={24} color={'#13131B'} />
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
          ? options.map((item: any, index) => (
              <div
                className={clsx({
                  [styles.dropdownItem]: true,
                  [styles.disabled]: (item as OptionWithImage<string>).disabled,
                  [styles.active]:
                    highlightSelectedOption &&
                    (item.value === value || item.label === value),
                })}
                key={item.value?.toString() ?? index}
                onMouseDown={
                  (item as OptionWithImage<string>).disabled
                    ? (e) => onFocus(e)
                    : () => onChooseItem(item)
                }
              >
                {(item as OptionWithText<string>).text && (
                  <p className={styles.dropdownItemFirstText}>
                    {(item as OptionWithText<string>).text}
                  </p>
                )}

                <span
                  className={clsx({
                    [styles.dropdownItemSecondText]: true,
                    [styles.disabled]: (item as OptionWithImage<string>)
                      .disabled,
                  })}
                >
                  {item.text2}
                  {(item as OptionWithImage<string>).disabled && (
                    <p
                      className={clsx({
                        [styles.dropdownItemSecondText]: true,
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
        {renderNoOptionsSection()}
      </div>
    </div>
  )
}

export const InputMultilineSelectV2 = React.forwardRef(forwardedInputSelectV2)
