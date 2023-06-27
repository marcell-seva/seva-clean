import React, { useContext, useState } from 'react'
import { LocationContext, LocationContextType } from 'services/context'
import styles from '../../../../styles/saas/components/molecules/OTRSecondary.module.scss'
import { IconCross, IconLocation, IconSearch } from 'components/atoms'
import { Location } from 'utils/types'

type TypesOTRSecondary = {
  data: Array<Location>
  onClick: () => void
}
const OTRSecondary: React.FC<TypesOTRSecondary> = ({
  data,
  onClick,
}): JSX.Element => {
  const [isCrossShow, setIsCrossShow] = useState<boolean>(false)
  const [isListShow, setIsListShow] = useState<boolean>(false)
  const [input, setInput] = useState<string>('')
  const [city, setCity] = useState<Array<Location>>(data)
  const titleText: string =
    'Pilih kota Kamu untuk menampilkan harga yang sesuai'
  const descText: string = '(Pilih sesuai KTP)'

  const { location, isInit, saveLocation } = useContext(
    LocationContext,
  ) as LocationContextType

  const handleChange = (payload: string): void => {
    setInput(payload)
    filterData(payload)
    if (payload === '') setIsCrossShow(false)
    else setIsCrossShow(true)
  }

  const selectLocation = (payload: any): void => {
    setIsListShow(false)
    saveLocation(payload)
    onClick()
  }

  const clearInput = (): void => {
    setInput('')
    setIsCrossShow(false)
    setIsListShow(false)
  }

  const filterData = (params: string): void => {
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
          <h2 className={styles.headerText}>{titleText}</h2>
          <p className={styles.descText}>{descText}</p>
          <div className={styles.wrapperInput}>
            <input
              type="text"
              value={input}
              onChange={(e) => handleChange(e.target.value)}
              className={styles.input}
              placeholder={isInit ? 'Jakarta Utara' : location.cityName}
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
                <button
                  key={item.id}
                  className={styles.buttonCityList}
                  onClick={() => selectLocation(item)}
                >
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

export default OTRSecondary
