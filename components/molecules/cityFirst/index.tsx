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
import { useMediaQuery } from 'react-responsive'

export const CityFirst = () => {
  const router = useRouter()
  const [interactive, setInteractive] = useState(false)
  const isMobile = useMediaQuery({ query: '(max-width: 1024px)' })
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

  const [showCity, setShowCity] = useState(false)
  const showCondition =
    isMobile && filterCity.length > 0 && !currentCity && !isIn30DaysInterval()

  const [cityListApi, setCityListApi] = useState<Array<CityOtrOption>>([])

  const checkCitiesData = () => {
    if (cityListApi.length === 0 && showCity) {
      api.getCities().then((res) => {
        setCityListApi(res.data)
      })
    }
  }

  const showConditionCity = () => {
    if (!interactive) {
      setInteractive(true)
      setShowCity(showCondition)
    }
  }

  useEffect(() => {
    checkCitiesData()
  }, [])

  useEffect(() => {
    ;['scroll'].forEach((ev) => window.addEventListener(ev, showConditionCity))

    return () => {
      ;['scroll'].forEach((ev) =>
        window.removeEventListener(ev, showConditionCity),
      )
    }
  }, [router.pathname, interactive])

  return (
    <CitySelectorModal
      isOpen={showCity}
      onClickCloseButton={() => {
        saveLocalStorage(
          LocalStorageKey.LastTimeSelectCity,
          new Date().toISOString(),
        )
        setInteractive(true)
        setShowCity(false)
      }}
      cityListFromApi={cityListApi}
    />
  )
}
