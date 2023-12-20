import {
  ExteriorTab,
  InteriorTab,
  WarnaTab,
  Exterior360ViewerTab,
  Interior360ViewerTab,
  VideoTab,
  CarOverview,
} from 'components/organisms'
import React, { useEffect, useMemo, useState } from 'react'
import { upperSectionNavigationTab } from 'config/carVariantList.config'
import { NavigationTabV2 } from 'components/molecules'
import { CityOtrOption, VideoDataType } from 'utils/types/utils'
import styles from 'styles/components/organisms/pdpUpperSection.module.scss'
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

interface Props {
  emitActiveIndex: (e: number) => void
  emitDataImages: (e: Array<string>) => void
  activeIndex: number
  isPreviewOpened: boolean
  videoData: VideoDataType
  onClickCityOtrCarOverview: () => void
  onClickShareButton: () => void
  isShowAnnouncementBox: boolean | null
  isOTO?: boolean
  onChangeTab: (value: any) => void
  cityOtr?: CityOtrOption
}

export const PdpUpperSection = ({
  emitActiveIndex,
  emitDataImages,
  activeIndex,
  isPreviewOpened,
  videoData,
  onClickCityOtrCarOverview,
  onClickShareButton,
  isShowAnnouncementBox,
  isOTO = false,
  onChangeTab,
  cityOtr,
}: Props) => {
  const router = useRouter()
  const { slug } = router.query || []
  const [currentCityOtr, setCurrentCityOtr] = useState(cityOtr ?? getCity())

  const validateSlug = (slug: Array<string>, dataFilter: any) => {
    if (slug) {
      var data = dataFilter.filter((item: any) => {
        var data = slug.filter((items: any) => items === item.value)
        return data.length > 0
      })
      return {
        isValid: data.length !== 0,
        data: data[0] ?? dataFilter[0],
      }
    } else
      return {
        isValid: false,
        data: upperSectionNavigationTab[0],
      }
  }

  const [selectedTabValue, setSelectedTabValue] = useState<any>(
    upperSectionNavigationTab[0].value,
  )

  useEffect(() => {
    if (cityOtr) setCurrentCityOtr(cityOtr)
  }, [cityOtr])

  const getImageExterior360 = () => {
    const currentUrlPathname = router.asPath
    const temp = exteriorImagesListNew.filter((item) =>
      currentUrlPathname.includes(item.url),
    )
    if (temp.length === 0) return []
    return temp[0].source
  }

  const getImageInterior360 = () => {
    const currentUrlPathname = router.asPath
    const temp = interiorImagesListNew.filter((item) =>
      currentUrlPathname.includes(item.url),
    )
    if (temp.length === 0) return ''
    return temp[0].source
  }

  const { carModelDetails } = useCar()

  const getInteriorImage = () => {
    const { images: carModelImages } = { ...carModelDetails }
    if (carModelImages) {
      const interior = carModelImages.filter((item: string) =>
        item.toLowerCase().includes('int'),
      )
      return [...interior]
    }
  }

  const filterTabItem = () => {
    let temp = upperSectionNavigationTab
    if (!getImageExterior360() || getImageExterior360().length === 0) {
      temp = temp.filter((item: any) => item.value !== '360-eksterior')
    }
    if (!getImageInterior360()) {
      temp = temp.filter((item: any) => item.value !== '360-interior')
    }
    if (videoData.videoId === '') {
      temp = temp.filter((item: any) => item.value !== 'video')
    }
    if (getInteriorImage()?.length === 0) {
      temp = temp.filter((item: any) => item.value !== 'interior')
    }
    return temp
  }

  const tabItemList = useMemo(() => {
    return filterTabItem()
  }, [videoData, carModelDetails])

  const onSelectTab = (value: any) => {
    setSelectedTabValue(value)
    onChangeTab(value)
    trackEventCountly(CountlyEventNames.WEB_PDP_VISUAL_TAB_CLICK, {
      VISUAL_TAB_CATEGORY: value,
    })
  }

  const renderContent = () => {
    switch (selectedTabValue) {
      case 'warna':
        return (
          <WarnaTab
            isShowAnnouncementBox={isShowAnnouncementBox}
            isOTO={isOTO}
          />
        )
      case 'eksterior':
        return (
          <ExteriorTab
            isPreviewOpened={isPreviewOpened}
            emitActiveIndex={emitActiveIndex}
            emitDataImages={emitDataImages}
            activeIndex={activeIndex}
            isShowAnnouncementBox={isShowAnnouncementBox}
          />
        )
      case 'interior':
        return (
          <InteriorTab
            emitDataImages={emitDataImages}
            isPreviewOpened={isPreviewOpened}
            emitActiveIndex={emitActiveIndex}
            activeIndex={activeIndex}
            isShowAnnouncementBox={isShowAnnouncementBox}
          />
        )
      case 'video':
        return (
          <VideoTab
            data={videoData}
            isShowAnnouncementBox={isShowAnnouncementBox}
          />
        )
      case '360-eksterior':
        return (
          <Exterior360ViewerTab isShowAnnouncementBox={isShowAnnouncementBox} />
        )
      case '360-interior':
        return (
          <Interior360ViewerTab isShowAnnouncementBox={isShowAnnouncementBox} />
        )
      default:
        return (
          <WarnaTab
            isShowAnnouncementBox={isShowAnnouncementBox}
            isOTO={isOTO}
          />
        )
    }
  }

  useEffect(() => {
    setSelectedTabValue(
      validateSlug(slug as Array<string>, tabItemList).data.value,
    )
  }, [tabItemList])

  return (
    <div>
      <div className={styles.upperSpacing} />
      <NavigationTabV2
        itemList={filterTabItem()}
        initialTab={selectedTabValue}
        onSelectTab={(value: any) => onSelectTab(value)}
        isShowAnnouncementBox={isShowAnnouncementBox}
        onPage={'PDP'}
      />
      <div id="pdp-upper-content">
        <>
          <div className={styles.content}>{renderContent()}</div>
          <CarOverview
            onClickCityOtrCarOverview={onClickCityOtrCarOverview}
            onClickShareButton={onClickShareButton}
            currentTabMenu={selectedTabValue}
            isOTO={isOTO}
            cityOtr={currentCityOtr}
          />
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
