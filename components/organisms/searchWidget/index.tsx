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
import { MinAmount } from 'utils/types/models'
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
} from 'components/atoms/icon'
import { FinancialFunnelWidgetError, FunnelWidget } from 'utils/types/props'
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
import { useRouter } from 'next/router'
import { useLocalStorage } from 'utils/hooks/useLocalStorage'
import { SearchWidgetContext, SearchWidgetContextType } from 'services/context'
import { api } from 'services/api'
import { getCity } from 'utils/hooks/useGetCity'
import { useFinancialQueryData } from 'services/context/finnancialQueryContext'
import { useFunnelQueryData } from 'services/context/funnelQueryContext'
import { LocalStorageKey } from 'utils/enum'
import { ButtonSize, ButtonVersion } from 'components/atoms/button'
import { navigateToPLP, PreviousButton } from 'utils/navigate'
import { trackEventCountly } from 'helpers/countly/countly'
import { CountlyEventNames } from 'helpers/countly/eventNames'
import { useAfterInteractive } from 'utils/hooks/useAfterInteractive'

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

const SearchWidget = () => {
  const { patchFunnelQuery }: any = useFunnelQueryData()
  const { financialQuery, patchFinancialQuery } = useFinancialQueryData()
  const { funnelWidget, saveFunnelWidget } = useContext(
    SearchWidgetContext,
  ) as SearchWidgetContextType

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
    if (!funnelWidget.priceRangeGroup)
      return `Rp${Currency(limitPrice.min)} - ${Currency(limitPrice.max)}`

    const splitPriceRange = funnelWidget.priceRangeGroup.split('-')
    return `Rp${Currency(splitPriceRange[0])} - ${Currency(splitPriceRange[1])}`
  }, [funnelWidget.priceRangeGroup, limitPrice])

  const limitMinimumDp = useMemo(() => {
    if (!funnelWidget.priceRangeGroup) return limitPrice.min * 0.2

    const currentMinimumPrice = funnelWidget.priceRangeGroup.split('-')[0]
    return Number(currentMinimumPrice) * (20 / 100)
  }, [funnelWidget.priceRangeGroup, limitPrice.min])

  const limitMaximumDp = useMemo(() => {
    if (!funnelWidget.priceRangeGroup) return limitPrice.max * (90 / 100)

    const currentMaximumPrice = funnelWidget.priceRangeGroup.split('-')[1]
    return Number(currentMaximumPrice) * 0.9
  }, [funnelWidget.priceRangeGroup, limitPrice.max])

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
    trackEventCountly(
      CountlyEventNames.WEB_HOMEPAGE_FILTER_DP_ADJUST_PRICE_CLICK,
      {
        DP_INPUT: `Rp${Currency(funnelWidget.downPaymentAmount)}`,
        DP_SUGGESTION: `Rp${Currency(limitMinimumDp)}`,
      },
    )
    priceRangeRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    })
    setTimeout(() => {
      priceRangeRef.current.click()
    }, 400)
  }

  const errorDownPayment = (): JSX.Element | string => {
    if (!funnelWidget.downPaymentAmount)
      return RequiredFunnelErrorMessage.downPaymentAmount

    if (Number(funnelWidget.downPaymentAmount) < MinAmount.downPaymentAmount)
      return MinAmountMessage.downPayemntAmount

    if (Number(funnelWidget.downPaymentAmount) < limitMinimumDp)
      return errorLimitDP({
        text: `Berdasarkan harga yang Anda pilih, min. DP 
      Rp${Currency(limitMinimumDp)}. `,
        gotoPriceRange,
      })

    if (Number(funnelWidget.downPaymentAmount) > limitMaximumDp)
      return errorLimitDP({
        text: `Berdasarkan harga yang Anda pilih, maks. DP 
      Rp${Currency(limitMaximumDp)}. `,
        gotoPriceRange,
      })

    return ''
  }

  const errorIncome = () => {
    if (!funnelWidget.monthlyIncome)
      return RequiredFunnelErrorMessage.monthlyIncome

    if (Number(funnelWidget.monthlyIncome) < MinAmount.monthlyIncome)
      return MinAmountMessage.monthlyIncome

    return ''
  }

  const brandTypePlaceholder = (type: 'brand' | 'bodyType') => {
    if (funnelWidget[type].length > 0) {
      return funnelWidget[type].join(', ')
    }

    return initDataWidget[type].join(', ')
  }

  const checkFinancialEmpty = () => {
    //check if user not open/expand financial form
    if (!expandFinancial) return true

    const { age, downPaymentAmount, monthlyIncome, tenure } = funnelWidget

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

  const dataForCountlyTrackerOnClick = () => {
    const tempPriceRange = formatPriceRangePlaceholder
      .replaceAll(' ', '')
      .replaceAll('Rp', '')

    return {
      CAR_BRAND: brandTypePlaceholder('brand'),
      CAR_TYPE: brandTypePlaceholder('bodyType'),
      MIN_PRICE: !!tempPriceRange
        ? `Rp${Currency(tempPriceRange.split('-')[0])}`
        : 'Null',
      MAX_PRICE: !!tempPriceRange
        ? `Rp${Currency(tempPriceRange.split('-')[1])}`
        : 'Null',
      DP_AMOUNT:
        expandFinancial && !!funnelWidget.downPaymentAmount
          ? `Rp${Currency(funnelWidget.downPaymentAmount)}`
          : 'Null',
      TENOR_OPTION:
        expandFinancial && !!funnelWidget.tenure
          ? `${funnelWidget.tenure} tahun`
          : 'Null',
      INCOME_AMOUNT:
        expandFinancial && !!funnelWidget.monthlyIncome
          ? `Rp${Currency(funnelWidget.monthlyIncome)}`
          : 'Null',
      AGE_RANGE:
        expandFinancial && !!funnelWidget.age
          ? `${funnelWidget.age} Tahun`
          : 'Null',
    }
  }

  const trackCountlyClickCta = () => {
    trackEventCountly(CountlyEventNames.WEB_HOMEPAGE_CAR_SEARCH_BUTTON_CLICK, {
      SOURCE_SECTION: 'Smart search',
      ...dataForCountlyTrackerOnClick(),
    })
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
    } = funnelWidget
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
      patchFunnelQuery({ ...funnelWidget, filterFincap: true })
    } else {
      patchFunnelQuery({
        brand,
        bodyType,
        priceRangeGroup,
        filterFincap: false,
      })
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

    trackCountlyClickCta()

    navigateToPLP(PreviousButton.SmartSearch, { search: urlParam })
  }

  useEffect(() => {
    const currentFinancial: { [key: string]: string } = {}

    if (storedFilter.monthlyIncome)
      currentFinancial.monthlyIncome = storedFilter.monthlyIncome
    if (storedFilter.age) currentFinancial.age = storedFilter.age
    if (storedFilter.tenure) currentFinancial.tenure = storedFilter.tenure
    if (storedFilter.downPaymentAmount)
      currentFinancial.downPaymentAmount = storedFilter.downPaymentAmount

    saveFunnelWidget({ ...funnelWidget, ...currentFinancial })
    fetchMinMaxPrice()
    patchFunnelQuery({ filterFincap: false })
  }, [])

  useAfterInteractive(() => {
    patchFunnelQuery({ filterFincap: false })
  }, [])

  useEffect(() => {
    const changeFinanceState: { [key: string]: string } = {}
    if (funnelWidget.age) changeFinanceState.age = ''
    if (funnelWidget.tenure) changeFinanceState.tenure = ''

    setErrorFinance((prev: any) => ({ ...prev, ...changeFinanceState }))
  }, [funnelWidget.age, funnelWidget.tenure])

  useEffect(() => {
    let downPaymentAmount = ''
    if (funnelWidget.downPaymentAmount) {
      if (
        Number(funnelWidget.downPaymentAmount) < MinAmount.downPaymentAmount
      ) {
        downPaymentAmount = MinAmountMessage.downPayemntAmount
      } else {
        if (!isValidElement(errorFinance.downPaymentAmount))
          downPaymentAmount = ''
      }
    }

    setErrorFinance((prev: any) => ({ ...prev, downPaymentAmount }))
  }, [funnelWidget.downPaymentAmount])

  useEffect(() => {
    let monthlyIncome = ''
    if (funnelWidget.monthlyIncome) {
      monthlyIncome = errorIncome()
    }

    setErrorFinance((prev: any) => ({ ...prev, monthlyIncome }))
  }, [funnelWidget.monthlyIncome])

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
            trackEventCountly(
              CountlyEventNames.WEB_HOMEPAGE_ADD_FINANCIAL_FILTER_CLICK,
            )
            trackEventCountly(
              CountlyEventNames.WEB_HOMEPAGE_ADD_FINANCIAL_FILTER_CLOSE,
            )
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

  const trackCountlyOnSubmitCarBrand = (checkedOption: string[]) => {
    trackEventCountly(CountlyEventNames.WEB_HOMEPAGE_FILTER_APPLY_CLICK, {
      FILTER_TYPE: 'Car Brand',
      ...dataForCountlyTrackerOnClick(),
      CAR_BRAND: checkedOption.join(', '),
      AGE_RANGE:
        expandFinancial && !!funnelWidget.age ? `${funnelWidget.age}` : 'Null',
    })
  }

  const trackCountlyOnSubmitCarBodyType = (checkedOption: string[]) => {
    trackEventCountly(CountlyEventNames.WEB_HOMEPAGE_FILTER_APPLY_CLICK, {
      FILTER_TYPE: 'Car Type',
      ...dataForCountlyTrackerOnClick(),
      CAR_TYPE: checkedOption.join(', '),
      AGE_RANGE:
        expandFinancial && !!funnelWidget.age ? `${funnelWidget.age}` : 'Null',
    })
  }

  const trackCountlyOnSubmitPriceRange = (min: number, max: number) => {
    trackEventCountly(CountlyEventNames.WEB_HOMEPAGE_FILTER_APPLY_CLICK, {
      FILTER_TYPE: 'Price Range',
      ...dataForCountlyTrackerOnClick(),
      MIN_PRICE: `Rp${Currency(min)}`,
      MAX_PRICE: `Rp${Currency(max)}`,
      AGE_RANGE:
        expandFinancial && !!funnelWidget.age ? `${funnelWidget.age}` : 'Null',
    })
  }

  const trackCountlyOnReset = (type: string) => {
    trackEventCountly(CountlyEventNames.WEB_HOMEPAGE_FILTER_BRAND_RESET_CLICK, {
      FILTER_TYPE: type,
    })
  }

  return (
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
              trackCountlyOnSubmit={trackCountlyOnSubmitCarBrand}
              trackCountlyOnReset={() => trackCountlyOnReset('Car Brand')}
            />
          )}
          datatestid={elementId.FilterMerek}
        />
        <SelectWidget
          title="Tipe"
          placeholder={brandTypePlaceholder('bodyType')}
          icon={
            <IconCar width={32} height={32} color={colors.secondaryBrickRed} />
          }
          sheetOption={({ onClose }: any) => (
            <GridOptionWidget
              onClose={onClose}
              type="bodyType"
              errorToastMessage="Silahkan pilih salah satu tipe mobil"
              trackCountlyOnSubmit={trackCountlyOnSubmitCarBodyType}
              trackCountlyOnReset={() => trackCountlyOnReset('Car Type')}
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
            <PriceRangeWidget
              onClose={onClose}
              limitPrice={limitPrice}
              trackCountlyOnSubmit={trackCountlyOnSubmitPriceRange}
              trackCountlyOnReset={() => trackCountlyOnReset('Price Range')}
            />
          )}
          datatestid={elementId.FilterHarga}
        />
        {FinancialEntry()}
        <InputWidget
          name="downPaymentAmount"
          title="Maksimum DP"
          value={funnelWidget.downPaymentAmount}
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
          placeholder={
            funnelWidget.tenure ? funnelWidget.tenure + ' Tahun' : 'Pilih Tenor'
          }
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
          value={funnelWidget.monthlyIncome}
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
          placeholder={funnelWidget.age || 'Pilih Kategori Umur'}
          value={funnelWidget.age}
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
  )
}

export default SearchWidget
