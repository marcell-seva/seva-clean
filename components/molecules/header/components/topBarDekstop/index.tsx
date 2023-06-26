import { useContext, useState } from 'react'
import {
  IconCross,
  IconLogout,
  IconSearch,
  IconUser,
  Logo,
} from 'components/atoms'
import styles from 'styles/saas/components/molecules/Header.module.scss'
import { api } from 'services/api'
import { destroySessionMoEngage } from 'services/moengage'
import { setAmplitudeUserId } from 'services/amplitude'
import { AuthContext, AuthContextType } from 'services/context'
import { Variant } from 'utils/types'

const TopBarDesktop: React.FC = () => {
  const { isLoggedIn, userData, filter, saveFilterData } = useContext(
    AuthContext,
  ) as AuthContextType
  const [isCrossShow, setIsCrossShow] = useState<boolean>(false)
  const [isVariantShow, setIsVariantShow] = useState<boolean>(false)
  const [input, setInput] = useState<string>('')
  const [variantList, setVariantList] = useState<Array<Variant>>([])
  const [isUserInfoShow, setIsUserInfoShow] = useState<boolean>(false)
  const redirectLoginUrl: string = 'https://www.seva.id/masuk-akun'
  const redirectProfileUrl: string = 'https://www.seva.id/akun/profil'
  const redirectUrlNewCar: string = 'https://www.seva.id/mobil-baru'

  const getVariantProduct = async (value: string): Promise<any> => {
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

  const parseProductUrl = (variant: string, type: string): string => {
    if (variant === null) {
      return '/'
    } else {
      const variantParsed: string = variant.split(' ')[0].toLowerCase()
      const typeParsed: string = type.replace(/ /g, '-').toLowerCase()
      const url: string = `https://www.seva.id/mobil-baru/${variantParsed}/${typeParsed}`
      return url
    }
  }

  const getUserInitial = (payload: string): string => {
    const name = payload.split(' ')
    const firstName = name[0]?.slice(0, 1)
    const lastName = name[1]?.slice(0, 1)
    return firstName + lastName
  }

  const handleChange = (payload: string): void => {
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

  const handlePressEnter = (payload: string) => {
    const dataFilter = {
      carModel: payload,
      bodyType: [],
      brand: [],
      tenure: 5,
      downPaymentAmount: '',
      downPaymentType: '',
      monthlyIncome: '',
      monthlyInstallment: '',
      age: '',
      sortBy: 'highToLow',
    }
    saveFilterData(dataFilter)
    window.location.href = redirectUrlNewCar
  }

  const clearInput = (): void => {
    setInput('')
    setIsCrossShow(false)
    setVariantList([])
    setIsVariantShow(false)
  }

  const handleUserInfoClick = () => setIsUserInfoShow(!isUserInfoShow)

  const logout = (): void => {
    localStorage.removeItem('token')
    localStorage.removeItem('customerId')
    localStorage.removeItem('seva-cust')
    localStorage.removeItem('filter')
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
          onKeyDown={(e: any) =>
            e.key === 'Enter' && handlePressEnter(e.target.value)
          }
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
          <a href={redirectLoginUrl} className={styles.initialAuthMain}>
            <IconUser width={15} height={15} color="#FFFFFF" />
            <p className={styles.initialText}>Masuk / Daftar</p>
          </a>
        </div>
      )}
      {isUserInfoShow && (
        <div className={styles.accountInfo}>
          <a href={redirectProfileUrl} className={styles.accountSelector}>
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

export default TopBarDesktop
