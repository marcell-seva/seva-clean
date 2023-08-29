import React, { useEffect, useState } from 'react'
import { Gallery } from 'components/molecules'
import { useMediaQuery } from 'react-responsive'
import { useCar } from 'services/context/carContext'

export const InteriorTab = ({
  emitActiveIndex,
  emitDataImages,
  activeIndex,
  isPreviewOpened,
  isShowAnnouncementBox,
}: any) => {
  const { carModelDetails } = useCar()
  const [interiorImage, setInteriorImage] = useState<Array<string>>([])
  const { images: carModelImages } = { ...carModelDetails }
  const isMobile = useMediaQuery({ query: '(max-width: 1024px)' })

  const groupingImage = () => {
    if (!carModelImages) return
    let dataInterior
    dataInterior = carModelImages.filter((item: string) => {
      return (
        item.toLowerCase().includes('int') &&
        item.toLowerCase().includes(isMobile ? 'mobile' : 'desktop')
      )
    })
    if (dataInterior.length === 0) {
      dataInterior = carModelImages.filter((item: string) => {
        return item.toLowerCase().includes('int')
      })
    }
    setInteriorImage([...dataInterior])
  }

  useEffect(() => {
    groupingImage()
  }, [carModelDetails])

  return (
    <div style={{ marginTop: isShowAnnouncementBox ? '54px' : '0px' }}>
      {!isPreviewOpened && (
        <Gallery
          emitDataImages={emitDataImages}
          items={interiorImage}
          emitActiveIndex={emitActiveIndex}
          activeIndex={activeIndex}
          onTab={'Interior'}
        />
      )}
    </div>
  )
}
