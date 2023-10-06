import { Spin } from 'antd'
import axios from 'axios'
import clsx from 'clsx'
import { CSAButton } from 'components/atoms'
import {
  AdaOTOdiSEVALeadsForm,
  CarDetailCard,
  FooterMobile,
  HeaderMobile,
  NavigationFilterMobile,
  PLPEmpty,
} from 'components/organisms'
import { TrackingEventName } from 'helpers/amplitude/eventTypes'
import {
  LeadsActionParam,
  PageOriginationName,
  trackCarSearchPageView,
  trackCekPeluangPopUpCloseClick,
  trackCekPeluangPopUpCtaClick,
  trackLeadsFormAction,
  trackPeluangMudahBadgeClick,
  trackPeluangMudahPopUpCloseClick,
  trackPeluangSulitBadgeClick,
  trackPeluangSulitPopUpCloseClick,
  trackPLPFilterShow,
  trackPLPSortShow,
} from 'helpers/amplitude/seva20Tracking'
import elementId from 'helpers/elementIds'
import { MoengageEventName, setTrackEventMoEngage } from 'helpers/moengage'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { api } from 'services/api'
import { getCities } from 'services/cities'
import { useCar } from 'services/context/carContext'
import { useFunnelQueryData } from 'services/context/funnelQueryContext'
import { getMinMaxPrice, getNewFunnelRecommendations } from 'services/newFunnel'
import { LanguageCode, LocalStorageKey, SessionStorageKey } from 'utils/enum'
import { getConvertFilterIncome } from 'utils/filterUtils'
import { getToken } from 'utils/handler/auth'
import { Currency } from 'utils/handler/calculation'
import { delayedExec } from 'utils/handler/delayed'
import { getLocalStorage, saveLocalStorage } from 'utils/handler/localStorage'
import { formatNumberByLocalization } from 'utils/handler/rupiah'
import { getSessionStorage } from 'utils/handler/sessionStorage'
import { hundred, million } from 'utils/helpers/const'
import { OTONewCarUrl, carResultsUrl } from 'utils/helpers/routes'
import { useAmplitudePageView } from 'utils/hooks/useAmplitudePageView'
import {
  defaultCity,
  getCity,
} from 'utils/hooks/useCurrentCityOtr/useCurrentCityOtr'
import { useLocalStorage } from 'utils/hooks/useLocalStorage'
import { Location } from 'utils/types'
import {
  CarRecommendation,
  CarRecommendationResponse,
  FilterParam,
  MinMaxPrice,
} from 'utils/types/context'
import { MoengageViewCarSearch } from 'utils/types/moengage'
import { AnnouncementBoxDataType } from 'utils/types/utils'
import styles from '../../../styles/pages/mobil-baru.module.scss'
import {
  trackEventCountly,
  valueForInitialPageProperty,
  valueForUserTypeProperty,
} from 'helpers/countly/countly'
import { CountlyEventNames } from 'helpers/countly/eventNames'
import { getPageName } from 'utils/pageName'
import { LoanRank } from 'utils/types/models'
import { temanSevaUrlPath } from 'services/temanseva'
import { decryptValue } from 'utils/encryptionUtils'
import { getCarBrand } from 'utils/carModelUtils/carModelUtils'
import { useUtils } from 'services/context/utilsContext'
import dynamic from 'next/dynamic'
import { useAfterInteractive } from 'utils/hooks/useAfterInteractive'

