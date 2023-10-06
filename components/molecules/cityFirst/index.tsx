import React, { useEffect, useState } from 'react'
import { LocalStorageKey } from 'utils/enum'
import { countDaysDifference } from 'utils/handler/date'
import { getLocalStorage, saveLocalStorage } from 'utils/handler/localStorage'
import {
  carResultsUrl,
  loanCalculatorDefaultUrl,
  refinancingUrl,
  TemanSevaOnboardingUrl,
} from 'utils/helpers/routes'
import { CityOtrOption } from 'utils/types'
import CitySelectorModal from '../citySelectorModal'
import { useRouter } from 'next/router'
import { api } from 'services/api'

export const CityFirst = () => {
  const router = useRouter()
  const currentCity = getLocalStorage<CityOtrOption>(LocalStorageKey.CityOtr)
  const cityFirstRoute = [
    carResultsUrl,
    loanCalculatorDefaultUrl,
    refinancingUrl,
    TemanSevaOnboardingUrl,
    // LoginSevaUrl,
    // profileUrl,
  ]

  const isIn30DaysInterval = () => {
    const lastTimeSelectCity = getLocalStorage<string>(
      LocalStorageKey.LastTimeSelectCity,
    )
    if (!lastTimeSelectCity) {
      return false
    } else if (
      countDaysDifference(lastTimeSelectCity, new Date().toISOString()) <= 30
    ) {
      return true
    } else {
      return false
    }
  }

  const filterCity = cityFirstRoute.filter(
    (x) => router.pathname.includes(x) && !router.pathname.includes('form'),
  )
  const showCondition =
    filterCity.length > 0 && !currentCity && !isIn30DaysInterval()
  const [showCity, setShowCity] = useState(showCondition)
  const [cityListApi, setCityListApi] = useState<Array<CityOtrOption>>([])

  const checkCitiesData = () => {
    if (cityListApi.length === 0 && showCity) {
      api.getCities().then((res) => {
        setCityListApi(res.data)
      })
    }
  }

  useEffect(() => {
    checkCitiesData()
    if (showCity) {
      saveLocalStorage(
        LocalStorageKey.LastTimeSelectCity,
        new Date().toISOString(),
      )
    }
  }, [])

  useEffect(() => {
    setShowCity(showCondition)
  }, [router.pathname])

  return (
    <CitySelectorModal
      isOpen={showCity}
      onClickCloseButton={() => setShowCity(false)}
      cityListFromApi={cityListApi}
    />
  )
}
