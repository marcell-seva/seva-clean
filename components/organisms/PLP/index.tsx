import clsx from 'clsx'
import { CSAButton } from 'components/atoms'
import { CarDetailCard, FooterMobile, HeaderMobile } from 'components/organisms'
import elementId from 'helpers/elementIds'
import { MoengageEventName, setTrackEventMoEngage } from 'helpers/moengage'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useCar } from 'services/context/carContext'
import { useFunnelQueryData } from 'services/context/funnelQueryContext'
import { LocalStorageKey, SessionStorageKey } from 'utils/enum'
import { getConvertFilterIncome } from 'utils/filterUtils'
import { getToken } from 'utils/handler/auth'
import { Currency } from 'utils/handler/calculation'
import { delayedExec } from 'utils/handler/delayed'
import { getLocalStorage, saveLocalStorage } from 'utils/handler/localStorage'
import { getSessionStorage } from 'utils/handler/sessionStorage'
import { OTONewCarUrl, carResultsUrl } from 'utils/helpers/routes'
import {
  defaultCity,
  getCity,
} from 'utils/hooks/useCurrentCityOtr/useCurrentCityOtr'
import { useLocalStorage } from 'utils/hooks/useLocalStorage'
import { Location } from 'utils/types'
import {
  CarRecommendation,
  FilterParam,
  MinMaxPrice,
} from 'utils/types/context'
import { MoengageViewCarSearch } from 'utils/types/moengage'
import { AnnouncementBoxDataType, trackDataCarType } from 'utils/types/utils'
import styles from 'styles/pages/mobil-baru.module.scss'
import {
  trackEventCountly,
  valueForInitialPageProperty,
  valueForUserTypeProperty,
} from 'helpers/countly/countly'
import { CountlyEventNames } from 'helpers/countly/eventNames'
import { getPageName } from 'utils/pageName'
import { LoanRank } from 'utils/types/models'
import { decryptValue } from 'utils/encryptionUtils'
import { getCarBrand } from 'utils/carModelUtils/carModelUtils'
import { useUtils } from 'services/context/utilsContext'
import dynamic from 'next/dynamic'
import { LeadsActionParam, PageOriginationName } from 'utils/types/props'
import { getNewFunnelRecommendations } from 'utils/handler/funnel'
import { useAfterInteractive } from 'utils/hooks/useAfterInteractive'
import { useAnnouncementBoxContext } from 'services/context/announcementBoxContext'
import { getMinMaxPrice, postCheckTemanSeva } from 'services/api'
import { isCurrentCitySameWithSSR } from 'utils/hooks/useGetCity'
import { isBodyType, isBrand } from 'pages/mobil-baru/[brand]'

const Spin = dynamic(() => import('antd/lib/spin'), { ssr: false })
const LeadsFormPrimary = dynamic(() =>
  import('components/organisms').then((mod) => mod.LeadsFormPrimary),
)
const NavigationFilterMobile = dynamic(() =>
  import('components/organisms').then((mod) => mod.NavigationFilterMobile),
)
const PLPEmpty = dynamic(() =>
  import('components/organisms').then((mod) => mod.PLPEmpty),
)
const FilterMobile = dynamic(() =>
  import('components/organisms').then((mod) => mod.FilterMobile),
)
const SortingMobile = dynamic(() =>
  import('components/organisms').then((mod) => mod.SortingMobile),
)
const PopupPromo = dynamic(() =>
  import('components/organisms').then((mod) => mod.PopupPromo),
)
const PopupResultSulit = dynamic(() =>
  import('components/organisms').then((mod) => mod.PopupResultSulit),
)
// const PopupResultMudah = dynamic(() =>
//   import('components/organisms').then((mod) => mod.PopupResultMudah),
// )
const PopupResultRecommended = dynamic(() =>
  import('components/organisms').then((mod) => mod.PopupResultRecommended),
)
const CitySelectorModal = dynamic(() =>
  import('components/molecules').then((mod) => mod.CitySelectorModal),
)
const AdaOTOdiSEVALeadsForm = dynamic(() =>
  import('components/organisms').then((mod) => mod.AdaOTOdiSEVALeadsForm),
)

