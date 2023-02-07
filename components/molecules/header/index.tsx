import Image from 'next/image'
import React, { useState } from 'react'
import { api } from '../../../services/api'
import styles from '../../../styles/Header.module.css'
import {
  IconBurgerMenu,
  IconChevronDown,
  IconChevrongRight,
  IconChevronLeft,
  IconCross,
  IconDots,
  IconLocation,
  IconSearch,
  IconTriangleDown,
  IconUser,
  Logo,
} from '../../atoms'
import sevaHeader from '../../../assets/images/logo/seva-header.svg'
import { useIsMobile } from '../../../utils'
import TopBarDesktop from './components/topBarDekstop'
import TopBarMobile from './components/topBarMobile'
interface ListNavbarProps {
  name: string
  redirect: string
  isHaveChild?: boolean
}

interface ListSideBarProps {
  item: any
  isNew?: boolean
}
interface Variant {
  id: string
  model: string
  code: string
  variant_name: string
  variant_title: string
  price_currency: string
  price_value: number
  price_formatted_value: string
}

export default function Header({
  data,
  onOpenModalOTR,
  onSearchClick,
  isLoggedIn,
}: any) {
  const isMobile = useIsMobile()
  const redirectRootPath = 'https://seva.id'

  const DropDownWithChild = ({ item }: any) => {
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

  const DropDownWithOutChild = ({ item }: any) => {
    return (
      <li className={styles.listMain}>
        <a
          href={redirectRootPath + item.menuUrl}
          className={styles.wrapperListMenu}
        >
          <p className={styles.listMainText}>{item.menuName}</p>
        </a>
      </li>
    )
  }

  const ListNavBarMenuSingle = ({ menuName, url }: any) => (
    <li className={styles.navBar}>
      <a href={url} className={styles.headerText}>
        {menuName}
      </a>
    </li>
  )

  const ListNavBarMenu = ({ item }: any) => (
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
          <TopBarMobile
            data={data}
            isLoggedIn={isLoggedIn}
            onSearchClick={onSearchClick}
          />
        ) : (
          <TopBarDesktop isLoggedIn={isLoggedIn} />
        )}
      </div>
      <div className={styles.wrapperSubMain}>
        <div className={styles.subMain}>
          <ul className={styles.wrapperMain}>
            {data.map((item: any, key: number) => {
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
              <p className={styles.cityText}>Pilih Kota</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
