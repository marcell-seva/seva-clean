import {
  ExteriorTab,
  InteriorTab,
  WarnaTab,
  Exterior360ViewerTab,
  Interior360ViewerTab,
  VideoTab,
  CarOverview,
  SearchWidget,
} from 'components/organisms'
import React, { useEffect, useMemo, useState } from 'react'
import { upperSectionNavigationTab } from 'config/carVariantList.config'
import { NavigationTabUsedCar, NavigationTabV2 } from 'components/molecules'
import { CityOtrOption, VideoDataType } from 'utils/types/utils'
import styles from 'styles/components/organisms/searchWidgetSection.module.scss'
import { exteriorImagesListNew } from 'config/Exterior360ImageList.config'
import { interiorImagesListNew } from 'config/Interior360ImageList.config'
import { useLocalStorage } from 'utils/hooks/useLocalStorage'
import { LocalStorageKey } from 'utils/enum'
import { useRouter } from 'next/router'
import { useCar } from 'services/context/carContext'
import { trackEventCountly } from 'helpers/countly/countly'
import { CountlyEventNames } from 'helpers/countly/eventNames'
import { getCity } from 'utils/hooks/useGetCity'
import { capitalizeFirstLetter } from 'utils/stringUtils'
// import UsedCarSearchWidget from '../searchWidget/usedCarSearchWidget'
import { upperSearchNavigationTab } from 'config/searchWidget.config'
import { usedCar } from 'services/context/usedCarContext'
import dynamic from 'next/dynamic'

const UsedCarSearchWidget = dynamic(
  () => import('components/organisms').then((mod) => mod.UsedCarSearchWidget),
  { ssr: false },
)

interface Props {
  isShowAnnouncementBox: boolean | null
  isOTO?: boolean
  onChangeTab: (value: any) => void
  cityOtr?: CityOtrOption
}

export const SearchWidgetSection = ({
  isShowAnnouncementBox,
  isOTO = false,
  onChangeTab,
  cityOtr,
}: Props) => {
  const router = useRouter()
  const { slug } = router.query
  const [upperTabSlug] = Array.isArray(slug) ? slug : []
  const [currentCityOtr, setCurrentCityOtr] = useState(cityOtr ?? getCity())
  const [selectedTabValue, setSelectedTabValue] = useState(
    upperTabSlug
      ? capitalizeSlugIf360(upperTabSlug)
      : upperSectionNavigationTab[0].value,
  )

  useEffect(() => {
    if (cityOtr) setCurrentCityOtr(cityOtr)
  }, [cityOtr])

  // const getImageExterior360 = () => {
  //   const currentUrlPathname = router.asPath
  //   const temp = exteriorImagesListNew.filter((item) =>
  //     currentUrlPathname.includes(item.url),
  //   )
  //   if (temp.length === 0) return []
  //   return temp[0].source
  // }

  // const getImageInterior360 = () => {
  //   const currentUrlPathname = router.asPath
  //   const temp = interiorImagesListNew.filter((item) =>
  //     currentUrlPathname.includes(item.url),
  //   )
  //   if (temp.length === 0) return ''
  //   return temp[0].source
  // }

  const { carModelDetails } = usedCar()

  // const getInteriorImage = () => {
  //   const { images: carModelImages } = { ...carModelDetails }
  //   if (carModelImages) {
  //     const interior = carModelImages.filter((item: string) =>
  //       item.toLowerCase().includes('int'),
  //     )
  //     return [...interior]
  //   }
  // }

  const filterTabItem = () => {
    let temp = upperSearchNavigationTab

    return temp
  }

  const tabItemList = useMemo(() => {
    return filterTabItem()
  }, [carModelDetails])

  const onSelectTab = (value: any) => {
    setSelectedTabValue(value)
    onChangeTab(value)
    trackEventCountly(CountlyEventNames.WEB_PDP_VISUAL_TAB_CLICK, {
      VISUAL_TAB_CATEGORY: value,
    })
  }

  const renderContent = () => {
    switch (selectedTabValue) {
      case 'Mobil Baru':
        return <SearchWidget />
      case 'Mobil Bekas':
        return <UsedCarSearchWidget />

      default:
        return <SearchWidget />
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.upperSpacing} />
      <div id="pdp-upper-content">
        <NavigationTabUsedCar
          itemList={tabItemList}
          initialTab={upperTabSlug && capitalizeSlugIf360(upperTabSlug)}
          onSelectTab={(value: any) => onSelectTab(value)}
          isShowAnnouncementBox={isShowAnnouncementBox}
          onPage={'PDP'}
        />
        <>
          <div className={styles.content}>{renderContent()}</div>
        </>
      </div>
    </div>
  )
}

const capitalizeSlugIf360 = (slug: string) => {
  if (slug.toLocaleLowerCase() == '360º eksterior') {
    return slug.slice(0, 4) + ' ' + slug.charAt(5).toUpperCase() + slug.slice(6)
  }
  return capitalizeFirstLetter(slug)
}
