import React, { useContext, useEffect, useMemo, useState } from 'react'
import { AxiosResponse } from 'axios'
import { saveLocalStorage } from 'utils/handler/localStorage'
import { LocalStorageKey } from 'utils/enum'
import { COMImage } from './COMImage'
import { Information } from './information'
import { COMData } from 'utils/types/utils'
import { HomePageDataLocalContext } from 'pages'
import { api } from 'services/api'
import { useCar } from 'services/context/carContext'
import { getCity } from 'utils/hooks/useGetCity'

interface CarOfMonthProps {
  onSendOffer: () => void
  // onCheckLogin: () => void
}

export const CarOfMonth = ({ onSendOffer }: CarOfMonthProps) => {
  const { carOfTheMonth } = useCar()
  const [tabIndex, setTabIndex] = useState(0)
  const [comDataNew, setComDataNew] = useState<COMData[]>(carOfTheMonth)
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)

  const carBrand = useMemo(() => {
    const brands = comDataNew?.map((item) => ({
      name: item.brand,
      imgUrl: item.model?.data.image ?? '',
    }))

    return brands ?? []
  }, [comDataNew])

  const carModel = useMemo(() => {
    const model = comDataNew?.map((item) => ({
      name: item.model?.carModel.model ?? '',
      desc: item.model?.description ?? '',
      link: item.model?.url ?? '',
    }))

    return model ?? []
  }, [comDataNew])

  useEffect(() => {
    const currentCar = JSON.stringify({
      Car_Brand: carBrand[tabIndex]?.name,
      Car_Model: carModel[tabIndex]?.name,
    })
    saveLocalStorage(LocalStorageKey.CurrentCarOfTheMonthItem, currentCar)
  }, [carBrand, carModel, tabIndex])

  useEffect(() => {
    setIsLoading(true)
    api
      .getCarofTheMonth('?city=' + getCity().cityCode)
      .then((res: { messages: string; data: COMData[] }) => {
        setComDataNew(res.data)
        setIsLoading(false)
      })
      .catch(() => {
        setIsError(true)
        setIsLoading(false)
      })
  }, [])

  if (isLoading || isError) return null
  if (comDataNew.length === 0) return null

  return (
    <div className="container-com">
      <h2 className="title-com">SEVA Car of The Month</h2>
      <div className="content-wrapper-com">
        <COMImage
          carBrand={carBrand}
          onChangeTab={(index: number) => setTabIndex(index)}
        />
        <Information
          tabIndex={tabIndex}
          carBrand={carBrand}
          carModel={carModel}
          onSendOffer={onSendOffer}
          // onCheckLogin={onCheckLogin}
        />
      </div>
    </div>
  )
}
