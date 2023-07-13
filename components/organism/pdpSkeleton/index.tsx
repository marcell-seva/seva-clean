import React from 'react'
import CarDetailLoad from '../carDetailLoadPdp'
import styles from 'styles/components/organism/pdpSkeleton.module.scss'
import { Skeleton } from 'components/atoms'

const PdpSkeleton = () => {
  return (
    <>
      <div className={styles.filterWrapperPdp}>
        <Skeleton width={'100%'} height={22} />
      </div>
      <div className={styles.carWrapper}>
        <CarDetailLoad />
      </div>
    </>
  )
}

export default PdpSkeleton
