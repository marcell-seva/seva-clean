import Fuse from 'fuse.js'
import elementId from 'helpers/elementIds'
import React, { useEffect, useRef, useState } from 'react'
import { getNewFunnelAllRecommendations } from 'services/newFunnel'
import { FormControlValue, Option, OptionWithImage } from 'utils/types'
import {
  ErrorMessage,
  IconChevronDown,
  IconRemove,
  InputSelect,
  Label,
} from 'components/atoms'
import styles from 'styles/components/molecules/form/formSelectModelCar.module.scss'
import { CarModel } from 'utils/types/carModel'
import Image from 'next/image'

const CarSillhouete = '/revamp/illustration/car-sillhouete.webp'

const searchOption = {
  keys: ['label'],
  isCaseSensitive: false,
  includeScore: true,
  threshold: 0.3,
}

type FormSelectModelCarProps = {
  selectedCity: string
  handleChange: (name: string, value: any) => void
  name: string
  value: string
  valueImage: string
  valueId: string
  allModelCarList: CarModel[]
  setModelError: any
  overrideDisabled?: boolean
  isCheckForError?: boolean
  isShowArrow?: boolean
  onShowDropdown?: () => void
}

export const FormSelectModelCarSevaOTO = ({
  selectedCity,
  handleChange,
  name,
  value,
  valueImage,
  valueId,
  allModelCarList,
  setModelError,
  overrideDisabled = false,
  isCheckForError = true,
  isShowArrow = true,
  onShowDropdown,
}: FormSelectModelCarProps) => {
  const [modelCarList, setModelCarList] = useState<CarModel[]>([])
  const [carImage, setCarImage] = React.useState(
    CarSillhouete as unknown as string,
  )
  const [isError, setIsError] = React.useState(false)

  const [choosenModel, setChoosenModel] = useState(valueId)

  const [inputValue, setInputValue] = useState(value)
  const [lastChoosenValue, setLastChoosenValue] = useState(value)

  const [modelCarListOptionsFull, setModelCarListOptionsFull] = useState<
    Option<string>[]
  >([])
  const [suggestionsLists, setSuggestionsLists] = useState<
    OptionWithImage<FormControlValue>[]
  >([])
  const inputRef = useRef() as React.MutableRefObject<HTMLInputElement>

  useEffect(() => {
    setInputValue(value)
    setLastChoosenValue(value)
    setCarImage(valueImage)
    setChoosenModel(valueId)
  }, [value, valueImage])

  const fetchCarModels = async () => {
    const response = await getNewFunnelAllRecommendations(
      undefined,
      selectedCity,
    )
    setModelCarList(response.carRecommendations)
  }

  const sortedModelCarList = () => {
    const flaggedModelCars = allModelCarList.map((allModel) => {
      const index = modelCarList.findIndex(
        (model) => allModel.model === model.model,
      )
      return {
        ...allModel,
        isAvailable: index !== -1,
      }
    })

    const suggestionList = flaggedModelCars.map((car) => ({
      label: `${car.brand} ${car.model}`,
      image: car.images[0],
      value: car.id,
      brand: car.brand,
      disabled: !car.isAvailable,
    }))

    const sortedSuggestionList = suggestionList.sort((a, b) =>
      a.label.localeCompare(b.label),
    )
    return sortedSuggestionList
  }

  useEffect(() => {
    const options = sortedModelCarList()
    setModelCarListOptionsFull(options)
  }, [modelCarList, allModelCarList, selectedCity])

  useEffect(() => {
    fetchCarModels()
    if (choosenModel && !selectedCity) {
      setIsError(true)
      setModelError(true)
    } else {
      setIsError(false)
      setModelError(false)
    }
  }, [selectedCity])

  useEffect(() => {
    if (choosenModel && selectedCity) {
      const index = modelCarList.findIndex((model) => model.id === choosenModel)
      if (index === -1 && modelCarList.length > 0) {
        setIsError(true)
        setModelError(true)
      }
    }
  }, [modelCarList, choosenModel])

  const onChangeInputHandler = (value: string) => {
    if (value === '') {
      const sortedCars = sortedModelCarList()
      setSuggestionsLists(sortedCars)
      setLastChoosenValue('')
      setInputValue('')
      handleChange(name, '')
      return
    }

    const sorted = getFuseSearchResult(value)
    setSuggestionsLists(sorted)

    setInputValue(
      value
        .toLowerCase()
        .split(' ')
        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
        .join(' '),
    )
  }

  const onBlurHandler = () => {
    setInputValue(lastChoosenValue)
  }

  const onChooseHandler = (item: OptionWithImage<FormControlValue>) => {
    setLastChoosenValue(item.label)
    setCarImage(item.image || (CarSillhouete as unknown as string))
    setChoosenModel(item.value as string)
    if (item.value) {
      handleChange(name, {
        modelId: item.value,
        modelName: item.label,
        brandName: item.brand,
        modelImage: item.image,
      })
    }
    setSuggestionsLists([item])
  }

  const onResetHandler = (event: any) => {
    event.preventDefault()
    inputRef.current?.focus()
    setLastChoosenValue('')
    handleChange(name, '')
    setInputValue('')
    const sorted = getFuseSearchResult('')
    setSuggestionsLists(sorted)
  }

  const onClickArrowHandler = (event: any) => {
    event.preventDefault()
    inputRef.current?.focus()
  }

  const getFuseSearchResult = (value: string) => {
    if (value === '') {
      const sortedCars = sortedModelCarList()
      return sortedCars
    }

    const fuse = new Fuse(modelCarListOptionsFull, searchOption)
    const suggestion = fuse.search(value)
    const result = suggestion.map((obj) => obj.item)

    // sort alphabetically
    // result.sort((a: any, b: any) => a.label.localeCompare(b.label))

    // sort based on input
    const sorted = result.sort((a: any, b: any) => {
      if (a.label.startsWith(value) && b.label.startsWith(value))
        return a.label.localeCompare(b.label)
      else if (a.label.startsWith(value)) return -1
      else if (b.label.startsWith(value)) return 1

      return a.label.localeCompare(b.label)
    })

    return sorted
  }

  useEffect(() => {
    if (inputValue === '') {
      const sortedCars = sortedModelCarList()
      setSuggestionsLists(sortedCars)
      return
    }
  }, [modelCarListOptionsFull])

  useEffect(() => {
    if (isError) {
      setModelError(true)
    }
  }, [isError])

  return (
    <>
      <InputSelect
        ref={inputRef}
        value={inputValue}
        options={suggestionsLists}
        onChange={onChangeInputHandler}
        placeholderText="Cari mobil"
        noOptionsText="Mobil tidak ditemukan"
        onBlurInput={onBlurHandler}
        onChoose={onChooseHandler}
        disableIconClick={false}
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
          } else if (isShowArrow) {
            return (
              <div
                onMouseDown={onClickArrowHandler}
                onClick={onClickArrowHandler}
                style={{ cursor: 'pointer' }}
              >
                <IconChevronDown width={25} height={25} color={'#13131B'} />
              </div>
            )
          }
        }}
        isClearable={false}
        showDropdownImage
        disableDropdownText="Tidak tersedia di kota pilihan kamu"
        isError={isError && !!selectedCity && isCheckForError}
        disabled={!selectedCity || overrideDisabled}
        datatestid={elementId.Field.CarMobil}
        onShowDropdown={onShowDropdown}
      />
      {isError && selectedCity && isCheckForError && (
        <ErrorMessage>
          Mobil tidak tersedia di kotamu. Silakan pilih mobil lain.
        </ErrorMessage>
      )}
    </>
  )
}
