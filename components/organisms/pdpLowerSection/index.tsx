import React, { useEffect, useState } from 'react'
import { NavigationTabV1 } from 'components/molecules'
import { lowerSectionNavigationTab } from 'config/carVariantList.config'
import styles from 'styles/pages/carVariantList.module.scss'
import {
  CreditTab,
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
}: pdpLowerSectionProps) => {
  const router = useRouter()
  const lowerTab = router.query.slug as string
  const path = lowerTab ? capitalizeFirstLetter(lowerTab[0]) : ''
  const [selectedTabValue, setSelectedTabValue] = useState(
    path ||
      lowerSectionNavigationTab.filter((item) => item.label !== 'Kredit')[0]
        .value,
  )
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
    const urlWithoutSlug = window.location.href
      .replace('/ringkasan', '')
      .replace('/spesifikasi', '')
      .replace('/harga', '')
      .replace('/kredit', '')
    const lastIndexUrl = window.location.href.slice(-1)

    if (lastIndexUrl === '/') {
      window.history.pushState(
        null,
        '',
        urlWithoutSlug + value.toLocaleLowerCase(),
      )
    } else {
      window.history.pushState(
        null,
        '',
        urlWithoutSlug +
          '/' +
          (value !== 'Ringkasan' ? value.toLocaleLowerCase() : ''),
      )
    }

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
    setTabFromDirectUrl()
    getAnnouncementBox()
  }, [dataAnnouncementBox, isShowAnnouncementBox])

  const setTabFromDirectUrl = () => {
    const slug = router.query.slug

    if (slug) {
      const path = capitalizeFirstLetter(slug[0])
      setSelectedTabValue(path)
    }
  }

  const renderContent = () => {
    switch (selectedTabValue) {
      case 'Ringkasan':
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
      case 'Spesifikasi':
        return <SpecificationTab />

      case 'Harga':
        return (
          <PriceTab
            setSelectedTabValue={onSelectLowerTab}
            setVariantIdFuelRatio={setVariantIdFuelRatio}
            variantFuelRatio={variantFuelRatio}
            isOTO={isOTO}
          />
        )
      case 'Kredit':
        return <CreditTab />

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
