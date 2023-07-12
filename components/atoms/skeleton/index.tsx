import React, { HTMLAttributes } from 'react'
import styles from 'styles/components/atoms/skeleton.module.scss'
import Shimmer from 'assets/illustration/placeholder.gif'
import Image from 'next/image'

type SkeletonProps = {
  width?: any
  height?: number
  className?: string
} & Pick<HTMLAttributes<HTMLImageElement>, 'style'>

const Skeleton = ({ width, height, className = '', style }: SkeletonProps) => {
  return (
    <Image
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
