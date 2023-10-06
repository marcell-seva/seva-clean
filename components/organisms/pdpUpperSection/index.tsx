import {
  ExteriorTab,
  InteriorTab,
  WarnaTab,
  Exterior360ViewerTab,
  Interior360ViewerTab,
  VideoTab,
  CarOverview,
} from 'components/organisms'
import React, { useEffect, useState } from 'react'
import { upperSectionNavigationTab } from 'config/carVariantList.config'
import { NavigationTabV2 } from 'components/molecules'
import { CityOtrOption, VideoDataType } from 'utils/types/utils'
import styles from 'styles/components/organisms/pdpUpperSection.module.scss'
import { exteriorImagesListNew } from 'config/Exterior360ImageList.config'
import { interiorImagesListNew } from 'config/Interior360ImageList.config'
import {
  TrackingEventName,
  TrackingEventWebPDPPhoto,
} from 'helpers/amplitude/eventTypes'
import {
  CarVariantPhotoParam,
  trackPDPPhotoClick,
} from 'helpers/amplitude/seva20Tracking'
import { useLocalStorage } from 'utils/hooks/useLocalStorage'
import { LocalStorageKey } from 'utils/enum'
import { useRouter } from 'next/router'
import { useCar } from 'services/context/carContext'
import { trackEventCountly } from 'helpers/countly/countly'
import { CountlyEventNames } from 'helpers/countly/eventNames'

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
}: Props) => {
  const router = useRouter()

  const upperTab = router.query.tab as string

  const [selectedTabValue, setSelectedTabValue] = useState(
    upperTab || upperSectionNavigationTab[0].value,
  )

  const [cityOtr] = useLocalStorage<CityOtrOption | null>(
    LocalStorageKey.CityOtr,
    null,
  )

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
      temp = temp.filter((item: any) => item.value !== '360º Eksterior')
    }
    if (!getImageInterior360()) {
      temp = temp.filter((item: any) => item.value !== '360º Interior')
    }
    if (videoData.videoId === '') {
      temp = temp.filter((item: any) => item.value !== 'Video')
    }
    if (getInteriorImage()?.length === 0) {
      temp = temp.filter((item: any) => item.value !== 'Interior')
    }
    return temp
  }

  const [tabItemList] = useState(filterTabItem())

  const trackEventPhoto = (
    event: TrackingEventWebPDPPhoto,
    photoType: string,
  ) => {
    const trackProperties: CarVariantPhotoParam = {
      Car_Brand: carModelDetails?.brand as string,
      Car_Model: carModelDetails?.model as string,
      Page_Origination_URL: window.location.href.replace('https://www.', ''),
      Photo_Type: photoType,
      City: cityOtr?.cityName || 'null',
    }
    trackPDPPhotoClick(event, trackProperties)
  }

  useEffect(() => {
    // useEffect to set tab item hidden or not
    filterTabItem()
  }, [carModelDetails])

  const renderContent = () => {
    switch (selectedTabValue) {
      case 'Warna':
        return (
          <WarnaTab
            isShowAnnouncementBox={isShowAnnouncementBox}
            isOTO={isOTO}
          />
        )
      case 'Eksterior':
        return (
          <ExteriorTab
            isPreviewOpened={isPreviewOpened}
            emitActiveIndex={emitActiveIndex}
            emitDataImages={emitDataImages}
            activeIndex={activeIndex}
            isShowAnnouncementBox={isShowAnnouncementBox}
          />
        )
      case 'Interior':
        return (
          <InteriorTab
            emitDataImages={emitDataImages}
            isPreviewOpened={isPreviewOpened}
            emitActiveIndex={emitActiveIndex}
            activeIndex={activeIndex}
            isShowAnnouncementBox={isShowAnnouncementBox}
          />
        )
      case 'Video':
        return (
          <VideoTab
            data={videoData}
            isShowAnnouncementBox={isShowAnnouncementBox}
          />
        )
      case '360º Eksterior':
        return (
          <Exterior360ViewerTab isShowAnnouncementBox={isShowAnnouncementBox} />
        )
      case '360º Interior':
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

  return (
    <div>
      <div className={styles.upperSpacing} />
      <NavigationTabV2
        itemList={tabItemList}
        onSelectTab={(value: any) => {
          setSelectedTabValue(value)
          router.replace({
            query: {
              ...router.query,
              tab: value,
            },
          })
          trackEventPhoto(TrackingEventName.WEB_PDP_TAB_PHOTO_CLICK, value)
          trackEventCountly(CountlyEventNames.WEB_PDP_VISUAL_TAB_CLICK, {
            VISUAL_TAB_CATEGORY: value,
          })
        }}
        isShowAnnouncementBox={isShowAnnouncementBox}
        onPage={'PDP'}
      />
      <div id="pdp-upper-content">
        <>
          <div className={styles.content}>{renderContent()}</div>
          {/* <CarOverview
            onClickCityOtrCarOverview={onClickCityOtrCarOverview}
            onClickShareButton={onClickShareButton}
            currentTabMenu={selectedTabValue}
            isOTO={isOTO}
          /> */}
        </>
      </div>
    </div>
  )
}
