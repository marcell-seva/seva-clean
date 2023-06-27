import React from 'react'
import styles from '../../../styles/saas/components/atoms/Shimmer.module.scss'
import { useIsMobile } from 'utils'

const ShimmerCardProduct: React.FC = (): JSX.Element => {
  const isMobile = useIsMobile()
  return isMobile ? (
    <div className={styles.card}>
      <seva-shimmer width="140px" height="90px" />
      <div className={styles.cardChild}>
        <seva-shimmer rounded="8px" width="80%" />
      </div>
      <div className={styles.cardChild}>
        <seva-shimmer rounded="8px" width="60%" />
      </div>
    </div>
  ) : (
    <div className={styles.card}>
      <seva-shimmer width="264px" height="180px" />
      <div className={styles.cardChild}>
        <seva-shimmer height="30px" width="80%" rounded="10px" />
      </div>
      <div className={styles.cardChild}>
        <seva-shimmer height="30px" width="60%" rounded="10px" />
      </div>
    </div>
  )
}

const ShimmerCardArticle: React.FC = (): JSX.Element => {
  const isMobile = useIsMobile()
  return isMobile ? (
    <div className={styles.article}>
      <seva-shimmer width="86px" height="86px" rounded="10px" />
      <div className={styles.articleWrapper}>
        <div className={styles.articleWrapperChild}>
          <seva-shimmer width="200px" height="15px" rounded="5px" />
        </div>
        <div className={styles.articleWrapperChild}>
          <seva-shimmer width="120px" height="15px" rounded="5px" />
        </div>
        <div className={styles.articleWrapperChild}>
          <seva-shimmer width="80px" height="20px" rounded="5px" />
        </div>
      </div>
    </div>
  ) : (
    <div className={styles.article}>
      <seva-shimmer width="240px" height="134px" rounded="20px" />
      <div className={styles.articleWrapperChild}>
        <seva-shimmer rounded="10px" width="80%" height="20px" />
      </div>
      <div className={styles.articleWrapperChild}>
        <seva-shimmer rounded="10px" width="60%" height="20px" />
      </div>
    </div>
  )
}
export { ShimmerCardProduct, ShimmerCardArticle }
