import React from 'react'
import styled from 'styled-components'
import { SidebarItem } from './sidebarItem'
import { useSideMenuListContext } from 'context/sideMenuListContext/sideMenuListContext'
import { BackItem } from './backItem'
import { removeWhitespacesAndToLowerCase } from 'utils/stringUtils'
import { handleEventTrackingLainnya } from 'helpers/amplitude/trackNavigationMenu'
import elementId from 'helpers/elementIds'
import { NavbarItemResponse } from 'utils/types/utils'
import { useRouter } from 'next/router'

interface Props {
  data: NavbarItemResponse[]
}

export const MenuListLainnya = ({ data }: Props) => {
  const router = useRouter()
  const { patchSideMenuList } = useSideMenuListContext()
  const lainnyaData = data.filter(
    (item) =>
      removeWhitespacesAndToLowerCase(item.menuName) ===
      removeWhitespacesAndToLowerCase('Lainnya'),
  )[0]

  const clickHandler = (item: NavbarItemResponse) => () => {
    handleEventTrackingLainnya(item.menuCode)
    if (item.menuUrl.includes('www.') || item.menuUrl.includes('ext.')) {
      window.open('https://' + item.menuUrl)
    } else {
      router.push(item.menuUrl)
    }
  }

  return (
    <>
      <div
        onClick={() =>
          patchSideMenuList({
            isMenuLevel1: true,
            isMenuLainnya: false,
          })
        }
      >
        <BackItem label={'Lainnya'} />
      </div>
      <Spacing />
      {lainnyaData.subMenu.map((item, index) => {
        if (item.status) {
          return (
            <>
              <a
                data-testid={
                  elementId.Homepage.HeaderMenu.SubMenu + item.menuName
                }
                key={index}
                onClick={clickHandler(item)}
              >
                <SidebarItem label={item.menuName} toggleNew={item.toggleNew} />
              </a>
              <Spacing />
            </>
          )
        }
      })}
    </>
  )
}

const Spacing = styled.div`
  height: 28px;
`
