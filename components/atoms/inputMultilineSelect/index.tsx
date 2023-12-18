import React, { ChangeEvent, ForwardedRef, useState } from 'react'
import styles from '../../../styles/components/atoms/inputMultilineSelect.module.scss'
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
  isOnCalculationResult?: boolean
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
    isOnCalculationResult = false,
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

  const renderValue = () => {
    const selectedOption = options.find((option) => option?.text === value)

    if (isFocused) {
      return <p className={styles.typedText}>{value}</p>
    } else {
      if (!selectedOption) {
        return <p className={styles.placeholder}>{placeholderText}</p>
      } else {
        return (
          <div>
            <p className={styles.selectedText}>{selectedOption?.text}</p>
            <p className={styles.selectedLabel}>{selectedOption?.label}</p>
          </div>
        )
      }
    }
  }
  const renderValueOnCalculationResult = () => {
    const selectedOption = options.find((option) => option?.text === value)

    if (isFocused && !isOnCalculationResult) {
      return (
        <div>
          <p className={styles.selectedText}>{selectedOption?.text}</p>
          <p className={styles.selectedLabel}>{selectedOption?.label}</p>
        </div>
      )
    } else {
      if (!selectedOption) {
        return <p className={styles.placeholder}>{placeholderText}</p>
      } else {
        return (
          <div>
            <p
              className={clsx({
                [styles.selectedText]: !isOnCalculationResult,
                [styles.selectedTextWithElipsis]: isOnCalculationResult,
              })}
            >
              {selectedOption?.text}
            </p>
            <p
              className={clsx({
                [styles.selectedLabel]: !isOnCalculationResult,
                [styles.selectedLabelCalculationResult]: isOnCalculationResult,
              })}
            >
              {selectedOption?.label}
            </p>
          </div>
        )
      }
    }
  }

  const handleClickNoOption = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    return e.preventDefault()
  }

  return (
    <div
      className={clsx({
        [styles.container]: !isOnCalculationResult,
        [styles.containerCalculationResult]: isOnCalculationResult,
      })}
    >
      <div
        className={clsx({
          [styles.inputArea]: !isOnCalculationResult,
          [styles.inputAreaCalculationResult]: isOnCalculationResult,
          [styles.hasNotSelectedValue]: isFocused || !value,
          [styles.disabled]: disabled,
          [styles.error]: !isFocused && isError,
          ['shake-animation-X']: isError && isAnimateShakeOnError,
        })}
        onClick={() => {
          if (isOnCalculationResult) {
            setIsFocused(!isFocused)
            openDropdown().onOpen(!isOpenDropdown)
          }
        }}
      >
        {!isOnCalculationResult
          ? renderValue()
          : renderValueOnCalculationResult()}
        <input
          ref={ref}
          value={value}
          type={inputType}
          onChange={onChangeHandler}
          className={clsx({
            [styles.inputField]: !isOnCalculationResult,
            [styles.inputFieldCalculationResult]: isOnCalculationResult,
          })}
          placeholder={placeholderText}
          onFocus={() => {
            if (!isOnCalculationResult) {
              setIsFocused(true)
              openDropdown().onOpen(true)
              onShowDropdown && onShowDropdown()
            }
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
                  [styles.dropdownItemVariant]:
                    isOnCalculationResult &&
                    (item as OptionWithText<string>).text === value,
                })}
                key={item?.value?.toString() ?? index}
                onMouseDown={
                  (item as OptionWithImage<string>).disabled
                    ? (e) => onFocus(e)
                    : () => onChooseItem(item)
                }
              >
                {(item as OptionWithText<string>).text && (
                  <p
                    className={clsx({
                      [styles.dropdownItemAdditionalText]:
                        !isOnCalculationResult,
                      [styles.dropdownItemAdditionalTextElipsis]:
                        isOnCalculationResult,
                    })}
                  >
                    {(item as OptionWithText<string>).text}
                  </p>
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

export const InputMultilineSelect = React.forwardRef(forwardedInputSelect)
