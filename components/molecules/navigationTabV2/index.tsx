import React, { useEffect, useRef, useState } from 'react'
import styles from 'styles/components/molecules/navigationTabV2.module.scss'
import clsx from 'clsx'
import elementId from 'utils/helpers/trackerId'
import { TabItemData } from 'utils/types/props'
import { upperSectionNavigationTab } from 'utils/config/carVariantList.config'
import { alephArticleCategoryList } from 'utils/config/articles.config'
import { TabV2 } from 'components/atoms'
import { useRouter } from 'next/router'
import brandList from 'utils/config'

interface Props {
  itemList: TabItemData[]
  onSelectTab?: (value: string) => void
  isShowAnnouncementBox: boolean | null
  onPage: string
  className?: string
  autoScroll?: boolean
}

const NavigationTabV2 = ({
  itemList,
  onSelectTab,
  isShowAnnouncementBox,
  onPage,
  className,
  autoScroll = true,
}: Props) => {
  const router = useRouter()

  const [selectedTabValue, setSelectedTabValue] = useState(
    router.query.tab || itemList[0].value,
  )
  const [selectedTabIndex, setSelectedTabIndex] = useState(0)
  const containerRef = useRef() as React.MutableRefObject<HTMLDivElement>

  const onClickTabItem = (value: string) => {
    if (onPage === 'PDP') {
      setSelectedTabValue(value)
      const index = upperSectionNavigationTab.findIndex(
        (item: any) => item.value === value,
      )
      setSelectedTabIndex(index)
      onSelectTab && onSelectTab(value)
    } else if (onPage === 'OTO') {
      setSelectedTabValue(value)
      const index = brandList.findIndex((item: any) => item.value === value)
      setSelectedTabIndex(index)
      onSelectTab && onSelectTab(value)
    } else {
      setSelectedTabValue(value)
      const index = alephArticleCategoryList.findIndex(
        (item: any) => item.value === value,
      )
      setSelectedTabIndex(index)
      onSelectTab && onSelectTab(value)
    }
  }

  useEffect(() => {
    if (onPage === 'LC') {
      autoScroll && checkActiveTabLC()
    } else if (onPage === 'OTO') {
      autoScroll && checkActiveTabOTO()
    } else {
      autoScroll && checkActiveTab()
    }
  }, [selectedTabValue])

  const scrollOTO = (scrollOffset: number) => {
    if (containerRef && containerRef.current) {
      containerRef.current.scrollTo({
        left: scrollOffset,
        behavior: 'smooth',
      })
    }
  }

  const checkActiveTabOTO = () => {
    let positionValue = 0
    if (selectedTabIndex >= 1) {
      if (selectedTabIndex === 1) {
        positionValue = 70
      } else if (selectedTabIndex === 2) {
        positionValue = 170
      } else if (selectedTabIndex === 3) {
        positionValue = 250
      } else if (selectedTabIndex >= 4) {
        positionValue = 350
        // if (containerRef.current.scrollLeft >= 160) {
        // } else {
        //   positionValue = 90
        // }
      }
    } else if (selectedTabIndex < 1) {
      positionValue = -200
    }
    scrollOTO(positionValue)
  }

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
        [className as string]: className,
      })}
      ref={containerRef}
      data-testid={elementId.PDP.NavigationTab.V2}
    >
      {itemList.map((item, index) => (
        <TabV2
          label={item.label}
          value={item.value}
          isActive={item.value === selectedTabValue}
          onClickHandler={(value: any) => onClickTabItem(value)}
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

export default NavigationTabV2
