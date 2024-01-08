/* eslint-disable react-hooks/rules-of-hooks */
import clsx from 'clsx'
import React, {
  ForwardedRef,
  forwardRef,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import styles from 'styles/components/molecules/searchWidget/selectWidgetUsedCar.module.scss'
import { colors } from 'utils/helpers/style/colors'
import {
  IconChevronDown,
  IconRemove,
  IconSearch,
  InputSelect,
} from 'components/atoms'
import {
  SearchUsedCarWidgetContext,
  SearchUsedCarWidgetContextType,
  SearchWidgetContext,
  SearchWidgetContextType,
} from 'services/context'
import { FormControlValue, Location, Option } from 'utils/types'
import { trackEventCountly } from 'helpers/countly/countly'
import { CountlyEventNames } from 'helpers/countly/eventNames'
import dynamic from 'next/dynamic'
import { CityOptionWidget } from '../../option/cityOptionWidget'
import { useLocalStorage } from 'utils/hooks/useLocalStorage'
import { LocalStorageKey } from 'utils/enum'
import { defaultCity as defaultCityOtr, saveCity } from 'utils/hooks/useGetCity'
import { useUtils } from 'services/context/utilsContext'
import { DealerBrand } from 'utils/types/utils'
import Fuse from 'fuse.js'

const BottomSheetUsedCar = dynamic(
  () => import('components/atoms/bottomSheet/usedCar'),
  {
    ssr: false,
  },
)

const BottomSheetList = dynamic(
  () => import('components/molecules/bottomSheetList'),
  { ssr: false },
)

type ContentSheetProps = {
  onClose: () => void
}

interface SelectWidgetProps {
  title: string
  placeholder: string
  name?: string
  value?: string | number
  icon: JSX.Element
  sheetOption?: (contentProps: ContentSheetProps) => JSX.Element
  sheetList?: Option<FormControlValue>[]
  errorText?: string | JSX.Element
  datatestid?: string
  optionDatatestId?: string
  isValue?: boolean
  isDealer?: boolean
  alterPlaceholder?: boolean
  dealerList?: DealerBrand[]
  setCitySelected?: any
  cityValue?: string
}

const searchOption = {
  keys: ['cityName'],
  isCaseSensitive: true,
  includeScore: true,
  threshold: 0.1,
}

const forwardSelectWidgetUsedCar = (
  {
    title,
    placeholder,
    value,
    name,
    icon,
    sheetOption,
    sheetList,
    errorText,
    datatestid,
    optionDatatestId,
    isValue = false,
    isDealer,
    alterPlaceholder,
    dealerList,
    setCitySelected,
    cityValue,
  }: SelectWidgetProps,
  ref?: ForwardedRef<HTMLDivElement>,
) => {
  const { dealerBrand } = useUtils()
  const [cityListApi, setCityListApi] = useState<Array<Location>>([])
  const [openOption, setOpenOption] = useState(false)
  const [defaultCity, setDefaultCity] = useState<Location | null>(null)
  const { funnelWidget, saveFunnelWidget } = useContext(
    SearchUsedCarWidgetContext,
  ) as SearchUsedCarWidgetContextType

  const {
    funnelWidget: funnelWidgetNewCar,
    saveFunnelWidget: saveFunnelWidgetNewCar,
  } = useContext(SearchWidgetContext) as SearchWidgetContextType
  const onClose = () => {
    setOpenOption(false)
  }

  const [lastChoosenValue, setLastChoosenValue] = useState('')
  const [currentValue, setCurrentValue] = useState('')
  const inputRef = useRef() as React.MutableRefObject<HTMLInputElement>
  const [inputValue, setInputValue] = useState('')
  const returnProps = {
    onClose,
  }

  const [suggestionsLists, setSuggestionsLists] = useState<any>([])

  const onChangeInputHandler = (value: string) => {
    if (isDealer) {
      setInputValue(
        value
          .toLowerCase()
          .split(' ')
          .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
          .join(' '),
      )
    } else {
      setInputValue(
        value
          .toLowerCase()
          .split(' ')
          .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
          .join(' '),
      )
    }
  }

  const onBlurHandler = (e: any) => {
    if (e.target.value === '') {
      setLastChoosenValue('')
      setInputValue('')
    } else {
      setInputValue(lastChoosenValue)
    }
  }

  const onClickArrowHandler = (event: any) => {
    event.preventDefault()
    inputRef.current?.focus()
  }

  const onChooseOption = (value: FormControlValue, label: FormControlValue) => {
    name && saveFunnelWidget({ ...funnelWidget, [name]: value })
    setCurrentValue(label as string)
    onClose()
  }

  const onChooseHandler = (item: any) => {
    if (isDealer) {
      setCitySelected(item.cityName)
      setLastChoosenValue(item.cityName)
    } else {
      setLastChoosenValue(item.label)
    }
  }

  const onResetHandler = (event: any, fn: any) => {
    if (inputValue === '') return fn
    event.preventDefault()
    inputRef.current?.focus()
    if (isDealer) {
      saveFunnelWidgetNewCar({ ...funnelWidgetNewCar, city: '' })
      setCitySelected('')
    }
    setInputValue('')
  }

  useEffect(() => {
    setSuggestionsLists(dealerList)
  }, [dealerList])

  useEffect(() => {
    setLastChoosenValue(cityValue || '')
    setInputValue(cityValue || '')
  }, [cityValue])

  const getFilterType = () => {
    if (title === 'Merek') {
      return 'Car Brand'
    } else if (title === 'Tipe') {
      return 'Car Type'
    } else if (title === 'Estimasi Harga') {
      return 'Price Range'
    } else if (title === 'Tenor (tahun)') {
      return 'Tenure'
    } else if (title === 'Kategori Umur') {
      return 'Age'
    }
  }

  useEffect(() => {
    if (inputValue === '') {
      setSuggestionsLists(dealerList)
      return
    }

    const suggestion = dealerList?.filter((item: any) =>
      item.cityName.includes(inputValue),
    )
    setSuggestionsLists(suggestion)
  }, [inputValue, dealerList])

  return (
    <>
      <div
        ref={ref}
        className={clsx({
          [styles.container]: true,
          ['shake-animation-X']: errorText,
        })}
        onClick={() => {
          trackEventCountly(
            CountlyEventNames.WEB_HOMEPAGE_SMART_SEARCH_FIELD_CLICK,
            {
              FILTER_TYPE: getFilterType(),
            },
          )
          setOpenOption(true)
        }}
        data-testid={datatestid}
      >
        <div className={styles.fieldContainer}>
          <div className={styles.icon}>{icon}</div>
          <div className={styles.fieldWrapper}>
            <span className={styles.title}>{title}</span>
            <div
              className={
                isDealer ? styles.inputSelectWrapper : styles.textArrowWrapper
              }
            >
              <div
                className={
                  isValue
                    ? styles.placeholderNotEmpty
                    : alterPlaceholder
                    ? styles.alternativePlaceholder
                    : styles.placeholder
                }
              >
                {currentValue || (!isDealer && placeholder)}
              </div>
              <div className={styles.arrowIcon}>
                {!isDealer && (
                  <IconChevronDown
                    width={24}
                    height={24}
                    color={colors.primaryBlack}
                  />
                )}
              </div>
            </div>
            {isDealer && (
              <div className={styles.inputSelectWrapper}>
                <InputSelect
                  isDealer
                  ref={inputRef}
                  value={inputValue}
                  options={suggestionsLists}
                  onChange={onChangeInputHandler}
                  placeholderText="Pilih kota"
                  noOptionsText="Kota tidak ditemukan"
                  onBlurInput={onBlurHandler}
                  onChoose={onChooseHandler}
                  isClearable={false}
                  disableIconClick={false}
                  rightIcon={(state) => {
                    if (state.isOpen) {
                      return (
                        <div
                          onMouseDown={(e) => onResetHandler(e, onBlurHandler)}
                          onClick={(e) => onResetHandler(e, onBlurHandler)}
                          style={{ cursor: 'pointer' }}
                        >
                          <IconRemove
                            width={25}
                            height={25}
                            color={'#13131B'}
                          />
                        </div>
                      )
                    } else {
                      return (
                        <div
                          onMouseDown={onClickArrowHandler}
                          onClick={onClickArrowHandler}
                          style={{ cursor: 'pointer' }}
                        >
                          <IconSearch
                            width={25}
                            height={25}
                            color={'#13131B'}
                            alt="SEVA Search Icon"
                          />
                        </div>
                      )
                    }
                  }}
                  isError={false}
                />
              </div>
            )}
          </div>
        </div>
        <div
          className={clsx({
            [styles.line]: true,
            [styles.error]: errorText,
          })}
        />
        {errorText && <span className={styles.errorText}>{errorText}</span>}
      </div>
      {isDealer ? (
        <></>
      ) : (
        <BottomSheetUsedCar
          title={title}
          open={openOption}
          onDismiss={() => setOpenOption(false)}
        >
          {sheetOption ? (
            sheetOption(returnProps)
          ) : sheetList ? (
            <BottomSheetList
              options={sheetList}
              onChooseOption={onChooseOption}
              activeState={value}
              datatestid={optionDatatestId}
            />
          ) : (
            <></>
          )}
        </BottomSheetUsedCar>
      )}
    </>
  )
}

export const SelectWidgetUsedCar = forwardRef(forwardSelectWidgetUsedCar)
