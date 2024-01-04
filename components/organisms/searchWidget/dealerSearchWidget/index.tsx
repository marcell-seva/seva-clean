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
import { Button, Gap } from 'components/atoms'
import { IconBrand, IconLocation } from 'components/atoms/icon'
import { SelectWidgetUsedCar } from 'components/molecules'
import { SearchWidgetContext, SearchWidgetContextType } from 'services/context'
import { getDealer } from 'services/api'
import { ButtonSize, ButtonVersion } from 'components/atoms/button'
import { useAfterInteractive } from 'utils/hooks/useAfterInteractive'
import { useFunnelQueryUsedCarData } from 'services/context/funnelQueryUsedCarContext'
import { capitalizeWords } from 'utils/stringUtils'
import dynamic from 'next/dynamic'
import { useUtils } from 'services/context/utilsContext'
import { useRouter } from 'next/router'
import { dealerBrandLocationUrl, dealerBrandUrl } from 'utils/helpers/routes'
import { DealerBrand } from 'utils/types/utils'

const BrandUsedCarWidget = dynamic(
  () => import('components/molecules').then((mod) => mod.BrandUsedCarWidget),
  { ssr: false },
)

interface DealerSearchWidgetProps {
  cityList: any
}

const DealerSearchWidget = ({ cityList }: DealerSearchWidgetProps) => {
  const router = useRouter()
  const [dealerCityList, setDealerCityList] = useState([])
  const [isError, setIsError] = useState(false)
  const { patchFunnelQuery, clearQueryFilter }: any =
    useFunnelQueryUsedCarData()
  const { funnelWidget, saveFunnelWidget } = useContext(
    SearchWidgetContext,
  ) as SearchWidgetContextType

  const [brandSelected, setBrandSelected] = useState(
    funnelWidget.brand ? funnelWidget.brand : [],
  )
  const [citySelected, setCitySelected] = useState(
    funnelWidget.city ? funnelWidget.city : '',
  )

  const brandPlaceholder = () => {
    if (funnelWidget.brand.length > 0) {
      const capitalizedBrands =
        funnelWidget.brand[0] === 'bmw'
          ? funnelWidget.brand[0].toUpperCase()
          : capitalizeWords(funnelWidget.brand[0])
      return capitalizedBrands
    }

    return 'Pilih merek'
  }

  const submit = () => {
    const { brand, city } = funnelWidget

    if (brand && city) {
      const brandCityDealerRoute = dealerBrandLocationUrl
        .replace(':brand', brand[0])
        .replace(':location', city.replace(/ /g, '-').toLowerCase())
        .toLowerCase()
      router.push(brandCityDealerRoute)
    } else if (brand.length > 0) {
      const brandDealerRoute = dealerBrandUrl
        .replace(
          ':brand',
          brand[0] === 'bmw'
            ? brand[0].toUpperCase()
            : capitalizeWords(brand[0]),
        )
        .toLowerCase()
      router.push(brandDealerRoute)
    } else {
      setIsError(true)
    }
  }

  useEffect(() => {
    saveFunnelWidget({ ...funnelWidget })
    patchFunnelQuery({ filterFincap: false })
  }, [])

  useEffect(() => {
    if (brandSelected?.length > 0) {
      getDealer(
        `?brand=${
          brandSelected[0] === 'bmw'
            ? brandSelected[0].toUpperCase()
            : capitalizeWords(brandSelected[0])
        }`,
      ).then((res: any) => {
        setDealerCityList(res.data)
      })
    }
    if (citySelected) {
      setCitySelected('')
    }
    saveFunnelWidget({
      ...funnelWidget,
      brand: brandSelected,
      city: '',
    })
    console.log(citySelected)
  }, [brandSelected])

  useEffect(() => {
    saveFunnelWidget({ ...funnelWidget, city: citySelected })
  }, [citySelected])

  useEffect(() => {
    setDealerCityList(cityList)
  }, [cityList])

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
        <div className={styles.title}>
          Temukan Dealer Rekanan SEVA yang tersebar di seluruh Indonesia
        </div>
        <Gap height={24} />
        <SelectWidgetUsedCar
          title="Merek"
          placeholder={brandPlaceholder()}
          alterPlaceholder
          icon={
            <IconBrand
              width={32}
              height={32}
              color={colors.secondaryBrickRed}
            />
          }
          sheetOption={({ onClose }: any) => (
            <BrandUsedCarWidget
              onClose={onClose}
              isDealer
              setBrandSelected={setBrandSelected}
            />
          )}
          datatestid={elementId.FilterMerek}
          isValue={funnelWidget.brand.length > 0}
        />
        <SelectWidgetUsedCar
          title="Kota"
          cityValue={citySelected}
          isDealer
          placeholder={''}
          dealerList={dealerCityList}
          icon={
            <IconLocation
              width={32}
              height={32}
              color={colors.secondaryBrickRed}
              stroke={true}
            />
          }
          datatestid={elementId.FilterType}
          setCitySelected={setCitySelected}
        />
        {isError && <span className={styles.errorText}>Wajib diisi</span>}
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
