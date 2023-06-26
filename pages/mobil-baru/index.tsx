import {
  CarDetailCard,
  FooterMobile,
  HeaderMobile,
  LeadsFormPrimary,
  PLPEmpty,
  PLPSkeleton,
  PopupPromo,
  PopupResultSulit,
  PopupResultMudah,
  PopupResultInfo,
  SortingMobile,
  NavigationFilterMobile,
  FilterMobile,
} from 'components/organism'
import React, { useEffect, useState } from 'react'
import { useContextRecommendations } from 'context/recommendationsContext/recommendationsContext'
import { getNewFunnelRecommendations, getMinMaxPrice } from 'services/newFunnel'
import axios, { AxiosResponse } from 'axios'
import styles from '../../styles/saas/pages/mobil-baru.module.scss'
import 'styles/global.scss'
import { useFunnelQueryData } from 'context/funnelQueryContext/funnelQueryContext'
import { CSAButton } from 'components/atoms'
import clsx from 'clsx'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Spin } from 'antd'
import { getLocalStorage, saveLocalStorage } from 'utils/localstorageUtils'
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
import { MoengageEventName, setTrackEventMoEngage } from 'helpers/moengage'
import { MoengageViewCarSearch } from 'utils/types/moengage'
import {
  Currency,
  formatNumberByLocalization,
} from 'utils/numberUtils/numberUtils'
import { delayedExec } from 'utils/handler/delayed'
import { CitySelectorModal } from 'components/molecules'
import { getCities } from 'services/cities'
import { TrackingEventName } from 'helpers/amplitude/eventTypes'
import { getToken } from 'utils/api'
import { carResultsUrl } from 'routes/routes'
import endpoints from 'helpers/endpoints'
import { hundred, million } from 'const/const'
import elementId from 'helpers/elementIds'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { LanguageCode, LocalStorageKey, SessionStorageKey } from 'utils/enum'
import { getSessionStorage } from 'utils/sessionstorageUtils'
import { Location } from 'utils/types'
import { useAmplitudePageView } from 'utils/hooks/useAmplitudePageView/useAmplitudePageView'
import {
  CarRecommendation,
  CarRecommendationResponse,
  FilterParam,
  MinMaxPrice,
} from 'utils/types/context'
import { useLocalStorage } from 'utils/hooks/useLocalStorage/useLocalStorage'
import { getConvertFilterIncome } from 'utils/filterUtils'
import { AnnouncementBoxDataType } from 'utils/types/utils'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'

