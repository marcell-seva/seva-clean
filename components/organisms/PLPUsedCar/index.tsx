import { Spin } from 'antd'
import axios from 'axios'
import clsx from 'clsx'
import { CSAButton } from 'components/atoms'
import {
  AdaOTOdiSEVALeadsForm,
  FooterMobile,
  HeaderMobile,
  NavigationFilterMobileUsedCar,
  PLPEmptyUsedCar,
  UsedCarDetailCard,
} from 'components/organisms'
import elementId from 'helpers/elementIds'
import { MoengageEventName, setTrackEventMoEngage } from 'helpers/moengage'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useFunnelQueryUsedCarData } from 'services/context/funnelQueryUsedCarContext'
import { getUsedCarFunnelRecommendations } from 'utils/handler/funnel'
import { LocalStorageKey, SessionStorageKey } from 'utils/enum'
import { getConvertFilterIncome } from 'utils/filterUtils'
import { getToken } from 'utils/handler/auth'
import { Currency } from 'utils/handler/calculation'
import { delayedExec } from 'utils/handler/delayed'
import { getLocalStorage, saveLocalStorage } from 'utils/handler/localStorage'
import { getSessionStorage } from 'utils/handler/sessionStorage'
import { usedCarResultUrl } from 'utils/helpers/routes'
import {
  defaultCity,
  getCity,
} from 'utils/hooks/useCurrentCityOtr/useCurrentCityOtr'
import { useLocalStorage } from 'utils/hooks/useLocalStorage'
import { Location } from 'utils/types'
import {
  CarRecommendation,
  FilterParam,
  MinMaxMileage,
  MinMaxPrice,
  MinMaxYear,
} from 'utils/types/context'
import { MoengageViewCarSearch } from 'utils/types/moengage'
import styles from 'styles/pages/mobil-bekas.module.scss'
import {
  trackEventCountly,
  valueForInitialPageProperty,
  valueForUserTypeProperty,
} from 'helpers/countly/countly'
import { CountlyEventNames } from 'helpers/countly/eventNames'
import { getPageName } from 'utils/pageName'
import { LoanRank } from 'utils/types/models'
import { temanSevaUrlPath } from 'utils/types/props'
import { decryptValue } from 'utils/encryptionUtils'
import { getCarBrand } from 'utils/carModelUtils/carModelUtils'
import { useUtils } from 'services/context/utilsContext'
import dynamic from 'next/dynamic'
import { usedCar } from 'services/context/usedCarContext'
import { useAfterInteractive } from 'utils/hooks/useAfterInteractive'
import { useAnnouncementBoxContext } from 'services/context/announcementBoxContext'
import {
  getMinMaxYearsUsedCar,
  getMinMaxMileageUsedCar,
  getMinMaxPriceUsedCar,
  getMinMaxPrice,
} from 'services/api'

const LeadsFormPrimary = dynamic(() =>
  import('components/organisms').then((mod) => mod.LeadsFormPrimary),
)
const FilterMobileUsedCar = dynamic(() =>
  import('components/organisms').then((mod) => mod.FilterMobileUsedCar),
)
const SortingMobileUsedCar = dynamic(() =>
  import('components/organisms').then((mod) => mod.SortingMobileUsedCar),
)
const CitySelectorModal = dynamic(() =>
  import('components/molecules').then((mod) => mod.CitySelectorModal),
)

interface PLPProps {
  minmaxPrice: MinMaxPrice
  minmaxYear: MinMaxYear
  minmaxMileage: MinMaxMileage
  isOTO?: boolean
}

