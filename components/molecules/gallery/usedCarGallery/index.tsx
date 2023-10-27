import React, { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { Swiper as SwiperType } from 'swiper'
import { FreeMode, Thumbs, Navigation } from 'swiper'
import styles from 'styles/components/molecules/usedCarGallery.module.scss'
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
import { useLocalStorage } from 'utils/hooks/useLocalStorage'
import { LocalStorageKey } from 'utils/enum'
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
import { usedCar } from 'services/context/usedCarContext'

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

export const UsedCarGallery: React.FC<PropsGallery> = ({
  items,
  emitActiveIndex,
  emitDataImages,
  activeIndex,
  onTab,
}): JSX.Element => {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null)
  const [flagIndex, setFlagIndex] = useState<number>(activeIndex)
  const { detail } = usedCar()
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
      CAR_BRAND: detail?.brandName ?? '',
      CAR_MODEL: detail?.modelName ?? '',
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
      CAR_BRAND: detail?.brandName ?? '',
      CAR_MODEL: detail?.modelName ?? '',
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
      alt={`Tampilan ${detail?.brandName} ${detail?.variantTitle}`}
      className={styles.mainImage}
      src={url}
      onClick={() => {
        emitDataImages(items)
        emitActiveIndex(flagIndex)
        setThumbsSwiper(null)
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
          alt={`Tampilan ${detail?.brandName} ${detail?.variantTitle}`}
          className={`${isActive && styles.active} ${styles.subImage}`}
          src={url}
        />
      </div>
    )
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.wrapperMain}>
        <>
          <div
            className={`icon-gallery-prev ${styles.buttonPrevMain}`}
            onClick={() => {
              setOnClickMainArrowPhoto(true)
            }}
            data-testid={elementId.PDP.Button.PreviousMainPicture}
          >
            <IconChevronLeft width={16} height={16} color="#FFFFFF" />
          </div>
          <div
            className={`icon-gallery-next ${styles.buttonNextMain}`}
            onClick={() => {
              setOnClickMainArrowPhoto(true)
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
          {items?.map((item: any, key: number) => (
            <SwiperSlide key={key}>
              <MainImage url={item} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className={styles.wrapperPagination}>
        {items.length > 0 && (
          <Swiper
            initialSlide={flagIndex}
            onSwiper={(swiper: SwiperType | null) => setThumbsSwiper(swiper)}
            pagination={{
              clickable: true,
            }}
            className={`subGallery ${styles.thumbsSwiper}`}
            slidesPerView={'auto'}
            spaceBetween={8}
            freeMode={true}
            modules={[FreeMode, Navigation, Thumbs]}
          >
            {items?.map((item: string, key: number) => (
              <SwiperSlide
                key={key}
                onClick={() => {
                  setOnClickSubPhoto(true)
                  trackCountlyCarouselImage(key)
                }}
                className={styles.previewSubImageWrapper}
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
