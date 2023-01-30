import Image from 'next/image'
import Link from 'next/link'
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
export default function Header({ data, onOpenModalOTR, onSearchClick }: any) {
  const [isShow, setIsShow] = useState<boolean>(false)
  const [input, setInput] = useState<string>('')
  const [isCrossShow, setIsCrossShow] = useState<boolean>(false)
  const [isVariantShow, setIsVariantShow] = useState<boolean>(false)
  const [variantList, setVariantList] = useState<Array<Variant>>([])
  const [isSubShown, setIsSubShown] = useState<boolean>(false)

  const ListNavBarMenu = ({
    redirect,
    name,
    isHaveChild = false,
  }: ListNavbarProps) => (
    <li className={styles.navBar}>
      <Link className={styles.headerText} href={redirect}>
        {name}
      </Link>

      <ul className={styles.mainDropDown}>
        <li className={styles.listMain}>
          <div className={styles.wrapperListMenu}>
            <a href="#" className={styles.listMainText}>
              Merek
            </a>
            <div className={styles.bundleIconRight}>
              <IconChevrongRight width={16} height={16} />
            </div>
          </div>
          <ul className={styles.subDropDown}>
            <li className={styles.listSubMain}>
              <Link href="#" className={styles.listMainText}>
                Toyota
              </Link>
            </li>
          </ul>
        </li>
      </ul>
      {isHaveChild && <IconTriangleDown width={8} height={4} />}
    </li>
  )

  const ListSideBarMenu = ({ name, isNew }: ListSideBarProps) => {
    return isNew ? (
      <Link className={styles.mainSelector} href="#">
        <div className={styles.wrapperTag}>
          <p className={styles.titleTextNew}>{name}</p>
          <div className={styles.newTag}>BARU!</div>
        </div>
        <p>seva</p>
      </Link>
    ) : (
      <Link className={styles.mainSelector} href="#">
        <p className={styles.titleText}>{name}</p>
        <p>seva</p>
      </Link>
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
      } else setVariantList([])
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
          {variantList.map((item: Variant) => (
            <button key={item.id} className={styles.list}>
              {item.variant_title}
            </button>
          ))}
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
      <button className={styles.initialAuthMain}>
        <IconUser width={15} height={15} color="#FFFFFF" />
        <p className={styles.initialText}>Masuk / Daftar</p>
      </button>
    </div>
  )

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <TopBarMobile />
        <TopBarDesktop />
      </div>
      <div className={styles.wrapperSubMain}>
        <div className={styles.subMain}>
          <ul className={styles.wrapperMain}>
            {data.map((item: any, key: number) => {
              if (
                item.menuName === 'Fasilitas Dana' ||
                item.menuName === 'Teman SEVA'
              ) {
                return <div key={key}></div>
              } else {
                return (
                  <ListNavBarMenu
                    key={key}
                    name={item.menuName}
                    redirect="#"
                    isHaveChild={item.subMenu.length > 0}
                  />
                )
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
            <button onClick={() => setIsShow(!isShow)}>test</button>
            <div className={styles.authSection}>
              <div className={styles.userAuth}>
                <div className={styles.userInfo}>
                  <div className={styles.initialUsernameText}>MA</div>
                  <div className={styles.wrapperUserName}>
                    <p className={styles.userWelcomeText}>Selamat Datang</p>
                    <p className={styles.userNameText}>Marcell Antonius</p>
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
