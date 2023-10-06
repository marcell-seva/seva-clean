import Fuse from 'fuse.js'
import elementId from 'helpers/elementIds'
import React, { useEffect, useRef, useState } from 'react'
import { getCities } from 'services/cities'
import { IconChevronDown, IconRemove, InputSelect } from 'components/atoms'
import { LabelWithTooltip } from 'components/molecules'
import { useLocalStorage } from 'utils/hooks/useLocalStorage'
import { FormControlValue, Location, Option } from 'utils/types'
import { LocalStorageKey } from 'utils/enum'

const searchOption = {
  keys: ['label'],
  isCaseSensitive: false,
  includeScore: true,
  threshold: 0.1,
}

type TestID = {
  CityText?: string
  CityInput?: string
}

interface FormSelectCityProps extends React.ComponentProps<'div'> {
  isHasCarParameter: boolean
  name: string
  handleChange: (name: string, value: any) => void
  disabledInput?: boolean
  isError?: boolean
  datatestid?: TestID
  onOpenTooltip?: () => void
  onShowDropdown?: () => void
}

export default function FormSelectCitySevaOTO({
  isHasCarParameter,
  handleChange,
  name,
  disabledInput,
  isError = false,
  onOpenTooltip,
  onShowDropdown,
  ...divProps
}: FormSelectCityProps) {
  const [cityListApi, setCityListApi] = useState<Array<Location>>([])
  const [defaultCity, setDefaultCity] = useState<Location | null>(null)

  const [cityOtr, saveCityOtrToLocalStorage] = useLocalStorage<Location | null>(
    LocalStorageKey.CityOtr,
    null,
  )

  const [inputValue, setInputValue] = useState(cityOtr?.cityName ?? '')
  const [lastChoosenValue, setLastChoosenValue] = useState(
    cityOtr?.cityName ?? '',
  )

  const [cityListOptionsFull, setCityListOptionsFull] = useState<
    Option<string>[]
  >([])
  const [suggestionsLists, setSuggestionsLists] = useState<any>([])
  const inputRef = useRef() as React.MutableRefObject<HTMLInputElement>

  const fetchCities = async () => {
    const response = await getCities()
    setCityListApi(response)
  }

  React.useEffect(() => {
    fetchCities()
  }, [])

  React.useEffect(() => {
    const selectedCity = cityOtr ? cityOtr : defaultCity
    if (selectedCity) {
      setInputValue(selectedCity?.cityName)
      setLastChoosenValue(selectedCity?.cityName)
    }
  }, [cityOtr, isHasCarParameter, defaultCity])

  React.useEffect(() => {
    if (isHasCarParameter && cityListApi.length > 0) {
      const city = cityListApi.find((city) => city.cityName === 'Jakarta Pusat')
      if (city) {
        setDefaultCity(city)
      }
    }
  }, [isHasCarParameter, cityListApi])

  const getCityListOption = (cityList: any) => {
    const tempArray: Option<string>[] = []
    for (const item of cityList) {
      const tempObj: Option<string> = {
        label: '',
        value: '',
      }
      tempObj.value = item?.cityName
      tempObj.label = item?.cityName
      tempArray.push(tempObj)
    }
    return tempArray
  }

  const onChangeInputHandler = (value: string) => {
    setInputValue(
      value
        .toLowerCase()
        .split(' ')
        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
        .join(' '),
    )
  }

  const onBlurHandler = (e: any) => {
    if (e.target.value === '') {
      setLastChoosenValue('')
      handleChange(name, '')
      setInputValue('')
    } else {
      setInputValue(lastChoosenValue)
    }
  }

  const onClickArrowHandler = (event: any) => {
    event.preventDefault()
    inputRef.current?.focus()
  }

  const onChooseHandler = (item: Option<FormControlValue>) => {
    setLastChoosenValue(item.label)

    const selectedCity = cityListApi.find(
      (city) => city.cityName === item.label,
    )
    if (selectedCity) {
      handleChange(name, selectedCity)
      // saveCityOtrToLocalStorage(selectedCity)
      window.dispatchEvent(new Event('storage'))
    }
  }

  const onResetHandler = (event: any) => {
    event.preventDefault()
    inputRef.current?.focus()

    setInputValue('')
  }

  useEffect(() => {
    const options = getCityListOption(cityListApi)
    setCityListOptionsFull(options)
  }, [cityListApi])

  const sortedTopCityList = () => {
    const topCities = [
      'Jakarta Pusat',
      'Bogor',
      'Surabaya',
      'Bandung',
      'Medan',
      'Makassar',
    ]
    if (cityListApi.length > 0) {
      const cityList = [...cityListApi]
      const topCityList: Location[] = new Array(6).fill(null)
      // move top cities from cityList array to topCityList array
      const filteredCityList = cityList.filter((city) => {
        if (topCities.includes(city.cityName)) {
          const idx = topCities.findIndex((item) => item === city.cityName)
          topCityList[idx] = city
          return false
        } else {
          return true
        }
      })

      const updatedCityList = [...topCityList, ...filteredCityList]

      return updatedCityList
    }

    return []
  }

  useEffect(() => {
    if (inputValue === '') {
      const sortedTopCity = sortedTopCityList()
      setSuggestionsLists(getCityListOption(sortedTopCity))

      return
    }

    const fuse = new Fuse(cityListOptionsFull, searchOption)
    const suggestion = fuse.search(inputValue)
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
  }, [inputValue, cityListOptionsFull])

  return (
    <div {...divProps}>
      <InputSelect
        ref={inputRef}
        value={inputValue}
        options={suggestionsLists}
        onChange={onChangeInputHandler}
        placeholderText="Pilih kota"
        noOptionsText="Kota tidak ditemukan"
        onBlurInput={onBlurHandler}
        onChoose={onChooseHandler}
        isClearable={false}
        disabled={disabledInput}
        disableIconClick={disabledInput}
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
                <IconChevronDown width={25} height={25} color={'#13131B'} />
              </div>
            )
          }
        }}
        isError={isError}
        datatestid={elementId.PDP.Drowpdown.PilihKota}
        onShowDropdown={onShowDropdown}
      />
    </div>
  )
}
