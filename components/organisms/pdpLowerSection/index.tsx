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
import { VideoDataType } from 'utils/types/utils'
import { capitalizeFirstLetter } from 'utils/stringUtils'
import { useRouter } from 'next/router'

type pdpLowerSectionProps = {
  onButtonClick: (value: boolean) => void
  setPromoName: (value: string) => void
  videoData: VideoDataType
  showAnnouncementBox: boolean | null
  setVariantIdFuelRatio: (value: string) => void
  variantFuelRatio: string | undefined
}

export const PdpLowerSection = ({
  onButtonClick,
  setPromoName,
  videoData,
  showAnnouncementBox,
  setVariantIdFuelRatio,
  variantFuelRatio,
}: pdpLowerSectionProps) => {
  const router = useRouter()
  const lowerTab = router.query.slug as string
  const path = lowerTab ? capitalizeFirstLetter(lowerTab[0]) : ''
  const [selectedTabValue, setSelectedTabValue] = useState(
    path || lowerSectionNavigationTab[0].value,
  )

  const onSelectLowerTab = (value: string) => {
    setSelectedTabValue(value)
    const destinationElm = document.getElementById('pdp-lower-content')
    const urlWithoutSlug = window.location.pathname
      .replace('/ringkasan', '')
      .replace('/spesifikasi', '')
      .replace('/harga', '')
      .replace('/kredit', '')
    const lastIndexUrl = window.location.pathname.slice(-1)

    const { brand, model, slug, ...restQuery } = router.query

    if (lastIndexUrl === '/') {
      router.push({
        pathname: urlWithoutSlug + value.toLocaleLowerCase(),
        query: { ...restQuery },
      })
    } else {
      router.push({
        pathname:
          urlWithoutSlug +
          '/' +
          (value !== 'Ringkasan' ? value.toLocaleLowerCase() : ''),
        query: { ...restQuery },
      })
    }

    if (destinationElm) {
      destinationElm.scrollIntoView()
      // add more scroll because global page header is fixed position
      window.scrollBy({ top: -100, left: 0 })
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
        itemList={lowerSectionNavigationTab}
        onSelectTab={onSelectLowerTab}
        selectedTabValueProps={selectedTabValue}
        showAnnouncementBox={showAnnouncementBox}
      />
      <div id="pdp-lower-content" className={styles.pdpLowerSection}>
        {renderContent()}
      </div>
    </div>
  )
}
