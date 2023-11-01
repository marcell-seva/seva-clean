import React, { useEffect, useRef, useState } from 'react'
import styles from '/styles/components/molecules/citySelectorModal.module.scss'
import Fuse from 'fuse.js'
import {
  trackCityListClick,
  trackCitySelectorApply,
  trackCitySelectorCancel,
} from 'helpers/amplitude/seva20Tracking'
import { Button, InputSelect } from 'components/atoms'
import { sendAmplitudeData } from 'services/amplitude'
import { AmplitudeEventName } from 'services/amplitude/types'
import elementId from 'utils/helpers/trackerId'
import { getLocalStorage, saveLocalStorage } from 'utils/handler/localStorage'
import { useLocalStorage } from 'utils/hooks/useLocalStorage'
import { getCity, saveCity } from 'utils/hooks/useGetCity'
import { CityOtrOption, FormControlValue, Option } from 'utils/types'
import { LocalStorageKey, SessionStorageKey } from 'utils/enum'
import { ButtonSize, ButtonVersion } from 'components/atoms/button'
import {
  trackEventCountly,
  valueForInitialPageProperty,
  valueForUserTypeProperty,
  valueMenuTabCategory,
} from 'helpers/countly/countly'
import { CountlyEventNames } from 'helpers/countly/eventNames'
import { getPageName } from 'utils/pageName'
import { countDaysDifference } from 'utils/handler/date'
import {
  getBrandAndModelValue,
  getBrandValue,
} from 'utils/handler/getBrandAndModel'
import { trackDataCarType } from 'utils/types/utils'
import { getSessionStorage } from 'utils/handler/sessionStorage'
import { RouteName } from 'utils/navigate'
import { removeCarBrand } from 'utils/handler/removeCarBrand'
import dynamic from 'next/dynamic'
import { useCityFirst } from 'utils/hooks/useCityFirst'

const searchOption = {
  keys: ['label'],
  isCaseSensitive: true,
  includeScore: true,
  threshold: 0.1,
}

interface Props {
  onClickCloseButton: () => void
  cityListFromApi: CityOtrOption[]
  isOpen: boolean
  pageOrigination?: string
  sourceButton?: string
  modelName?: string
  brandName?: string
}

const Modal = dynamic(() => import('antd').then((mod) => mod.Modal), {
  ssr: false,
})

