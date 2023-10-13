import React, { useEffect, useState } from 'react'
import styles from 'styles/components/organisms/productDetailEmptyState.module.scss'
import { Link } from 'components/atoms'
import { CitySelectorModal } from 'components/molecules'
import { saveLocalStorage } from 'utils/handler/localStorage'
import { LocalStorageKey } from 'utils/enum'

import { useLocalStorage } from 'utils/hooks/useLocalStorage'
import { CityOtrOption } from 'utils/types/utils'
import Image from 'next/image'
import { api } from 'services/api'

const EmptyCar = '/revamp/illustration/empty-car.webp'

interface PropsPDPEmptyState {
  message: string
  model: string
}

interface OptionCity {
  cityName: string
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void
}
export interface Location {
  cityName: string
  cityCode: string
  id: number
  province: string
}

export const ProductDetailEmptyState: React.FC<PropsPDPEmptyState> = ({
  message,
  model,
}): JSX.Element => {
  const optionText = 'dan masih banyak kota lainnya'
  const [cityListApi, setCityListApi] = useState<Array<CityOtrOption>>([])
  const [isOpenCitySelectorModal, setIsOpenCitySelectorModal] =
    useState<boolean>(false)
  const [cityOtr] = useLocalStorage<CityOtrOption | null>(
    LocalStorageKey.CityOtr,
    null,
  )
  const [cityRecommendations, setCityRecommendations] =
    useState<Array<Location>>()

  const OptionCity: React.FC<OptionCity> = ({
    cityName,
    onClick,
  }): JSX.Element => (
    <button className={styles.button} onClick={onClick}>
      {cityName}
    </button>
  )

  const setLocationOTR = (payload: Location) => {
    saveLocalStorage(LocalStorageKey.CityOtr, JSON.stringify(payload))
    window.location.reload()
  }

  const checkCitiesData = () => {
    if (cityListApi.length === 0) {
      api.getCities().then((res) => {
        setCityListApi(res)
      })
    }
  }

  const getFunnelCityRecommendations = async () => {
    try {
      const payload = {
        modelName: model,
        city: cityOtr?.cityCode || 'jakarta',
      }
      const data = await api.postNewFunnelCityRecommendations(payload)
      setCityRecommendations(data)
    } catch (error) {}
  }

  useEffect(() => {
    checkCitiesData()
    getFunnelCityRecommendations()
  }, [])

  return (
    <>
      <div className={styles.wrapper}>
        <Image
          src={EmptyCar}
          width={250}
          height={130}
          alt="empty-detail-car"
          className={styles.emptyImage}
        />
        <h2 className={styles.textInfo}>Mobil Tidak Ditemukan di Kotamu</h2>
        <p className={styles.textChangeCity}>
          Silakan{' '}
          <Link
            message="ubah lokasimu"
            onClick={() => setIsOpenCitySelectorModal(true)}
          />
        </p>
        <div className={styles.wrapperCityOption}>
          <p className={styles.textCarOption}>{message}</p>
          <div className={styles.citySuggestion}>
            {cityRecommendations &&
              cityRecommendations.map((item: any, key: number) => (
                <OptionCity
                  key={key}
                  cityName={item.cityName}
                  onClick={() => setLocationOTR(item)}
                />
              ))}
          </div>
          <p className={styles.textSuggestion}>{optionText}</p>
        </div>
      </div>
      <CitySelectorModal
        isOpen={isOpenCitySelectorModal}
        onClickCloseButton={() => setIsOpenCitySelectorModal(false)}
        cityListFromApi={cityListApi}
      />
    </>
  )
}
