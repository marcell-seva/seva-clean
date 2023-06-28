import Image from 'next/image'
import styles from '../../../../styles/saas/components/molecules/OTRPrimary.module.scss'
import React, { useContext, useState } from 'react'
import { Capsule, IconCross, IconLocation } from 'components/atoms'
import { LocationContext, LocationContextType } from 'services/context'
import { Location } from 'utils/types'
import citySelectorMobile from '/assets/images/modal/CitySelectorBackgroundMobile.svg'
import citySelectorDesktop from '/assets/images/modal/CitySelectorBackgroundDesktop.svg'

type TypeOTRPrimary = {
  data: Array<Location>
  onClick: () => void
}
const OTRPrimary: React.FC<TypeOTRPrimary> = ({
  data,
  onClick,
}): JSX.Element => {
  const { saveLocation } = useContext(LocationContext) as LocationContextType
  const [isListShow, setIsListShow] = useState<boolean>(false)
  const [input, setInput] = useState<string>('')
  const [city, setCity] = useState<Array<Location>>(data)
  const headerMobileFirstText: string = 'Pilih kota dulu'
  const headerMobileSecondText: string = 'untuk info harga OTR'
  const headerMobileThirdText: string = 'dan stok yang lebih akurat'
  const headerDesktopFirstText: string = 'Pilih kota dulu untuk info harga OTR'
  const headerDesktopSecondText: string = 'dan stok yang lebih akurat'
  const labelText: string = 'atau cari Kota yang sesuai KTP'

  const staticCity: Array<Location> = [
    {
      cityCode: 'bekasi',
      cityName: 'Bekasi',
      id: 180,
      province: 'Jawa Barat',
    },
    {
      cityCode: 'medan',
      cityName: 'Medan',
      id: 153,
      province: 'Sumatera Utara',
    },
    {
      cityCode: 'tangerang',
      cityName: 'Tangerang',
      id: 222,
      province: 'Banten',
    },
    {
      cityCode: 'jakarta',
      cityName: 'Jakarta Selatan',
      id: 119,
      province: 'DKI Jakarta',
    },
    {
      cityCode: 'surabaya',
      cityName: 'Surabaya',
      id: 218,
      province: 'Jawa Timur',
    },
  ]

  const handleChange = (payload: string): void => {
    setInput(payload)
    filterData(payload)
  }

  const handleOnClick = (payload: Location): void => {
    saveLocation(payload)
    onClick()
  }

  const selectLocation = (payload: any): void => {
    saveLocation(payload)
    setIsListShow(false)
    onClick()
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
        <div className={styles.wrapperLocator}>
          <Image
            src={citySelectorMobile}
            width={320}
            height={388}
            priority
            alt="seva-modal-mobile"
            className={styles.bgImageMobile}
          />
          <Image
            src={citySelectorDesktop}
            width={740}
            height={390}
            alt="seva-modal-desktop"
            className={styles.bgImageDekstop}
          />
          <div className={styles.info}>
            <div className={styles.closeModal}>
              <div onClick={onClick}>
                <IconCross width={24} height={24} color="#FFFFFF" />
              </div>
            </div>
            <h1 className={styles.mobileHeader}>
              <pre className={styles.headerText}>{headerMobileFirstText}</pre>
              <pre className={styles.headerText}>{headerMobileSecondText} </pre>
              <pre className={styles.headerText}>{headerMobileThirdText}</pre>
            </h1>
            <h1 className={styles.dekstopHeader}>
              <pre className={styles.headerText}>{headerDesktopFirstText}</pre>
              <pre className={styles.headerText}>{headerDesktopSecondText}</pre>
            </h1>
            <div className={styles.suggestedLocation}>
              {staticCity.map((item: any) => {
                return (
                  <Capsule
                    key={item.id}
                    item={item}
                    onClick={() => handleOnClick(item)}
                  />
                )
              })}
            </div>
            <p className={styles.descText}>{labelText}</p>
            <div className={styles.wrapperInput}>
              <IconLocation width={17} height={18} color="#D83130" />
              <input
                type="text"
                value={input}
                className={styles.input}
                onChange={(e: any) => handleChange(e.target.value)}
                placeholder="Pilih kota sesuai KTP"
              />
            </div>
            {isListShow && (
              <div className={styles.wrapperList}>
                {city.map((item: any) => (
                  <button
                    key={item.id}
                    className={styles.list}
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
    </div>
  )
}

export default OTRPrimary
