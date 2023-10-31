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
    const temp = usedCarModelDetailsRes.carGallery.map((items: any) => {
      if (items.mediaCode === 'main-image') {
        return items.url
      } else if (items.mediaCode === 'detail-images') {
        return items.url
      }
    })
    setEksteriorImage(temp.slice(0, 11))
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
