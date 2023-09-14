import React from 'react'
import styled from 'styled-components'
import {
  Wrapper,
  StyledLabel,
  Spacing,
  ItemTextWrapper,
  StyledItemText,
  WrapperButton,
} from './navbarItemStyle'
import elementId from 'helpers/elementIds'
import { colors } from 'styles/colors'
import { refinancingUrl } from 'utils/helpers/routes'
import { NavbarItemResponse } from 'utils/types/utils'
import { useDropdownMultilevel } from 'components/atoms/dropdownMultiLevel'
import {
  trackBurgerMenuClick,
  trackHeaderNavigationMenuClick,
} from 'helpers/amplitude/seva20Tracking'
import { TrackingEventName } from 'helpers/amplitude/eventTypes'
import {
  handleEventTrackingArticle,
  handleEventTrackingLainnya,
} from 'helpers/amplitude/trackNavigationMenu'
import { NavbarArrow } from 'components/atoms/icon/NavbarArrow'
import { Forward } from 'components/atoms/icon/Forward'

interface Props {
  data: NavbarItemResponse
  isButton?: boolean
  type?: string
}

export const NavbarItem = ({ data, isButton = false }: Props) => {
  const { DropdownMultilevel, setDropdownDisplay } = useDropdownMultilevel()

  const handleEventTracking = (menuCode: string) => {
    if (menuCode === 'tentang-saya') {
      trackHeaderNavigationMenuClick(
        TrackingEventName.WEB_NAVIGATION_TENTANG_SEVA_CLICK,
      )
    } else if (menuCode === 'promo') {
      trackHeaderNavigationMenuClick(
        TrackingEventName.WEB_NAVIGATION_PROMO_CLICK,
      )
    } else if (menuCode === 'layanan-surat-kendaraan') {
      trackBurgerMenuClick({
        Page_Origination_URL: window.location.href,
        Menu: 'Layanan Surat Kendaraan',
      })
    }
  }

  const parentClick = () => {
    if (data.menuUrl) {
      if (data.menuUrl.includes('www.') || data.menuUrl.includes('ext.')) {
        return `https://${data.menuUrl}`
      } else {
        return data.menuUrl
      }
    } else {
      if (data.menuName === 'Fasilitas Dana') {
        return refinancingUrl
      }
    }
  }

  const clickHandler = (url: string) => {
    if (url.includes('www.') || url.includes('ext.')) {
      return `https://${url}`
    } else {
      return url
    }
  }

  const onClickMenu = (item: NavbarItemResponse) => () => {
    if (data.menuCode === 'promo') {
      trackHeaderNavigationMenuClick(
        TrackingEventName.WEB_NAVIGATION_MEREK_ALL_CLICK,
      )
    } else if (data.menuCode === 'artikel') {
      handleEventTrackingArticle(item.menuCode)
    } else if (data.menuCode === 'lainnya') {
      handleEventTrackingLainnya(item.menuCode)
    }
  }

  const renderChild = () => (
    <>
      <StyledLabel newMenu={data.toggleNew}>{data.menuName}</StyledLabel>
      {data.toggleNew ? <IconBaruWrapper>BARU!</IconBaruWrapper> : null}
      {data.subMenu.length > 0 && (
        <>
          <Spacing />
          <NavbarArrow />
        </>
      )}
      <DropdownMultilevel
        items={data.subMenu.length}
        width={'233px'}
        marginTop={27}
      >
        <div
          onMouseEnter={() => setDropdownDisplay(true)}
          onMouseLeave={() => setDropdownDisplay(false)}
        >
          {data.subMenu.map((item: any, index: number) => {
            if (item.status) {
              return (
                <ItemTextWrapper
                  data-testid={
                    elementId.Homepage.HeaderMenu.SubMenu + item.menuName
                  }
                  key={index}
                  href={clickHandler(item.menuUrl)}
                  onClick={onClickMenu(item)}
                >
                  <StyledItemText className="item-text">
                    {item.menuName}
                  </StyledItemText>
                  {item.subMenu && item.subMenu.length > 0 && <Forward />}
                </ItemTextWrapper>
              )
            }
          })}
        </div>
      </DropdownMultilevel>
    </>
  )

  const checkParentWrapper = () => {
    if (isButton)
      return (
        <WrapperButton
          data-testid={elementId.Homepage.HeaderMenu.Other + data.menuCode}
          onMouseEnter={() =>
            data.subMenu.length > 0 && setDropdownDisplay(true)
          }
          onMouseLeave={() =>
            data.subMenu.length > 0 && setDropdownDisplay(false)
          }
        >
          {renderChild()}
        </WrapperButton>
      )
    else
      return (
        <Wrapper
          onMouseEnter={() =>
            data.subMenu.length > 0 && setDropdownDisplay(true)
          }
          onMouseLeave={() =>
            data.subMenu.length > 0 && setDropdownDisplay(false)
          }
          data-testid={elementId.Homepage.HeaderMenu.Other + data.menuCode}
          href={parentClick()}
          onClick={() => handleEventTracking(data.menuCode)}
        >
          {renderChild()}
        </Wrapper>
      )
  }
  return checkParentWrapper()
}

const IconBaruWrapper = styled.div`
  margin-left: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #246ed4;
  border-radius: 8px;
  height: 15px;
  width: 32px;
  padding: 1px 4px 0px;

  font-family: var(--kanyon-bold);
  font-size: 8px;
  line-height: 14px;
  color: ${colors.white};
`
