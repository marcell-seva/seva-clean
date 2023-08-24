import { IconChevronRight } from 'components/atoms'
import React from 'react'
import { PropsBannerCard } from 'utils/types/props'
import styles from 'styles/components/molecules/card/bannerCard.module.scss'

export const BannerCard: React.FC<PropsBannerCard> = ({
  title,
  subTitle,
  icon,
  onClick,
  isWithoutClick,
  children,
}): JSX.Element => {
  return (
    <div
      onClick={onClick}
      className={
        isWithoutClick
          ? `${styles.container}`
          : `${styles.container} ${styles.pointer}`
      }
    >
      <div className={styles.bundleCard}>
        <div className={styles.content}>
          <div className={styles.icon}>{icon}</div>
          <div className={isWithoutClick ? '' : styles.detail}>
            <p className={styles.titleText}>{title}</p>
            <p className={styles.descText}>{subTitle}</p>
          </div>
        </div>
        {!isWithoutClick && (
          <IconChevronRight width={24} height={24} color="#13131B" />
        )}
      </div>
      {children}
    </div>
  )
}
