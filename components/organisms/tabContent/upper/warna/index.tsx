import React, { useContext, useEffect, useState } from 'react'
import styles from 'styles/components/molecules/warnaTabContent.module.scss'
import { ColorSelector } from 'components/atoms/colorSelector'
import { availableList, availableListColors } from 'config/AvailableListColors'
import elementId from 'helpers/elementIds'
import { PDPCarOverviewSkeleton } from 'components/organisms'
import { PdpDataLocalContext } from 'pages/mobil-baru/[brand]/[model]/[[...slug]]'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { PdpDataOTOLocalContext } from 'pages/adaSEVAdiOTO/mobil-baru/[brand]/[model]/[[...slug]]'

export const WarnaTab = ({ isShowAnnouncementBox, isOTO = false }: any) => {
  const {
    dataCombinationOfCarRecomAndModelDetailDefaultCity: carModelDetails,
  } = useContext(isOTO ? PdpDataOTOLocalContext : PdpDataLocalContext)

  const router = useRouter()

  const getColorList = () => {
    const model = router.query.model
    const brand = router.query.brand
    const currentUrlPathName = router.asPath
    const splitedPath = currentUrlPathName.split('/')
    const carBrandModelUrl = `/${splitedPath[isOTO ? 2 : 1]}/${brand}/${model}`

    if (availableList.includes(carBrandModelUrl)) {
      const colorsTmp = availableListColors.filter(
        (url) => url.url === carBrandModelUrl,
      )[0].colors

      if (colorsTmp.length === 0) return []
      return colorsTmp
    }

    return []
  }

  const [colorsList, setColorList] = useState<(string | string[])[]>(
    getColorList(),
  )

  useEffect(() => {
    if (colorsList.length === 0) setColorList(getColorList())
  }, [carModelDetails])

  return (
    <div style={{ marginTop: isShowAnnouncementBox ? '54px' : '0px' }}>
      {carModelDetails && carModelDetails?.images.length > 0 ? (
        <div className={styles.container}>
          <div className={styles.carImageWrapper}>
            <Image
              src={carModelDetails?.images[0]}
              width="252"
              height="146"
              className={styles.carImage}
              data-testid={elementId.HeroImage}
              alt={`Warna Mobil ${
                carModelDetails?.brand
              } ${carModelDetails?.model.replace('-', ' ')} Bagian Depan`}
              priority
              quality="20"
            />
          </div>
          {colorsList.length > 0 ? (
            <>
              <span
                className={styles.pilihanWarnaText}
                data-testid={elementId.Text + 'pilihan-warna'}
              >
                Pilihan Warna
              </span>
              <ColorSelector
                colorList={colorsList}
                dataTestId={elementId.PDP.WarnaTab.ColorSelector}
              />
            </>
          ) : null}
        </div>
      ) : (
        <div className={styles.container}>
          <PDPCarOverviewSkeleton />
        </div>
      )}
    </div>
  )
}
