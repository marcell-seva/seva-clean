import React, { useState } from 'react'
import styled, { css } from 'styled-components'
import { useSideMenuListContext } from 'context/sideMenuListContext/sideMenuListContext'
import { colors } from 'styles/colors'
import { useFunnelQueryData } from 'context/funnelQueryContext/funnelQueryContext'
import { useSideMenuContext } from 'context/sideMenuContext/sideMenuContext'
import { removeWhitespacesAndToLowerCase } from 'utils/stringUtils'
import { trackHeaderNavigationMenuClick } from 'helpers/amplitude/seva20Tracking'
import { TrackingEventName } from 'helpers/amplitude/eventTypes'
import elementId from 'helpers/elementIds'
import { NavbarItemResponse } from 'utils/types/utils'
import { useRouter } from 'next/router'
import { handleEventTrackingBeliMobile } from 'helpers/amplitude/trackNavigationMenu'
import { LocalStorageKey } from 'utils/models/models'
import { BackItem } from './backItem'
import { Forward } from 'components/atoms/icon/Forward'
import { SidebarItem } from './sidebarItem'
import { LinkLabelMediumBold } from 'utils/typography/LinkLabelMediumBold'

interface Props {
  data: NavbarItemResponse[]
}

export const MenuListBeliMobil = ({ data }: Props) => {
  const history = useRouter()
  const [isOpenSubmenu1, setIsOpenSubmenu1] = useState(false)
  const [isOpenSubmenu2, setIsOpenSubmenu2] = useState(false)
  const { patchSideMenuList } = useSideMenuListContext()
  const { sideMenu, patchSideMenu } = useSideMenuContext()
  const { patchFunnelQuery } = useFunnelQueryData()
  const beliMobilData = data.filter(
    (item) =>
      removeWhitespacesAndToLowerCase(item.menuName) ===
      removeWhitespacesAndToLowerCase('Beli Mobil'),
  )[0]
  const merekData = beliMobilData.subMenu.filter(
    (item) => item.menuName === 'Merek',
  )[0]
  const bodiData = beliMobilData.subMenu.filter(
    (item) => item.menuName === 'Tipe Bodi',
  )[0]

  const clickMerekHandler = (item: NavbarItemResponse) => {
    patchSideMenuList({
      isMenuLevel1: true,
      isMenuBeliMobil: false,
    })
    patchSideMenu({ isOpenLevel1: !sideMenu.isOpenLevel1 })
    if (item.menuName !== 'Semua Merek') {
      const temp: string[] = []
      temp.push(item.menuName)
      patchFunnelQuery({ brand: temp })
      handleEventTrackingBeliMobile(item.menuCode)
    } else {
      patchFunnelQuery({ brand: [] })
      trackHeaderNavigationMenuClick(
        TrackingEventName.WEB_NAVIGATION_MEREK_ALL_CLICK,
      )
    }
    removeUnnecessaryDataFilter()
    history.push(item.menuUrl)
  }

  const removeUnnecessaryDataFilter = (): void => {
    const dataFilterLocal = localStorage.getItem(LocalStorageKey.CarFilter)
    const dataFilterParsed =
      dataFilterLocal !== null ? JSON.parse(dataFilterLocal) : null
    const newDataFilter = {
      ...dataFilterParsed,
      bodyType: [],
      carModel: '',
      tenure: 5,
      downPaymentAmount: '',
      sortBy: 'highToLow',
    }

    localStorage.setItem(
      LocalStorageKey.CarFilter,
      JSON.stringify(newDataFilter),
    )
  }

  const clickBodiHandler = (item: NavbarItemResponse) => {
    handleEventTrackingBeliMobile(item.menuCode)
    patchSideMenuList({
      isMenuLevel1: true,
      isMenuBeliMobil: false,
    })
    patchSideMenu({ isOpenLevel1: !sideMenu.isOpenLevel1 })
    const temp: string[] = []
    temp.push(item.menuName)
    patchFunnelQuery({ bodyType: temp })
    history.push(item.menuUrl)
  }

  if (!beliMobilData.status) return <></>

  return (
    <>
      <div
        onClick={() =>
          patchSideMenuList({
            isMenuLevel1: true,
            isMenuBeliMobil: false,
          })
        }
      >
        <BackItem label={'Beli Mobil'} />
      </div>
      <Spacing />

      {merekData.status && (
        <Wrapper>
          <MenuWrapper onClick={() => setIsOpenSubmenu1(!isOpenSubmenu1)}>
            <StyledText>{merekData.menuName}</StyledText>
            <IconWrapper isOpen={isOpenSubmenu1}>
              <Forward />
            </IconWrapper>
          </MenuWrapper>
          {isOpenSubmenu1 && (
            <>
              <SubmenuWrapper>
                {merekData.subMenu.map((item: NavbarItemResponse, index) => {
                  if (item.status) {
                    return (
                      <a
                        data-testid={elementId.Homepage.BuyCar + item.menuName}
                        key={index}
                        onClick={() => clickMerekHandler(item)}
                      >
                        <SidebarItem
                          label={item.menuName}
                          toggleNew={item.toggleNew}
                        />
                      </a>
                    )
                  }
                })}
              </SubmenuWrapper>
            </>
          )}
        </Wrapper>
      )}

      {bodiData.status && (
        <Wrapper>
          <MenuWrapper onClick={() => setIsOpenSubmenu2(!isOpenSubmenu2)}>
            <StyledText>{bodiData.menuName}</StyledText>
            <IconWrapper isOpen={isOpenSubmenu2}>
              <span>
                <Forward />
              </span>
            </IconWrapper>
          </MenuWrapper>
          {isOpenSubmenu2 && (
            <>
              <SubmenuWrapper>
                {bodiData.subMenu.map((item: NavbarItemResponse, index) => {
                  if (item.status) {
                    return (
                      <div key={index} onClick={() => clickBodiHandler(item)}>
                        <SidebarItem
                          label={item.menuName}
                          toggleNew={item.toggleNew}
                        />
                      </div>
                    )
                  }
                })}
              </SubmenuWrapper>
            </>
          )}
        </Wrapper>
      )}
    </>
  )
}

const Spacing = styled.div`
  height: 28px;
`

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 24px;
`

const MenuWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

const StyledText = styled(LinkLabelMediumBold)`
  color: ${colors.body2};
`

const IconWrapper = styled.div<{ isOpen: boolean }>`
  display: flex;
  align-items: center;
  ${({ isOpen }) =>
    isOpen
      ? css`
          transform: rotate(-90deg);
        `
      : css`
          transform: rotate(90deg);
        `};
`

const SubmenuWrapper = styled.div`
  margin-top: 20px;
  padding: 20px 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
  border-top: 1px solid ${colors.line};
  border-bottom: 1px solid ${colors.line};
`
