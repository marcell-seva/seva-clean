import React, { useContext, useEffect, useState } from 'react'
import styles from 'styles/saas/components/molecules/warnaTabContent.module.scss'
import { ColorSelector } from 'components/atoms/colorSelector'
import { availableList, availableListColors } from 'config/AvailableListColors'
import elementId from 'helpers/elementIds'
import { PDPCarOverviewSkeleton } from 'components/organism'
import { PdpDataLocalContext } from 'pages/mobil-baru/[brand]/[model]/[[...slug]]'
import { useRouter } from 'next/router'

export const WarnaTab = ({ isShowAnnouncementBox }: any) => {
  const { carModelDetailsResDefaultCity: carModelDetails } =
    useContext(PdpDataLocalContext)

  const [colorsList, setColorList] = useState<(string | string[])[]>([])

  const router = useRouter()

  useEffect(() => {
    const model = router.query.model
    const brand = router.query.brand
    const currentUrlPathName = router.asPath
    const splitedPath = currentUrlPathName.split('/')
    const carBrandModelUrl = `/${splitedPath[1]}/${brand}/${model}`

    if (availableList.includes(carBrandModelUrl)) {
      const colorsTmp = availableListColors.filter(
        (url) => url.url === carBrandModelUrl,
      )[0].colors

      if (colorsTmp.length === 0) return
      setColorList(colorsTmp)
    }
  }, [carModelDetails])

  return (
    <div style={{ marginTop: isShowAnnouncementBox ? '54px' : '0px' }}>
      {carModelDetails && carModelDetails?.images.length > 0 ? (
        <div className={styles.container}>
          <div className={styles.carImageWrapper}>
            <img
              src={carModelDetails?.images[0]}
              width="252"
              height="146"
              className={styles.carImage}
              data-testid={elementId.HeroImage}
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
