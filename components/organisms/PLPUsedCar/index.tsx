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
import { default as customAxiosPost } from 'services/api/post'
import { isCurrentCitySameWithSSR } from 'utils/hooks/useGetCity'

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
  const {
    search,
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
  const [resultMinMaxPrice, setResultMinMaxPrice] = useState({
    resultMinPrice: 0,
    resultMaxPrice: 0,
  })
  const { funnelQuery, patchFunnelQuery } = useFunnelQueryUsedCarData()
  const [isButtonClick, setIsButtonClick] = useState(false)
  const [isResetFilter, setIsResetFilter] = useState(false)
  const showFilter =
    search ||
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
  const [openLabelResultMudah, setOpenLabelResultMudah] = useState(false)
  const [openLabelResultSulit, setOpenLabelResultSulit] = useState(false)
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
  const [sampleArray, setSampleArray] = useState({
    items: recommendation,
  })
  const [isOpenCitySelectorModal, setIsOpenCitySelectorModal] = useState(false)
  const { cities, dataAnnouncementBox } = useUtils()
  const { showAnnouncementBox, saveShowAnnouncementBox } =
    useAnnouncementBoxContext()
  const [dataCarForPromo, setDataCarForPromo] = useState({
    brand: '',
    model: '',
    carOrder: 0,
    loanRank: 'Null',
  })
  const [cityListPLP, setCityListPLP] = useState(cityList)
  funnelQuery.search = search !== '' ? search : ''
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
          search: search ? search : '',
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
          sortBy: sortBy || 'newest',
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
    if (!isCurrentCitySameWithSSR()) {
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
    if (
      (funnelQuery.search !== '' && funnelQuery.search !== undefined) ||
      (funnelQuery.brand && funnelQuery.brand.length > 0) ||
      (funnelQuery.modelName && funnelQuery.modelName.length > 0) ||
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
  }, [funnelQuery, brand, search])

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
      sortBy: val || 'newest',
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
          ...(search && { search }),
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
        <PLPHeaderTitle />
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
            <PLPEmptyUsedCar />
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

const PLPHeaderTitle = () => {
  return (
    <div className={styles.titleHeaderWrapper}>
      <h1 className={styles.title}>Rekomendasi Mobil Bekas di SEVA</h1>
      <h2 className={styles.subtitle}>
        Menampilkan beragam pilihan mobil bekas sesuai kebutuhanmu.
      </h2>
    </div>
  )
}