interface PLPProps {
  minmaxPrice: MinMaxPrice
  isOTO?: boolean
}

export const PLP = ({ minmaxPrice, isOTO = false }: PLPProps) => {
  const router = useRouter()
  const { recommendation, saveRecommendation } = useCar()
  const [alternativeCars, setAlternativeCar] = useState<CarRecommendation[]>([])
  const {
    search,
    bodyType: bodyTypeTemp,
    brand: param,
    downPaymentAmount,
    monthlyIncome,
    tenure,
    priceRangeGroup,
    age,
    sortBy,
  } = router.query as FilterParam
  const brand = isBrand(param) ? param : undefined
  const bodyType = bodyTypeTemp
    ? bodyTypeTemp
    : isBodyType(param)
    ? param?.toUpperCase()
    : undefined
  const [minMaxPrice, setMinMaxPrice] = useState<MinMaxPrice>(minmaxPrice)

  const [cityOtr] = useLocalStorage<Location | null>(
    LocalStorageKey.CityOtr,
    null,
  )
  const [resultMinMaxPrice, setResultMinMaxPrice] = useState({
    resultMinPrice: 0,
    resultMaxPrice: 0,
  })
  const { funnelQuery, patchFunnelQuery } = useFunnelQueryData()
  const [isButtonClick, setIsButtonClick] = useState(false)
  const [isResetFilter, setIsResetFilter] = useState(false)
  const showFilter =
    search ||
    bodyType ||
    brand ||
    priceRangeGroup ||
    tenure ||
    age ||
    downPaymentAmount ||
    monthlyIncome
      ? true
      : false
  funnelQuery.search = search
  funnelQuery.brand = brand?.split(',').map((item) => getCarBrand(item)) || []
  if (isBodyType(param) && !bodyTypeTemp) {
    funnelQuery.bodyType = bodyType
      ?.split(',')
      ?.map((item) => item?.toUpperCase())
  }
  const showFilterFinancial =
    age || downPaymentAmount || monthlyIncome ? true : false
  const [isFilter, setIsFilter] = useState(showFilter)
  const [isFilterCredit, setIsFilterCredit] = useState(false)
  const [isFilterFinancial, setIsFilterFinancial] =
    useState(showFilterFinancial)
  const [openLabelPromo, setOpenLabelPromo] = useState(false)
  const [openLabelResultMudah, setOpenLabelResultMudah] = useState(false)
  const [openLabelResultSulit, setOpenLabelResultSulit] = useState(false)
  const [openLabelResultInfo, setOpenLabelResultInfo] = useState(false)
  const [openSorting, setOpenSorting] = useState(false)
  const [openInterestingModal, setOpenInterestingModal] = useState(false)
  const [isProduct, setIsProduct] = useState(false)
  const [startScroll, setStartScroll] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [sticky, setSticky] = useState(false)
  const [isActive, setIsActive] = useState(false)
  const [showLoading, setShowLoading] = useState(true)
  const [isModalOpenend, setIsModalOpened] = useState<boolean>(false)
  const [page, setPage] = useState<any>(1)
  const [sampleArray, setSampleArray] = useState({
    items: recommendation.slice(0, 12),
  })
  const [isOpenCitySelectorModal, setIsOpenCitySelectorModal] = useState(false)
  const { cities, dataAnnouncementBox } = useUtils()
  const { showAnnouncementBox, saveShowAnnouncementBox } =
    useAnnouncementBoxContext()
  const [isLogin] = useState(!!getToken())
  const [dataCarForPromo, setDataCarForPromo] = useState({
    brand: '',
    model: '',
    carOrder: 0,
    loanRank: 'Null',
  })
  const user: string | null = getLocalStorage(LocalStorageKey.sevaCust)
  const filterStorage: any = getLocalStorage(LocalStorageKey.CarFilter)
  const isUsingFilterFinancial =
    !!filterStorage?.age &&
    !!filterStorage?.downPaymentAmount &&
    !!filterStorage?.monthlyIncome &&
    !!filterStorage?.tenure
  const dataCar: trackDataCarType | null = getSessionStorage(
    SessionStorageKey.PreviousCarDataBeforeLogin,
  )

  const IsShowBadgeCreditOpportunity = getSessionStorage(
    SessionStorageKey.IsShowBadgeCreditOpportunity,
  )

  const fetchMoreData = () => {
    if (sampleArray.items.length >= recommendation.length) {
      return setHasMore(false)
    }
    const timeout = setTimeout(() => {
      if (sampleArray.items.length >= 12 * page) {
        const pagePlus = page + 1
        setPage(pagePlus)
        setSampleArray({
          items: sampleArray.items.concat(
            recommendation.slice(
              12 * page,
              sampleArray.items.length > 12 * page + 12
                ? recommendation.length
                : 12 * page + 12,
            ),
          ),
        })
      }
      clearTimeout(timeout)
    }, 1000)
  }

  const cleanEffect = () => {
    if (!isCurrentCitySameWithSSR()) {
      saveRecommendation([])
    }
    setPage(1)
    setShowLoading(false)
    setSampleArray({ items: [] })
  }

  const handelSticky = (position: number) => {
    if (position > 150) return setSticky(true)
    return setSticky(false)
  }

  const handleScroll = () => {
    const position = window.pageYOffset
    handelSticky(position)
    scrollStopper()
  }

  const scrollStopper = delayedExec(
    1000,
    () => {
      setStartScroll(true)
    },
    () => {
      setStartScroll(false)
    },
  )

  const moengageViewPLP = () => {
    if (typeof priceRangeGroup === 'undefined') return
    const minPrice = priceRangeGroup
      ? String(priceRangeGroup).split('-')[0]
      : ''
    const maxPrice = priceRangeGroup
      ? String(priceRangeGroup).split('-')[1]
      : ''
    const filterIncome = getConvertFilterIncome(String(monthlyIncome))
    const properties: MoengageViewCarSearch = {
      ...(brand && { brand }),
      ...(bodyType && { carbodytype: bodyType }),
      ...(age && { age: `${age} years old` }),
      ...(monthlyIncome && {
        income: `Rp${filterIncome}`,
      }),
      ...(minPrice && { minprice: `Rp${Currency(minPrice)}` }),
      ...(maxPrice && { maxPrice: `Rp${Currency(maxPrice)}` }),
      ...(downPaymentAmount && {
        downpayment: `Rp${Currency(String(downPaymentAmount))}`,
      }),
      ...(tenure && { loantenure: `${tenure} years` }),
    }
    setTrackEventMoEngage(MoengageEventName.view_car_search, properties)
  }

  const trackLeads = (): LeadsActionParam => {
    const minPrice = funnelQuery.priceRangeGroup
      ? String(funnelQuery.priceRangeGroup).split('-')[0]
      : ''
    const maxPrice = funnelQuery.priceRangeGroup
      ? String(funnelQuery.priceRangeGroup).split('-')[1]
      : ''

    const filterIncome = getConvertFilterIncome(String(monthlyIncome))
    return {
      ...(brand && {
        Car_Brand: getCarBrand(brand),
      }),
      ...(bodyType && {
        Car_Body_Type: bodyType,
      }),
      ...(minPrice && {
        Min_Price: `Rp${Currency(String(minPrice))}`,
      }),
      ...(maxPrice && {
        Max_Price: `Rp${Currency(String(maxPrice))}`,
      }),
      ...(downPaymentAmount && {
        DP: `Rp${Currency(String(downPaymentAmount))}`,
      }),
      ...(monthlyIncome && {
        Income: `Rp${filterIncome}`,
      }),
      ...(tenure && {
        Tenure: String(tenure),
      }),
      ...(age && {
        Age: String(age),
      }),
      Page_Origination: PageOriginationName.PLPFloatingIcon,
      ...(cityOtr && { City: cityOtr.cityName }),
    }
  }

  const showLeadsForm = () => {
    setOpenInterestingModal(true)
    setIsProduct(true)
    trackEventCountly(CountlyEventNames.WEB_LEADS_FORM_BUTTON_CLICK, {
      PAGE_ORIGINATION: 'PLP',
    })
  }

  const closeLeadsForm = () => {
    setIsModalOpened(false)
  }

  const closeInterestingBtn = () => {
    setOpenInterestingModal(false)
    setIsProduct(false)
  }

  const handleShowFilter = () => {
    setIsButtonClick(true)
    trackEventCountly(CountlyEventNames.WEB_PLP_OPEN_FILTER_CLICK, {
      CURRENT_FILTER_STATUS: isFilter ? 'On' : 'Off',
    })
  }

  const handleShowSort = (open: boolean) => () => {
    setOpenSorting(open)
    trackEventCountly(CountlyEventNames.WEB_PLP_OPEN_SORT_CLICK)
  }
  const getAnnouncementBox = () => {
    if (dataAnnouncementBox) {
      const isShowAnnouncement = getSessionStorage(
        getToken()
          ? SessionStorageKey.ShowWebAnnouncementLogin
          : SessionStorageKey.ShowWebAnnouncementNonLogin,
      )
      if (typeof isShowAnnouncement !== 'undefined') {
        saveShowAnnouncementBox(isShowAnnouncement as boolean)
      } else {
        saveShowAnnouncementBox(true)
      }
    } else {
      saveShowAnnouncementBox(false)
    }
  }

  const temanSevaStatus = async () => {
    const tsLink = brand && typeof brand === 'string' && brand.includes('SEVA')
    if (tsLink) return 'Yes'
    if (user) {
      const decryptUser = JSON.parse(decryptValue(user))
      if (decryptUser.temanSevaTrxCode) {
        return 'Yes'
      }

      try {
        const temanSeva = await postCheckTemanSeva({
          phoneNumber: decryptUser.phoneNumber,
        })
        if (temanSeva.data.isTemanSeva) return 'Yes'
        return 'No'
      } catch (e) {
        return 'No'
      }
    }
  }

  const trackPLPView = async (creditBadge = 'Null') => {
    const prevPage = getSessionStorage(SessionStorageKey.PreviousPage) as any
    const filterUsage = brand || bodyType || priceRangeGroup ? 'Yes' : 'No'
    const fincapUsage =
      downPaymentAmount && tenure && age && monthlyIncome ? 'Yes' : 'No'
    const initialPage = valueForInitialPageProperty()
    const track = {
      CAR_FILTER_USAGE: filterUsage,
      FINCAP_FILTER_USAGE: fincapUsage,
      PELUANG_KREDIT_BADGE: fincapUsage === 'No' ? 'Null' : creditBadge,
      INITIAL_PAGE: initialPage,
      TEMAN_SEVA_STATUS: await temanSevaStatus(),
      USER_TYPE: valueForUserTypeProperty(),
      PAGE_REFERRER: prevPage?.refer || 'Null',
      PREVIOUS_SOURCE_BUTTON: prevPage?.source || 'Null',
    }

    trackEventCountly(CountlyEventNames.WEB_PLP_VIEW, track)
    sessionStorage.removeItem(SessionStorageKey.PreviousPage)
  }

  const checkFincapBadge = (carRecommendations: CarRecommendation[]) => {
    const checkMudah = carRecommendations.some(
      (x) => x.loanRank === LoanRank.Green,
    )
    const checkSulit = carRecommendations.some(
      (x) => x.loanRank === LoanRank.Red,
    )

    if (checkMudah && checkSulit) {
      trackPLPView('Both')
    } else if (checkMudah) {
      trackPLPView('Mudah disetujui')
    } else if (checkSulit) {
      trackPLPView('Sulit disetujui')
    } else {
      trackPLPView()
    }
  }

  const saveFlagPopUpRecomendation = () => {
    const now = new Date()
    const expiry = now.getTime() + 7 * 24 * 60 * 60 * 1000
    const data = expiry
    const dataValue = JSON.stringify(data)
    saveLocalStorage(LocalStorageKey.flagPopUpRecomendation, dataValue)
    saveLocalStorage(LocalStorageKey.flagResultFilterInfoPLP, 'true')
  }
  const checkFlagPopUpRecomendation = () => {
    const now = new Date()
    const flagPopUp: any | null = getLocalStorage(
      LocalStorageKey.flagPopUpRecomendation,
    )
    if (flagPopUp !== null) {
      if (now.getTime() > flagPopUp) {
        localStorage.removeItem(LocalStorageKey.flagPopUpRecomendation)
        return
      } else {
        return flagPopUp
      }
    }
  }

  useAfterInteractive(() => {
    getAnnouncementBox()
  }, [dataAnnouncementBox])

  useAfterInteractive(() => {
    setTimeout(() => {
      checkFincapBadge(recommendation.slice(0, 12))
    }, 1000)
  }, [recommendation])

  //handle scrolling
  useEffect(() => {
    window.scrollTo(0, 0)
    moengageViewPLP()

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    if (funnelQuery.age && funnelQuery.monthlyIncome) {
      setIsFilterCredit(true)
    } else {
      setIsFilterCredit(false)
    }
    if (
      (funnelQuery.brand && funnelQuery.brand.length > 0) ||
      (funnelQuery.bodyType && funnelQuery.bodyType.length > 0) ||
      (funnelQuery.priceRangeGroup !==
        minMaxPrice.minPriceValue.toString() +
          '-' +
          minMaxPrice.maxPriceValue.toString() &&
        funnelQuery.priceRangeGroup !== '' &&
        funnelQuery.priceRangeGroup !== undefined) ||
      // funnelQuery.downPaymentAmount ||
      funnelQuery.search ||
      funnelQuery.monthlyIncome ||
      funnelQuery.age ||
      funnelQuery.tenure !== 5 ||
      (brand && brand.length > 0)
    ) {
      setIsFilter(true)
    } else {
      setIsFilter(false)
    }
  }, [funnelQuery, brand])

  useEffect(() => {
    if (
      funnelQuery.downPaymentAmount &&
      funnelQuery.monthlyIncome &&
      funnelQuery.age
    ) {
      setIsFilterFinancial(true)
      patchFunnelQuery({ ...funnelQuery, filterFincap: true })
    } else {
      setIsFilterFinancial(false)
      patchFunnelQuery({ ...funnelQuery, filterFincap: false })
    }
  }, [
    funnelQuery.downPaymentAmount,
    funnelQuery.monthlyIncome,
    funnelQuery.age,
  ])

  useEffect(() => {
    checkFlagPopUpRecomendation()
    if (
      isFilterFinancial &&
      getLocalStorage(LocalStorageKey.flagResultFilterInfoPLP) !== true &&
      sampleArray.items.some((a) => a.loanRank === 'Green')
    ) {
      setOpenLabelResultInfo(true)
      saveFlagPopUpRecomendation()
    }
  }, [isFilterFinancial, sampleArray])

  useEffect(() => {
    setPage(1)
    if (recommendation.length > sampleArray.items.length) {
      setHasMore(true)
    }
    setSampleArray({ items: recommendation.slice(0, 12) })
    saveRecommendation(recommendation)
    if (sampleArray.items.length === 0 || recommendation.length === 0) {
      setShowLoading(false)
      setHasMore(false)
    }
  }, [recommendation])

  useEffect(() => {
    if (isActive) {
      trackEventCountly(CountlyEventNames.WEB_HAMBURGER_OPEN, {
        PAGE_ORIGINATION: getPageName(),
        LOGIN_STATUS: isLogin,
        USER_TYPE: valueForUserTypeProperty(),
      })
    }

    if (!isCurrentCitySameWithSSR() || recommendation.length === 0) {
      const params = getCity().cityCode

      getMinMaxPrice(`?city=${params}`)
        .then((response) => {
          if (response) {
            setMinMaxPrice({
              minPriceValue: response.minPriceValue,
              maxPriceValue: response.maxPriceValue,
            })
            const minTemp = priceRangeGroup
              ? response.minPriceValue > Number(priceRangeGroup.split('-')[0])
                ? response.minPriceValue
                : Number(priceRangeGroup.split('-')[0])
              : ''
            const maxTemp = priceRangeGroup
              ? response.maxPriceValue < Number(priceRangeGroup.split('-')[1])
                ? response.maxPriceValue
                : Number(priceRangeGroup.split('-')[1])
              : ''

            const queryParam: any = {
              downPaymentType: 'amount',
              downPaymentAmount: downPaymentAmount || '',
              brand:
                !brand || brand?.includes('SEVA')
                  ? undefined
                  : brand?.split(',')?.map((item) => getCarBrand(item)) || '',
              bodyType: bodyType?.split(',') || '',
              priceRangeGroup: priceRangeGroup ? minTemp + '-' + maxTemp : '',
              age: age || '',
              search: search || '',
              tenure: Number(tenure) || 5,
              monthlyIncome: monthlyIncome || '',
              sortBy: sortBy || 'lowToHigh',
            }

            getNewFunnelRecommendations(queryParam)
              .then((response: any) => {
                if (response) {
                  patchFunnelQuery(queryParam)
                  saveRecommendation(response.carRecommendations)
                  setResultMinMaxPrice({
                    resultMinPrice: response.lowestCarPrice || 0,
                    resultMaxPrice: response.highestCarPrice || 0,
                  })
                  setPage(1)
                  setSampleArray({
                    items: response.carRecommendations.slice(0, 12),
                  })
                }
                setShowLoading(false)
              })
              .catch(() => {
                setShowLoading(false)
                router.push({
                  pathname: isOTO
                    ? `adaSEVAdiOTO/${carResultsUrl}`
                    : carResultsUrl,
                })
              })
            getNewFunnelRecommendations({ ...queryParam, brand: [] }).then(
              (response: any) => {
                if (response) setAlternativeCar(response.carRecommendations)
              },
            )
          }
        })
        .catch()
    } else {
      saveRecommendation(recommendation)
      const queryParam: any = {
        downPaymentType: 'amount',
        downPaymentAmount: downPaymentAmount || '',
        brand:
          !brand || brand?.includes('SEVA')
            ? undefined
            : brand?.split(',')?.map((item) => getCarBrand(item)) || '',
        bodyType: bodyType?.split(',') || '',
        priceRangeGroup: priceRangeGroup,
        age: age || '',
        search: search || '',
        tenure: Number(tenure) || 5,
        monthlyIncome: monthlyIncome || '',
        sortBy: sortBy || 'lowToHigh',
      }
      patchFunnelQuery(queryParam)
      getNewFunnelRecommendations({ ...queryParam, brand: [] }).then(
        (response: any) => {
          if (response) setAlternativeCar(response.carRecommendations)
        },
      )
    }
    return () => cleanEffect()
  }, [])

  const onCloseResultInfo = () => {
    setOpenLabelResultInfo(false)
    saveLocalStorage(LocalStorageKey.flagResultFilterInfoPLP, 'true')
    trackEventCountly(CountlyEventNames.WEB_PLP_FINCAP_BANNER_DESC_OK_CLICK)
  }
  const onCloseResultInfoClose = () => {
    setOpenLabelResultInfo(false)
    setOpenLabelResultMudah(false)
    trackEventCountly(CountlyEventNames.WEB_PLP_FINCAP_BANNER_DESC_EXIT_CLICK)
  }

  const stickyFilter = () => {
    if (sticky && !isActive)
      return (
        <NavigationFilterMobile
          setRecommendations={saveRecommendation}
          onButtonClick={handleShowFilter}
          onSortClick={handleShowSort(true)}
          carlist={recommendation || []}
          isFilter={isFilter}
          isFilterFinancial={isFilterFinancial}
          startScroll={startScroll}
          sticky={sticky}
          resultMinMaxPrice={resultMinMaxPrice}
          isShowAnnouncementBox={showAnnouncementBox}
        />
      )

    return <></>
  }

  const onFilterSort = (val: any) => {
    setOpenSorting(false)
    const queryParam = {
      ...funnelQuery,
      sortBy: val || 'lowToHigh',
    }
    getNewFunnelRecommendations(queryParam).then((response: any) => {
      if (response) {
        patchFunnelQuery(queryParam)
        saveRecommendation(response.carRecommendations)
        setResultMinMaxPrice({
          resultMinPrice: response.lowestCarPrice || 0,
          resultMaxPrice: response.highestCarPrice || 0,
        })
        setPage(1)

        setSampleArray({
          items: response.carRecommendations.slice(0, 12),
        })
      }
      setShowLoading(false)

      router.replace({
        pathname: isOTO ? OTONewCarUrl : carResultsUrl,
        query: {
          ...(search && { search }),
          ...(age && { age }),
          ...(downPaymentAmount && { downPaymentAmount }),
          ...(monthlyIncome && { monthlyIncome }),
          ...(priceRangeGroup && { priceRangeGroup }),
          ...(bodyType && { bodyType }),
          ...(brand && { brand }),
          ...(tenure && { tenure }),
          sortBy: val,
        },
      })
    })
  }

  const trackCountlyPromoBadgeClick = (car: CarRecommendation, index: any) => {
    trackEventCountly(CountlyEventNames.WEB_PROMO_CLICK, {
      CAR_BRAND: car.brand,
      CAR_MODEL: car.model,
      CAR_ORDER: parseInt(index) + 1,
      PELUANG_KREDIT_BADGE:
        isUsingFilterFinancial && IsShowBadgeCreditOpportunity
          ? dataCar?.PELUANG_KREDIT_BADGE
          : 'Null',
      PAGE_ORIGINATION: 'PLP',
    })
  }

  const trackCountlyOnClickBadge = (
    item: any,
    rank: 'Mudah disetujui' | 'Sulit disetujui',
  ) => {
    // use timeout in case Countly is loading after interactive
    setTimeout(() => {
      trackEventCountly(CountlyEventNames.WEB_PLP_FINCAP_BADGE_CLICK, {
        PELUANG_KREDIT_BADGE: rank,
        CAR_BRAND: item.brand,
        CAR_MODEL: item.model,
        PAGE_ORIGINATION: 'PLP',
        SOURCE_BUTTON: 'Product Card Badge (PLP)',
      })
    }, 1000)
  }

  return (
    <>
      <div
        className={clsx({
          [styles.wrapper]: true,
          [styles.stickypadding]: sticky,
        })}
      >
        <HeaderMobile
          startScroll={startScroll}
          style={sticky ? { position: 'fixed' } : {}}
          isActive={isActive}
          setIsActive={setIsActive}
          emitClickCityIcon={() => setIsOpenCitySelectorModal(true)}
          setShowAnnouncementBox={saveShowAnnouncementBox}
          isShowAnnouncementBox={showAnnouncementBox}
          pageOrigination={'PLP'}
          isOTO={isOTO}
        />
        <PLPHeaderTitle />
        {!showLoading && sampleArray.items.length === 0 ? (
          <>
            <NavigationFilterMobile
              setRecommendations={saveRecommendation}
              onButtonClick={handleShowFilter}
              onSortClick={handleShowSort(true)}
              carlist={recommendation || []}
              isFilter={isFilter}
              isFilterFinancial={isFilterFinancial}
              resultMinMaxPrice={resultMinMaxPrice}
              isShowAnnouncementBox={showAnnouncementBox}
            />
            {stickyFilter()}
            <PLPEmpty
              alternativeCars={alternativeCars}
              onClickLabel={() => setOpenLabelPromo(true)}
            />
          </>
        ) : (
          <>
            <NavigationFilterMobile
              setRecommendations={saveRecommendation}
              onButtonClick={handleShowFilter}
              onSortClick={handleShowSort(true)}
              carlist={recommendation || []}
              isFilter={isFilter}
              isFilterFinancial={isFilterFinancial}
              resultMinMaxPrice={resultMinMaxPrice}
              isShowAnnouncementBox={showAnnouncementBox}
              isOTO={isOTO}
            />
            {stickyFilter()}
            <div
              className={clsx({
                ['plp-scroll']: true,
                [styles.detailCardWrapper]: true,
                [styles.stickyMargin]: sticky,
              })}
            >
              <InfiniteScroll
                dataLength={sampleArray.items.length}
                next={fetchMoreData}
                hasMore={hasMore}
                loader={
                  <div className={styles.spin}>
                    <Spin />
                  </div>
                }
              >
                {sampleArray.items.map(
                  (i: any, index: React.Key | null | undefined) => (
                    <CarDetailCard
                      order={Number(index)}
                      key={i.id}
                      recommendation={i}
                      isOTO={isOTO}
                      isFilter={isFilterCredit}
                      setOpenInterestingModal={setOpenInterestingModal}
                      onClickLabel={() => {
                        setOpenLabelPromo(true)
                        trackCountlyPromoBadgeClick(i, index)

                        setDataCarForPromo({
                          brand: i.brand,
                          model: i.model,
                          carOrder: Number(index) + 1,
                          loanRank: i.loanRank,
                        })
                      }}
                      onClickResultMudah={() => {
                        setOpenLabelResultMudah(true)
                        trackCountlyOnClickBadge(i, 'Mudah disetujui')
                      }}
                      onClickResultSulit={() => {
                        setOpenLabelResultSulit(true)
                        trackCountlyOnClickBadge(i, 'Sulit disetujui')
                      }}
                      isFilterTrayOpened={isButtonClick} // fix background click on ios
                    />
                  ),
                )}
              </InfiniteScroll>
            </div>
          </>
        )}
        <FooterMobile pageOrigination="PLP" />
        <CSAButton
          onClick={showLeadsForm}
          data-testid={elementId.PLP.Button.LeadsFormIcon}
        />
        {isModalOpenend && (
          <LeadsFormPrimary
            onCancel={closeLeadsForm}
            trackerProperties={trackLeads()}
            onPage="LP"
          />
        )}
        <FilterMobile
          onButtonClick={(
            value: boolean | ((prevState: boolean) => boolean),
          ) => {
            setIsButtonClick(value)
          }}
          isButtonClick={isButtonClick}
          isResetFilter={isResetFilter}
          setIsResetFilter={setIsResetFilter}
          minMaxPrice={minMaxPrice}
          isFilter={isFilter}
          isFilterFinancial={isFilterFinancial}
          setIsFilter={setIsFilter}
          isOTO={isOTO}
        />
        <SortingMobile
          open={openSorting}
          onClose={handleShowSort(false)}
          onPickClose={(value: any, label) => {
            onFilterSort(value)
            trackEventCountly(CountlyEventNames.WEB_PLP_SORT_OPTION_CLICK, {
              SORT_VALUE: label,
            })
          }}
        />
        <PopupPromo
          open={openLabelPromo}
          onCancel={() => setOpenLabelPromo(false)}
          carData={dataCarForPromo}
        />
        <PopupResultSulit
          open={openLabelResultSulit}
          onCancel={() => {
            setOpenLabelResultSulit(false)
          }}
        />
        {/* <PopupResultMudah
          open={openLabelResultMudah}
          onCancel={() => {
            setOpenLabelResultMudah(false)
          }}
        /> */}
        <PopupResultRecommended
          open={openLabelResultInfo || openLabelResultMudah}
          onCancel={onCloseResultInfoClose}
          onOk={onCloseResultInfo}
        />
        <CitySelectorModal
          isOpen={isOpenCitySelectorModal}
          onClickCloseButton={() => {
            setIsOpenCitySelectorModal(false)
          }}
          cityListFromApi={cities}
          pageOrigination="PLP"
        />
        {openInterestingModal && (
          <AdaOTOdiSEVALeadsForm
            onCancel={closeInterestingBtn}
            trackerProperties={trackLeads()}
            onPage="PLP"
            isProduct={isProduct}
          />
        )}
      </div>
    </>
  )
}

const PLPHeaderTitle = () => {
  return (
    <div className={styles.titleHeaderWrapper}>
      <h1 className={styles.title}>Rekomendasi Mobil Baru di SEVA</h1>
      <h2 className={styles.subtitle}>
        Menampilkan beragam pilihan mobil baru sesuai kebutuhan dan finansialmu.
      </h2>
    </div>
  )
}
