import { useState } from 'react'
import { IconCross, IconSearch, IconUser, Logo } from '../../../../atoms'
import styles from '../../../../../styles/Header.module.css'
import { api } from '../../../../../services/api'
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

export default function TopBarDesktop({ isLoggedIn }: any) {
  const [isCrossShow, setIsCrossShow] = useState<boolean>(false)
  const [isVariantShow, setIsVariantShow] = useState<boolean>(false)
  const [input, setInput] = useState<string>('')
  const [variantList, setVariantList] = useState<Array<Variant>>([])

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
    const firstName = name[0].slice(0, 1)
    const lastName = name[1].slice(0, 1)
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
      {!isLoggedIn ? (
        <div className={styles.wrapperInitialAuth}>
          <a
            href="https://www.seva.id/masuk-akun"
            className={styles.initialAuthMain}
          >
            <IconUser width={15} height={15} color="#FFFFFF" />
            <p className={styles.initialText}>Masuk / Daftar</p>
          </a>
        </div>
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
}
