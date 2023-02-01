import React, { useState } from 'react'
import { api } from '../../../../services/api'
import styles from '../../../../styles/Search.module.css'
import { IconChevronLeft, IconCross, IconSearch } from '../../../atoms'

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

export default function Search({ onSearchMobileClose }: any) {
  const [input, setInput] = useState<string>('')
  const [isCrossShow, setIsCrossShow] = useState<boolean>(false)
  const [isVariantShow, setIsVariantShow] = useState<boolean>(false)
  const [variantList, setVariantList] = useState<Array<Variant>>([])

  const getVariantProduct = async (value: string) => {
    try {
      const params: string = `?query=${value}&city=jakarta&cityId=189`
      const res: any = await api.getVariantCar(params)
      if (res.length > 0) {
        setIsVariantShow(true)
        setVariantList(res)
      } else {
        setIsVariantShow(false)
        setVariantList([])
      }
    } catch (error) {
      throw error
    }
  }

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
    setVariantList([])
    setIsVariantShow(false)
  }

  const parseProductUrl = (variant: string, type: string) => {
    const variantParsed: string = variant.split(' ')[0].toLowerCase()
    const typeParsed: string = type.replace(/ /g, '-').toLowerCase()
    const url: string = `https://www.seva.id/mobil-baru/${variantParsed}/${typeParsed}`
    return url
  }

  return (
    <div className={styles.wrapperSearch}>
      {isVariantShow && (
        <div className={styles.wrapperListVariant}>
          {variantList.map((item: Variant) => (
            <a
              href={parseProductUrl(item.variant_title, item.model)}
              key={item.id}
              className={styles.list}
            >
              {item.variant_title}
            </a>
          ))}
        </div>
      )}
      <div className={styles.wrapperInput}>
        <div onClick={onSearchMobileClose} className={styles.iconChevronLeft}>
          <IconChevronLeft width={18} height={18} />
        </div>
        <input
          type="text"
          value={input}
          className={styles.input}
          placeholder="Cari Model Mobil..s."
          onChange={(e) => handleChange(e.target.value)}
        />
        {isCrossShow ? (
          <div onClick={() => clearInput()}>
            <IconCross width={24} height={24} />
          </div>
        ) : (
          <IconSearch width={24} height={24} />
        )}
      </div>
    </div>
  )
}
