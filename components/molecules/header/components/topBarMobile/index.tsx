import Image from 'next/image'
import React, { useState } from 'react'
import styles from '../../../../../styles/Header.module.css'
import {
  IconBurgerMenu,
  IconChevronDown,
  IconChevrongRight,
  IconChevronLeft,
  IconDots,
  IconSearch,
} from '../../../../atoms'
import sevaHeader from '../../../../../assets/images/logo/seva-header.svg'

interface ListSideBarProps {
  item: any
  isNew?: boolean
}

export default function TopBarMobile({ data, isLoggedIn, onSearchClick }: any) {
  const [isShow, setIsShow] = useState<boolean>(false)
  const [isSubSideBarShow, setIsSubSideBarShow] = useState<boolean>(false)
  const [typeSubSideBar, setTypeSubSideBar] = useState<string>('')
  const [typeSideBar, setTypeSideBar] = useState<string>('')
  const [dataSideBar, setDataSideBar] = useState<any>([])

  const getUserInitial = (payload: string) => {
    const name = payload.split(' ')
    const firstName = name[0].slice(0, 1)
    const lastName = name[1].slice(0, 1)
    return firstName + lastName
  }

  const ListSubMenuBar = ({ item }: any) => {
    return (
      <div key={item.id}>
        <div
          onClick={() => setTypeSubSideBar(item.menuName)}
          className={styles.childContent}
        >
          <p className={styles.childTitleText}>{item.menuName}</p>
          <div>
            <IconChevronDown width={13} height={13} />
          </div>
        </div>
        {typeSubSideBar === item.menuName && (
          <div className={styles.selectorDetail}>
            {item.subMenu.map((subMenu: any) => {
              return (
                <a
                  href={subMenu.menuUrl}
                  key={subMenu.id}
                  className={styles.descText}
                >
                  {subMenu.menuName}
                </a>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  const ListSideBarMenu = ({ item, isNew }: ListSideBarProps) => {
    if (isNew) {
      return (
        <a className={styles.mainSelector} href="#">
          <div className={styles.wrapperTag}>
            <p className={styles.titleTextNew}>{item.menuName}</p>
            <div className={styles.newTag}>BARU!</div>
          </div>
          <IconChevrongRight width={13} height={13} />
        </a>
      )
    }
    if (item.subMenu.length > 0) {
      return (
        <div
          className={styles.mainSelector}
          onClick={() => {
            setIsSubSideBarShow(true)
            setTypeSideBar(item.menuName)
            setDataSideBar(item)
          }}
        >
          <p className={styles.titleText}>{item.menuName}</p>
          <IconChevrongRight width={13} height={13} />
        </div>
      )
    } else {
      return (
        <a className={styles.mainSelector} href={item.menuUrl}>
          <p className={styles.titleText}>{item.menuName}</p>
          <IconChevrongRight width={13} height={13} />
        </a>
      )
    }
  }

  const ListSubMenuBarSingle = ({ item }: any) => {
    return (
      <a href={item.menuUrl} key={item.id} className={styles.descText}>
        {item.menuName}
      </a>
    )
  }

  return (
    <div className={styles.barMobile}>
      <div className={styles.bar}>
        <div onClick={() => setIsShow(!isShow)}>
          <IconBurgerMenu width={26} height={26} />
        </div>
        <Image
          src={sevaHeader}
          width={120}
          height={75}
          alt="seva-logo"
          className={styles.logo}
        />
      </div>
      <div className={styles.searchIcon} onClick={onSearchClick}>
        <IconSearch width={20} height={20} color="#002373" />
      </div>
      <div
        className={isShow ? styles.wrapperSideBar : styles.wrapperSideBarClose}
      >
        <div className={isShow ? styles.sideBar : styles.sideBarClose}>
          {isSubSideBarShow ? (
            <>
              <div
                onClick={() => setIsSubSideBarShow(false)}
                className={styles.childSelector}
              >
                <IconChevronLeft width={13} height={13} />
                <p className={styles.childTitleText}>{typeSideBar}</p>
              </div>

              {dataSideBar.subMenu.map((list: any) => {
                if (list.subMenu.length > 0) {
                  return <ListSubMenuBar item={list} key={list.id} />
                } else {
                  return <ListSubMenuBarSingle item={list} key={list.id} />
                }
              })}
            </>
          ) : (
            <>
              <div className={styles.authSection}>
                <div className={styles.userAuth}>
                  <div className={styles.userInfo}>
                    <div className={styles.initialUsernameText}>
                      {getUserInitial('Marcell Antonius Dermawan')}
                    </div>
                    <div className={styles.wrapperUserName}>
                      <p className={styles.userWelcomeText}>Selamat Datang</p>
                      <p className={styles.userNameText}>
                        Marcell Antonius Dermawan
                      </p>
                    </div>
                  </div>
                  <div>
                    <IconDots width={20} height={20} />
                  </div>
                </div>
                {/* <button className={styles.initialAuth}>
                <Image
                  src="https://www.seva.id/static/media/Profile.1dd80031bfb540b10391f2274639eee3.svg"
                  width={15}
                  height={15}
                  alt="profile-icon"
                  className={styles.profileIcon}
                />
                <p className={styles.initialText}>Masuk / Daftar</p>
              </button> */}
              </div>
              {data.map((item: any, key: number) => (
                <ListSideBarMenu key={key} item={item} isNew={item.toggleNew} />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
