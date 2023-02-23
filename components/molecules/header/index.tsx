import React, { useContext, useState } from 'react'
import styles from '../../../styles/Header.module.css'
import { IconChevrongRight, IconLocation, IconTriangleDown } from '../../atoms'
import { useIsMobile } from '../../../utils'
import TopBarDesktop from './components/topBarDekstop'
import TopBarMobile from './components/topBarMobile'
import {
  LocationContext,
  LocationContextType,
} from '../../../services/context/locationContext'
import { Menu, PropsListNavBarMenu } from '../../../utils/types'

type TypeHeader = {
  dataMenu: Array<Menu>
  onOpenModalOTR: (e: React.MouseEvent<HTMLDivElement>) => void
  onSearchClick: () => void
}

type TypeMenu = {
  item: Menu
}

const Header: React.FC<TypeHeader> = ({
  dataMenu,
  onOpenModalOTR,
  onSearchClick,
}): JSX.Element => {
  const isMobile = useIsMobile()
  const redirectRootPath: string = 'https://seva.id'
  const { location, isInit } = useContext(
    LocationContext,
  ) as LocationContextType

  const removeUnnecessaryDataFilter = (payload: string): void => {
    let brand = payload === 'Semua Merek' ? [] : [payload]
    const dataFilterLocal = localStorage.getItem('filter')
    const dataFilterParsed =
      dataFilterLocal !== null ? JSON.parse(dataFilterLocal) : null
    const newDataFilter = {
      ...dataFilterParsed,
      bodyType: [],
      brand: brand,
      carModel: '',
      tenure: 5,
      downPaymentAmount: '',
      monthlyIncome: '',
      age: '',
      sortBy: 'highToLow',
    }

    localStorage.setItem('filter', JSON.stringify(newDataFilter))
  }
  const DropDownWithChild: React.FC<TypeMenu> = ({ item }): JSX.Element => {
    return (
      <li className={styles.listMain}>
        <div className={styles.wrapperListMenu}>
          <p className={styles.listMainText}>{item.menuName}</p>
          <div className={styles.bundleIconRight}>
            <IconChevrongRight width={16} height={16} />
          </div>
        </div>
        <ul className={styles.subDropDown}>
          {item.subMenu.map((listSubMenu: any, key: number) => (
            <li key={key} className={styles.listSubMain}>
              <a
                onClick={() =>
                  removeUnnecessaryDataFilter(listSubMenu.menuName)
                }
                href={redirectRootPath + listSubMenu.menuUrl}
                className={styles.listSubMainText}
              >
                {listSubMenu.menuName}
              </a>
            </li>
          ))}
        </ul>
      </li>
    )
  }

  const DropDownWithOutChild: React.FC<TypeMenu> = ({ item }): JSX.Element => {
    return (
      <li className={styles.listMain}>
        <a href={`https://${item.menuUrl}`} className={styles.wrapperListMenu}>
          <p className={styles.listMainText}>{item.menuName}</p>
        </a>
      </li>
    )
  }

  const ListNavBarMenuSingle: React.FC<PropsListNavBarMenu> = ({
    menuName,
    url,
  }): JSX.Element => (
    <li className={styles.navBar}>
      <a href={url} className={styles.headerText}>
        {menuName}
      </a>
    </li>
  )

  const ListNavBarMenu: React.FC<TypeMenu> = ({ item }): JSX.Element => (
    <li className={styles.navBar}>
      <p className={styles.headerText}>{item.menuName}</p>
      <IconTriangleDown width={8} height={4} />
      <ul className={styles.mainDropDown}>
        {item.subMenu.map((listMain: any, key: number) => {
          if (listMain.menuName === 'Tipe Bodi') return
          if (listMain.subMenu.length > 0) {
            return <DropDownWithChild item={listMain} key={key} />
          } else return <DropDownWithOutChild item={listMain} key={key} />
        })}
      </ul>
    </li>
  )

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {isMobile ? (
          <TopBarMobile data={dataMenu} onSearchClick={onSearchClick} />
        ) : (
          <TopBarDesktop />
        )}
      </div>
      <div className={styles.wrapperSubMain}>
        <div className={styles.subMain}>
          <ul className={styles.wrapperMain}>
            {dataMenu.map((item: any, key: number) => {
              if (key === 1) {
                return (
                  <ListNavBarMenuSingle
                    key={key}
                    menuName="Promo"
                    url="https://www.seva.id/info/promo/"
                  />
                )
              }
              if (item.menuName === 'Tentang SEVA')
                return (
                  <ListNavBarMenuSingle
                    key={key}
                    menuName="Tentang SEVA"
                    url={`https://${item.menuUrl}`}
                  />
                )
              if (
                item.menuName !== 'Fasilitas Dana' &&
                item.menuName !== 'Teman SEVA' &&
                item.menuName !== 'Tentang SEVA'
              ) {
                return <ListNavBarMenu key={key} item={item} />
              }
            })}
          </ul>
          <div onClick={onOpenModalOTR} className={styles.modalOTR}>
            <IconLocation width={16} height={16} color="#002373" />
            <div className={styles.selectLocation}>
              <p className={styles.labelText}>
                Beli Mobil di
                <span className={styles.iconTriangleDown}>
                  <IconTriangleDown width={8} height={8} />
                </span>
              </p>
              <p className={styles.cityText}>
                {isInit ? 'Pilih Kota ' : location.cityName}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header
