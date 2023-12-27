import React, { useContext, useEffect, useState } from 'react'
import { Gallery, UsedCarGallery } from 'components/molecules'
import { useMediaQuery } from 'react-responsive'
import { useCar } from 'services/context/carContext'
import { UsedPdpDataLocalContext } from 'pages/mobil-bekas/p/[[...slug]]'

export const CarGallery = ({
  emitActiveIndex,
  emitDataImages,
  activeIndex,
  isPreviewOpened,
}: any) => {
  const { usedCarModelDetailsRes } = useContext(UsedPdpDataLocalContext)
  const [eksteriorImage, setEksteriorImage] = useState<Array<string>>([])
  const isMobile = useMediaQuery({ query: '(max-width: 1024px)' })

  useEffect(() => {
    const mainImages: any = []
    const detailImages: any = []

    usedCarModelDetailsRes.carGallery.map((item: any) => {
      if (item.mediaCode === 'main-image') {
        mainImages.push(item)
      } else if (item.mediaCode === 'detail-images') {
        detailImages.push(item)
      }
    })
    const sortedImages = [...mainImages, ...detailImages]

    setEksteriorImage(sortedImages.slice(0, 11))
  }, [usedCarModelDetailsRes])

  return (
    <div>
      {!isPreviewOpened && (
        <UsedCarGallery
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
