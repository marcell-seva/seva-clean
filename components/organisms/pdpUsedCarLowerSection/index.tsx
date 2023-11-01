import React, { useEffect, useState } from 'react'
import { NavigationTabV1 } from 'components/molecules'
// import { lowerSectionNavigationTab } from 'config/carVariantList.config'
import styles from 'styles/pages/carVariantList.module.scss'
import {
  CreditUsedCarTab,
  PriceTab,
  SpecificationTab,
  DescriptionTab,
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
import { usedCarDetailUrl } from 'utils/helpers/routes'

const lowerSectionNavigationTabTemp = [
  {
    label: 'Deskripsi',
    value: 'Deskripsi',
    testid: 'deskripsi',
  },
  {
    label: 'Kredit',
    value: 'Kredit',
    testid: 'kredit',
  },
]

type pdpUsedCarLowerSectionProps = {
  onButtonClick: (value: boolean) => void
  setPromoName: (value: string) => void
  showAnnouncementBox: boolean | null
  isShowAnnouncementBox?: boolean | null // for track annoucnement box every tab
  onChangeTab: (value: any) => void
}

export const PdpUsedCarLowerSection = ({
  onButtonClick,
  setPromoName,
  showAnnouncementBox,
  isShowAnnouncementBox,
  onChangeTab,
}: pdpUsedCarLowerSectionProps) => {
  const router = useRouter()
  const [lowerTabSlug] = ['Deskripsi', 'Kredit']
  const path = lowerTabSlug ? capitalizeFirstLetter(lowerTabSlug) : ''
  const [selectedTabValue, setSelectedTabValue] = useState(
    path ||
      lowerSectionNavigationTabTemp.filter((item) => item.label !== 'Kredit')[0]
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
      navigateToTabCredit()
    }
    if (value.toLowerCase() === 'deskripsi' && isExecuteFromClickingTab) {
      saveDataForCountlyTrackerPageViewLC(PreviousButton.undefined)
      navigateToTabDescription()
    }
    trackClickLowerTabCountly(value)
    trackAnnouncementBoxView(value)
    setSelectedTabValue(value)
    // const destinationElm = document.getElementById('pdp-lower-content')
    onChangeTab(value)

    // if (destinationElm) {
    //   destinationElm.scrollIntoView()
    //   // add more scroll because global page header is fixed position
    //   window.scrollBy({ top: -100, left: 0 })
    // }
  }
  const getAnnouncementBox = () => {
    if (dataAnnouncementBox !== undefined) {
      setAnnouncement(dataAnnouncementBox)
    }
  }

  useEffect(() => {
    setTabFromDirectUrl()
  }, [])

  useEffect(() => {
    getAnnouncementBox()
  }, [dataAnnouncementBox, isShowAnnouncementBox])

  const setTabFromDirectUrl = () => {
    const slug = router.query.slug
    const [upperTabSlug, lowerTabSlug] = Array.isArray(slug) ? slug : []

    if (lowerTabSlug) {
      const path = capitalizeFirstLetter(lowerTabSlug)
      setSelectedTabValue(path)
    }
  }

  const navigateToTabCredit = () => {
    const id = router.asPath.split('/')[3]
    router.replace(
      {
        pathname: usedCarDetailUrl.replace(':id', id) + '/kredit',
      },
      undefined,
      { scroll: false },
    )
  }
  const navigateToTabDescription = () => {
    const id = router.asPath.split('/')[3]
    router.replace(
      {
        pathname: usedCarDetailUrl.replace(':id', id),
      },
      undefined,
      { scroll: false },
    )
  }

  const renderContent = () => {
    switch (selectedTabValue) {
      case 'Deskripsi':
        return (
          <DescriptionTab
            setPromoName={setPromoName}
            onButtonClick={onButtonClick}
            setSelectedTabValue={onSelectLowerTab}
          />
        )
      case 'Kredit':
        return <CreditUsedCarTab />

      default:
        return (
          <DescriptionTab
            setPromoName={setPromoName}
            onButtonClick={onButtonClick}
            setSelectedTabValue={onSelectLowerTab}
          />
        )
    }
  }

  return (
    <div>
      <NavigationTabV1
        itemList={lowerSectionNavigationTabTemp}
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
