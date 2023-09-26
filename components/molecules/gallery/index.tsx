import React, { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { Swiper as SwiperType } from 'swiper'
import { FreeMode, Thumbs, Navigation } from 'swiper'
import styles from 'styles/components/molecules/gallery.module.scss'

import 'swiper/css'
import 'swiper/css/free-mode'
import 'swiper/css/navigation'
import 'swiper/css/thumbs'

import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronUp,
  IconExpand,
} from 'components/atoms'
import {
  CarVariantPhotoParam,
  trackPDPPhotoClick,
  trackPDPPhotoSwipe,
} from 'helpers/amplitude/seva20Tracking'
import { useLocalStorage } from 'utils/hooks/useLocalStorage'
import { LocalStorageKey } from 'utils/enum'
import {
  TrackingEventName,
  TrackingEventWebPDPPhoto,
} from 'helpers/amplitude/eventTypes'
import { isIphone } from 'utils/window'
import elementId from 'helpers/elementIds'
import { CityOtrOption } from 'utils/types/utils'
import { useCar } from 'services/context/carContext'
import {
  trackEventCountly,
  valueMenuTabCategory,
} from 'helpers/countly/countly'
import { CountlyEventNames } from 'helpers/countly/eventNames'
import { useRouter } from 'next/router'
import { LoanRank } from 'utils/types/models'
import { getLocalStorage } from 'utils/handler/localStorage'
import Image from 'next/image'

interface PropsGallery {
  items: Array<string>
  emitActiveIndex: any
  emitDataImages: any
  activeIndex: number
  onTab?: string
}
interface PropsGalleryMainImage {
  url: string
}

