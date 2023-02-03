import React, { useState } from 'react'
import { api } from '../../../services/api'
import styles from '../../../styles/LoanSection.module.css'
import { IconCross, IconSearch } from '../../atoms'
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

export default function LoanSection() {
  const [input, setInput] = useState<string>('')
  const [isCrossShow, setIsCrossShow] = useState<boolean>(false)
  const [variantList, setVariantList] = useState<Array<Variant>>([])
  const [isVarianShow, setIsVariantShow] = useState<boolean>(false)

  const handleChange = (payload: string) => {
    setInput(payload)
    if (payload === '') {
      setIsCrossShow(false)
      setIsVariantShow(false)
      setVariantList([])
    } else {
      setIsCrossShow(true)
      getVariantProduct(payload)
    }
  }

  const clearInput = () => {
    setInput('')
    setIsCrossShow(false)
    setIsVariantShow(false)
    setVariantList([])
  }

  const parseProductUrl = (variant: string, type: string) => {
    const variantParsed: string = variant?.split(' ')[0].toLowerCase()
    const typeParsed: string = type.replace(/ /g, '-').toLowerCase()
    const url: string = `https://www.seva.id/mobil-baru/${variantParsed}/${typeParsed}/kredit`
    return url
  }

  const getVariantProduct = async (value: string) => {
    try {
      const params: string = `?query=${value}&city=jakarta&cityId=118`
      const res: any = await api.getVariantCar(params)
      if (res.length > 0) {
        setVariantList(res)
        setIsVariantShow(true)
      } else {
        setVariantList([])
        setIsVariantShow(false)
      }
    } catch (error) {
      throw error
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <h1 className={styles.title}>Yuk, coba hitung sekarang!</h1>
        <p className={styles.desc}>
          Buat kamu yang serba #JelasDariAwal, langsung hitung cicilan buat
          mobil impianmu.
        </p>
        <div className={styles.wrapperInput}>
          <IconSearch width={18} height={18} color="grey" />
          <input
            type="text"
            value={input}
            className={styles.input}
            placeholder="cari model mobil yang mau dihitung"
            onChange={(e) => handleChange(e.target.value)}
          />
          {isCrossShow && (
            <div onClick={() => clearInput()} className={styles.closeButton}>
              <IconCross width={16} height={16} />
            </div>
          )}
        </div>
        {isVarianShow && (
          <div className={styles.wrapperListVariant}>
            {variantList.map((item: Variant) => (
              <a
                href={parseProductUrl(item.variant_title, item.model)}
                key={item.id}
                className={styles.list}
              >
                <p className={styles.titleText}>{item.variant_title}</p>
                <p className={styles.priceText}>{item.price_formatted_value}</p>
              </a>
            ))}
          </div>
        )}
        <p className={styles.info}>Contoh: Fortuner</p>
      </div>
    </div>
  )
}
