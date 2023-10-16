import Fuse from 'fuse.js'
import elementId from 'helpers/elementIds'
import React, { useEffect, useRef, useState } from 'react'
import { formatPriceNumberThousandDivisor } from 'utils/numberUtils/numberUtils'
import { IconChevronDown, IconRemove, Label } from 'components/atoms'
import { InputMultilineSelect } from 'components/atoms/inputMultilineSelect'
import styles from '../../../../styles/components/molecules/form/formSelectCarVariant.module.scss'
import { FormControlValue, OptionWithText, Option } from 'utils/types'
import { LanguageCode } from 'utils/enum'
import { ModelVariant } from 'utils/types/carVariant'

const searchOption = {
  keys: ['text'],
  isCaseSensitive: false,
  includeScore: true,
  threshold: 0.1,
}

type FormSelectCarVariantProps = {
  selectedModel: string
  handleChange: (name: string, value: any) => void
  name: string
  carVariantList: ModelVariant[]
  value: {
    variantId: string
    variantName: string
    otr: string
    discount: number
  }
  modelError: boolean
  onShowDropdown?: () => void
  isError?: boolean
}

type optionItemType = OptionWithText<FormControlValue> & {
  discount?: number
}

export const variantEmptyValue = {
  variantId: '',
  variantName: '',
  otr: '',
  discount: 0,
}

export const FormSelectCarVariant: React.FC<FormSelectCarVariantProps> = ({
  selectedModel,
  handleChange,
  name,
  carVariantList,
  value,
  modelError,
  onShowDropdown,
  isError = false,
}) => {
  const [inputValue, setInputValue] = useState(value)
  const [lastChoosenValue, setLastChoosenValue] = useState(value)
  const [carVariantListOptionsFull, setCarVariantOptionsFull] = useState<
    Option<string>[]
  >([])
  const [suggestionsLists, setSuggestionsLists] = useState<any>([])
  const inputRef = useRef() as React.MutableRefObject<HTMLInputElement>

  useEffect(() => {
    setInputValue(value)
    setLastChoosenValue(value)
  }, [value])

  const sortedVariantCarList = () => {
    const suggestionList = carVariantList?.map((variant: any) => ({
      label: `Rp${formatPriceNumberThousandDivisor(
        variant.priceValue,
        LanguageCode.id,
      )}`,
      value: variant.id,
      text: variant.name,
      discount: variant.discount,
    }))

    const sortedSuggestionList = suggestionList.sort((a, b) =>
      a.label.localeCompare(b.label),
    )
    return sortedSuggestionList
  }

  const onChangeInputHandler = (value: string) => {
    setInputValue({
      ...inputValue,
      variantName: value
        .toLowerCase()
        .split(' ')
        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
        .join(' '),
    })
  }

  const onBlurHandler = () => {
    setInputValue(lastChoosenValue)
  }

  const onChooseHandler = (item: optionItemType) => {
    if (item) {
      setLastChoosenValue({
        discount: item.discount || 0,
        otr: item.label,
        variantId: (item.value as string) || '',
        variantName: item.text || '',
      })
    }
    handleChange(name, {
      variantId: item.value,
      variantName: item.text,
      otr: item.label,
      discount: item.discount,
    })
  }

  const onResetHandler = (event: any) => {
    event.preventDefault()
    inputRef.current?.focus()
    setLastChoosenValue(variantEmptyValue)
    handleChange(name, variantEmptyValue)
    setInputValue(variantEmptyValue)
  }

  const onClickArrowHandler = (event: any) => {
    event.preventDefault()
    inputRef.current?.focus()
  }

  useEffect(() => {
    const options = sortedVariantCarList()
    setCarVariantOptionsFull(options)
    setSuggestionsLists(options)
  }, [carVariantList])

  useEffect(() => {
    if (inputValue?.variantName === '' || lastChoosenValue.variantName) {
      const sortedCars = sortedVariantCarList()
      setSuggestionsLists(sortedCars)
      return
    }
    const fuse = new Fuse(carVariantListOptionsFull, searchOption)
    const suggestion = fuse.search(inputValue.variantName)
    const result = suggestion.map((obj) => obj.item)
    // sort alphabetically
    // result.sort((a: any, b: any) => a.label.localeCompare(b.label))
    // sort based on input
    const sorted = result.sort((a: any, b: any) => {
      if (a.label.startsWith(inputValue) && b.label.startsWith(inputValue))
        return a.label.localeCompare(b.label)
      else if (a.label.startsWith(inputValue)) return -1
      else if (b.label.startsWith(inputValue)) return 1
      return a.label.localeCompare(b.label)
    })
    setSuggestionsLists(sorted)
  }, [inputValue])

  return (
    <>
      <div className={styles.labelWrapper}>
        <Label name="model">Varian mobil</Label>
      </div>
      <InputMultilineSelect
        ref={inputRef}
        value={inputValue.variantName}
        options={suggestionsLists}
        onChange={onChangeInputHandler}
        placeholderText="Pilih varian"
        noOptionsText="Varian tidak ditemukan"
        onBlurInput={onBlurHandler}
        onChoose={onChooseHandler}
        isClearable={false}
        rightIcon={(state) => {
          if (state.isOpen) {
            return (
              <div
                onMouseDown={onResetHandler}
                onClick={onResetHandler}
                style={{ cursor: 'pointer' }}
              >
                <IconRemove width={25} height={25} color={'#13131B'} />
              </div>
            )
          } else {
            return (
              <div
                onMouseDown={onClickArrowHandler}
                onClick={onClickArrowHandler}
                style={{ cursor: 'pointer' }}
              >
                <IconChevronDown
                  width={25}
                  height={25}
                  color={'#13131B'}
                  alt="SEVA Dropdown Icon"
                />
              </div>
            )
          }
        }}
        disabled={!selectedModel || modelError}
        maxHeightDropdown="365px"
        datatestid={elementId.PDP.Drowpdown.CarVariant}
        onShowDropdown={onShowDropdown}
        isError={isError}
        isAnimateShakeOnError={true}
      />
    </>
  )
}
