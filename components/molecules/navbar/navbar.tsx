import React, { useState, useEffect, useContext } from 'react'
import styled from 'styled-components'
import { getMenus } from 'services/menu'
import { removeWhitespacesAndToLowerCase } from 'utils/stringUtils'
import urls from 'helpers/urls'
import { useMediaQuery } from 'react-responsive'
import { decryptValue, encryptValue } from 'utils/encryptionUtils'
import { getLocalStorage, saveLocalStorage } from 'utils/localstorageUtils'
import { NavbarItemResponse } from 'utils/types/utils'
import { LocalStorageKey } from 'utils/models/models'
import { NavbarItem } from './navbarItem'
import { BeliMobilMenu } from './beliMobilMenu'
import { MenuContext } from 'context/menuContext'

export const Navbar = () => {
  const { dataMenu: menus } = useContext(MenuContext)

  const filterCategory = (
    data: Array<NavbarItemResponse>,
    category: string,
  ) => {
    const temp: Array<NavbarItemResponse> = data
    const result: NavbarItemResponse = temp?.filter(
      (item: NavbarItemResponse) =>
        removeWhitespacesAndToLowerCase(item.menuName) ===
        removeWhitespacesAndToLowerCase(category),
    )[0]
    return result
  }

  const [beliMobilData, setBeliMobilData] = useState<NavbarItemResponse>(
    filterCategory(menus, 'Beli Mobil'),
  )
  const [fasilitasDanaData, setFasilitasDanaData] =
    useState<NavbarItemResponse>(filterCategory(menus, 'Fasilitas Dana'))
  const [layananSuratData, setLayananSuratData] = useState<NavbarItemResponse>(
    filterCategory(menus, 'Layanan Surat Kendaraan'),
  )
  const [artikelData, setArtikelData] = useState<NavbarItemResponse>(
    filterCategory(menus, 'Artikel'),
  )
  const [tentangSevaData, setTentangSevaData] = useState<NavbarItemResponse>(
    filterCategory(menus, 'Tentang Seva'),
  )
  const [lainnyaData, setLainnyaData] = useState<NavbarItemResponse>(
    filterCategory(menus, 'Lainnya'),
  )
  const isMobile = useMediaQuery({ query: '(max-width: 1024px)' })

  useEffect(() => {
    checkMenusData()
  }, [])

  const setMenusData = (payload: any) => {
    const encryptedData: any = encryptValue(JSON.stringify(payload))
    saveLocalStorage(LocalStorageKey.menu, encryptedData)
  }

  const checkMenusData = () => {
    const data: string | null = getLocalStorage(LocalStorageKey.menu)
    if (data === null) {
      getMenus().then((res) => {
        const result = res.data.data
        setMenuCategory(result)
      })
    } else {
      const decryptedValue: any = JSON.parse(decryptValue(data))
      setMenusData(decryptedValue)
      setMenuCategory(decryptedValue)
    }
  }

  const setMenuCategory = (data: Array<NavbarItemResponse>): void => {
    const mobilData: NavbarItemResponse = filterCategory(data, 'Beli Mobil')
    const refinancingData: NavbarItemResponse = filterCategory(
      data,
      'Fasilitas Dana',
    )
    const eDocData: NavbarItemResponse = filterCategory(
      data,
      'Layanan Surat Kendaraan',
    )
    const artikelData: NavbarItemResponse = filterCategory(data, 'Artikel')
    const tentangSevaData: NavbarItemResponse = filterCategory(
      data,
      'Tentang Seva',
    )
    const lainnyaData: NavbarItemResponse = filterCategory(data, 'Lainnya')

    setBeliMobilData(mobilData)
    setFasilitasDanaData(refinancingData)
    setLayananSuratData(eDocData)
    setArtikelData(artikelData)
    setTentangSevaData(tentangSevaData)
    setLainnyaData(lainnyaData)
  }

  const dataPromo: NavbarItemResponse = {
    id: 99,
    menuName: 'Promo',
    menuDesc: 'Promo',
    menuCode: 'promo',
    menuParent: 'null',
    menuUrl: urls.promoCumaDiSeva,
    menuLevel: 1,
    toggleNew: false,
    status: true,
    subMenu: [],
  }

  return (
    <nav>
      <StyledList isMobile={isMobile}>
        {beliMobilData && <BeliMobilMenu data={beliMobilData} />}
        {fasilitasDanaData && (
          <NavbarItem type="fasilitas-dana" data={fasilitasDanaData} />
        )}
        {layananSuratData && (
          <NavbarItem type="layanan-surat-kendaraan" data={layananSuratData} />
        )}
        <NavbarItem type="promo" data={dataPromo} />
        {artikelData && (
          <NavbarItem type="article" isButton data={artikelData} />
        )}
        {tentangSevaData && (
          <NavbarItem type="tentang-seva" data={tentangSevaData} />
        )}
        {lainnyaData && <NavbarItem type="other" isButton data={lainnyaData} />}
      </StyledList>
    </nav>
  )
}

const StyledList = styled.div<{
  isMobile: boolean
}>`
  display: ${({ isMobile }) => (isMobile ? 'none' : 'flex')};
  list-style: none;
`
