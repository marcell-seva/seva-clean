import React, { useEffect, useRef, useState } from 'react'
import styles from 'styles/components/molecules/navigationTabUsedCar.module.scss'
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
  initialTab?: string
  className?: string
  autoScroll?: boolean
}

const NavigationTabUsedCar = ({
  itemList,
  onSelectTab,
  isShowAnnouncementBox,
  onPage,
  className,
  initialTab,
  autoScroll = true,
}: Props) => {
  const router = useRouter()

  const [selectedTabValue, setSelectedTabValue] = useState(
    router.query.tab || initialTab || itemList[0].value,
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
    autoScroll && checkActiveTab()
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

export default NavigationTabUsedCar
