import { LanguageCode, SessionStorageKey } from 'utils/enum'
// import { getNewFunnelAllRecommendations } from 'services/newFunnel'
// import { getCarModelDetailsById } from 'services/recommendations'
import { CarRecommendation, CarVariantRecommendation } from 'utils/types'
import { getModelPriceRange } from './carModelUtils/carModelUtils'

import { getSessionStorage, saveSessionStorage } from './handler/sessionStorage'

// export const getVariantId = async (model: string, variant: string) => {
//   const response = await getNewFunnelAllRecommendations()
//   const allCar = response.data.carRecommendations

//   const currentModel = allCar.filter(
//     (value: CarRecommendation) =>
//       value.model.replace(/ +/g, '-').toLowerCase() === model,
//   )

//   const response2: any = await getCarModelDetails(
//     currentModel[0].id,
//     '?city=jakarta&cityId=118',
//   )
//   const variantList = response2.data.variants

//   const currentVariant = variantList.filter(
//     (value: CarVariantRecommendation) =>
//       value.name.replace(/ +/g, '-').toLowerCase().replace('/', '') === variant,
//   )

//   return currentVariant[0].id
// }

export const savePreviouslyViewed = (car: CarRecommendation) => {
  const previouslyCarList = getSessionStorage(
    SessionStorageKey.PreviouslyViewed,
  ) as CarRecommendation[]
  if (previouslyCarList) {
    const filter = previouslyCarList.find(
      (item: CarRecommendation) => item.id === car.id,
    )
    // QUEUE LOGIC
    const arr = previouslyCarList
    if (!filter) {
      if (previouslyCarList.length == 7) {
        arr.pop()
        arr.unshift(car)
      } else {
        arr.unshift(car)
      }
      saveSessionStorage(
        SessionStorageKey.PreviouslyViewed,
        JSON.stringify(arr),
      )
    } else {
      const carPrice = getModelPriceRange(car, LanguageCode.id)

      for (let i = 0; i < previouslyCarList.length; i++) {
        const savedCarPrice = getModelPriceRange(
          previouslyCarList[i],
          LanguageCode.id,
        )

        if (car.id === previouslyCarList[i].id && carPrice !== savedCarPrice) {
          // same car, different price
          // will be updated & put in first index
          previouslyCarList.splice(i, 1)
          previouslyCarList.unshift(car)
        } else if (
          car.id === previouslyCarList[i].id &&
          carPrice === savedCarPrice
        ) {
          // same car-same price will be put in first index
          const index = arr.findIndex(
            (item: CarRecommendation) => item.id === car.id,
          )
          arr.splice(index, 1)
          arr.unshift(filter)
        }
      }

      saveSessionStorage(
        SessionStorageKey.PreviouslyViewed,
        JSON.stringify(arr),
      )
    }
  } else {
    saveSessionStorage(
      SessionStorageKey.PreviouslyViewed,
      JSON.stringify([car]),
    )
  }
}
