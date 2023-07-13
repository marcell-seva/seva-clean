import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { slide as Menu } from 'react-burger-menu'
import { useSideMenuContext } from 'context/sideMenuContext/sideMenuContext'
import { colors } from 'styles/colors'
import { NavbarItemResponse } from 'utils/types/utils'
import { useSideMenuListContext } from 'context/sideMenuListContext/sideMenuListContext'
import { pageHeaderHeight } from 'const/const'
import { MenuListLevel1 } from '../menuSection/menuListLevel1'
import { MenuListBeliMobil } from '../menuSection/menuListBeliMobil'
import { MenuListArtikel } from '../menuSection/menuListArtikel'
import { MenuListLainnya } from '../menuSection/menuListLainnya'

interface Props {
  data: NavbarItemResponse[]
}

export const SidebarBurger = ({ data }: Props) => {
  const { sideMenu, patchSideMenu } = useSideMenuContext()
  const { sideMenuList, patchSideMenuList } = useSideMenuListContext()
  const [top, setTop] = useState(0)

  useEffect(() => {
    if (sideMenuList.isMenuLevel1 === true) {
      setTop(pageHeaderHeight + 28)
    } else {
      setTop(0)
    }
  }, [sideMenuList])

  // const clickClose = () => {
  //   patchSideMenu({ isOpenLevel1: false })
  //   patchSideMenuList({
  //     isMenuLevel1: true,
  //     isMenuBeliMobil: false,
  //     isMenuArtikel: false,
  //     isMenuLainnya: false,
  //   })
  // }

  const handleOnClose = () => {
    patchSideMenu({ isOpenLevel1: false })
    patchSideMenuList({
      isMenuLevel1: true,
      isMenuBeliMobil: false,
      isMenuArtikel: false,
      isMenuLainnya: false,
    })
  }

  const styles = {
    bmBurgerButton: {
      width: '36px',
      height: '30px',
      left: '106px',
      top: '20px',
    },
    bmBurgerBars: {
      background: '#373a47',
      display: 'none',
    },
    bmBurgerBarsHover: {
      background: '#a90000',
    },
    bmCrossButton: {
      height: '24px',
      width: '24px',
    },
    bmCross: {
      background: '#bdc3c7',
    },
    bmMenuWrap: {
      position: 'fixed',
      width: '290px',
      height: '100vh',
      top: `${top}px`,
      left: '0',
      borderTop: `1px solid ${colors.line}`,
      zIndex: '999999',
    },
    bmMenu: {
      background: `${colors.white}`,
      fontSize: '1.15em',
    },
    bmMorphShape: {
      fill: '#373a47',
    },
    bmItemList: {
      color: `${colors.white}`,
      padding: '0',
      display: 'flex',
      flexDirection: 'column',
    },
    bmItem: {
      display: 'inline-block',
    },
    bmOverlay: {
      background: 'rgba(0, 0, 0, 0.3)',
      top: `${top}px`,
      left: '0',
    },
  }

  return (
    <>
      <Menu
        pageWrapId={'page-wrap'}
        styles={styles}
        customBurgerIcon={false}
        customCrossIcon={false}
        isOpen={sideMenu.isOpenLevel1}
        onClose={handleOnClose}
      >
        {sideMenuList.isMenuLevel1 && (
          <MenuListLevel1 isShow={true} data={data} />
        )}
        {sideMenuList.isMenuBeliMobil && (
          <Wrap>
            <MenuListBeliMobil data={data} />
          </Wrap>
        )}
        {sideMenuList.isMenuArtikel && (
          <Wrap>
            <MenuListArtikel data={data} />
          </Wrap>
        )}
        {sideMenuList.isMenuLainnya && (
          <Wrap>
            <MenuListLainnya data={data} />
          </Wrap>
        )}
      </Menu>

      {/* {sideMenu.isOpenLevel1 && sideMenuList.isMenuLevel1 && (
        <IconWrapper isOnLevel1={true} onClick={() => clickClose()}>
          <CloseWithCircle />
        </IconWrapper>
      )}
      {sideMenu.isOpenLevel1 && !sideMenuList.isMenuLevel1 && (
        <IconWrapper isOnLevel1={false} onClick={() => clickClose()}>
          <CloseWithCircle />
        </IconWrapper>
      )} */}
    </>
  )
}

const Wrap = styled.div`
  padding: 20px 17px 0;
`

// const IconWrapper = styled.div<{ isOnLevel1: boolean }>`
//   position: absolute;
//   top: ${({ isOnLevel1 }) => (isOnLevel1 ? '70px' : '10px')};
//   right: 16px;
//   z-index: 1001;
// `
