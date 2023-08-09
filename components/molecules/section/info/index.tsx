import React, { useState } from 'react'
import styles from 'styles/components/molecules/info.module.scss'
import { IconInfo } from 'components/atoms'
import { useLocalStorage } from 'utils/hooks/useLocalStorage/useLocalStorage'
import { LocalStorageKey } from 'utils/models/models'
import {
  trackCarVariantDescriptionCollapseClick,
  trackCarVariantDescriptionExpandClick,
  trackSEOFooterExpandClick,
} from 'helpers/amplitude/seva20Tracking'
import { TrackingEventName } from 'helpers/amplitude/eventTypes'
import elementId from 'helpers/elementIds'
import { CityOtrOption } from 'utils/types/utils'
import { client } from 'utils/helpers/const'
import { useCar } from 'services/context/carContext'

export interface PropsInfo {
  isWithIcon?: boolean
  headingText: string
  descText: string
}

export const Info: React.FC<PropsInfo> = ({
  isWithIcon,
  headingText,
  descText,
}): JSX.Element => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false)
  const readMoreText = 'Baca Selengkapnya'
  const closeText = 'Tutup'

  const { carModelDetails } = useCar()
  const [cityOtr] = useLocalStorage<CityOtrOption | null>(
    LocalStorageKey.CityOtr,
    null,
  )

  const getDataForAmplitude = () => {
    return {
      Car_Brand: carModelDetails?.brand ?? '',
      Car_Model: carModelDetails?.model ?? '',
      City: cityOtr?.cityName || 'null',
      Page_Origination_URL: client ? window.location.href : '',
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.heading}>
        {isWithIcon && (
          <div className={styles.iconInfo}>
            <IconInfo width={24} height={24} color="#B4231E" />
          </div>
        )}
        <h3
          className={styles.textHeading}
          data-testid={elementId.Text + 'tentang-mobil'}
        >
          {headingText}
        </h3>
      </div>
      <div className={styles.desc}>
        <p className={`${styles.textDesc} ${!isExpanded && styles.elipsed}`}>
          {descText}
        </p>
        <br />
        <button
          className={styles.button}
          onClick={() => {
            if (!isExpanded) {
              isWithIcon // I assume isWithIcon for Car Description
                ? trackCarVariantDescriptionExpandClick(getDataForAmplitude())
                : trackSEOFooterExpandClick(
                    TrackingEventName.WEB_SEO_FOOTER_CLICK_EXPAND,
                  )
            } else {
              isWithIcon // I assume isWithIcon for Car Description
                ? trackCarVariantDescriptionCollapseClick(getDataForAmplitude())
                : trackSEOFooterExpandClick(
                    TrackingEventName.WEB_SEO_FOOTER_CLICK_CLOSE,
                  )
            }
            setIsExpanded(!isExpanded)
          }}
          data-testid={elementId.PDP.CTA.BacaSelengkapnya}
        >
          {isExpanded ? closeText : readMoreText}
        </button>
      </div>
    </div>
  )
}