export const Gallery: React.FC<PropsGallery> = ({
  items,
  emitActiveIndex,
  emitDataImages,
  activeIndex,
  onTab,
}): JSX.Element => {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null)
  const [flagIndex, setFlagIndex] = useState<number>(activeIndex)
  const { carModelDetails } = useCar()
  const [cityOtr] = useLocalStorage<CityOtrOption | null>(
    LocalStorageKey.CityOtr,
    null,
  )
  const [onClickSubPhoto, setOnClickSubPhoto] = useState(true)
  const [onClickMainArrowPhoto, setOnClickMainArrowPhoto] = useState(true)
  const filterStorage: any = getLocalStorage(LocalStorageKey.CarFilter)

  const isUsingFilterFinancial =
    !!filterStorage?.age &&
    !!filterStorage?.downPaymentAmount &&
    !!filterStorage?.monthlyIncome &&
    !!filterStorage?.tenure

  const router = useRouter()
  const upperTab = router.query.tab as string
  const loanRankcr = router.query.loanRankCVL ?? ''

  const getCreditBadgeForCountly = () => {
    let creditBadge = 'Null'
    if (loanRankcr && loanRankcr.includes(LoanRank.Green)) {
      creditBadge = 'Mudah disetujui'
    } else if (loanRankcr && loanRankcr.includes(LoanRank.Red)) {
      creditBadge = 'Sulit disetujui'
    }
    return creditBadge
  }

  const trackCountlyMainImage = () => {
    trackEventCountly(CountlyEventNames.WEB_PDP_MAIN_PHOTO_CLICK, {
      CAR_BRAND: carModelDetails?.brand ?? '',
      CAR_MODEL: carModelDetails?.model ?? '',
      MENU_TAB_CATEGORY: valueMenuTabCategory(),
      CAR_PHOTO_ORDER: flagIndex + 1,
      VISUAL_TAB_CATEGORY: upperTab ? upperTab : 'Warna',
      PELUANG_KREDIT_BADGE: isUsingFilterFinancial
        ? getCreditBadgeForCountly()
        : 'Null',
    })
  }

  const trackCountlyCarouselImage = (index: number) => {
    trackEventCountly(CountlyEventNames.WEB_PDP_CAROUSEL_PHOTO_CLICK, {
      CAR_BRAND: carModelDetails?.brand ?? '',
      CAR_MODEL: carModelDetails?.model ?? '',
      PELUANG_KREDIT_BADGE: isUsingFilterFinancial
        ? getCreditBadgeForCountly()
        : 'Null',
      CAR_PHOTO_ORDER: index + 1,
      VISUAL_TAB_CATEGORY: upperTab ? upperTab : 'Warna',
      MENU_TAB_CATEGORY: valueMenuTabCategory(),
    })
  }

  const MainImage: React.FC<PropsGalleryMainImage> = ({ url }): JSX.Element => (
    <Image
      width={274}
      height={207}
      alt={`Tampilan ${onTab === 'Exterior' ? 'Eksterior' : 'Interior'} ${
        carModelDetails?.brand
      } ${carModelDetails?.model.replace('-', ' ')} ${
        url.match(/_(\d+)\.\w+$/)?.[1] ?? 'main'
      }`}
      className={styles.mainImage}
      src={url}
      onClick={() => {
        emitDataImages(items)
        emitActiveIndex(flagIndex)
        setThumbsSwiper(null)
        trackEventPhoto(
          onTab,
          url,
          TrackingEventName.WEB_PDP_GALLERY_MAIN_PHOTO_CLICK,
        )
        trackCountlyMainImage()
      }}
      data-testid={elementId.MainPicture}
    />
  )

  const CoverSubImage = ({ isActive, url }: any): JSX.Element => {
    return (
      <div className={styles.subImageWrapper}>
        {!isActive && <div className={styles.coverSubImage} />}
        <Image
          width={61}
          height={46}
          alt={`Tampilan ${onTab === 'Exterior' ? 'Eksterior' : 'Interior'} ${
            carModelDetails?.brand
          } ${carModelDetails?.model.replace('-', ' ')} ${
            url.match(/_(\d+)\.\w+$/)?.[1] ?? 'main'
          }`}
          className={`${isActive && styles.active} ${styles.subImage}`}
          src={url}
        />
      </div>
    )
  }

  const trackEventPhoto = (
    photoType: string | undefined,
    imgUrl: string,
    eventName: TrackingEventWebPDPPhoto,
  ) => {
    const trackProperties: CarVariantPhotoParam = {
      Car_Brand: carModelDetails?.brand as string,
      Car_Model: carModelDetails?.model as string,
      Page_Origination_URL: window.location.href.replace('https://www.', ''),
      Photo_Type: photoType,
      City: cityOtr?.cityName || 'null',
      Image_URL: imgUrl,
    }
    trackPDPPhotoClick(eventName, trackProperties)
  }

  const trackEventSwipePhoto = (
    photoType: string | undefined,
    eventName: TrackingEventWebPDPPhoto,
  ) => {
    const trackProperties: CarVariantPhotoParam = {
      Car_Brand: carModelDetails?.brand as string,
      Car_Model: carModelDetails?.model as string,
      Page_Origination_URL: window.location.href.replace('https://www.', ''),
      Photo_Type: photoType,
      City: cityOtr?.cityName || 'null',
    }
    trackPDPPhotoSwipe(eventName, trackProperties)
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.wrapperMain}>
        <>
          <div
            className={`icon-gallery-prev ${styles.buttonPrevMain}`}
            onClick={() => {
              setOnClickMainArrowPhoto(true)
              trackEventSwipePhoto(
                onTab,
                TrackingEventName.WEB_PDP_GALLERY_MAIN_PHOTO_SWIPE,
              )
            }}
            data-testid={elementId.PDP.Button.PreviousMainPicture}
          >
            <IconChevronLeft width={16} height={16} color="#FFFFFF" />
          </div>
          <div
            className={`icon-gallery-next ${styles.buttonNextMain}`}
            onClick={() => {
              setOnClickMainArrowPhoto(true)
              trackEventSwipePhoto(
                onTab,
                TrackingEventName.WEB_PDP_GALLERY_MAIN_PHOTO_SWIPE,
              )
            }}
            data-testid={elementId.PDP.Button.NextMainPicture}
          >
            <IconChevronRight width={16} height={16} color="#FFFFFF" />
          </div>
          <div
            className={styles.expandButton}
            onClick={() => {
              emitDataImages(items)
              emitActiveIndex(flagIndex)
              setThumbsSwiper(null)
            }}
            data-testid={elementId.PDP.Button.FocusMode}
          >
            <IconExpand width={24} height={24} color="#FFFFFF" />
          </div>
        </>

        <Swiper
          initialSlide={flagIndex}
          onTouchStart={() => {
            if (!isIphone) {
              setOnClickSubPhoto(false)
              setOnClickMainArrowPhoto(false)
            }
          }}
          onSlideChangeTransitionEnd={() => {
            if (!onClickSubPhoto && !onClickMainArrowPhoto) {
              trackEventSwipePhoto(
                onTab,
                TrackingEventName.WEB_PDP_GALLERY_MAIN_PHOTO_SWIPE,
              )
            }
          }}
          onActiveIndexChange={(swiper: SwiperType) => {
            setFlagIndex(swiper.realIndex)
          }}
          spaceBetween={10}
          thumbs={{
            swiper:
              thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
          }}
          modules={[FreeMode, Navigation, Thumbs]}
          className="mainGallery"
          navigation={{
            nextEl: '.icon-gallery-next',
            prevEl: '.icon-gallery-prev',
          }}
        >
          {items?.map((item: string, key: number) => (
            <SwiperSlide key={key}>
              <MainImage url={item} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className={styles.wrapperPagination}>
        <>
          <div className={`icon-thumbs-prev ${styles.buttonPrevPagination}`}>
            <IconChevronUp
              width={16}
              height={16}
              color="#FFFFFF"
              onClick={() => {
                if (!onClickSubPhoto) {
                  trackEventSwipePhoto(
                    onTab,
                    TrackingEventName.WEB_PDP_CAROUSEL_PHOTO_SWIPE,
                  )
                }
              }}
            />
          </div>
          <div className={`icon-thumbs-next ${styles.buttonNextPagination}`}>
            <IconChevronDown
              width={16}
              height={16}
              color="#FFFFFF"
              onClick={() => {
                if (!onClickSubPhoto) {
                  trackEventSwipePhoto(
                    onTab,
                    TrackingEventName.WEB_PDP_CAROUSEL_PHOTO_SWIPE,
                  )
                }
              }}
            />
          </div>
        </>
        {items.length > 0 && (
          <Swiper
            initialSlide={flagIndex}
            onSwiper={(swiper: SwiperType | null) => setThumbsSwiper(swiper)}
            onNavigationPrev={(swiper: SwiperType | null) =>
              setThumbsSwiper(swiper)
            }
            onNavigationNext={(swiper: SwiperType | null) =>
              setThumbsSwiper(swiper)
            }
            direction={'vertical'}
            pagination={{
              clickable: true,
            }}
            className={`subGallery ${styles.thumbsSwiper}`}
            spaceBetween={8}
            slidesPerView={4}
            navigation={{
              nextEl: '.icon-thumbs-next',
              prevEl: '.icon-thumbs-prev',
            }}
            freeMode={true}
            modules={[FreeMode, Navigation, Thumbs]}
            onTouchMove={() => setOnClickSubPhoto(false)}
            onSlideChangeTransitionEnd={() => {
              if (!onClickSubPhoto) {
                trackEventSwipePhoto(
                  onTab,
                  TrackingEventName.WEB_PDP_CAROUSEL_PHOTO_SWIPE,
                )
              }
            }}
          >
            {items?.map((item: string, key: number) => (
              <SwiperSlide
                key={key}
                onClick={() => {
                  setOnClickSubPhoto(true)
                  trackEventPhoto(
                    onTab,
                    item,
                    TrackingEventName.WEB_PDP_CAROUSEL_PHOTO_CLICK,
                  )
                  trackCountlyCarouselImage(key)
                }}
              >
                <CoverSubImage url={item} isActive={flagIndex === key} />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </div>
  )
}