const NewCarResultPage = ({
  meta,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  useAmplitudePageView(trackCarSearchPageView)
  const router = useRouter()
  const params = router.query.id
  const id = params ? params[0] : null
  const { recommendations, setRecommendations } = useContextRecommendations()
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
  const [minMaxPrice, setMinMaxPrice] = useState<MinMaxPrice>({
    minPriceValue: 0,
    maxPriceValue: 0,
  })

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
  const [isFilter, setIsFilter] = useState(false)
  const [isFilterCredit, setIsFilterCredit] = useState(false)
  const [isFilterFinancial, setIsFilterFinancial] = useState(false)
  const [openLabelPromo, setOpenLabelPromo] = useState(false)
  const [openLabelResultMudah, setOpenLabelResultMudah] = useState(false)
  const [openLabelResultSulit, setOpenLabelResultSulit] = useState(false)
  const [openLabelResultInfo, setOpenLabelResultInfo] = useState(false)
  const [openSorting, setOpenSorting] = useState(false)
  const [startScroll, setStartScroll] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [sticky, setSticky] = useState(false)
  const [isActive, setIsActive] = useState(false)
  const [showLoading, setShowLoading] = useState(true)
  const [isModalOpenend, setIsModalOpened] = useState<boolean>(false)
  const [page, setPage] = useState<any>(1)
  const [sampleArray, setSampleArray] = useState({
    items: recommendations.slice(0, 12),
  })
  const [isOpenCitySelectorModal, setIsOpenCitySelectorModal] = useState(false)
  const [cityListApi, setCityListApi] = useState<Array<Location>>([])
  const [showAnnouncementBox, setIsShowAnnouncementBox] = useState<
    boolean | null
  >(
    getSessionStorage(
      getToken()
        ? SessionStorageKey.ShowWebAnnouncementLogin
        : SessionStorageKey.ShowWebAnnouncementNonLogin,
    ) ?? true,
  )
  const checkCitiesData = () => {
    if (cityListApi.length === 0) {
      getCities().then((res: { data: React.SetStateAction<Location[]> }) => {
        setCityListApi(res.data)
      })
    }
  }

  const fetchMoreData = () => {
    if (sampleArray.items.length >= recommendations.length) {
      return setHasMore(false)
    }
    const timeout = setTimeout(() => {
      if (sampleArray.items.length >= 12 * page) {
        const pagePlus = page + 1
        setPage(pagePlus)
        setSampleArray({
          items: sampleArray.items.concat(
            recommendations.slice(
              12 * page,
              sampleArray.items.length > 12 * page + 12
                ? recommendations.length
                : 12 * page + 12,
            ),
          ),
        })
      }
      clearTimeout(timeout)
    }, 1000)
  }

  const cleanEffect = () => {
    setRecommendations([])
    setPage(1)
    setSampleArray({ items: [] })
    setShowLoading(true)
  }

  useEffect(() => {
    document.body.style.overflowY = isActive ? 'hidden' : 'auto'
    return () => {
      document.body.style.overflowY = 'auto'
    }
  }, [isActive])

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
        Car_Brand: brand,
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
  }

  const closeLeadsForm = () => {
    setIsModalOpened(false)
  }

  const handleShowFilter = () => {
    setIsButtonClick(true)
    trackPLPFilterShow(true)
  }

  const handleShowSort = (open: boolean) => () => {
    setOpenSorting(open)
    trackPLPSortShow(open)
  }
  const getAnnouncementBox = () => {
    axios
      .get(endpoints.announcementBox, {
        headers: {
          'is-login': getToken() ? 'true' : 'false',
        },
      })
      .then((res: AxiosResponse<{ data: AnnouncementBoxDataType }>) => {
        if (res.data.data === undefined) {
          setIsShowAnnouncementBox(false)
        }
      })
  }
  //handle scrolling
  useEffect(() => {
    window.scrollTo(0, 0)
    moengageViewPLP()
    checkCitiesData()
    getAnnouncementBox()
    if (id && id.includes('SEVA')) {
      saveLocalStorage(LocalStorageKey.referralTemanSeva, id)
    }
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
        funnelQuery.priceRangeGroup !== '') ||
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
    if (recommendations.length > sampleArray.items.length) {
      setHasMore(true)
    }
    setSampleArray({ items: recommendations.slice(0, 12) })
  }, [recommendations])

  useEffect(() => {
    getMinMaxPrice({})
      .then((response: AxiosResponse<MinMaxPrice>) => {
        if (response.data) {
          setMinMaxPrice({
            minPriceValue: response.data.minPriceValue,
            maxPriceValue: response.data.maxPriceValue,
          })
          const minTemp = priceRangeGroup
            ? response.data.minPriceValue >
              Number(
                priceRangeGroup && priceRangeGroup?.toString().split('-')[0],
              )
              ? Number(
                  priceRangeGroup && priceRangeGroup?.toString().split('-')[0],
                )
              : response.data.minPriceValue
            : ''
          const maxTemp = priceRangeGroup
            ? response.data.maxPriceValue <
              Number(
                priceRangeGroup && priceRangeGroup?.toString().split('-')[1],
              )
              ? response.data.maxPriceValue
              : Number(
                  priceRangeGroup && priceRangeGroup?.toString().split('-')[1],
                )
            : ''
          const queryParam: any = {
            downPaymentType: 'amount',
            downPaymentAmount: downPaymentAmount || '',
            brand: brand?.split(',') || '',
            bodyType: bodyType?.split(',') || '',
            priceRangeGroup: priceRangeGroup ? minTemp + '-' + maxTemp : '',
            age: age || '',
            tenure: Number(tenure) || 5,
            monthlyIncome: monthlyIncome || '',
            sortBy: sortBy || 'lowToHigh',
          }

          getNewFunnelRecommendations(queryParam)
            .then((response: AxiosResponse<CarRecommendationResponse>) => {
              if (response.data) {
                patchFunnelQuery(queryParam)
                setRecommendations(response.data.carRecommendations)
                setResultMinMaxPrice({
                  resultMinPrice: response.data.lowestCarPrice || 0,
                  resultMaxPrice: response.data.highestCarPrice || 0,
                })
                setPage(1)
                setSampleArray({
                  items: response.data.carRecommendations.slice(0, 12),
                })
              }
              setShowLoading(false)
            })
            .catch(() => {
              setShowLoading(false)
              router.push({
                pathname: carResultsUrl,
              })
            })
          getNewFunnelRecommendations({ ...queryParam, brand: [] }).then(
            (response: AxiosResponse<CarRecommendationResponse>) => {
              if (response.data)
                setAlternativeCar(response.data.carRecommendations)
            },
          )
        }
      })
      .catch()
    return () => cleanEffect()
  }, [])

  const onCloseResultInfo = () => {
    setOpenLabelResultInfo(false)
    saveLocalStorage(LocalStorageKey.flagResultFilterInfoPLP, 'true')
    trackCekPeluangPopUpCtaClick(getDataForAmplitude())
  }
  const onCloseResultInfoClose = () => {
    setOpenLabelResultInfo(false)
    trackCekPeluangPopUpCloseClick(getDataForAmplitude())
  }

  const stickyFilter = () => {
    if (sticky && !isActive)
      return (
        <NavigationFilterMobile
          setRecommendations={setRecommendations}
          onButtonClick={handleShowFilter}
          onSortClick={handleShowSort(true)}
          carlist={recommendations || []}
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
    getNewFunnelRecommendations(queryParam).then(
      (response: AxiosResponse<CarRecommendationResponse>) => {
        if (response.data) {
          patchFunnelQuery(queryParam)
          setRecommendations(response.data.carRecommendations)
          setResultMinMaxPrice({
            resultMinPrice: response.data.lowestCarPrice || 0,
            resultMaxPrice: response.data.highestCarPrice || 0,
          })
          setPage(1)

          setSampleArray({
            items: response.data.carRecommendations.slice(0, 12),
          })
        }
        setShowLoading(false)

        router.replace({
          pathname: carResultsUrl,
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
      },
    )
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

  return (
    <>
      <Head>
        <title>{meta.title}</title>
        <meta name="title" content={meta.title} />
        <meta name="description" content={meta.description} />
      </Head>
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
        />
        {showLoading ? (
          <PLPSkeleton />
        ) : (
          <>
            {!showLoading && sampleArray.items.length === 0 ? (
              <>
                <NavigationFilterMobile
                  setRecommendations={setRecommendations}
                  onButtonClick={handleShowFilter}
                  onSortClick={handleShowSort(true)}
                  carlist={recommendations || []}
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
                  setRecommendations={setRecommendations}
                  onButtonClick={handleShowFilter}
                  onSortClick={handleShowSort(true)}
                  carlist={recommendations || []}
                  isFilter={isFilter}
                  isFilterFinancial={isFilterFinancial}
                  resultMinMaxPrice={resultMinMaxPrice}
                  isShowAnnouncementBox={showAnnouncementBox}
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
                          key={index}
                          recommendation={i}
                          isFilter={isFilterCredit}
                          onClickLabel={() => setOpenLabelPromo(true)}
                          onClickResultMudah={() => {
                            setOpenLabelResultMudah(true)
                            trackPeluangMudahBadgeClick(getDataForAmplitude())
                          }}
                          onClickResultSulit={() => {
                            setOpenLabelResultSulit(true)
                            trackPeluangSulitBadgeClick(getDataForAmplitude())
                          }}
                          isFilterTrayOpened={isButtonClick} // fix background click on ios
                        />
                      ),
                    )}
                  </InfiniteScroll>
                </div>
                <FooterMobile />
              </>
            )}
          </>
        )}
        <CSAButton
          onClick={showLeadsForm}
          data-testid={elementId.PLP.Button.LeadsFormIcon}
        />
        {isModalOpenend && (
          <LeadsFormPrimary
            onCancel={closeLeadsForm}
            trackerProperties={trackLeads()}
          />
        )}
        <FilterMobile
          onButtonClick={(value: boolean | ((prevState: boolean) => boolean)) =>
            setIsButtonClick(value)
          }
          isButtonClick={isButtonClick}
          isResetFilter={isResetFilter}
          setIsResetFilter={setIsResetFilter}
          minMaxPrice={minMaxPrice}
          isFilter={isFilter}
          isFilterFinancial={isFilterFinancial}
          setIsFilter={setIsFilter}
        />
        <SortingMobile
          open={openSorting}
          onClose={handleShowSort(false)}
          onPickClose={(value: any) => onFilterSort(value)}
        />
        <PopupPromo
          open={openLabelPromo}
          onCancel={() => setOpenLabelPromo(false)}
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
          cityListFromApi={cityListApi}
        />
      </div>
    </>
  )
}

export default NewCarResultPage

type PLPProps = {
  title: string
  description: string
}

const getBrand = (brand: string | string[] | undefined) => {
  if (brand === 'toyota') {
    return 'Toyota'
  } else if (brand === 'daihatsu') {
    return 'Daihatsu'
  } else if (brand === 'bmw') {
    return 'Bmw'
  } else {
    return ''
  }
}

export const getServerSideProps: GetServerSideProps<{
  meta: PLPProps
}> = async (ctx) => {
  const brand = getBrand(ctx.query.brand)
  const metaTagBaseApi =
    'https://api.sslpots.com/api/meta-seos/?filters[location_page3][$eq]=CarSearchResult'
  const meta = { title: 'SEVA', description: '' }
  try {
    const fetchMeta = await axios.get(metaTagBaseApi + brand)
    console.log('log meta', fetchMeta)
    const metaData = fetchMeta.data.data
    if (metaData && metaData.length > 0) {
      meta.title = metaData[0].attributes.meta_title
      meta.description = metaData[0].attributes.meta_description
    }

    return { props: { meta } }
  } catch (e) {
    return { props: { meta } }
  }
}
