import React, { HTMLAttributes } from 'react'
import styles from '../../../styles/saas/components/atoms/skeleton.module.scss'

const Shimmer = '/assets/illustration/placeholder.gif'

type SkeletonProps = {
  width: number | string
  height?: number | string
  className?: string
} & Pick<HTMLAttributes<HTMLImageElement>, 'style'>

export const Skeleton = ({
  width,
  height,
  className = '',
  style,
}: SkeletonProps) => {
  return (
    <img
      src={Shimmer}
      className={`${className} ${styles.skeleton}`}
      width={width}
      height={height}
      alt="placeholder"
      style={{ width, height, ...style }}
    />
  )
}
