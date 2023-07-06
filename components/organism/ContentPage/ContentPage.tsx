import React, { lazy, memo } from 'react'
import { useMediaQuery } from 'react-responsive'

const TabSummary = lazy(() => import('./Summary/Summary'))
const TabPrice = lazy(() => import('./Price/Price'))
const TabSpecification = lazy(() => import('./Specification/Specification'))
const TabGallery = lazy(() => import('./Gallery/Gallery'))
// const TabCredit = lazy(() => import('./Credit/Credit'))
// const TabCreditV2 = lazy(() => import('./CreditV2/CreditV2'))

type ContentPageProps = {
  tab: string | undefined
  isSticky?: boolean
  isShowLoading?: boolean
}

export const ContentPage = memo(
  ({ tab, isSticky, isShowLoading }: ContentPageProps) => {
    const isMobile = useMediaQuery({ query: '(max-width: 1024px)' })
    if (!tab || tab.includes('SEVA')) {
      return <TabSummary tab={tab} isSticky={isSticky} />
    } else if (tab === 'harga') {
      return <TabPrice tab={tab} isSticky={isSticky} />
    } else if (tab === 'kredit') {
      // if (!isMobile) {
      //   return <TabCredit tab={tab} isShowLoading={isShowLoading} />
      // } else {
      //   return <TabCreditV2 tab={tab} isShowLoading={isShowLoading} />
      // }
    } else if (tab === 'spesifikasi') {
      return <TabSpecification tab={tab} isSticky={isSticky} />
    } else if (tab === 'galeri') {
      return <TabGallery tab={tab} isSticky={isSticky} />
    }
    return <TabSummary tab={tab} isSticky={isSticky} />
  },
)
