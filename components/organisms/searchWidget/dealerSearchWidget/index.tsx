import clsx from 'clsx'
import React, {
  MutableRefObject,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import styles from 'styles/components/organisms/dealerSearchWidget.module.scss'
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
import { capitalizeWords } from 'utils/stringUtils'
import dynamic from 'next/dynamic'

const BrandUsedCarWidget = dynamic(
  () => import('components/molecules').then((mod) => mod.BrandUsedCarWidget),
  { ssr: false },
)

const initEmptyDataWidget = {
  model: [],
  brand: [],
  minYear: '',
  maxYear: '',
  transmission: [],
}

const DealerSearchWidget = () => {
  const [minmaxYear, setMinMaxYear] = useState<MinMaxYear>()
  const { dataMinMaxYearUsedCar, dataModelUsedCar } = useContext(
    HomePageDataLocalContext,
  )
  const { patchFunnelQuery, clearQueryFilter }: any =
    useFunnelQueryUsedCarData()
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

    return 'Pilih merek'
  }

  const submit = () => {
    const { brand, minYear, maxYear, transmission, model } = funnelWidget
    let carModel
    const tempArray: any = []
    carModel = dataModelUsedCar.filter((data: any) => {
      model.map((item: string) => {
        return data.modelName.includes(item)
          ? tempArray.push(
              data.brandName.toUpperCase() === 'BMW'
                ? data.brandName.toUpperCase() + ' ' + data.modelName
                : data.brandName.toUpperCase() === 'MERCEDEZ-BENZ'
                ? 'Mercedez-Benz' + ' ' + data.modelName
                : data.brandName.charAt(0).toUpperCase() +
                  data.brandName.slice(1) +
                  ' ' +
                  data.modelName,
            )
          : ''
      })
    })
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
      modelFullName: tempArray,
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

  const goToButton = useRef<null | HTMLDivElement>(null)

  return (
    <div className={styles.container}>
      <div
        className={clsx({
          [styles.cardContainer]: true,
        })}
      >
        <div className={styles.containertitleCard}>
          <h3 className={styles.titleCard}>
            Temukan Dealer Rekanan SEVA yang tersebar di seluruh Indonesia
          </h3>
        </div>
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
      </div>
      <div className={styles.buttonWrapper} ref={goToButton}>
        <Button
          version={ButtonVersion.PrimaryDarkBlue}
          size={ButtonSize.Big}
          onClick={submit}
          data-testid={elementId.Homepage.Button.CariMobil}
        >
          Cari Dealer
        </Button>
      </div>
    </div>
  )
}

export default DealerSearchWidget
