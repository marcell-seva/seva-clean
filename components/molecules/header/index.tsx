import Image from 'next/image'
import React, { useState } from 'react'
import { api } from '../../../services/api'
import styles from '../../../styles/Header.module.css'
import {
  IconBurgerMenu,
  IconChevrongRight,
  IconCross,
  IconDots,
  IconLocation,
  IconSearch,
  IconTriangleDown,
  IconUser,
} from '../../atoms'
import sevaHeader from '../../../assets/images/logo/seva-header.svg'
import { useIsMobile } from '../../../utils'
interface ListNavbarProps {
  name: string
  redirect: string
  isHaveChild?: boolean
}

interface ListSideBarProps {
  name: string
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
  const [isShow, setIsShow] = useState<boolean>(false)
  const [input, setInput] = useState<string>('')
  const [isCrossShow, setIsCrossShow] = useState<boolean>(false)
  const [isVariantShow, setIsVariantShow] = useState<boolean>(false)
  const [variantList, setVariantList] = useState<Array<Variant>>([])
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

  const ListSideBarMenu = ({ name, isNew }: ListSideBarProps) => {
    return isNew ? (
      <a className={styles.mainSelector} href="#">
        <div className={styles.wrapperTag}>
          <p className={styles.titleTextNew}>{name}</p>
          <div className={styles.newTag}>BARU!</div>
        </div>
        <p>seva</p>
      </a>
    ) : (
      <a className={styles.mainSelector} href="#">
        <p className={styles.titleText}>{name}</p>
        <p>seva</p>
      </a>
    )
  }

  const handleChange = (payload: string) => {
    setInput(payload)
    if (payload === '') {
      setIsCrossShow(false)
      setVariantList([])
    } else {
      setIsCrossShow(true)
      getVariantProduct(payload)
    }
  }

  const clearInput = () => {
    setInput('')
    setIsCrossShow(false)
    setVariantList([])
    setIsVariantShow(false)
  }

  const getVariantProduct = async (value: string) => {
    try {
      const params: string = `?query=${value}&city=jakarta&cityId=118`
      const res: any = await api.getVariantCar(params)
      if (res.length > 0) {
        setIsVariantShow(true)
        setVariantList(res)
      } else {
        setVariantList([])
        setIsVariantShow(false)
      }
    } catch (error) {
      throw error
    }
  }

  const TopBarMobile = () => (
    <div className={styles.barMobile}>
      <div className={styles.bar}>
        <IconBurgerMenu width={26} height={26} />
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
    </div>
  )

  const parseProductUrl = (variant: string, type: string) => {
    const variantParsed: string = variant.split(' ')[0].toLowerCase()
    const typeParsed: string = type.replace(/ /g, '-').toLowerCase()
    const url: string = `https://www.seva.id/mobil-baru/${variantParsed}/${typeParsed}`
    return url
  }

  const getUserInitial = (payload: string) => {
    const name = payload.split(' ')
    const firstName = name[0].slice(0, 1)
    const lastName = name[1].slice(0, 1)
    return firstName + lastName
  }
  const TopBarDesktop = () => (
    <div className={styles.barDesktop}>
      <Image
        src={sevaHeader}
        width={120}
        height={75}
        alt="seva-logo"
        className={styles.logo}
      />
      {isVariantShow && (
        <div className={styles.wrapperListVariant}>
          {variantList.map((item: Variant) => {
            return (
              <a
                href={parseProductUrl(item.variant_title, item.model)}
                key={item.id}
                className={styles.list}
              >
                {item.variant_title}
              </a>
            )
          })}
        </div>
      )}
      <div className={styles.wrapperInput}>
        <IconSearch width={18} height={18} color="grey" />
        <input
          type="text"
          value={input}
          className={styles.input}
          placeholder="Cari Model Mobil..."
          onChange={(e) => handleChange(e.target.value)}
        />
        {isCrossShow && (
          <div onClick={() => clearInput()}>
            <IconCross width={24} height={24} />
          </div>
        )}
      </div>
      {!isLoggedIn ? (
        <a
          href="https://www.seva.id/masuk-akun"
          className={styles.initialAuthMain}
        >
          <IconUser width={15} height={15} color="#FFFFFF" />
          <p className={styles.initialText}>Masuk / Daftar</p>
        </a>
      ) : (
        <div className={styles.userInfo}>
          <div className={styles.wrapperUserName}>
            <p className={styles.userWelcomeText}>Selamat Datang</p>
            <p className={styles.userNameText}>Marcell Antonius Dermawan</p>
          </div>
          <div className={styles.initialUsernameText}>
            {getUserInitial('Marcell Antonius Dermawan')}
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {isMobile ? <TopBarMobile /> : <TopBarDesktop />}
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
      {isShow && (
        <div className={styles.wrapperSideBar}>
          <div className={styles.sideBar}>
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
              <ListSideBarMenu key={key} name={item.menuName} isNew />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
