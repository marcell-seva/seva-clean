import React from 'react'
import styled from 'styled-components'
import { useSideMenuListContext } from 'services/context/sideMenuListContext'
import { removeWhitespacesAndToLowerCase } from 'utils/stringUtils'
import elementId from 'helpers/elementIds'
import { NavbarItemResponse } from 'utils/types/utils'
import { handleEventTrackingArticle } from 'helpers/amplitude/trackNavigationMenu'
import { BackItem } from './backItem'
import { SidebarItem } from './sidebarItem'

interface Props {
  data: NavbarItemResponse[]
}

export const MenuListArtikel = ({ data }: Props) => {
  const { patchSideMenuList } = useSideMenuListContext()
  const artikelData = data.filter(
    (item) =>
      removeWhitespacesAndToLowerCase(item.menuName) ===
      removeWhitespacesAndToLowerCase('Artikel'),
  )[0]

  const onClickArticleMenu = (articleCode: string) => () => {
    handleEventTrackingArticle(articleCode)
  }

  return (
    <>
      <div
        onClick={() =>
          patchSideMenuList({
            isMenuLevel1: true,
            isMenuArtikel: false,
          })
        }
      >
        <BackItem label={'Artikel'} />
      </div>
      <Spacing />
      {artikelData.subMenu.map((item, index) => {
        if (item.status) {
          return (
            <>
              <a
                data-testid={
                  elementId.Homepage.HeaderMenu.SubMenu + item.menuName
                }
                key={index}
                href={'https://' + item.menuUrl}
                onClick={onClickArticleMenu(item.menuCode)}
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
