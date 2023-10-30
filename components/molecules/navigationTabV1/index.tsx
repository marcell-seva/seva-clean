import React, { useEffect, useRef, useState } from 'react'
import { TabV1 } from 'components/atoms/index'
import styles from 'styles/components/molecules/navigationTabV1.module.scss'
import { TabItemData } from 'utils/types/props'
import { lowerSectionNavigationTab } from 'config/carVariantList.config'
import { capitalizeFirstLetter } from 'utils/stringUtils'
import elementId from 'helpers/elementIds'
import { useRouter } from 'next/router'

interface Props {
  itemList: TabItemData[]
  onSelectTab?: (value: string) => void
  selectedTabValueProps: string
  showAnnouncementBox: boolean | null
}

export const NavigationTabV1 = ({
  itemList,
  onSelectTab,
  selectedTabValueProps,
  showAnnouncementBox,
}: Props) => {
  const [selectedTabValue, setSelectedTabValue] = useState(
    selectedTabValueProps,
  )
  const router = useRouter()
  const isMobilBekas =
    router.asPath.split('/')[1] === 'mobil-bekas' ? true : false
  const [selectedTabIndex, setSelectedTabIndex] = useState(0)
  const containerRef = useRef() as React.MutableRefObject<HTMLDivElement>
  // const showAnnouncementBoxLogin = getSessionStorage(
  //   SessionStorageKey.ShowWebAnnouncementLogin,
  // )
  // const showAnnouncementBoxNonLogin = getSessionStorage(
  //   SessionStorageKey.ShowWebAnnouncementNonLogin,
  // )
  // change to state

  const onClickTabItem = (value: string) => {
    setSelectedTabValue(value)
    const index = lowerSectionNavigationTab.findIndex(
      (item) => item.value === value,
    )
    setSelectedTabIndex(index)
    onSelectTab && onSelectTab(value)
  }

  useEffect(() => {
    setTabFromDirectUrl()
    checkActiveTab()
  }, [selectedTabValue])

  const setTabFromDirectUrl = () => {
    const activePath = window.location.pathname
    const splitedPath = activePath.split('/')[4]
    if (splitedPath == '' || splitedPath == undefined) {
      return
    } else {
      const path = capitalizeFirstLetter(splitedPath)
      setSelectedTabValue(path)
    }
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

  return (
    <div
      className={`${
        isMobilBekas ? styles.containerUsedCar : styles.container
      } ${showAnnouncementBox && styles.showAAnnouncementBox}`}
      ref={containerRef}
      data-testid={elementId.PDP.NavigationTab.V1}
    >
      {itemList.map((item, index) => (
        <TabV1
          label={item.label}
          value={item.value}
          isActive={item.value === selectedTabValueProps}
          onClickHandler={(value) => onClickTabItem(value)}
          key={index}
          dataTestId={
            item.testid ??
            elementId.PDP.NavigationTab.V1 + '-item-' + item.label
          }
        />
      ))}
    </div>
  )
}