const CitySelectorModal = ({
  onClickCloseButton,
  cityListFromApi,
  isOpen,
  pageOrigination,
  sourceButton,
  modelName,
  brandName,
}: Props) => {
  const { showCity, onCloseCity } = useCityFirst()
  const [cityOtr] = useLocalStorage<CityOtrOption | null>(
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
  const dataCar: trackDataCarType | null = getSessionStorage(
    SessionStorageKey.PreviousCarDataBeforeLogin,
  )

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

  const getPathname = () => {
    if (window.location.pathname === '/mobil-baru') {
      return 'PLP'
    } else if (
      window.location.pathname !== '/mobil-baru' &&
      window.location.pathname.includes('/mobil-baru')
    ) {
      return 'PDP - ' + valueMenuTabCategory()
    }
  }
  const onClickLaterButton = () => {
    if (cityOtr) {
      setInputValue(cityOtr.cityName)
      setLastChoosenValue(cityOtr.cityName)
    }
    sendAmplitudeData(AmplitudeEventName.WEB_CITYSELECTOR_CANCEL, {
      Page_Origination_URL: window.location.href,
    })
    trackEventCountly(CountlyEventNames.WEB_CITY_SELECTOR_BANNER_LATER_CLICK, {
      PAGE_ORIGINATION:
        pageOrigination && pageOrigination.toLowerCase().includes('pdp')
          ? 'PDP - ' + valueMenuTabCategory()
          : getPathname(),
    })
    onCloseCity()
    onClickCloseButton()
  }

  const onClickSubmitButton = () => {
    const filter = cityListFromApi?.filter(
      (item: CityOtrOption) => item.cityName === inputValue,
    )
    const temp: CityOtrOption = {
      cityName: filter[0].cityName,
      cityCode: filter[0].cityCode,
      province: filter[0].province,
      id: filter[0].id,
    }
    saveCity(temp)
    saveLocalStorage(
      LocalStorageKey.LastTimeSelectCity,
      new Date().toISOString(),
    )
    sendAmplitudeData(
      AmplitudeEventName.WEB_CITY_SELECTOR_POPUP_SUGGESTION_CLICK,
      {
        Page_Origination_URL: window.location.href.replace('https://www.', ''),
        City: inputValue,
      },
    )
    sendAmplitudeData(AmplitudeEventName.WEB_CITYSELECTOR_APPLY, {
      Page_Origination_URL: window.location.href,
      City: inputValue,
    })
    trackCitySelectorApply({
      Page_Origination_URL: window.location.href,
      City: inputValue,
    })
    trackEventCountly(
      CountlyEventNames.WEB_CITY_SELECTOR_BANNER_FIND_CAR_CLICK,
      { CITY_LOCATION: temp.cityName },
    )
    location.reload()
  }

  const setIsDisabledButtonSubmit = () => {
    const matchedCity = cityListFromApi?.filter(
      (item) => item.cityName === inputValue,
    )
    if (matchedCity?.length > 0) {
      return false
    } else {
      return true
    }
  }

  const onBlurHandler = () => {
    setInputValue(lastChoosenValue)
  }

  const onChooseHandler = (item: Option<FormControlValue>) => {
    setLastChoosenValue(item.label)
    trackEventCountly(CountlyEventNames.WEB_CITY_SELECTOR_BANNER_CITY_CLICK)
  }

  const onResetHandler = () => {
    inputRef.current?.focus()
  }

  const isIn30DaysInterval = () => {
    const lastTimeSelectCity = getLocalStorage<string>(
      LocalStorageKey.LastTimeSelectCity,
    )
    if (!lastTimeSelectCity) {
      return false
    } else if (
      countDaysDifference(lastTimeSelectCity, new Date().toISOString()) <= 30
    ) {
      return true
    } else {
      return false
    }
  }

  const getPageToShowValue = () => {
    if (
      (window.location.pathname !== '/mobil-baru' &&
        window.location.pathname.includes('/mobil-baru')) ||
      pageOrigination?.includes('Loan Calculator') ||
      pageOrigination === RouteName.KKResult
    ) {
      return true
    } else {
      return false
    }
  }

  const getPeluangKreditValue = () => {
    if (
      dataCar?.PELUANG_KREDIT_BADGE &&
      dataCar?.PELUANG_KREDIT_BADGE === 'Green'
    ) {
      return 'Mudah disetujui'
    } else if (
      dataCar?.PELUANG_KREDIT_BADGE &&
      dataCar?.PELUANG_KREDIT_BADGE === 'Red'
    ) {
      return 'Sulit disetujui'
    } else if (
      dataCar?.PELUANG_KREDIT_BADGE &&
      dataCar?.PELUANG_KREDIT_BADGE.includes('disetujui')
    ) {
      return dataCar?.PELUANG_KREDIT_BADGE
    } else {
      return 'Null'
    }
  }

  useEffect(() => {
    if (isOpen) {
      trackEventCountly(CountlyEventNames.WEB_CITY_SELECTOR_BANNER_VIEW, {
        PAGE_ORIGINATION: getPathname(),
        USER_TYPE: valueForUserTypeProperty(),
        SOURCE_BUTTON:
          !cityOtr && !isIn30DaysInterval()
            ? 'Null'
            : sourceButton && sourceButton.length !== 0
            ? sourceButton
            : 'Location Icon (Navbar)',
        INITIAL_PAGE: valueForInitialPageProperty(),
        CAR_BRAND:
          getPageToShowValue() && brandName
            ? getBrandValue(brandName)
            : getPageToShowValue() &&
              dataCar &&
              !window.location.pathname.includes('kalkulator-kredit')
            ? getBrandValue(dataCar.CAR_BRAND)
            : 'Null',
        CAR_MODEL:
          getPageToShowValue() && modelName
            ? getBrandAndModelValue(removeCarBrand(modelName))
            : getPageToShowValue() &&
              dataCar &&
              !window.location.pathname.includes('kalkulator-kredit')
            ? getBrandAndModelValue(dataCar.CAR_MODEL)
            : 'Null',
        PELUANG_KREDIT_BADGE: getPageToShowValue()
          ? getPeluangKreditValue()
          : 'Null',
      })
    }
  }, [isOpen])

  useEffect(() => {
    if (cityListFromApi) {
      const options = getCityListOption(cityListFromApi)
      setCityListOptionsFull(options)
    }
  }, [cityListFromApi])

  const cityListWithTopCity = () => {
    const topCityName = [
      'Jakarta Pusat',
      'Bogor',
      'Surabaya',
      'Bandung',
      'Medan',
      'Makassar',
    ]

    const topCityDataList: CityOtrOption[] = []

    for (let i = 0; i < topCityName.length; i++) {
      for (let j = 0; j < cityListFromApi?.length; j++) {
        if (topCityName[i] === cityListFromApi[j].cityName) {
          topCityDataList.push(cityListFromApi[j])
        }
      }
    }

    const restOfCityData = cityListFromApi?.filter(
      (x) => !topCityDataList.includes(x),
    )
    const sortedRestOfCityData = restOfCityData?.sort((a, b) =>
      a.cityName.localeCompare(b.cityName),
    )

    if (Array.isArray(sortedRestOfCityData)) {
      return [...topCityDataList, ...sortedRestOfCityData]
    } else {
      return topCityDataList
    }
  }

  useEffect(() => {
    if (inputValue === '') {
      setSuggestionsLists(getCityListOption(cityListWithTopCity()))
      return
    }

    const fuse = new Fuse(cityListOptionsFull, searchOption)
    const suggestion = fuse.search(inputValue)
    const result = suggestion.map((obj: any) => obj.item)

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
  }, [inputValue, cityListFromApi, cityListOptionsFull])

  if (typeof window !== 'undefined') {
    window.addEventListener('storage', () => {
      const cityOtrStorage = localStorage.getItem('cityOtr')

      if (cityOtrStorage) {
        const cityOtr = JSON.parse(cityOtrStorage)
        setLastChoosenValue(cityOtr.cityName)
        setInputValue(cityOtr.cityName)
      }
    })
  }
  const onOpenHandler = () => {
    trackEventCountly(
      CountlyEventNames.WEB_CITY_SELECTOR_BANNER_CITY_FIELD_CLICK,
    )
  }
  return (
    <Modal
      closable={false}
      centered
      className="city-selector-custom-modal"
      open={showCity || isOpen}
      footer={null}
      maskStyle={{
        background: 'rgba(19, 19, 27, 0.5)',
        maxWidth: '570px',
        marginLeft: 'auto',
        marginRight: 'auto',
      }}
      data-testid={
        elementId.Homepage.GlobalHeader.PopupChangeLocation + getCity().cityName
      }
    >
      <h2 className={styles.title}>Pilih lokasi pembelian mobilmu</h2>
      <span className={styles.subtitle}>
        Harga & ketersediaan mobil di setiap kota berbeda. Jika tidak dipilih,
        kami tampilkan mobil di Jakarta Pusat.
      </span>

      <div className={styles.inputSelectWrapper}>
        <InputSelect
          ref={inputRef}
          value={inputValue}
          options={suggestionsLists}
          onChange={onChangeInputHandler}
          placeholderText={'Cari kotamu'}
          isAutoFocus={false}
          noOptionsText="Kota tidak ditemukan"
          onBlurInput={onBlurHandler}
          onChoose={onChooseHandler}
          onReset={onResetHandler}
          onShowDropdown={onOpenHandler}
          datatestid={elementId.Homepage.GlobalHeader.FieldInputCity}
        />
      </div>

      <div className={styles.buttonGroup}>
        <Button
          version={ButtonVersion.Secondary}
          size={ButtonSize.Big}
          onClick={onClickLaterButton}
          data-testid={elementId.Homepage.GlobalHeader.ButtonNantiSaja}
        >
          Nanti saja
        </Button>
        <Button
          version={ButtonVersion.PrimaryDarkBlue}
          size={ButtonSize.Big}
          disabled={setIsDisabledButtonSubmit()}
          onClick={onClickSubmitButton}
          data-testid={elementId.Homepage.GlobalHeader.ButtonNantiSaja}
        >
          Mulai Cari Mobil
        </Button>
      </div>
    </Modal>
  )
}

export default CitySelectorModal
