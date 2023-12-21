import { createContext, useContext, useState } from 'react'
import {
  CarDetail,
  CarModelResponse,
  CarVariantDetails,
  CityOtrOption,
} from 'utils/types'
import { BodyTypes } from 'utils/types/carModel'
import { UsedCarDetail, UsedCarRecommendation } from 'utils/types/context'
import { COMData } from 'utils/types/models'
import { CarModelDetailsResponse, CarRecommendation } from 'utils/types/props'
import { BrandList } from 'utils/types/utils'

export interface UsedCarContextType {
  car: CarDetail | null
  saveCar: (data: CarDetail) => void
  carOfTheMonth: COMData[] | []
  saveCarOfTheMonth: (data: COMData[]) => void
  typeCar: BodyTypes[] | null
  saveTypeCar: (data: BodyTypes[]) => void
  carModel: CarModelResponse | null
  saveCarModel: (data: CarModelResponse) => void
  carModelDetails: CarModelDetailsResponse | null
  saveCarModelDetails: (data: CarModelDetailsResponse) => void
  carVariantDetails: CarVariantDetails | null
  saveCarVariantDetails: (data: CarVariantDetails) => void
  recommendation: UsedCarRecommendation[] | []
  saveRecommendation: (data: UsedCarRecommendation[] | []) => void
  recommendationToyota: CarRecommendation[] | []
  saveRecommendationToyota: (data: CarRecommendation[] | []) => void
  detail: UsedCarDetail | null
  saveDetail: (data: UsedCarDetail) => void
  totalItems: number | null
  saveTotalItems: (data: number) => void
  cityList: CityOtrOption[] | []
  saveCityList: (data: CityOtrOption[] | []) => void
  brandList: BrandList[] | []
  saveBrandList: (data: BrandList[] | []) => void
}

export interface UsedCarContextProps
  extends Pick<
    UsedCarContextType,
    | 'car'
    | 'carOfTheMonth'
    | 'typeCar'
    | 'carModel'
    | 'carModelDetails'
    | 'carVariantDetails'
    | 'recommendation'
    | 'recommendationToyota'
    | 'totalItems'
    | 'detail'
    | 'cityList'
    | 'brandList'
  > {
  children: React.ReactNode
}

export const UsedCarContext = createContext<UsedCarContextType>({
  car: null,
  saveCar: () => {},
  carOfTheMonth: [],
  saveCarOfTheMonth: () => {},
  typeCar: null,
  saveTypeCar: () => {},
  carModel: null,
  saveCarModel: () => {},
  carModelDetails: null,
  saveCarModelDetails: () => {},
  carVariantDetails: null,
  saveCarVariantDetails: () => {},
  recommendation: [],
  saveRecommendation: () => {},
  recommendationToyota: [],
  saveRecommendationToyota: () => {},
  detail: null,
  saveDetail: () => {},
  totalItems: null,
  saveTotalItems: () => {},
  cityList: [],
  saveCityList: () => {},
  brandList: [],
  saveBrandList: () => {},
})

export const UsedCarProvider = ({
  children,
  car = null,
  carOfTheMonth = [],
  typeCar = null,
  carModel = null,
  carModelDetails = null,
  carVariantDetails = null,
  recommendation = [],
  detail = null,
  recommendationToyota = [],
  totalItems = null,
  cityList = [],
  brandList = [],
}: UsedCarContextProps) => {
  const [currentCar, setCar] = useState<CarDetail | null>(car)
  const [currentCarofTheMonth, setCarofTheMonth] = useState<COMData[] | []>(
    carOfTheMonth,
  )
  const [currentTypeCar, setTypeCar] = useState<BodyTypes[] | null>(typeCar)
  const [currentCarModel, setCarModel] = useState<CarModelResponse | null>(
    carModel,
  )
  const [currentCarModelDetails, setCarModelDetails] =
    useState<CarModelDetailsResponse | null>(carModelDetails)
  const [currentCarVariantDetails, setCarVariantDetails] =
    useState<CarVariantDetails | null>(carVariantDetails)
  const [currentRecommendation, setRecommendation] = useState<
    UsedCarRecommendation[] | []
  >(recommendation)
  const [currentDetail, setDetail] = useState<UsedCarDetail | null>(detail)
  const [currentRecommendationToyota, setRecommendationToyota] = useState<
    CarRecommendation[] | []
  >(recommendationToyota)
  const [currentTotalItems, setTotalItems] = useState<number | null>(totalItems)
  const [currentCityList, setCityList] = useState<CityOtrOption[] | []>(
    cityList,
  )
  const [currentBrandList, setBrandList] = useState<BrandList[] | []>(brandList)

  const saveCar = (car: CarDetail) => {
    setCar(car)
  }

  const saveTypeCar = (typeCar: BodyTypes[]) => {
    setTypeCar(typeCar)
  }

  const saveCarOfTheMonth = (carOfTheMonth: COMData[]) => {
    setCarofTheMonth(carOfTheMonth)
  }

  const saveCarModel = (carModel: CarModelResponse) => {
    setCarModel(carModel)
  }

  const saveCarModelDetails = (carModelDetailsData: CarModelDetailsResponse) =>
    setCarModelDetails(carModelDetailsData)

  const saveCarVariantDetails = (carVariantDetailsData: CarVariantDetails) =>
    setCarVariantDetails(carVariantDetailsData)

  const saveRecommendation = (
    recommendationData: UsedCarRecommendation[] | [],
  ) => {
    setRecommendation(recommendationData)
  }

  const saveDetail = (detailData: UsedCarDetail | null) => {
    setDetail(detailData)
  }

  const saveRecommendationToyota = (
    recommendationData: CarRecommendation[] | [],
  ) => {
    setRecommendationToyota(recommendationData)
  }

  const saveTotalItems = (totalItems: number | null) => {
    setTotalItems(totalItems)
  }
  const saveCityList = (cityList: CityOtrOption[] | []) => {
    setCityList(cityList)
  }
  const saveBrandList = (brandList: BrandList[] | []) => {
    setBrandList(brandList)
  }

  return (
    <UsedCarContext.Provider
      value={{
        car: currentCar,
        saveCar,
        typeCar: currentTypeCar,
        saveTypeCar,
        carOfTheMonth: currentCarofTheMonth,
        saveCarOfTheMonth,
        carModel: currentCarModel,
        saveCarModel,
        carModelDetails: currentCarModelDetails,
        saveCarModelDetails,
        carVariantDetails: currentCarVariantDetails,
        saveCarVariantDetails,
        recommendation: currentRecommendation,
        saveRecommendation,
        detail: currentDetail,
        saveDetail,
        recommendationToyota: currentRecommendationToyota,
        saveRecommendationToyota,
        totalItems: currentTotalItems,
        saveTotalItems,
        cityList: currentCityList,
        saveCityList,
        brandList: currentBrandList,
        saveBrandList,
      }}
    >
      {children}
    </UsedCarContext.Provider>
  )
}

export const usedCar = () => useContext(UsedCarContext)
