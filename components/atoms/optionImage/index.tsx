import clsx from 'clsx'
import Image, { StaticImageData } from 'next/image'
import React from 'react'
import styles from 'styles/components/atoms/optionImage.module.scss'

interface Props {
  onChoose: () => void
  isSelected: boolean
  image: string | StaticImageData
  imageWidth: number
  imageHeight: number
  disabled: boolean
  index: number
}

export const OptionImage = ({
  onChoose,
  isSelected,
  image,
  imageWidth,
  imageHeight,
  disabled,
  index,
}: Props) => {
  const handleOnClick = () => {
    if (!disabled) onChoose()
  }

  return (
    <div
      className={clsx({
        [styles.container]: true,
        [styles.containerSelected]: isSelected,
      })}
      onClick={handleOnClick}
    >
      <Image
        width={imageWidth}
        height={imageHeight}
        className={clsx({
          [styles.styledImage]: true,
          [styles.styledImageDisabled]: disabled,
        })}
        src={image}
        alt={`Option Image ${index}`}
      />
    </div>
  )
}