const LeadsFormPrimary = dynamic(() =>
  import('components/organisms').then((mod) => mod.LeadsFormPrimary),
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
const PopupResultMudah = dynamic(() =>
  import('components/organisms').then((mod) => mod.PopupResultMudah),
)
const PopupResultInfo = dynamic(() =>
  import('components/organisms').then((mod) => mod.PopupResultInfo),
)
const CitySelectorModal = dynamic(() =>
  import('components/molecules').then((mod) => mod.CitySelectorModal),
)

interface PLPProps {
  minmaxPrice: MinMaxPrice
  isOTO?: boolean
}

export const PLP = ({ minmaxPrice, isOTO = false }: PLPProps) => {
  useAmplitudePageView(trackCarSearchPageView)
  const router = useRouter()
  const { recommendation, saveRecommendation } = useCar()
  const [alternativeCars, setAlternativeCar] = useState<CarRecommendation[]>([])
  const {
    bodyType,
    brand,
    downPaymentAmount,
    monthlyIncome,
    tenure,
    priceRangeGroup,
    age,
    sortBy,
  } = router.query as FilterParam

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
    bodyType ||
    brand ||
    priceRangeGroup ||
    tenure ||
    age ||
    downPaymentAmount ||
    monthlyIncome
      ? true
      : false

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
  const { cities, saveDataAnnouncementBox } = useUtils()
  const [showAnnouncementBox, setIsShowAnnouncementBox] = useState(false)
  const [interactive, setInteractive] = useState(false)
  const [isLogin] = useState(!!getToken())
  const [dataCarForPromo, setDataCarForPromo] = useState({
    brand: '',
    model: '',
    carOrder: 0,
    loanRank: 'Null',
  })
  const user: string | null = getLocalStorage(LocalStorageKey.sevaCust)
  const isCurrentCitySameWithSSR = getCity().cityCode === defaultCity.cityCode

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
    if (!isCurrentCitySameWithSSR) {
      saveRecommendation([])
    }
    setPage(1)
    setShowLoading(true)
    setSampleArray({ items: [] })
  }

  const handelSticky = (position: number) => {
    if (position > 50) return setSticky(true)
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
    setIsModalOpened(true)
    trackLeadsFormAction(TrackingEventName.WEB_LEADS_FORM_OPEN, trackLeads())
    trackEventCountly(CountlyEventNames.WEB_LEADS_FORM_BUTTON_CLICK, {
      PAGE_ORIGINATION: 'PLP',
    })
  }

  const closeLeadsForm = () => {
    setIsModalOpened(false)
  }

  const closeInterestingBtn = () => {
    setOpenInterestingModal(false)
  }

  const handleShowFilter = () => {
    setIsButtonClick(true)
    trackPLPFilterShow(true)
    trackEventCountly(CountlyEventNames.WEB_PLP_OPEN_FILTER_CLICK, {
      CURRENT_FILTER_STATUS: isFilter ? 'On' : 'Off',
    })
  }

  const handleShowSort = (open: boolean) => () => {
    setOpenSorting(open)
    trackPLPSortShow(open)
    trackEventCountly(CountlyEventNames.WEB_PLP_OPEN_SORT_CLICK)
  }
  const getAnnouncementBox = () => {
    api
      .getAnnouncementBox({
        headers: {
          'is-login': getToken() ? 'true' : 'false',
        },
      })
      .then((res: { data: AnnouncementBoxDataType }) => {
        if (res.data === undefined) {
          setIsShowAnnouncementBox(false)
        } else {
          saveDataAnnouncementBox(res.data)
          const sessionAnnouncmentBox = getSessionStorage(
            getToken()
              ? SessionStorageKey.ShowWebAnnouncementLogin
              : SessionStorageKey.ShowWebAnnouncementNonLogin,
          )
          if (typeof sessionAnnouncmentBox !== 'undefined') {
            setIsShowAnnouncementBox(sessionAnnouncmentBox as boolean)
          } else {
            setIsShowAnnouncementBox(true)
          }
        }
      })
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
        const temanSeva = await axios.post(temanSevaUrlPath.isTemanSeva, {
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

  useAfterInteractive(() => {
    getAnnouncementBox()
  }, [])

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
      funnelQuery.monthlyIncome ||
      funnelQuery.age ||
      funnelQuery.tenure !== 5 ||
      (brand && brand.length > 0)
    ) {
      setIsFilter(true)
    } else {
      setIsFilter(false)
    }

    if (
      funnelQuery.downPaymentAmount &&
      funnelQuery.monthlyIncome &&
      funnelQuery.age
    ) {
      setIsFilterFinancial(true)
    } else {
      setIsFilterFinancial(false)
    }
  }, [funnelQuery, brand])

  useEffect(() => {
    if (
      isFilterFinancial &&
      getLocalStorage(LocalStorageKey.flagResultFilterInfoPLP) !== true
    ) {
      setOpenLabelResultInfo(true)
    }
  }, [isFilterFinancial])

  useEffect(() => {
    setPage(1)
    setHasMore(true)
    setSampleArray({ items: recommendation.slice(0, 12) })
    saveRecommendation(recommendation)
  }, [recommendation])

  useEffect(() => {
    if (isActive) {
      trackEventCountly(CountlyEventNames.WEB_HAMBURGER_OPEN, {
        PAGE_ORIGINATION: getPageName(),
        LOGIN_STATUS: isLogin,
        USER_TYPE: valueForUserTypeProperty(),
      })
    }

    if (!isCurrentCitySameWithSSR || recommendation.length === 0) {
      getMinMaxPrice()
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
              brand: brand?.split(',')?.map((item) => getCarBrand(item)) || '',
              bodyType: bodyType?.split(',') || '',
              priceRangeGroup: priceRangeGroup ? minTemp + '-' + maxTemp : '',
              age: age || '',
              tenure: Number(tenure) || 5,
              monthlyIncome: monthlyIncome || '',
              sortBy: sortBy || 'lowToHigh',
            }

            getNewFunnelRecommendations(queryParam)
              .then((response) => {
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
        downPaymentAmount: downPaymentAmount || '',
        brand: brand?.split(',')?.map((item) => getCarBrand(item)) || '',
        bodyType: bodyType?.split(',') || '',
        priceRangeGroup: priceRangeGroup,
        age: age || '',
        tenure: Number(tenure) || 5,
        monthlyIncome: monthlyIncome || '',
        sortBy: sortBy || 'lowToHigh',
      }
      patchFunnelQuery(queryParam)
    }
    return () => cleanEffect()
  }, [])

  const onCloseResultInfo = () => {
    setOpenLabelResultInfo(false)
    saveLocalStorage(LocalStorageKey.flagResultFilterInfoPLP, 'true')
    trackCekPeluangPopUpCtaClick(getDataForAmplitude())
    trackEventCountly(CountlyEventNames.WEB_PLP_FINCAP_BANNER_DESC_OK_CLICK)
  }
  const onCloseResultInfoClose = () => {
    setOpenLabelResultInfo(false)
    trackCekPeluangPopUpCloseClick(getDataForAmplitude())
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
    getNewFunnelRecommendations(queryParam).then((response) => {
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

  const getDataForAmplitude = () => {
    return {
      ...(funnelQuery.monthlyIncome && {
        Income: `Rp${formatNumberByLocalization(
          parseInt(monthlyIncome),
          LanguageCode.id,
          million,
          hundred,
        )} Juta`,
      }),
      Age: funnelQuery.age,
      ...(cityOtr && {
        City: cityOtr?.cityName,
      }),
      ...(funnelQuery.downPaymentAmount && {
        DP: `Rp${formatNumberByLocalization(
          parseInt(downPaymentAmount),
          LanguageCode.en,
          million,
          hundred,
        )} Juta`,
      }),
      Tenure: `${funnelQuery.tenure || 5}`,
    }
  }
  const trackCountlyPromoBadgeClick = (car: CarRecommendation, index: any) => {
    trackEventCountly(CountlyEventNames.WEB_PROMO_CLICK, {
      CAR_BRAND: car.brand,
      CAR_MODEL: car.model,
      CAR_ORDER: parseInt(index) + 1,
      PELUANG_KREDIT_BADGE:
        car.loanRank === 'Green'
          ? 'Mudah disetujui'
          : car.loanRank === 'Red'
          ? 'Sulit disetujui'
          : 'Null',
      PAGE_ORIGINATION: 'PLP',
    })
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
          setShowAnnouncementBox={setIsShowAnnouncementBox}
          isShowAnnouncementBox={showAnnouncementBox}
          pageOrigination={'PLP'}
          isOTO={isOTO}
        />

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
                      key={index}
                      recommendation={i}
                      isOTO={isOTO}
                      isFilter={isFilterCredit}
                      setOpenInterestingModal={setOpenInterestingModal}
                      onClickLabel={() => {
                        setOpenLabelPromo(true)
                        trackCountlyPromoBadgeClick(i, index)
                        if (index) {
                          setDataCarForPromo({
                            brand: i.brand,
                            model: i.model,
                            carOrder: Number(index) + 1,
                            loanRank: i.loanRank,
                          })
                        }
                      }}
                      onClickResultMudah={() => {
                        setOpenLabelResultMudah(true)
                        trackPeluangMudahBadgeClick(getDataForAmplitude())
                        trackEventCountly(
                          CountlyEventNames.WEB_PLP_FINCAP_BADGE_CLICK,
                          {
                            PELUANG_KREDIT_BADGE: 'Mudah disetujui',
                            CAR_BRAND: i.brand,
                            CAR_MODEL: i.model,
                          },
                        )
                      }}
                      onClickResultSulit={() => {
                        setOpenLabelResultSulit(true)
                        trackPeluangSulitBadgeClick(getDataForAmplitude())
                        trackEventCountly(
                          CountlyEventNames.WEB_PLP_FINCAP_BADGE_CLICK,
                          {
                            PELUANG_KREDIT_BADGE: 'Sulit disetujui',
                            CAR_BRAND: i.brand,
                            CAR_MODEL: i.model,
                          },
                        )
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
            trackPeluangSulitPopUpCloseClick(getDataForAmplitude())
          }}
        />
        <PopupResultMudah
          open={openLabelResultMudah}
          onCancel={() => {
            setOpenLabelResultMudah(false)
            trackPeluangMudahPopUpCloseClick(getDataForAmplitude())
          }}
        />
        <PopupResultInfo
          open={openLabelResultInfo}
          onCancel={onCloseResultInfoClose}
          onOk={onCloseResultInfo}
        />
        <CitySelectorModal
          isOpen={isOpenCitySelectorModal}
          onClickCloseButton={() => setIsOpenCitySelectorModal(false)}
          cityListFromApi={cities}
          pageOrigination="PLP"
        />
        {openInterestingModal && (
          <AdaOTOdiSEVALeadsForm
            onCancel={closeInterestingBtn}
            trackerProperties={trackLeads()}
            onPage="LP"
          />
        )}
      </div>
    </>
  )
}
