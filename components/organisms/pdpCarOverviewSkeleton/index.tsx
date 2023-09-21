import React from 'react'
// import CarDetailLoad from '../carDetailLoadPdp'
import styles from 'styles/components/organisms/pdpSkeleton.module.scss'
import { Skeleton } from 'components/atoms'
import Image from 'next/image'

const CarSkeleton = '/revamp/illustration/car-skeleton.webp'

const PdpCarOverviewSkeleton = () => {
  return (
    <div className={styles.carWrapperCarOverview}>
      <Image
        src={CarSkeleton}
        className={styles.heroImg}
        alt={'car skeleton'}
        width={248}
        height={248}
        style={{ marginBottom: 13 }}
      />
      <div className={styles.lineWrapper}>
        <Skeleton width={'100%'} style={{ marginBottom: 13 }} />
        <Skeleton width={'100%'} style={{ marginBottom: 13 }} />
      </div>
    </div>
  )
}

export default PdpCarOverviewSkeleton
