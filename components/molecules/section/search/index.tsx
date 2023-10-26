import React, { useState } from 'react'
import styles from 'styles/components/molecules/Search.module.scss'
import { IconChevronLeft, IconCross, IconSearch } from 'components/atoms'
import { Variant, PropsSearchMobile } from 'utils/types'
import { getVariantCar } from 'services/api'

const Search: React.FC<PropsSearchMobile> = ({
  onSearchMobileClose,
}): JSX.Element => {
  const [input, setInput] = useState<string>('')
  const [isCrossShow, setIsCrossShow] = useState<boolean>(false)
  const [isVariantShow, setIsVariantShow] = useState<boolean>(false)
  const [variantList, setVariantList] = useState<Array<Variant>>([])

  const getVariantProduct = async (value: string): Promise<any> => {
    try {
      const params: string = `?query=${value}&city=jakarta&cityId=189`
      const res: any = await getVariantCar(params)
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

  const handleChange = (payload: string): void => {
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

  const clearInput = (): void => {
    setInput('')
    setIsCrossShow(false)
    setVariantList([])
    setIsVariantShow(false)
  }

  const parseProductUrl = (variant: string, type: string): string => {
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
          placeholder="Cari Model Mobil..."
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
export default Search
