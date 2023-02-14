import React from 'react'
import {
  ShimmerThumbnail,
  ShimmerTitle,
  ShimmerButton,
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

export function ShimmerCardArticle({}) {
  const isMobile = useIsMobile()
  return isMobile ? (
    <div className={styles.cardArticleShimmer}>
      <ShimmerThumbnail width={86} height={86} rounded />
      <div className={styles.articleChildWrapper}>
        <ShimmerThumbnail
          width={200}
          height={15}
          rounded
          className={styles.articleChild}
        />
        <ShimmerThumbnail
          width={120}
          height={15}
          rounded
          className={styles.articleChild}
        />
        <ShimmerThumbnail
          width={80}
          height={20}
          rounded
          className={styles.articleChild}
        />
      </div>
    </div>
  ) : (
    <div className={styles.cardArticleShimmer}>
      <ShimmerThumbnail width={240} height={134} rounded />
      <ShimmerTitle rounded line={2} className={styles.cardChildArticle} />
    </div>
  )
}
