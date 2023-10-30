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
import { Button, CardShadow } from 'components/atoms'
import {
  IconAgeRange,
  IconBrand,
  IconCalendar,
  IconCar,
  IconDownPayment,
  IconIncome,
  IconMoney,
  IconPlus,
  IconTenure,
  IconTransmission,
} from 'components/atoms/icon'
import {
  FinancialFunnelWidgetError,
  FunnelWidget,
  UsedCarFunnelWidget,
} from 'utils/types/props'
import {
  ageOptions,
  MinAmountMessage,
  RequiredFunnelErrorMessage,
} from 'utils/config/funnel.config'
import { Currency } from 'utils/handler/calculation'
import {
  BrandUsedCarWidget,
  FormSearchModel,
  GridOptionWidget,
  InputWidget,
  PriceRangeWidget,
  SelectWidget,
  TenureOptionWidget,
} from 'components/molecules'
import { useRouter } from 'next/router'
import { useLocalStorage } from 'utils/hooks/useLocalStorage'
import {
  SearchUsedCarWidgetContext,
  SearchUsedCarWidgetContextType,
  SearchWidgetContext,
  SearchWidgetContextType,
} from 'services/context'
import { getMinMaxYearsUsedCar, getUsedCarCityList } from 'services/api'
import { getCity } from 'utils/hooks/useGetCity'
import { useFinancialQueryData } from 'services/context/finnancialQueryContext'
import { useFunnelQueryData } from 'services/context/funnelQueryContext'
import { LocalStorageKey } from 'utils/enum'
import { ButtonSize, ButtonVersion } from 'components/atoms/button'
import { navigateToPLP, PreviousButton } from 'utils/navigate'
import { trackEventCountly } from 'helpers/countly/countly'
import { CountlyEventNames } from 'helpers/countly/eventNames'
import { useAfterInteractive } from 'utils/hooks/useAfterInteractive'
import { useFunnelQueryUsedCarData } from 'services/context/funnelQueryUsedCarContext'

import { HomePageDataLocalContext } from 'pages'
import { MinMaxYear } from 'utils/types/context'

const initEmptyDataWidget = {
  brand: [],
  minYear: '',
  maxYear: '',
  transmission: [],
}

const UsedCarSearchWidget = () => {
  const [minmaxYear, setMinMaxYear] = useState<MinMaxYear>()
  const { patchFunnelQuery }: any = useFunnelQueryUsedCarData()
  const { funnelWidget, saveFunnelWidget } = useContext(
    SearchUsedCarWidgetContext,
  ) as SearchUsedCarWidgetContextType

  const priceRangeRef = useRef() as MutableRefObject<HTMLDivElement>
  const [storedFilter] = useLocalStorage<UsedCarFunnelWidget>(
    LocalStorageKey.CarFilter,
    initEmptyDataWidget,
  )

  const fetchMinMaxYear = () => {
    getMinMaxYearsUsedCar('').then((data) => {
      setMinMaxYear(data.data)
    })
  }

  const brandPlaceholder = () => {
    if (funnelWidget.brand.length > 0) {
      const capitalizedBrands = funnelWidget.brand.map((brand) => {
        if (brand === 'bmw') {
          return brand.toUpperCase()
        } else {
          return brand.charAt(0).toUpperCase() + brand.slice(1)
        }
      })

      return capitalizedBrands.join(', ')
    }

    return 'Pilih merek mobil bekas'
  }

  // const submit = () => {
  //   const { brand, minYear, maxYear, transmission } = funnelWidget
  //   const urlParam = new URLSearchParams({
  //     ...(brand && brand.length > 0 && { brand: brand.join(',') }),
  //     ...(expandFinancial && tenure && { tenure }),
  //     sortBy: 'lowToHigh',
  //   }).toString()

  //   navigateToPLP(
  //     PreviousButton.SmartSearch,
  //     { search: urlParam },
  //     true,
  //     false,
  //     urls.internalUrls.usedCarResultsUrl,
  //   )
  // }

  useEffect(() => {
    saveFunnelWidget({ ...funnelWidget })
    fetchMinMaxYear()
    getCiyList()
    patchFunnelQuery({ filterFincap: false })
  }, [])

  useAfterInteractive(() => {
    patchFunnelQuery({ filterFincap: false })
  }, [])

  const trackCountlyOnReset = (type: string) => {
    trackEventCountly(CountlyEventNames.WEB_HOMEPAGE_FILTER_BRAND_RESET_CLICK, {
      FILTER_TYPE: type,
    })
  }

  const [cityList, setCityList] = useState([])
  const [isApplied, setIsApplied] = useState(false)
  const [resetTmp, setResetTmp] = useState(false)

  const getCiyList = async () => {
    const response = await getUsedCarCityList()
    setCityList(response.data)
  }
  return (
    <div className={styles.container}>
      <CardShadow
        className={clsx({
          [styles.cardContainer]: true,
        })}
      >
        <FormSearchModel cityList={cityList} isApplied={isApplied} />
        <SelectWidget
          title="Merek"
          placeholder={brandPlaceholder()}
          icon={
            <IconBrand
              width={32}
              height={32}
              color={colors.secondaryBrickRed}
            />
          }
          sheetOption={({ onClose }: any) => (
            <BrandUsedCarWidget onClose={onClose} />
          )}
          datatestid={elementId.FilterMerek}
        />
        <SelectWidget
          title="Tahun"
          placeholder={'Pilih tahun mobil bekas'}
          icon={
            <IconCalendar
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
              // trackCountlyOnSubmit={trackCountlyOnSubmitCarBodyType}
              trackCountlyOnReset={() => trackCountlyOnReset('Car Type')}
            />
          )}
          datatestid={elementId.FilterType}
        />
        <SelectWidget
          ref={priceRangeRef}
          title="Transmisi"
          placeholder={'Pilih transmisi'}
          icon={
            <IconTransmission
              width={32}
              height={32}
              color={colors.secondaryBrickRed}
            />
          }
          sheetOption={({ onClose }: any) => (
            <BrandUsedCarWidget onClose={onClose} />
          )}
          datatestid={elementId.FilterHarga}
        />
      </CardShadow>
      <div className={styles.buttonWrapper}>
        <Button
          version={ButtonVersion.PrimaryDarkBlue}
          size={ButtonSize.Big}
          // onClick={submit}
          data-testid={elementId.Homepage.Button.CariMobil}
        >
          Cari Mobil
        </Button>
      </div>
    </div>
  )
}

export default UsedCarSearchWidget
