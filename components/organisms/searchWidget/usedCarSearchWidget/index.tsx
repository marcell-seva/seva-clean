import clsx from 'clsx'
import React, {
  MutableRefObject,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import styles from 'styles/components/organisms/usedCarSearchWidget.module.scss'
import urls from 'utils/helpers/url'
import elementId from 'utils/helpers/trackerId'
import { colors } from 'utils/helpers/style/colors'
import { Button, CardShadow } from 'components/atoms'
import {
  IconBrand,
  IconCalendar,
  IconTransmission,
} from 'components/atoms/icon'
import { UsedCarFunnelWidget } from 'utils/types/props'
import {
  BrandUsedCarWidget,
  FormSearchModel,
  SelectWidgetUsedCar,
  TransmissionUsedCarWidget,
  YearRangeWidget,
} from 'components/molecules'
import { useLocalStorage } from 'utils/hooks/useLocalStorage'
import {
  SearchUsedCarWidgetContext,
  SearchUsedCarWidgetContextType,
} from 'services/context'
import { getMinMaxYearsUsedCar, getUsedCarCityList } from 'services/api'
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
  model: [],
  brand: [],
  minYear: '',
  maxYear: '',
  transmission: [],
}

const UsedCarSearchWidget = () => {
  const [minmaxYear, setMinMaxYear] = useState<MinMaxYear>()
  const { dataMinMaxYearUsedCar, dataModelUsedCar } = useContext(
    HomePageDataLocalContext,
  )
  const { patchFunnelQuery }: any = useFunnelQueryUsedCarData()
  const { funnelWidget, saveFunnelWidget } = useContext(
    SearchUsedCarWidgetContext,
  ) as SearchUsedCarWidgetContextType

  const priceRangeRef = useRef() as MutableRefObject<HTMLDivElement>
  const [storedFilter] = useLocalStorage<UsedCarFunnelWidget>(
    LocalStorageKey.CarFilter,
    initEmptyDataWidget,
  )

  const [locationSelected, setLocationSelected] = useState(
    funnelWidget.model ? funnelWidget.model : [],
  )

  const fetchMinMaxYear = async () => {
    const response = await getMinMaxYearsUsedCar('')
    setMinMaxYear(response.data)
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

  const yearPlaceholder = () => {
    if (funnelWidget.minYear && funnelWidget.maxYear) {
      return `${funnelWidget.minYear} - ${funnelWidget.maxYear}`
    }
    return 'Pilih tahun mobil bekas'
  }

  const transmissionPlaceholder = () => {
    if (funnelWidget.transmission.length > 0) {
      return funnelWidget.transmission.join(', ')
    }

    return 'Pilih transmisi'
  }

  const submit = () => {
    const { brand, minYear, maxYear, transmission, model } = funnelWidget
    const urlParam = new URLSearchParams({
      ...(model && model.length > 0 && { modelName: model.join(',') }),
      ...(brand && brand.length > 0 && { brand: brand.join(',') }),
      ...(minYear && { yearStart: minYear }),
      ...(maxYear && { yearEnd: maxYear }),
      ...(transmission &&
        transmission.length > 0 && { transmission: transmission.join(',') }),
      sortBy: 'lowToHigh',
    }).toString()

    patchFunnelQuery({
      modelName: model,
      brand: brand,
      yearStart: minYear,
      yearEnd: maxYear,
      transmission: transmission,
      sortBy: 'lowToHigh',
    })

    navigateToPLP(
      PreviousButton.SmartSearch,
      {
        search: urlParam,
      },
      true,
      false,
      urls.internalUrls.usedCarResultsUrl,
    )
  }

  useEffect(() => {
    saveFunnelWidget({ ...funnelWidget, model: locationSelected })
  }, [locationSelected])

  useEffect(() => {
    saveFunnelWidget({ ...funnelWidget })
    fetchMinMaxYear()
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

  const goToButton = useRef<null | HTMLDivElement>(null)
  const scrollToSection = () => {
    if (goToButton.current) {
      window.scrollTo({
        top: goToButton.current.offsetTop,
        behavior: 'smooth', // Optional: adds a smooth scrolling effect
      })
    }
  }

  return (
    <div className={styles.container}>
      <div
        className={clsx({
          [styles.cardContainer]: true,
        })}
      >
        <FormSearchModel
          modelList={dataModelUsedCar}
          setLocationSelected={setLocationSelected}
          isClick={scrollToSection}
        />
        <SelectWidgetUsedCar
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
          isValue={funnelWidget.brand.length > 0}
        />
        <SelectWidgetUsedCar
          title="Tahun"
          placeholder={yearPlaceholder()}
          icon={
            <IconCalendar
              width={32}
              height={32}
              color={colors.secondaryBrickRed}
            />
          }
          sheetOption={({ onClose }: any) => (
            <YearRangeWidget
              onClose={onClose}
              minMaxYear={dataMinMaxYearUsedCar}
            />
          )}
          datatestid={elementId.FilterType}
          isValue={
            funnelWidget.minYear.length > 0 || funnelWidget.maxYear.length > 0
          }
        />
        <SelectWidgetUsedCar
          ref={priceRangeRef}
          title="Transmisi"
          placeholder={transmissionPlaceholder()}
          icon={
            <IconTransmission
              width={32}
              height={32}
              color={colors.secondaryBrickRed}
            />
          }
          sheetOption={({ onClose }: any) => (
            <TransmissionUsedCarWidget onClose={onClose} />
          )}
          datatestid={elementId.FilterHarga}
          isValue={funnelWidget.transmission.length > 0}
        />
      </div>
      <div className={styles.buttonWrapper} ref={goToButton}>
        <Button
          version={ButtonVersion.PrimaryDarkBlue}
          size={ButtonSize.Big}
          onClick={submit}
          data-testid={elementId.Homepage.Button.CariMobil}
        >
          Cari Mobil Bekas
        </Button>
      </div>
    </div>
  )
}

export default UsedCarSearchWidget
