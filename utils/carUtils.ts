import { LanguageCode, SessionStorageKey } from 'utils/models/models'
import { CarRecommendation } from 'utils/types/utils'
import { getModelPriceRange } from './carModelUtils/carModelUtils'
import { getSessionStorage, saveSessionStorage } from './sessionstorageUtils'

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
