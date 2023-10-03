import React, { useState } from 'react'
import styles from 'styles/components/molecules/info.module.scss'
import { IconInfo } from 'components/atoms'
import { useLocalStorage } from 'utils/hooks/useLocalStorage'
import { LocalStorageKey } from 'utils/enum'
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
import {
  trackEventCountly,
  valueMenuTabCategory,
} from 'helpers/countly/countly'
import { CountlyEventNames } from 'helpers/countly/eventNames'

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

  const handleClickExpand = () => {
    if (isWithIcon) {
      trackCarVariantDescriptionExpandClick(getDataForAmplitude())
      trackEventCountly(CountlyEventNames.WEB_PDP_SEO_TEXT_EXPAND_CLICK, {
        MENU_TAB_CATEGORY: valueMenuTabCategory(),
        CAR_BRAND: carModelDetails?.brand ?? '',
        CAR_MODEL: carModelDetails?.model ?? '',
        SOURCE_SECTION: 'Car Description',
      })
    } else {
      trackSEOFooterExpandClick(TrackingEventName.WEB_SEO_FOOTER_CLICK_EXPAND)
      trackEventCountly(CountlyEventNames.WEB_PDP_SEO_TEXT_EXPAND_CLICK, {
        MENU_TAB_CATEGORY: valueMenuTabCategory(),
        CAR_BRAND: carModelDetails?.brand ?? '',
        CAR_MODEL: carModelDetails?.model ?? '',
        SOURCE_SECTION: 'SEO Text',
      })
    }
  }

  const handleClickCollapse = () => {
    if (isWithIcon) {
      trackCarVariantDescriptionCollapseClick(getDataForAmplitude())
    } else {
      trackSEOFooterExpandClick(TrackingEventName.WEB_SEO_FOOTER_CLICK_CLOSE)
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.heading}>
        {isWithIcon && (
          <div className={styles.iconInfo}>
            <IconInfo
              width={24}
              height={24}
              color="#B4231E"
              alt="SEVA Information Icon"
            />
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
              handleClickExpand()
            } else {
              handleClickCollapse()
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
