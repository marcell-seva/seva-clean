import { AxiosResponse } from 'axios'
import clsx from 'clsx'
import React, {
  isValidElement,
  MutableRefObject,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import styles from 'styles/components/organisms/searchWidget.module.scss'
import {
  ButtonSize,
  ButtonVersion,
  LocalStorageKey,
  MinAmount,
} from 'utils/types/models'
import urls from 'utils/helpers/url'
import elementId from 'utils/helpers/trackerId'
import { colors } from 'utils/helpers/style/colors'
import { sendAmplitudeData } from 'services/amplitude'
import { AmplitudeEventName } from 'services/amplitude/types'
import { Button, CardShadow } from 'components/atoms'
import {
  IconAgeRange,
  IconBrand,
  IconCar,
  IconDownPayment,
  IconIncome,
  IconMoney,
  IconPlus,
  IconTenure,
} from 'components/atoms/icons'
import {
  FinancialFunnelWidgetError,
  FunnelWidget,
  MinMaxPrice,
} from 'utils/types/props'
import {
  ageOptions,
  MinAmountMessage,
  RequiredFunnelErrorMessage,
} from 'utils/config/funnel.config'
import { Currency } from 'utils/handler/calculation'
import {
  GridOptionWidget,
  InputWidget,
  PriceRangeWidget,
  SelectWidget,
  TenureOptionWidget,
} from 'components/molecules'
import createDataContext from 'services/context/createDataContext'
import { useRouter } from 'next/router'
import { useLocalStorage } from 'utils/hooks/useLocalStorage'
import {
  FinancialQueryContext,
  FinancialQueryContextType,
  FunnelQueryContext,
  FunnelQueryContextType,
} from 'services/context'
import { api } from 'services/api'
import { getCity } from 'utils/hooks/useGetCity'

export const initDataWidget = {
  downPaymentAmount: '',
  brand: ['Toyota', 'Daihatsu', 'Isuzu', 'BMW', 'Peugeot'],
  bodyType: ['MPV', 'SUV', 'Sedan', 'Hatchback', 'Sport'],
  priceRangeGroup: '',
  tenure: '5',
  age: '',
  monthlyIncome: '',
}

const initErrorFinancial = {
  downPaymentAmount: '',
  tenure: '',
  age: '',
  monthlyIncome: '',
}

const initEmptyDataWidget = {
  downPaymentAmount: '',
  brand: [],
  bodyType: [],
  priceRangeGroup: '',
  tenure: '',
  age: '',
  monthlyIncome: '',
}

const { Context } = createDataContext<FunnelWidget>(initEmptyDataWidget)
export const SearchWidgetContext = Context

const SearchWidget = () => {
  const { patchFunnelQuery } = useContext(
    FunnelQueryContext,
  ) as FunnelQueryContextType
  const router = useRouter()
  const { financialQuery, patchFinancialQuery } = useContext(
    FinancialQueryContext,
  ) as FinancialQueryContextType
  const [state, setState] = useState<FunnelWidget>(initEmptyDataWidget) // assume this state as Context widget, mind about re-render
  const contextValue = useMemo(() => ({ state, setState }), [state])
  const priceRangeRef = useRef() as MutableRefObject<HTMLDivElement>
  const [storedFilter] = useLocalStorage<FunnelWidget>(
    LocalStorageKey.CarFilter,
    initEmptyDataWidget,
  )
  const [limitPrice, setLimitPrice] = useState({ min: 0, max: 0 })
  const [expandFinancial, setExpandFinancial] = useState(false)
  const [errorFinance, setErrorFinance] =
    useState<FinancialFunnelWidgetError>(initErrorFinancial)

  const fetchMinMaxPrice = () => {
    const params = getCity().cityCode

    api.getMinMaxPrice(`?city=${params}`).then((response: any) => {
      setLimitPrice({
        min: response.minPriceValue,
        max: response.maxPriceValue,
      })
    })
  }

  const formatPriceRangePlaceholder = useMemo(() => {
    if (!state.priceRangeGroup)
      return `Rp${Currency(limitPrice.min)} - ${Currency(limitPrice.max)}`

    const splitPriceRange = state.priceRangeGroup.split('-')
    return `Rp${Currency(splitPriceRange[0])} - ${Currency(splitPriceRange[1])}`
  }, [state.priceRangeGroup, limitPrice])

  const limitMinimumDp = useMemo(() => {
    if (!state.priceRangeGroup) return limitPrice.min * 0.2

    const currentMinimumPrice = state.priceRangeGroup.split('-')[0]
    return Number(currentMinimumPrice) * (20 / 100)
  }, [state.priceRangeGroup, limitPrice.min])

  const limitMaximumDp = useMemo(() => {
    if (!state.priceRangeGroup) return limitPrice.max * (90 / 100)

    const currentMaximumPrice = state.priceRangeGroup.split('-')[1]
    return Number(currentMaximumPrice) * 0.9
  }, [state.priceRangeGroup, limitPrice.max])

  const errorLimitDP = ({
    text,
    gotoPriceRange,
  }: {
    text: string
    gotoPriceRange: () => void
  }) => (
    <div className={styles.dpError}>
      {text}
      <div className={styles.clickable} onClick={gotoPriceRange}>
        Atau sesuaikan harga mobil
      </div>
    </div>
  )

  const gotoPriceRange = () => {
    priceRangeRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    })
    setTimeout(() => {
      priceRangeRef.current.click()
    }, 400)
  }

  const errorDownPayment = (): JSX.Element | string => {
    if (!state.downPaymentAmount)
      return RequiredFunnelErrorMessage.downPaymentAmount

    if (Number(state.downPaymentAmount) < MinAmount.downPaymentAmount)
      return MinAmountMessage.downPayemntAmount

    if (Number(state.downPaymentAmount) < limitMinimumDp)
      return errorLimitDP({
        text: `Berdasarkan harga yang Anda pilih, min. DP 
      Rp${Currency(limitMinimumDp)}. `,
        gotoPriceRange,
      })

    if (Number(state.downPaymentAmount) > limitMaximumDp)
      return errorLimitDP({
        text: `Berdasarkan harga yang Anda pilih, maks. DP 
      Rp${Currency(limitMaximumDp)}. `,
        gotoPriceRange,
      })

    return ''
  }

  const errorIncome = () => {
    if (!state.monthlyIncome) return RequiredFunnelErrorMessage.monthlyIncome

    if (Number(state.monthlyIncome) < MinAmount.monthlyIncome)
      return MinAmountMessage.monthlyIncome

    return ''
  }

  const brandTypePlaceholder = (type: 'brand' | 'bodyType') => {
    if (state[type].length > 0) {
      return state[type].join(', ')
    }

    return initDataWidget[type].join(', ')
  }

  const checkFinancialEmpty = () => {
    //check if user not open/expand financial form
    if (!expandFinancial) return true

    const { age, downPaymentAmount, monthlyIncome, tenure } = state

    // check if user not fill all financial form
    if (!age && !downPaymentAmount && !monthlyIncome && !tenure) return true

    // check if user fill all financial form
    if (age && !errorDownPayment() && !errorIncome() && tenure) return true

    setErrorFinance((prev: any) => ({
      ...prev,
      downPaymentAmount: errorDownPayment(),
      monthlyIncome: errorIncome(),
      ...(!age && { age: RequiredFunnelErrorMessage.age }),
      ...(!tenure && { tenure: RequiredFunnelErrorMessage.tenure }),
    }))

    return false
  }

  const submit = () => {
    if (!checkFinancialEmpty()) return
    const {
      age,
      downPaymentAmount,
      monthlyIncome,
      priceRangeGroup,
      bodyType,
      brand,
      tenure,
    } = state
    const splitPriceRange = priceRangeGroup.split('-')
    const maxPrice = priceRangeGroup ? splitPriceRange[1] : 0
    const sortHighToLow = maxPrice && Number(maxPrice) < limitPrice.max
    const urlParam = new URLSearchParams({
      ...(expandFinancial && age && { age }),
      ...(expandFinancial && downPaymentAmount && { downPaymentAmount }),
      ...(expandFinancial && monthlyIncome && { monthlyIncome }),
      ...(priceRangeGroup && { priceRangeGroup }),
      ...(bodyType &&
        bodyType.length > 0 && {
          bodyType: bodyType.map((item: any) => item.toUpperCase()).join(','),
        }),
      ...(brand && brand.length > 0 && { brand: brand.join(',') }),
      ...(expandFinancial && tenure && { tenure }),
      ...(sortHighToLow && { sortBy: 'highToLow' }),
    }).toString()

    const dataFinancial = {
      ...financialQuery,
      ...(expandFinancial && age && { age }),
      ...(expandFinancial && downPaymentAmount && { downPaymentAmount }),
      ...(expandFinancial && monthlyIncome && { monthlyIncome }),
      ...(expandFinancial && tenure && { tenure }),
    }

    if (expandFinancial) {
      patchFinancialQuery(dataFinancial)
      patchFunnelQuery({ ...state })
    } else {
      patchFunnelQuery({ brand, bodyType, priceRangeGroup })
    }

    sendAmplitudeData(AmplitudeEventName.WEB_LP_SEARCHWIDGET_SUBMIT, {
      ...(brand && brand.length > 0 && { Car_Brand: brand.join(', ') }),
      ...(bodyType &&
        bodyType.length > 0 && {
          Car_Body_Type: bodyType
            .map((item: any) => item.toUpperCase())
            .join(','),
        }),
      ...(priceRangeGroup && {
        Price_Range: `Rp${Currency(splitPriceRange[0])} - Rp${Currency(
          splitPriceRange[1],
        )}`,
      }),
      ...(expandFinancial &&
        downPaymentAmount && { DP: `Rp${Currency(downPaymentAmount)}` }),
      ...(expandFinancial && tenure && { Tenure: tenure }),
      ...(expandFinancial &&
        monthlyIncome && { Income: `Rp${Currency(monthlyIncome)}` }),
      ...(expandFinancial && age && { Age: age }),
    })

    router.push({
      pathname: urls.internalUrls.carResultsUrl,
      search: urlParam,
    })
  }

  useEffect(() => {
    const currentFinancial: { [key: string]: string } = {}

    if (storedFilter.monthlyIncome)
      currentFinancial.monthlyIncome = storedFilter.monthlyIncome
    if (storedFilter.age) currentFinancial.age = storedFilter.age
    if (storedFilter.tenure) currentFinancial.tenure = storedFilter.tenure
    if (storedFilter.downPaymentAmount)
      currentFinancial.downPaymentAmount = storedFilter.downPaymentAmount

    setState((prev: any) => ({ ...prev, ...currentFinancial }))

    fetchMinMaxPrice()
  }, [])

  useEffect(() => {
    const changeFinanceState: { [key: string]: string } = {}
    if (state.age) changeFinanceState.age = ''
    if (state.tenure) changeFinanceState.tenure = ''

    setErrorFinance((prev: any) => ({ ...prev, ...changeFinanceState }))
  }, [state.age, state.tenure])

  useEffect(() => {
    let downPaymentAmount = ''
    if (state.downPaymentAmount) {
      if (Number(state.downPaymentAmount) < MinAmount.downPaymentAmount) {
        downPaymentAmount = MinAmountMessage.downPayemntAmount
      } else {
        if (!isValidElement(errorFinance.downPaymentAmount))
          downPaymentAmount = ''
      }
    }

    setErrorFinance((prev: any) => ({ ...prev, downPaymentAmount }))
  }, [state.downPaymentAmount])

  useEffect(() => {
    let monthlyIncome = ''
    if (state.monthlyIncome) {
      monthlyIncome = errorIncome()
    }

    setErrorFinance((prev: any) => ({ ...prev, monthlyIncome }))
  }, [state.monthlyIncome])

  const FinancialEntry = () => {
    if (expandFinancial)
      return (
        <>
          <div className={styles.expandFinancialClose}>
            <h3 className={styles.title}>Filter Finansial</h3>
            <span
              className={styles.closeText}
              onClick={() => {
                sendAmplitudeData(
                  AmplitudeEventName.WEB_LP_SEARCHWIDGET_FILTER_FINANSIAL_COLLAPSE,
                  null,
                )
                setErrorFinance(initErrorFinancial)
                setExpandFinancial(false)
              }}
            >
              Tutup
            </span>
          </div>
          <span
            className={`${styles.expandFinancialInfo} ${styles.expandFinancialInfoClose}`}
          >
            Isi semua data di bawah ini untuk melihat peluang pinjamanmu akan
            disetujui.
          </span>
        </>
      )

    return (
      <>
        <Button
          version={ButtonVersion.Secondary}
          size={ButtonSize.Small}
          onClick={() => {
            sendAmplitudeData(
              AmplitudeEventName.WEB_LP_SEARCHWIDGET_FILTER_FINANSIAL_EXPAND,
              null,
            )
            setExpandFinancial(true)
          }}
          data-testid={elementId.Homepage.Button.TambahFilterFinansial}
        >
          <div className={styles.expandFinancialButton}>
            <IconPlus width={16} height={16} />
            <span>Tambah Filter Finansial</span>
          </div>
        </Button>
        <span
          className={`${styles.expandFinancialInfo} ${styles.expandFinancialInfoOpen}`}
        >
          Isi data tambahan untuk melihat peluang pinjamanmu.
        </span>
      </>
    )
  }

  return (
    <SearchWidgetContext.Provider value={contextValue}>
      <div className={styles.container}>
        <CardShadow
          className={clsx({
            [styles.cardContainer]: true,
            [styles.expandCard]: expandFinancial,
          })}
        >
          <SelectWidget
            title="Merek"
            placeholder={brandTypePlaceholder('brand')}
            icon={
              <IconBrand
                width={32}
                height={32}
                color={colors.secondaryBrickRed}
              />
            }
            sheetOption={({ onClose }: any) => (
              <GridOptionWidget
                onClose={onClose}
                type="brand"
                errorToastMessage="Silahkan pilih salah satu merk mobil"
              />
            )}
            datatestid={elementId.FilterMerek}
          />
          <SelectWidget
            title="Tipe"
            placeholder={brandTypePlaceholder('bodyType')}
            icon={
              <IconCar
                width={32}
                height={32}
                color={colors.secondaryBrickRed}
              />
            }
            sheetOption={({ onClose }: any) => (
              <GridOptionWidget
                onClose={onClose}
                type="bodyType"
                errorToastMessage="Silahkan pilih salah satu tipe mobil"
              />
            )}
            datatestid={elementId.FilterType}
          />
          <SelectWidget
            ref={priceRangeRef}
            title="Estimasi Harga"
            placeholder={formatPriceRangePlaceholder}
            icon={
              <IconMoney
                width={32}
                height={32}
                color={colors.secondaryBrickRed}
              />
            }
            sheetOption={({ onClose }: any) => (
              <PriceRangeWidget onClose={onClose} limitPrice={limitPrice} />
            )}
            datatestid={elementId.FilterHarga}
          />
          {FinancialEntry()}
          <InputWidget
            name="downPaymentAmount"
            title="Maksimum DP"
            value={state.downPaymentAmount}
            icon={
              <IconDownPayment
                width={32}
                height={32}
                color={colors.secondaryBrickRed}
              />
            }
            placeholder="Masukkan DP"
            errorText={errorFinance.downPaymentAmount}
            datatestid={elementId.Field.DP}
          />
          <SelectWidget
            title="Tenor (tahun)"
            placeholder={state.tenure ? state.tenure + ' Tahun' : 'Pilih Tenor'}
            icon={
              <IconTenure
                width={32}
                height={32}
                color={colors.secondaryBrickRed}
              />
            }
            sheetOption={({ onClose }: any) => (
              <TenureOptionWidget onClose={onClose} />
            )}
            errorText={errorFinance.tenure}
            datatestid={elementId.Field.Tenure}
          />
          <InputWidget
            name="monthlyIncome"
            title="Pendapatan Bulanan"
            value={state.monthlyIncome}
            icon={
              <IconIncome
                width={32}
                height={32}
                color={colors.secondaryBrickRed}
              />
            }
            placeholder="Masukkan Pendapatan"
            errorText={errorFinance.monthlyIncome}
            datatestid={elementId.Field.Income}
          />
          <SelectWidget
            title="Kategori Umur"
            placeholder={state.age || 'Pilih Kategori Umur'}
            value={state.age}
            name="age"
            icon={
              <IconAgeRange
                width={32}
                height={32}
                color={colors.secondaryBrickRed}
              />
            }
            sheetList={ageOptions}
            errorText={errorFinance.age}
            datatestid={elementId.Homepage.Dropdown.KategoriUmur}
            optionDatatestId={elementId.Field.Age}
          />
        </CardShadow>
        <div className={styles.buttonWrapper}>
          <Button
            version={ButtonVersion.PrimaryDarkBlue}
            size={ButtonSize.Big}
            onClick={submit}
            data-testid={elementId.Homepage.Button.CariMobil}
          >
            Cari Mobil
          </Button>
        </div>
      </div>
    </SearchWidgetContext.Provider>
  )
}

export default SearchWidget
