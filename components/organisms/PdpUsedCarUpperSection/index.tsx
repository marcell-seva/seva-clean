import React from 'react'
import { CarGallery } from '../tabContent/upper/CarGallery'

interface Props {
  emitActiveIndex: (e: number) => void
  emitDataImages: (e: Array<string>) => void
  activeIndex: number
  isPreviewOpened: boolean
}

const PdpUsedCarUpperSection = ({
  emitActiveIndex,
  emitDataImages,
  activeIndex,
  isPreviewOpened,
}: Props) => {
  return (
    <>
      <CarGallery
        isPreviewOpened={isPreviewOpened}
        emitActiveIndex={emitActiveIndex}
        emitDataImages={emitDataImages}
        activeIndex={activeIndex}
      />
    </>
  )
}

export default PdpUsedCarUpperSection
