import React, { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { Swiper as SwiperType } from 'swiper'

import styles from 'styles/components/molecules/overlayGallery.module.scss'

import 'swiper/css'
import 'swiper/css/free-mode'
import 'swiper/css/navigation'
import 'swiper/css/thumbs'

import { FreeMode, Navigation, Thumbs } from 'swiper'
import { IconChevronLeft, IconChevronRight } from 'components/atoms'
import elementId from 'helpers/elementIds'
import Image from 'next/image'

interface PropsGallery {
  items: Array<string>
  emitActiveIndex: any
  activeIndex: number
}
interface PropsGalleryMainImage {
  url: string
}

interface PropsGalleryCoverImage {
  isActive: boolean
  url: string
}

export const OverlayGallery: React.FC<PropsGallery> = ({
  items,
  emitActiveIndex,
  activeIndex,
}): JSX.Element => {
  const [thumbsSwiperPreview, setThumbsSwiperPreview] =
    useState<SwiperType | null>(null)
  const [flagIndex, setFlagIndex] = useState<number>(activeIndex)

  const MainImage: React.FC<PropsGalleryMainImage> = ({ url }): JSX.Element => (
    <Image
      width={274}
      height={207}
      alt="car"
      className={styles.mainImage}
      src={url}
      data-testid={elementId.CarouselPicture}
    />
  )
  const CoverPreviewSubImage: React.FC<PropsGalleryCoverImage> = ({
    isActive,
    url,
  }): JSX.Element => {
    return (
      <div className={styles.subImagePreviewActive}>
        {!isActive && <div className={styles.coverImage} />}
        <Image
          width={80}
          height={64}
          alt="car"
          className={`${styles.subImage} ${isActive && styles.active}`}
          src={url}
        />
      </div>
    )
  }

  return (
    <div className={styles.wrapperPreview}>
      <>
        <div
          className={styles.buttonIconLeft}
          onClick={() => {
            setThumbsSwiperPreview(null)
            emitActiveIndex(flagIndex)
          }}
        >
          <IconChevronLeft width={24} height={24} color="#FFFFFF" />
        </div>
        <div
          className={`icon-pagination-prev ${styles.buttonPrevPreview}`}
          data-testid={elementId.PDP.Button.PreviousCarouselPicture}
        >
          <IconChevronLeft width={16} height={16} color="#FFFFFF" />
        </div>
        <div
          className={`icon-pagination-next ${styles.buttonNextPreview}`}
          data-testid={elementId.PDP.Button.NextCarouselPicture}
        >
          <IconChevronRight width={16} height={16} color="#FFFFFF" />
        </div>
      </>
      <Swiper
        className={`mainPreview ${styles.swiperPreview}`}
        initialSlide={flagIndex}
        thumbs={{
          swiper:
            thumbsSwiperPreview && !thumbsSwiperPreview.destroyed
              ? thumbsSwiperPreview
              : null,
        }}
        modules={[FreeMode, Navigation, Thumbs]}
        onActiveIndexChange={(swiper: SwiperType) => {
          setFlagIndex(swiper.realIndex)
        }}
        navigation={{
          nextEl: '.icon-pagination-next',
          prevEl: '.icon-pagination-prev',
        }}
      >
        {items.map((item: string, key: number) => (
          <SwiperSlide key={key}>
            <MainImage url={item} />
          </SwiperSlide>
        ))}
      </Swiper>
      <Swiper
        initialSlide={flagIndex}
        className={`paginationPreview ${styles.swiperPreviewNavigation}`}
        freeMode={true}
        slidesPerView="auto"
        spaceBetween={8}
        modules={[FreeMode, Navigation, Thumbs]}
        onSwiper={(swiper: SwiperType | null) => setThumbsSwiperPreview(swiper)}
        pagination={{
          clickable: true,
        }}
      >
        {items.map((item: string, key: number) => (
          <SwiperSlide key={key} className={styles.previewSubImageWrapper}>
            <CoverPreviewSubImage url={item} isActive={flagIndex === key} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
