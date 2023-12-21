import React, { HTMLAttributes } from 'react'
import styles from 'styles/components/atoms/skeletonLC.module.scss'
import { LazyLoadImage } from 'react-lazy-load-image-component'

const Shimmer = '/revamp/illustration/placeholder.gif'

type SkeletonProps = {
  width?: any
  height?: number
  className?: string
  isHeader?: boolean
  children?: any
} & Pick<HTMLAttributes<HTMLImageElement>, 'style'>

const SkeletonLC = ({
  width,
  height,
  className = '',
  children,
  style,
  isHeader = false,
}: SkeletonProps) => {
  return !isHeader ? (
    <div
      className={`${styles.shimmerBG} ${styles.titleLine} ${styles.end}`}
      style={{ width, height, ...style }}
    >
      {children}
    </div>
  ) : (
    <div
      className={`${styles.shimmerBG} ${styles.titleLineHeader} `}
      style={{ width, height, ...style }}
    >
      {children}
    </div>
  )
}

export default SkeletonLC
