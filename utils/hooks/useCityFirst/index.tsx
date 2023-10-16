import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { api } from 'services/api'
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

export const useCityFirst = () => {
  const router = useRouter()
  const [interactive, setInteractive] = useState(false)
  const currentCity = getLocalStorage<CityOtrOption>(LocalStorageKey.CityOtr)
  const cityFirstRoute = [
    carResultsUrl,
    loanCalculatorDefaultUrl,
    refinancingUrl,
    TemanSevaOnboardingUrl,
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
    filterCity.length > 0 && !currentCity && !isIn30DaysInterval()

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

  const onCloseCity = () => {
    saveLocalStorage(
      LocalStorageKey.LastTimeSelectCity,
      new Date().toISOString(),
    )
    setInteractive(true)
    setShowCity(false)
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

  return { showCity, onCloseCity }
}
