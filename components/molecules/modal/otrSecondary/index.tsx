import React, { useState } from 'react'
import styles from '../../../../styles/OTRSecondary.module.css'
import { IconCross, IconLocation, IconSearch } from '../../../atoms'

export default function OTRSecondary({ data, onClick }: any) {
  const [isCrossShow, setIsCrossShow] = useState<boolean>(false)
  const [isListShow, setIsListShow] = useState<boolean>(false)
  const [input, setInput] = useState<string>('')
  const [city, setCity] = useState<any>(data)

  const handleChange = (payload: string) => {
    setInput(payload)
    filterData(payload)
    if (payload === '') setIsCrossShow(false)
    else setIsCrossShow(true)
  }

  const clearInput = () => {
    setInput('')
    setIsCrossShow(false)
    setIsListShow(false)
  }

  const filterData = (params: string) => {
    const tempData = data
    const newData = tempData.filter((item: any) => {
      const itemData = `${item.cityName.toUpperCase()}`
      const paramsData = params.toUpperCase()

      return itemData.indexOf(paramsData) > -1
    })
    if (newData.length > 0 && params !== '') {
      setIsListShow(true)
      setCity(newData)
    } else setIsListShow(false)
  }

  return (
    <div className={styles.modalLocation}>
      <div className={styles.wrapper}>
        <div className={styles.closeModal} onClick={onClick}>
          <IconCross width={24} height={24} color="#002373" />
        </div>
        <div className={styles.info}>
          <IconLocation width={30} height={30} />
          <h2 className={styles.headerText}>
            Pilih kota Kamu untuk menampilkan harga yang sesuai
          </h2>
          <p className={styles.descText}>(Pilih sesuai KTP) </p>
          <div className={styles.wrapperInput}>
            <input
              type="text"
              value={input}
              onChange={(e) => handleChange(e.target.value)}
              className={styles.input}
              placeholder="Jakarta Utara"
            />
            {isCrossShow ? (
              <div
                className={styles.wrapperIconCross}
                onClick={() => clearInput()}
              >
                <IconCross width={24} height={24} />
              </div>
            ) : (
              <IconSearch width={18} height={18} />
            )}
          </div>

          {isListShow && (
            <div className={styles.cityList}>
              {city.map((item: any) => (
                <button key={item.id} className={styles.buttonCityList}>
                  {item.cityName}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
