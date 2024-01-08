import React, { useRef, useState } from 'react'
import styles from 'styles/components/molecules/dealerCarousel.module.scss'
import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode, Thumbs, Navigation } from 'swiper'
import 'swiper/css'
import 'swiper/css/free-mode'
import 'swiper/css/navigation'
import 'swiper/css/thumbs'
import { dealerBrandLocationUrl } from 'utils/helpers/routes'
import { useRouter } from 'next/router'
import { DealerBrand } from 'utils/types/utils'

interface PropsCarousel {
  items: DealerBrand[]
  brand: string
}

const DealerCarousel = ({ items, brand }: PropsCarousel) => {
  const router = useRouter()
  const getUrlBrand = router.query.brand?.toString() ?? ''

  const onClick = (loc: string) => {
    const brandCarRoute = dealerBrandLocationUrl
      .replace(':brand', getUrlBrand)
      .replace(':location', loc.replace(/ /g, '-').toLowerCase())
      .toLowerCase()
    router.push(brandCarRoute)
  }

  const DealerCard: React.FC<DealerBrand> = ({
    cityName,
    makeName,
    totalBranch,
  }): JSX.Element => (
    <div className={styles.cardWrapper} onClick={() => onClick(cityName)}>
      <div className={styles.cardTitle}>{cityName}</div>
      <div className={styles.cardDesc}>
        {totalBranch} Dealer Mobil {brand}
      </div>
    </div>
  )

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.wrapperTitle}>
        Dealer Mobil {brand} di Kota Besar
      </h2>
      {items.length > 0 ? (
        <Swiper
          slidesPerView={'auto'}
          spaceBetween={12}
          className={styles.thumbsSwiper}
          freeMode={true}
          modules={[FreeMode, Navigation, Thumbs]}
          pagination={{
            clickable: true,
          }}
        >
          {items.map((item: DealerBrand, index: number) => (
            <SwiperSlide className={styles.previewSubImageWrapper} key={index}>
              <DealerCard
                cityName={item.cityName}
                makeName={item.makeName}
                totalBranch={item.totalBranch}
                cityCode={item.cityCode}
                cityId={item.cityId}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div>Dealer tidak tersedia</div>
      )}
    </div>
  )
}

export default DealerCarousel
