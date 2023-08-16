import { Skeleton } from 'components/atoms'
import React from 'react'
import styles from 'styles/components/organisms/plpSkeleton.module.scss'
import { CarDetailLoad } from '../carDetailLoad'

export const MultiUnitSkeleton = () => {
  return (
    <>
      <div className={styles.filterWrapper}>
        <Skeleton
          width={254}
          height={20}
          style={{ marginBottom: 8, borderRadius: 8 }}
        />
        <Skeleton
          width={100}
          height={20}
          style={{ marginBottom: 15, borderRadius: 8 }}
        />
        <Skeleton
          width={'90%'}
          height={10}
          style={{ marginBottom: 10, borderRadius: 8 }}
        />
        <Skeleton
          width={'60%'}
          height={10}
          style={{ marginBottom: 13, borderRadius: 8 }}
        />
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
