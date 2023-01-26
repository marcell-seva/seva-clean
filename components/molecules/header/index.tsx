import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import { api } from '../../../services/api'
import styles from '../../../styles/Header.module.css'
import { IconCross, IconDots, IconSearch, IconUser } from '../../atoms'
import sevaHeader from '../../../assets/images/logo/seva-header.png'
interface ListNavbarProps {
  name: string
  redirect: string
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
export default function Header({ data, onOpenModalOTR }: any) {
  const [isShow, setIsShow] = useState<boolean>(false)
  const [input, setInput] = useState<string>('')
  const [isCrossShow, setIsCrossShow] = useState<boolean>(false)
  const [isVariantShow, setIsVariantShow] = useState<boolean>(false)
  const [variantList, setVariantList] = useState<Array<Variant>>([])

  const ListNavBarMenu = ({ redirect, name }: ListNavbarProps) => (
    <li className={styles.navBar}>
      <Link className={styles.headerText} href={redirect}>
        {name}
      </Link>
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

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.main}>
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
          <div>
            <button className={styles.initialAuthMain}>
              <IconUser width={15} height={15} color="#FFFFFF" />
              <p className={styles.initialText}>Masuk / Daftar</p>
            </button>
          </div>
        </div>
      </div>
      <div className={styles.wrapperSubMain}>
        <div className={styles.subMain}>
          <ul className={styles.wrapperMain}>
            {data.map((item: any, key: number) => (
              <ListNavBarMenu key={key} name={item.menuName} redirect="#" />
            ))}
          </ul>
          <div onClick={onOpenModalOTR}>
            <p className={styles.labelText}>Beli Mobil di </p>
            <p className={styles.cityText}>Pilih Kota</p>
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
