import Image from 'next/image'
import React, { useContext, useState } from 'react'
import styles from '../../../../styles/OTRPrimary.module.css'
import { Capsule, IconCross, IconLocation } from '../../../atoms'
import { LocationContext } from '../../../../services/context/locationContext'

type LocationContextType = {
  location: Location
  saveLocation: (data: Location) => void
}

export default function OTRPrimary({ data, onClick }: any) {
  const { saveLocation } = useContext(
    LocationContext,
  ) as unknown as LocationContextType
  const [isListShow, setIsListShow] = useState<boolean>(false)
  const [input, setInput] = useState<string>('')
  const [city, setCity] = useState<any>(data)
  const staticCity = [
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

  const handleChange = (payload: string) => {
    setInput(payload)
    filterData(payload)
  }

  const handleOnClick = (payload: Location) => {
    saveLocation(payload)
    onClick()
  }

  const selectLocation = (payload: any) => {
    saveLocation(payload)
    setIsListShow(false)
    onClick()
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
        <div className={styles.wrapperLocator}>
          <Image
            src="https://www.seva.id/static/media/CitySelectorBackgroundMobile.0bda639bbb6387a2830874684c0af082.svg"
            width={320}
            height={388}
            priority
            alt="seva-modal-mobile"
            className={styles.bgImageMobile}
          />
          <Image
            src="https://www.seva.id/static/media/CitySelectorBackgroundDesktop.c7c088fbdaf6912d331555837ab523be.svg"
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
              <pre className={styles.headerText}>Pilih kota dulu </pre>
              <pre className={styles.headerText}>untuk info harga OTR </pre>
              <pre className={styles.headerText}>
                dan stok yang lebih akurat
              </pre>
            </h1>
            <h1 className={styles.dekstopHeader}>
              <pre className={styles.headerText}>
                Pilih kota dulu untuk info harga OTR
              </pre>
              <pre className={styles.headerText}>
                dan stok yang lebih akurat
              </pre>
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
            <p className={styles.descText}>atau cari Kota yang sesuai KTP</p>
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
