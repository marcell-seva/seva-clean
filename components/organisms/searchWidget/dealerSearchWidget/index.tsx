import clsx from 'clsx'
import React, { useEffect, useRef, useState } from 'react'
import styles from 'styles/components/organisms/dealerSearchWidget.module.scss'
import elementId from 'utils/helpers/trackerId'
import { colors } from 'utils/helpers/style/colors'
import { Button, Gap } from 'components/atoms'
import { IconBrand, IconLocation } from 'components/atoms/icon'
import { SelectWidgetUsedCar } from 'components/molecules'
import { getDealer } from 'services/api'
import { ButtonSize, ButtonVersion } from 'components/atoms/button'
import { capitalizeWords } from 'utils/stringUtils'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { dealerBrandLocationUrl, dealerBrandUrl } from 'utils/helpers/routes'
const BrandUsedCarWidget = dynamic(
  () => import('components/molecules').then((mod) => mod.BrandUsedCarWidget),
  { ssr: false },
)

interface DealerSearchWidgetProps {
  cityList: any
  onPage?: string
}

const DealerSearchWidget = ({ cityList, onPage }: DealerSearchWidgetProps) => {
  const router = useRouter()
  const getUrlBrand = router.query.brand?.toString() ?? ''
  const getUrlLocation =
    router.query.location?.toString().replaceAll('-', ' ') ?? ''
  const [dealerCityList, setDealerCityList] = useState([])
  const [isError, setIsError] = useState(false)
  const [intialLoad, setInitialLoad] = useState(true)

  const [brandSelected, setBrandSelected] = useState(
    getUrlBrand ? getUrlBrand : '',
  )
  const [citySelected, setCitySelected] = useState(
    getUrlLocation ? capitalizeWords(getUrlLocation) : '',
  )

  const brandPlaceholder = () => {
    if (brandSelected !== '') {
      const capitalizedBrands =
        brandSelected.toLowerCase() === 'bmw'
          ? brandSelected.toUpperCase()
          : capitalizeWords(brandSelected)
      return capitalizedBrands
    }

    return 'Pilih merek'
  }

  const submit = () => {
    if (brandSelected !== '' && citySelected !== ('' || 'Indonesia')) {
      const brandCityDealerRoute = dealerBrandLocationUrl
        .replace(':brand', brandSelected)
        .replace(':location', citySelected.replace(/ /g, '-').toLowerCase())
        .toLowerCase()
      window.location.href = brandCityDealerRoute
    } else if (brandSelected !== '') {
      const brandDealerRoute = dealerBrandUrl
        .replace(
          ':brand',
          brandSelected === 'bmw'
            ? brandSelected.toUpperCase()
            : capitalizeWords(brandSelected),
        )
        .toLowerCase()
      window.location.href = brandDealerRoute
    } else {
      setIsError(true)
    }
  }

  useEffect(() => {
    if (getUrlBrand !== '') {
      setBrandSelected(
        getUrlBrand === 'bmw'
          ? getUrlBrand.toUpperCase()
          : capitalizeWords(getUrlBrand),
      )
    }
  }, [getUrlBrand])

  useEffect(() => {
    if (getUrlLocation !== '') {
      setCitySelected(capitalizeWords(getUrlLocation))
    }
  }, [getUrlLocation])

  useEffect(() => {
    if (brandSelected !== '') {
      getDealer(
        `?brand=${
          brandSelected === 'bmw'
            ? brandSelected.toUpperCase()
            : capitalizeWords(brandSelected)
        }`,
      ).then((res: any) => {
        setDealerCityList(res.data)
        if (intialLoad) {
          setCitySelected(capitalizeWords(getUrlLocation))
          setInitialLoad(false)
        } else {
          setCitySelected('')
        }
      })
    } else if (brandSelected === '') {
      setCitySelected('')
      setDealerCityList([])
    }
  }, [brandSelected])

  useEffect(() => {
    setDealerCityList(cityList)
  }, [cityList])

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
              brandSelected={brandSelected.toLowerCase()}
              setBrandSelected={setBrandSelected}
            />
          )}
          datatestid={elementId.FilterMerek}
          isValue={brandSelected !== ''}
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
