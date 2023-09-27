import React from 'react'
import { Skeleton } from 'components/atoms'
import styles from 'styles/components/organisms/carDetailLoadPdp.module.scss'
import Image from 'next/image'
const CarSkeleton = '/revamp/illustration/car-skeleton.webp'

const CarDetailLoadPdp = () => {
  return (
    <div className={styles.containerPdp}>
      <div className={styles.cardWrapperPdp}>
        <Image
          src={CarSkeleton}
          className={styles.heroImgPdp}
          alt={'car skeleton'}
          width={248}
          height={248}
        />
        <div className={styles.contentWrapperPdp}>
          <Skeleton width={'100%'} style={{ marginBottom: 13 }} />
          <Skeleton width={'100%'} style={{ marginBottom: 13 }} />
          <Skeleton width={'100%'} height={48} style={{ marginBottom: 24 }} />
          <Skeleton width={121} height={36} style={{ marginBottom: 13 }} />
          <div className={styles.rowWrapper}>
            <Skeleton width={121} height={36} />
            <div className={styles.rowFlexEnd}>
              <Skeleton width={121} height={36} />
            </div>
          </div>
          <Skeleton
            width={121}
            height={20}
            style={{ marginBottom: 46, marginTop: 46 }}
          />
          <div className={styles.buttonWrapper}>
            <Skeleton width={'100%'} height={46} />
            <Skeleton width={40} height={46} />
          </div>
          <Skeleton width={'100%'} height={22} style={{ marginTop: 47 }} />
        </div>
      </div>
    </div>
  )
}

export default CarDetailLoadPdp