export const PLPUsedCar = ({
  minmaxPrice,
  minmaxMileage,
  minmaxYear,
  isOTO = false,
}: PLPProps) => {
  const router = useRouter()
  const {
    recommendation,
    saveRecommendation,
    totalItems,
    saveTotalItems,
    cityList,
  } = usedCar()
  const [alternativeCars, setAlternativeCar] = useState<CarRecommendation[]>([])
  const {
    bodyType,
    brand,
    downPaymentAmount,
    monthlyIncome,
    priceStart,
    priceEnd,
    yearStart,
    yearEnd,
    mileageEnd,
    mileageStart,
    transmission,
    age,
    sortBy,
    modelName,
  } = router.query as FilterParam
  const [minMaxPrice, setMinMaxPrice] = useState<MinMaxPrice>(minmaxPrice)

  const [minMaxYear, setMinMaxYear] = useState<MinMaxYear>(minmaxYear)
  const [minMaxMileage, setMinMaxMileage] =
    useState<MinMaxMileage>(minmaxMileage)

  const [cityOtr] = useLocalStorage<Location | null>(
    LocalStorageKey.CityOtr,
    null,
  )
  const [resultMinMaxPrice, setResultMinMaxPrice] = useState({
    resultMinPrice: 0,
    resultMaxPrice: 0,
  })
  const { funnelQuery, patchFunnelQuery } = useFunnelQueryUsedCarData()
  const [isButtonClick, setIsButtonClick] = useState(false)
  const [isResetFilter, setIsResetFilter] = useState(false)
  const showFilter =
    brand ||
    priceStart ||
    priceEnd ||
    yearStart ||
    yearEnd ||
    mileageStart ||
    mileageEnd ||
    transmission ||
    modelName
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
  const [tempQuery, setTempQuery] = useState<any>()
  const [page, setPage] = useState<any>(1)
  // const [totalItems, setTotalItems] = useState(0)
  const [sampleArray, setSampleArray] = useState({
    items: recommendation,
  })
  const [isOpenCitySelectorModal, setIsOpenCitySelectorModal] = useState(false)
  const { cities, dataAnnouncementBox } = useUtils()
  const { showAnnouncementBox, saveShowAnnouncementBox } =
    useAnnouncementBoxContext()
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
  const [cityListPLP, setCityListPLP] = useState(cityList)
  funnelQuery.brand = brand?.split(',').map((item) => getCarBrand(item)) || []

  const fetchMoreData = () => {
    if (sampleArray.items.length >= totalItems!) {
      return setHasMore(false)
    }
    const timeout = setTimeout(() => {
      if (sampleArray.items.length >= 10 * page) {
        const pagePlus = page + 1
        setPage(pagePlus)
        const queryParam: any = {
          brand:
            brand?.split(',')?.map((item) => getCarBrand(item).toLowerCase()) ||
            [],
          priceStart: priceStart ? priceStart : '',
          priceEnd: priceEnd ? priceEnd : '',
          yearEnd: yearEnd ? yearEnd : '',
          yearStart: yearStart ? yearStart : '',
          mileageEnd: mileageEnd ? mileageEnd : '',
          mileageStart: mileageStart ? mileageStart : '',
          transmission: transmission ? transmission?.split(',') : [],
          modelName: modelName ? modelName?.split('%2C') : [],
          sortBy: sortBy || 'lowToHigh',
          page: pagePlus || '1',
          perPage: '10',
        }
        getUsedCarFunnelRecommendations({
          ...(tempQuery ? tempQuery : queryParam),
          page: pagePlus,
        }).then((response: any) => {
          if (response) {
            setSampleArray({
              items: sampleArray.items.concat(response.carData),
            })
          }
        })
      }
      clearTimeout(timeout)
    }, 1000)
  }

  useEffect(() => {
    return () => cleanEffect()
  }, [])

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
    if (typeof priceStart === 'undefined') return
    const minPrice = priceStart ? String(priceStart) : ''
    const maxPrice = priceEnd ? String(priceEnd) : ''
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
    }
    setTrackEventMoEngage(MoengageEventName.view_car_search, properties)
  }

  const showLeadsForm = () => {
    setIsModalOpened(true)
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
    const filterUsage =
      brand || bodyType || (priceStart && priceEnd) ? 'Yes' : 'No'
    const fincapUsage = downPaymentAmount && age && monthlyIncome ? 'Yes' : 'No'
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
  }, [dataAnnouncementBox])

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
    ;['scroll', 'touchstart'].forEach((ev) =>
      window.addEventListener(ev, getAnnouncementBox),
    )

    return () => {
      ;['scroll', 'touchstart'].forEach((ev) =>
        window.removeEventListener(ev, getAnnouncementBox),
      )
    }
  }, [interactive])

  useEffect(() => {
    if (
      (funnelQuery.brand && funnelQuery.brand.length > 0) ||
      (funnelQuery.bodyType && funnelQuery.bodyType.length > 0) ||
      (funnelQuery.transmission && funnelQuery.transmission.length > 0) ||
      (funnelQuery.cityId && funnelQuery.cityId.length > 0) ||
      (funnelQuery.plate && funnelQuery.plate.length > 0) ||
      (funnelQuery.priceStart !== minMaxPrice.minPriceValue.toString() &&
        funnelQuery.priceStart !== '' &&
        funnelQuery.priceStart !== undefined) ||
      (funnelQuery.priceEnd !== minMaxPrice.maxPriceValue.toString() &&
        funnelQuery.priceEnd !== '' &&
        funnelQuery.priceEnd !== undefined) ||
      (funnelQuery.yearStart !== minmaxYear.minYearValue.toString() &&
        funnelQuery.yearStart !== '' &&
        funnelQuery.yearStart !== undefined) ||
      (funnelQuery.yearEnd !== minMaxYear.maxYearValue.toString() &&
        funnelQuery.yearEnd !== '' &&
        funnelQuery.yearEnd !== undefined) ||
      (funnelQuery.mileageStart !== minMaxMileage.minMileageValue.toString() &&
        funnelQuery.mileageStart !== '' &&
        funnelQuery.mileageStart !== undefined) ||
      (funnelQuery.mileageEnd !== minMaxMileage.maxMileageValue.toString() &&
        funnelQuery.mileageEnd !== '' &&
        funnelQuery.mileageEnd !== undefined) ||
      (brand && brand.length > 0)
    ) {
      setIsFilter(true)
    } else {
      setIsFilter(false)
    }
  }, [funnelQuery, brand])

  useEffect(() => {
    setPage(1)
    setHasMore(true)
    setSampleArray({ items: recommendation })
    saveRecommendation(recommendation)
    if (sampleArray.items.length >= totalItems!) {
      setHasMore(false)
    }
  }, [recommendation])

  useEffect(() => {
    setPage(1)
  }, [sampleArray])

  const onCloseResultInfo = () => {
    setOpenLabelResultInfo(false)
    saveLocalStorage(LocalStorageKey.flagResultFilterInfoPLP, 'true')
    trackEventCountly(CountlyEventNames.WEB_PLP_FINCAP_BANNER_DESC_OK_CLICK)
  }
  const onCloseResultInfoClose = () => {
    setOpenLabelResultInfo(false)
    trackEventCountly(CountlyEventNames.WEB_PLP_FINCAP_BANNER_DESC_EXIT_CLICK)
  }

  const stickyFilter = () => {
    if (sticky && !isActive)
      return (
        <NavigationFilterMobileUsedCar
          setRecommendations={saveRecommendation}
          setTotalItems={saveTotalItems}
          onButtonClick={handleShowFilter}
          onSortClick={handleShowSort(true)}
          carlist={totalItems || 0}
          isFilter={isFilter}
          isFilterFinancial={isFilterFinancial}
          startScroll={startScroll}
          sticky={sticky}
          resultMinMaxPrice={resultMinMaxPrice}
          isShowAnnouncementBox={showAnnouncementBox}
          cityList={cityListPLP}
          isUsed={true}
        />
      )

    return <></>
  }

  const onFilterSort = (val: any) => {
    setOpenSorting(false)
    const queryParam = {
      ...funnelQuery,
      sortBy: val || 'lowToHigh',
      page: page || '1',
      perPage: '10',
    }
    setTempQuery(queryParam)
    getUsedCarFunnelRecommendations(queryParam).then((response: any) => {
      if (response) {
        patchFunnelQuery(queryParam)
        saveTotalItems(response.totalItems)
        saveRecommendation(response.carData)
        setResultMinMaxPrice({
          resultMinPrice: response.lowestCarPrice || 0,
          resultMaxPrice: response.highestCarPrice || 0,
        })
        setPage(1)

        setSampleArray({
          items: response.carData,
        })
      }
      setShowLoading(false)

      router.replace({
        pathname: usedCarResultUrl,
        query: {
          ...(age && { age }),
          ...(downPaymentAmount && { downPaymentAmount }),
          ...(monthlyIncome && { monthlyIncome }),
          ...(priceStart && { priceStart }),
          ...(priceEnd && { priceEnd }),
          ...(brand && { brand }),
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
          [styles.showAAnnouncementBox]: showAnnouncementBox,
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

        {sampleArray?.items?.length === 0 ? (
          <>
            <NavigationFilterMobileUsedCar
              setRecommendations={saveRecommendation}
              setTotalItems={saveTotalItems}
              onButtonClick={handleShowFilter}
              onSortClick={handleShowSort(true)}
              carlist={totalItems || 0}
              isFilter={isFilter}
              isFilterFinancial={isFilterFinancial}
              resultMinMaxPrice={resultMinMaxPrice}
              isShowAnnouncementBox={showAnnouncementBox}
              cityList={cityListPLP}
              isUsed={true}
            />
            {stickyFilter()}
            {/* <PLPEmpty
              alternativeCars={alternativeCars}
              onClickLabel={() => setOpenLabelPromo(true)}
            /> */}
            <PLPEmptyUsedCar onClickLabel={() => setOpenLabelPromo(true)} />
          </>
        ) : (
          <>
            <NavigationFilterMobileUsedCar
              setRecommendations={saveRecommendation}
              setTotalItems={saveTotalItems}
              onButtonClick={handleShowFilter}
              onSortClick={handleShowSort(true)}
              carlist={totalItems || 0}
              isFilter={isFilter}
              isFilterFinancial={isFilterFinancial}
              resultMinMaxPrice={resultMinMaxPrice}
              isShowAnnouncementBox={showAnnouncementBox}
              cityList={cityListPLP}
              isUsed={true}
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
                dataLength={sampleArray?.items?.length}
                next={fetchMoreData}
                hasMore={hasMore}
                loader={
                  <div className={styles.spin}>
                    <Spin />
                  </div>
                }
              >
                {sampleArray.items?.map(
                  (i: any, index: React.Key | null | undefined) => (
                    <UsedCarDetailCard
                      order={Number(index)}
                      key={index}
                      recommendation={i}
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
          <LeadsFormPrimary onCancel={closeLeadsForm} onPage="LP" />
        )}
        <FilterMobileUsedCar
          onButtonClick={(
            value: boolean | ((prevState: boolean) => boolean),
          ) => {
            setIsButtonClick(value)
          }}
          isButtonClick={isButtonClick}
          isResetFilter={isResetFilter}
          setIsResetFilter={setIsResetFilter}
          minMaxPrice={minMaxPrice}
          minMaxYear={minMaxYear}
          minMaxMileage={minMaxMileage}
          isFilter={isFilter}
          setIsFilter={setIsFilter}
          setCityListPLP={setCityListPLP}
        />
        <SortingMobileUsedCar
          open={openSorting}
          onClose={handleShowSort(false)}
          onPickClose={(value: any, label) => {
            onFilterSort(value)
            trackEventCountly(CountlyEventNames.WEB_PLP_SORT_OPTION_CLICK, {
              SORT_VALUE: label,
            })
          }}
        />
        <CitySelectorModal
          isOpen={isOpenCitySelectorModal}
          onClickCloseButton={() => setIsOpenCitySelectorModal(false)}
          cityListFromApi={cities}
          pageOrigination="PLP"
        />
        {openInterestingModal && (
          <AdaOTOdiSEVALeadsForm onCancel={closeInterestingBtn} onPage="LP" />
        )}
      </div>
    </>
  )
}
