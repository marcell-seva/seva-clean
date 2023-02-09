import { useContext, useState } from 'react'
import {
  IconCross,
  IconLogout,
  IconSearch,
  IconUser,
  Logo,
} from '../../../../atoms'
import styles from '../../../../../styles/Header.module.css'
import { api } from '../../../../../services/api'
import { destroySessionMoEngage } from '../../../../../services/moengage'
import { setAmplitudeUserId } from '../../../../../services/amplitude'
import {
  AuthContext,
  AuthContextType,
} from '../../../../../services/context/authContext'
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

export default function TopBarDesktop() {
  const { isLoggedIn, userData } = useContext(AuthContext) as AuthContextType
  const [isCrossShow, setIsCrossShow] = useState<boolean>(false)
  const [isVariantShow, setIsVariantShow] = useState<boolean>(false)
  const [input, setInput] = useState<string>('')
  const [variantList, setVariantList] = useState<Array<Variant>>([])
  const [isUserInfoShow, setIsUserInfoShow] = useState<boolean>(false)

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
      setIsVariantShow(false)
      throw error
    }
  }

  const parseProductUrl = (variant: string, type: string) => {
    if (variant === null) {
      return '/'
    } else {
      const variantParsed: string = variant.split(' ')[0].toLowerCase()
      const typeParsed: string = type.replace(/ /g, '-').toLowerCase()
      const url: string = `https://www.seva.id/mobil-baru/${variantParsed}/${typeParsed}`
      return url
    }
  }
  const getUserInitial = (payload: string) => {
    const name = payload.split(' ')
    const firstName = name[0]?.slice(0, 1)
    const lastName = name[1]?.slice(0, 1)
    return firstName + lastName
  }

  const handleChange = (payload: string) => {
    setInput(payload)
    if (payload === '') {
      setIsVariantShow(false)
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

  const handleUserInfoClick = () => {
    setIsUserInfoShow(!isUserInfoShow)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('customerId')
    localStorage.removeItem('seva-cust')
    sessionStorage.removeItem('customerId')

    destroySessionMoEngage()
    setAmplitudeUserId(null)
    window.location.reload()
  }

  return (
    <div className={styles.barDesktop}>
      <Logo />
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
      {isLoggedIn && userData !== null ? (
        <div className={styles.userInfo}>
          <div className={styles.wrapperUserName}>
            <p className={styles.userWelcomeText}>Selamat Datang</p>
            <p className={styles.userNameText}>{userData!.fullName}</p>
          </div>
          <button
            className={styles.initialUsernameText}
            onClick={() => handleUserInfoClick()}
          >
            {getUserInitial(userData!.fullName)}
          </button>
        </div>
      ) : (
        <div className={styles.wrapperInitialAuth}>
          <a
            href="https://www.seva.id/masuk-akun"
            className={styles.initialAuthMain}
          >
            <IconUser width={15} height={15} color="#FFFFFF" />
            <p className={styles.initialText}>Masuk / Daftar</p>
          </a>
        </div>
      )}
      {isUserInfoShow && (
        <div className={styles.accountInfo}>
          <a
            href="https://www.seva.id/akun/profil"
            className={styles.accountSelector}
          >
            <IconUser width={22} height={22} color="#52627A" />
            <p className={styles.accountText}>Akun Saya</p>
          </a>
          <button onClick={() => logout()} className={styles.accountSelector}>
            <IconLogout width={22} height={22} color="#52627a" />
            <p className={styles.accountText}>Keluar</p>
          </button>
        </div>
      )}
    </div>
  )
}
