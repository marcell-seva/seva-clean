import React from 'react'
import styles from '../../../styles/components/organisms/plpSkeleton.module.scss'
import { Skeleton } from 'components/atoms'
import { CarDetailLoad } from '../carDetailLoad'

export const PLPSkeleton = () => {
  return (
    <>
      <div className={styles.filterWrapper}>
        <Skeleton width={'100%'} height={44} />
        <div className={styles.line} />
        <div className={styles.sortingWrapper}>
          <Skeleton width={151} />
          <Skeleton width={127} />
        </div>
      </div>
      <div className={styles.carWrapper}>
        <CarDetailLoad />
        <CarDetailLoad />
        <CarDetailLoad />
      </div>
    </>
  )
}
