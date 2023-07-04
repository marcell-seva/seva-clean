import React, { useEffect, useRef, useState } from 'react'
import { TabV2 } from 'components/atoms/index'
import styles from 'styles/saas/components/molecules/navigationTabV2.module.scss'
import { TabItemData } from 'utils/types/props'
import { upperSectionNavigationTab } from 'config/carVariantList.config'
import elementId from 'helpers/elementIds'
import clsx from 'clsx'
import { alephArticleCategoryList } from 'config/articles.config'
import { useRouter } from 'next/router'

interface Props {
  itemList: TabItemData[]
  onSelectTab?: (value: string) => void
  isShowAnnouncementBox: boolean | null
  onPage: string
  className?: string
  autoScroll?: boolean
}

export const NavigationTabV2 = ({
  itemList,
  onSelectTab,
  isShowAnnouncementBox,
  onPage,
  className,
  autoScroll = true,
}: Props) => {
  const { query } = useRouter()

  const [selectedTabValue, setSelectedTabValue] = useState(
    query.tab || itemList[0].value,
  )
  const [selectedTabIndex, setSelectedTabIndex] = useState(0)
  const containerRef = useRef() as React.MutableRefObject<HTMLDivElement>

  const onClickTabItem = (value: string) => {
    if (onPage === 'PDP') {
      setSelectedTabValue(value)
      const index = upperSectionNavigationTab.findIndex(
        (item) => item.value === value,
      )
      setSelectedTabIndex(index)
      onSelectTab && onSelectTab(value)
    } else {
      setSelectedTabValue(value)
      const index = alephArticleCategoryList.findIndex(
        (item) => item.value === value,
      )
      setSelectedTabIndex(index)
      onSelectTab && onSelectTab(value)
    }
  }

  useEffect(() => {
    if (onPage === 'LC') {
      autoScroll && checkActiveTabLC()
    } else {
      autoScroll && checkActiveTab()
    }
  }, [selectedTabValue])

  const scroll = (scrollOffset: number) => {
    if (containerRef && containerRef.current) {
      containerRef.current.scrollTo({
        left: (containerRef.current.scrollLeft += scrollOffset),
        behavior: 'smooth',
      })
    }
  }

  const checkActiveTab = () => {
    let positionValue = 0
    if (selectedTabIndex >= 4) {
      positionValue = 200
    } else if (selectedTabIndex <= 2) {
      positionValue = -200
    }

    scroll(positionValue)
  }

  const scrollTabLc = (scrollOffset: number) => {
    if (containerRef && containerRef.current) {
      containerRef.current.scrollTo({
        left: scrollOffset,
        behavior: 'smooth',
      })
    }
  }
  const checkActiveTabLC = () => {
    let positionValue = 0
    if (selectedTabIndex >= 1) {
      if (selectedTabIndex === 1) {
        positionValue = 70
      } else if (selectedTabIndex === 2) {
        positionValue = 160
      } else if (selectedTabIndex === 3) {
        positionValue = 290
      } else if (selectedTabIndex >= 4) {
        positionValue = 450
        // if (containerRef.current.scrollLeft >= 160) {
        // } else {
        //   positionValue = 90
        // }
      }
    } else if (selectedTabIndex < 1) {
      positionValue = -200
    }
    scrollTabLc(positionValue)
  }

  return (
    <div
      className={clsx({
        [styles.container]: true,
        [styles.showAAnnouncementBox]: isShowAnnouncementBox,
        [className ?? '']: true,
      })}
      ref={containerRef}
      data-testid={elementId.PDP.NavigationTab.V2}
    >
      {itemList.map((item, index) => (
        <TabV2
          label={item.label}
          value={item.value}
          isActive={item.value === selectedTabValue}
          onClickHandler={(value) => onClickTabItem(value)}
          key={index}
          dataTestId={
            item.testid ??
            elementId.PDP.NavigationTab.V2 + '-item-' + item.label
          }
          onPage={onPage}
        />
      ))}
    </div>
  )
}
