import React, { HTMLAttributes } from 'react'
import styles from 'styles/components/atoms/skeleton.module.scss'
import { LazyLoadImage } from 'react-lazy-load-image-component'

const Shimmer = '/revamp/illustration/placeholder.gif'

type SkeletonProps = {
  width?: any
  height?: number
  className?: string
} & Pick<HTMLAttributes<HTMLImageElement>, 'style'>

const Skeleton = ({ width, height, className = '', style }: SkeletonProps) => {
  return (
    <LazyLoadImage
      src={Shimmer}
      className={`${className} ${styles.skeleton}`}
      width={width}
      height={height}
      alt="placeholder"
      style={{ width, height, ...style }}
    />
  )
}

export default Skeleton
