import React, { useEffect, useState } from 'react'
import { NavigationTabV1 } from 'components/molecules'
import { lowerSectionNavigationTab } from 'config/carVariantList.config'
import styles from 'styles/pages/carVariantList.module.scss'
import {
  CreditTabV1,
  CreditTabV2,
  PriceTab,
  SpecificationTab,
  SummaryTab,
} from 'components/organisms'
import { AnnouncementBoxDataType, VideoDataType } from 'utils/types/utils'
import { capitalizeFirstLetter } from 'utils/stringUtils'
import { useRouter } from 'next/router'
import { trackEventCountly } from 'helpers/countly/countly'
import { CountlyEventNames } from 'helpers/countly/eventNames'
import { LoanRank } from 'utils/types/models'
import { useCar } from 'services/context/carContext'
import {
  PreviousButton,
  saveDataForCountlyTrackerPageViewLC,
} from 'utils/navigate'
import { getLocalStorage } from 'utils/handler/localStorage'
import { LocalStorageKey } from 'utils/enum'
import { useUtils } from 'services/context/utilsContext'

type pdpLowerSectionProps = {
  onButtonClick: (value: boolean) => void
  setPromoName: (value: string) => void
  videoData: VideoDataType
  showAnnouncementBox: boolean | null
  setVariantIdFuelRatio: (value: string) => void
  variantFuelRatio: string | undefined
  isOTO?: boolean
  isShowAnnouncementBox?: boolean | null // for track annoucnement box every tab
  onChangeTab: (value: any) => void
}

export const PdpLowerSection = ({
  onButtonClick,
  setPromoName,
  videoData,
  showAnnouncementBox,
  setVariantIdFuelRatio,
  variantFuelRatio,
  isOTO = false,
  isShowAnnouncementBox,
  onChangeTab,
}: pdpLowerSectionProps) => {
  const router = useRouter()
  const { slug, v } = router.query || []
  const { carModelDetails } = useCar()
  const filterStorage: any = getLocalStorage(LocalStorageKey.CarFilter)
  const [announcement, setAnnouncement] = useState<AnnouncementBoxDataType>()
  const { dataAnnouncementBox } = useUtils()

  const isUsingFilterFinancial =
    !!filterStorage?.age &&
    !!filterStorage?.downPaymentAmount &&
    !!filterStorage?.monthlyIncome &&
    !!filterStorage?.tenure
  const loanRankcr = router.query.loanRankCVL ?? ''
  const upperTab = router.query.tab as string

  const validateSlug = (slug: Array<string>) => {
    if (slug) {
      var data = lowerSectionNavigationTab.filter((item) => {
        var data = slug.filter((items: any) => items === item.value)
        return data.length > 0
      })
      return {
        isValid: data.length !== 0,
        data: data[0] ?? lowerSectionNavigationTab[0],
      }
    } else
      return {
        isValid: false,
        data: lowerSectionNavigationTab[0],
      }
  }

  const [selectedTabValue, setSelectedTabValue] = useState(
    validateSlug(slug as Array<string>).data?.value,
  )

  const trackAnnouncementBoxView = (value: string) => {
    if (isShowAnnouncementBox && announcement) {
      trackEventCountly(CountlyEventNames.WEB_ANNOUNCEMENT_VIEW, {
        ANNOUNCEMENT_TITLE: announcement?.title,
        PAGE_ORIGINATION: 'PDP - ' + value,
      })
    }
  }
  const trackClickLowerTabCountly = (value: string) => {
    let creditBadge = 'Null'
    if (loanRankcr && loanRankcr.includes(LoanRank.Green)) {
      creditBadge = 'Mudah disetujui'
    } else if (loanRankcr && loanRankcr.includes(LoanRank.Red)) {
      creditBadge = 'Sulit disetujui'
    }

    trackEventCountly(CountlyEventNames.WEB_PDP_TAB_CONTENT_CLICK, {
      MENU_TAB_CATEGORY: value,
      PELUANG_KREDIT_BADGE: isUsingFilterFinancial ? creditBadge : 'Null',
      CAR_BRAND: carModelDetails?.brand ?? '',
      CAR_MODEL: carModelDetails?.model ?? '',
      VISUAL_TAB_CATEGORY: upperTab ? upperTab : 'Warna',
    })
  }

  const onSelectLowerTab = (
    value: string,
    isExecuteFromClickingTab?: boolean,
  ) => {
    if (value.toLowerCase() === 'kredit' && isExecuteFromClickingTab) {
      saveDataForCountlyTrackerPageViewLC(PreviousButton.undefined)
    }
    trackClickLowerTabCountly(value)
    trackAnnouncementBoxView(value)
    setSelectedTabValue(value)
    const destinationElm = document.getElementById('pdp-lower-content')
    onChangeTab(value)

    if (destinationElm) {
      destinationElm.scrollIntoView()
      // add more scroll because global page header is fixed position
      window.scrollBy({ top: -100, left: 0 })
    }
  }
  const getAnnouncementBox = () => {
    if (dataAnnouncementBox !== undefined) {
      setAnnouncement(dataAnnouncementBox)
    }
  }

  useEffect(() => {
    getAnnouncementBox()
  }, [dataAnnouncementBox, isShowAnnouncementBox])

  const renderContent = () => {
    switch (selectedTabValue) {
      case 'ringkasan':
        return (
          <SummaryTab
            setPromoName={setPromoName}
            onButtonClick={onButtonClick}
            videoData={videoData}
            setSelectedTabValue={onSelectLowerTab}
            setVariantIdFuelRatio={setVariantIdFuelRatio}
            variantFuelRatio={variantFuelRatio}
            isOTO={isOTO}
          />
        )
      case 'spesifikasi':
        return <SpecificationTab isOTO={isOTO} />

      case 'harga':
        return (
          <PriceTab
            setSelectedTabValue={onSelectLowerTab}
            setVariantIdFuelRatio={setVariantIdFuelRatio}
            variantFuelRatio={variantFuelRatio}
            isOTO={isOTO}
          />
        )
      case 'kredit':
        return v === '1' ? <CreditTabV1 /> : <CreditTabV2 />

      default:
        return (
          <SummaryTab
            setPromoName={setPromoName}
            onButtonClick={onButtonClick}
            videoData={videoData}
            setSelectedTabValue={onSelectLowerTab}
            setVariantIdFuelRatio={setVariantIdFuelRatio}
            variantFuelRatio={variantFuelRatio}
          />
        )
    }
  }

  return (
    <div>
      <NavigationTabV1
        itemList={
          isOTO
            ? lowerSectionNavigationTab.filter(
                (item) => item.label !== 'Kredit',
              )
            : lowerSectionNavigationTab
        }
        onSelectTab={(value) => onSelectLowerTab(value, true)}
        selectedTabValueProps={selectedTabValue}
        showAnnouncementBox={showAnnouncementBox}
      />
      <div id="pdp-lower-content" className={styles.pdpLowerSection}>
        {renderContent()}
      </div>
    </div>
  )
}
