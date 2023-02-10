import React from 'react'
import {
  ShimmerThumbnail,
  ShimmerTitle,
  ShimmerText,
} from 'react-shimmer-effects'
import styles from '../../../styles/atoms/Shimmer.module.css'
import { useIsMobile } from '../../../utils'
export function ShimmerCardProduct({}) {
  const isMobile = useIsMobile()
  return isMobile ? (
    <div className={styles.cardShimmer}>
      <ShimmerThumbnail width={140} height={90} rounded />
      <ShimmerTitle rounded line={2} className={styles.cardShimmerChild} />
    </div>
  ) : (
    <div className={styles.cardShimmer}>
      <ShimmerThumbnail width={264} height={180} rounded />
      <ShimmerTitle
        height={30}
        rounded
        line={2}
        className={styles.cardShimmerChild}
      />
    </div>
  )
}
