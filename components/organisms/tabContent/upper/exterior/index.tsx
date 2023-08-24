import React, { useEffect, useState } from 'react'
import { Gallery } from 'components/molecules'
import { useMediaQuery } from 'react-responsive'
import { useCar } from 'services/context/carContext'

export const ExteriorTab = ({
  emitActiveIndex,
  emitDataImages,
  activeIndex,
  isPreviewOpened,
  isShowAnnouncementBox,
}: any) => {
  const { carModelDetails } = useCar()
  const [eksteriorImage, setEksteriorImage] = useState<Array<string>>([])
  const { images: carModelImages } = { ...carModelDetails }
  const isMobile = useMediaQuery({ query: '(max-width: 1024px)' })

  const groupingImage = () => {
    if (!carModelImages) return

    let mainNonInterior = carModelImages.filter(
      (item: string) =>
        item.toLowerCase().includes('main') &&
        !item.toLowerCase().includes('int') &&
        item.toLowerCase().includes(isMobile ? 'mobile' : 'desktop'),
    )

    if (mainNonInterior.length === 0) {
      mainNonInterior = carModelImages.filter(
        (item: string) =>
          item.toLowerCase().includes('main') &&
          !item.toLowerCase().includes('int'),
      )
    }

    let dataExterior
    dataExterior = carModelImages.filter((item: string) => {
      return (
        item.toLowerCase().includes('eks') &&
        item.toLowerCase().includes(isMobile ? 'mobile' : 'desktop')
      )
    })
    if (dataExterior.length === 0) {
      dataExterior = carModelImages.filter((item: string) => {
        return item.toLowerCase().includes('eks')
      })
    }

    const extTemp = [...mainNonInterior, ...dataExterior]
    const extTempUnique = Array.from(new Set(extTemp))
    setEksteriorImage(extTempUnique)
  }

  useEffect(() => {
    groupingImage()
  }, [carModelDetails])

  return (
    <div style={{ marginTop: isShowAnnouncementBox ? '54px' : '0px' }}>
      {!isPreviewOpened && (
        <Gallery
          emitDataImages={emitDataImages}
          items={eksteriorImage}
          emitActiveIndex={emitActiveIndex}
          activeIndex={activeIndex}
          onTab={'Exterior'}
        />
      )}
    </div>
  )
}
