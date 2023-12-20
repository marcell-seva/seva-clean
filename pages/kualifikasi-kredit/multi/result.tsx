import { Spin } from 'antd'
import { AxiosResponse } from 'axios'
import clsx from 'clsx'
import { CSAButton, IconChevronDown, IconStrawberry } from 'components/atoms'
import { CitySelectorModal } from 'components/molecules'
import {
  FooterMobile,
  HeaderMobile,
  PopupPromo,
  SortingMobile,
} from 'components/organisms'
import { MultiUnitSkeleton } from 'components/organisms/plpSkeleton/multiunitSkeleton'
import PopupCarDetail from 'components/organisms/popupCarDetail'
import { PopupMultiCreditQualificationResult } from 'components/organisms/popUpMultiKKResult'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'

import { useMultiUnitQueryContext } from 'services/context/multiUnitQueryContext'
import { SessionStorageKey } from 'utils/enum'
import { getToken } from 'utils/handler/auth'
import { Currency } from 'utils/handler/calculation'
import { getSessionStorage } from 'utils/handler/sessionStorage'
import { multiCreditQualificationPageUrl } from 'utils/helpers/routes'
import { useProtectPage } from 'utils/hooks/useProtectPage/useProtectPage'
import {
  AnnouncementBoxDataType,
  CityOtrOption,
  MobileWebTopMenuType,
  MultKKCarRecommendation,
  PopupPromoDataItemType,
  PromoItemType,
  SearchUsedCar,
} from 'utils/types/utils'
import styles from 'styles/pages/multi-kk-result.module.scss'
import Seo from 'components/atoms/seo'
import { defaultSeoImage } from 'utils/helpers/const'
import { getCustomerInfoSeva } from 'utils/handler/customer'
import { getCustomerAssistantWhatsAppNumber } from 'utils/handler/lead'
import dynamic from 'next/dynamic'
import {
  getCities,
  getAnnouncementBox as gab,
  getMobileFooterMenu,
  getMobileHeaderMenu,
  getUsedCarSearch,
} from 'services/api'
import CarDetailCardMultiCredit from 'components/organisms/carDetailCardMultiCredit'
import { GetServerSideProps } from 'next'
import { MobileWebFooterMenuType } from 'utils/types/props'
import { serverSideManualNavigateToErrorPage } from 'utils/handler/navigateErrorPage'

const discountedDp = undefined // for current promo, it will not affect DP

const sortHighToLowList = (recommendationTmp: MultKKCarRecommendation[]) => {
  if (!recommendationTmp) {
    return []
  }

  const easyChance = recommendationTmp
    .filter(
      (item: MultKKCarRecommendation) =>
        item.creditQualificationStatus === 'Mudah',
    )
    .sort(
      (a: MultKKCarRecommendation, b: MultKKCarRecommendation) =>
        b.variants[0].priceValue - a.variants[0].priceValue,
    )
  const difficultChance = recommendationTmp
    .filter(
      (item: MultKKCarRecommendation) =>
        item.creditQualificationStatus !== 'Mudah',
    )
    .sort(
      (a: MultKKCarRecommendation, b: MultKKCarRecommendation) =>
        b.variants[0].priceValue - a.variants[0].priceValue,
    )
  return [...easyChance, ...difficultChance]
}

const sortLowToHighList = (recommendationTmp: MultKKCarRecommendation[]) => {
  const easyChance = recommendationTmp
    .filter(
      (item: MultKKCarRecommendation) =>
        item.creditQualificationStatus === 'Mudah',
    )
    .sort(
      (a: MultKKCarRecommendation, b: MultKKCarRecommendation) =>
        a.variants[0].priceValue - b.variants[0].priceValue,
    )
  const difficultChance = recommendationTmp
    .filter(
      (item: MultKKCarRecommendation) =>
        item.creditQualificationStatus !== 'Mudah',
    )
    .sort(
      (a: MultKKCarRecommendation, b: MultKKCarRecommendation) =>
        a.variants[0].priceValue - b.variants[0].priceValue,
    )
  return [...easyChance, ...difficultChance]
}

<<<<<<< HEAD
const MultiKKResult = () => {
=======
const MultiKKResult = ({
  dataMobileMenu,
  dataFooter,
  dataCities,
  dataSearchUsedCar,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
>>>>>>> bc263846 (move to SSR for search used car recommendation)
  useProtectPage()
  const router = useRouter()
  const [offsetPage, setOffsetPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const { multiUnitQuery } = useMultiUnitQueryContext()
  const sortedRecommendation = sortHighToLowList(
    multiUnitQuery.filteredCarList,
  ).slice(0, 12)
  const [recommendation, setRecommendation] = useState(sortedRecommendation)
  const [isOpenCitySelectorModal, setIsOpenCitySelectorModal] = useState(false)
  const [cityListApi, setCityListApi] = useState<Array<CityOtrOption>>([])
  const [showLoading, setShowLoading] = useState(true)
  const [isActive, setIsActive] = useState(false) // trying separation of concern
  const [trxCode, setTrxCode] = useState('')
  const [isPopUpOpened, setIsPopUpOpened] = useState(false)
  const [isOpenPopupPromo, setIsOpenPopupPromo] = useState(false)
  const [isOpenPopupCarDetail, setIsOpenPopupCarDetail] = useState(false)
  const [openSorting, setOpenSorting] = useState(false)
  const [isTooltipOpenDisclaimer, setIsTooltipOpenDisclaimer] = useState(false)
  const [selectedCarInfo, setSelectedCarInfo] =
    useState<MultKKCarRecommendation>()
  const [dataPromoPopup, setDataPromoPopup] =
    useState<PopupPromoDataItemType[]>()
<<<<<<< HEAD
  const [showAnnouncementBox, setIsShowAnnouncementBox] = useState<
    boolean | null
  >(
    getSessionStorage(
      getToken()
        ? SessionStorageKey.ShowWebAnnouncementLogin
        : SessionStorageKey.ShowWebAnnouncementNonLogin,
    ) ?? true,
  )

  const getTrxCode = () => {
    if (!!getToken()) {
      getCustomerInfoSeva().then((response) => {
        if (response[0].temanSevaTrxCode) {
          setTrxCode(response[0].temanSevaTrxCode)
        }
      })
    }
  }
=======
  const { showAnnouncementBox } = useAnnouncementBoxContext()
  const {
    saveDataAnnouncementBox,
    saveMobileWebTopMenus,
    saveMobileWebFooterMenus,
    saveCities,
    saveDataSearchUsedCar,
  } = useUtils()
>>>>>>> bc263846 (move to SSR for search used car recommendation)

  const [sortFilter, setSortFilter] = useState('Harga Tertinggi')
  const checkQuery = () => {
    if (
      multiUnitQuery.downPaymentAmount &&
      multiUnitQuery.monthlyIncome &&
      multiUnitQuery.occupation &&
      multiUnitQuery.priceRangeGroup &&
      multiUnitQuery.tenure &&
      multiUnitQuery.transmission.length > 0 &&
      multiUnitQuery.cityName &&
      multiUnitQuery.dob &&
      multiUnitQuery.multikkResponse &&
      multiUnitQuery.filteredCarList.length > 0
    ) {
      return true
    }

    return false
  }

  const checkCitiesData = () => {
    if (cityListApi.length === 0) {
      getCities().then((res) => {
        setCityListApi(res)
      })
    }
  }

  const getAnnouncementBox = () => {
    gab({
      headers: {
        'is-login': getToken() ? 'true' : 'false',
      },
    }).then((res: AxiosResponse<{ data: AnnouncementBoxDataType }>) => {
      if (res.data === undefined) {
        setIsShowAnnouncementBox(false)
      }
    })
  }

  const sendToWhatsapp = async () => {
    const transmissionText =
      multiUnitQuery.transmission.length === 1
        ? multiUnitQuery.transmission[0].toLowerCase()
        : `manual & otomatis`
    const splitPrice = multiUnitQuery.priceRangeGroup.split('-')
    const rangePriceText = `Rp${Currency(splitPrice[0])} - Rp${Currency(
      splitPrice[1],
    )}`
    const message = `Halo, saya tertarik untuk mencari mobil ${transmissionText} di SEVA dalam kisaran harga ${rangePriceText} dengan DP sebesar Rp${Currency(
      multiUnitQuery.downPaymentAmount,
    )}, pendapatan per bulan Rp${Currency(
      multiUnitQuery.monthlyIncome,
    )}, dan tenor ${multiUnitQuery.tenure} tahun.`

    const whatsAppUrl = await getCustomerAssistantWhatsAppNumber()
    window.open(`${whatsAppUrl}?text=${encodeURIComponent(message)}`, '_blank')
  }

  useEffect(() => {
<<<<<<< HEAD
    if (!checkQuery()) router.replace(multiCreditQualificationPageUrl)
    checkCitiesData()
    getAnnouncementBox()
    onShowToolTip()
    getTrxCode()

    const timeout = setTimeout(() => {
      setShowLoading(false)
    }, 500)

    return () => clearTimeout(timeout)
=======
    if (!checkQuery()) {
      router.replace(multiCreditQualificationPageUrl)
    } else {
      getAnnouncementBox()
      onShowToolTip()
      removeLocalStorage()
      trackMultiKKResult()
      saveMobileWebTopMenus(dataMobileMenu)
      saveMobileWebFooterMenus(dataFooter)
      saveCities(dataCities)
      saveDataSearchUsedCar(dataSearchUsedCar)
    }
>>>>>>> bc263846 (move to SSR for search used car recommendation)
  }, [])

  const onDismissPopup = () => {
    setIsPopUpOpened(false)
  }

  const onClickClosePopup = () => {
    setIsPopUpOpened(false)
  }

  const onClickLabelPromo = (selectedDataPromo: PromoItemType | null) => {
    if (selectedDataPromo) {
      const temp = generateDataPromoPopup(selectedDataPromo)
      setDataPromoPopup(temp)
      if (temp) {
        setIsOpenPopupPromo(true)
      }
    }
  }

  const onCancelPopupPromo = () => {
    setIsOpenPopupPromo(false)
  }

  const onCancelPopupCarDetail = () => {
    setIsOpenPopupCarDetail(false)
  }

  const onClickSeeDetail = (data: any) => {
    setSelectedCarInfo(data)
    setIsOpenPopupCarDetail(true)
  }

  const handleShowSort = (open: boolean) => () => {
    setOpenSorting(open)
  }

  const onFilterSort = (value: any) => {
    setOpenSorting(false)
    if (value === 'lowToHigh') {
      setSortFilter('Harga Terendah')
      setRecommendation(
        sortLowToHighList(multiUnitQuery.filteredCarList).slice(0, 12),
      )
    } else {
      setSortFilter('Harga Tertinggi')
      setRecommendation(
        sortHighToLowList(multiUnitQuery.filteredCarList).slice(0, 12),
      )
    }
    setOffsetPage(1)
    setHasMore(true)
  }
  const onClickShowSort = () => {
    setOpenSorting(true)
  }

  const calculateNextDisplayDate = (): Date => {
    const nextDisplayDate = new Date()
    nextDisplayDate.setDate(nextDisplayDate.getDate() + 7) // Add 7 days
    return nextDisplayDate
  }

  const isTooltipExpired = (): boolean => {
    const currentDate = new Date().getTime()
    const nextDisplayTmp = localStorage.getItem(
      'tooltipNextDisplayMultiKKResult',
    )
    let nextDisplayDate
    if (nextDisplayTmp) {
      nextDisplayDate = new Date(nextDisplayTmp!).getTime()

      return currentDate > nextDisplayDate
    } else {
      return true
    }
  }
  const onShowToolTip = () => {
    if (isTooltipExpired()) {
      setIsTooltipOpenDisclaimer(true)
      const nextDisplay = calculateNextDisplayDate().toString()

      localStorage.setItem('tooltipNextDisplayMultiKKResult', nextDisplay)
    } else {
      setIsTooltipOpenDisclaimer(false)
    }
  }

  const currentSortList = (recommendationTmp: MultKKCarRecommendation[]) => {
    if (sortFilter === 'Harga Tertinggi')
      return sortHighToLowList(recommendationTmp)
    return sortLowToHighList(recommendationTmp)
  }

  const fetchMoreData = () => {
    if (recommendation.length >= multiUnitQuery.filteredCarList.length) {
      return setHasMore(false)
    }

    if (recommendation.length >= 12 * offsetPage) {
      const filterList = currentSortList(multiUnitQuery.filteredCarList)
      const timeout = setTimeout(() => {
        const pagePlus = offsetPage + 1
        const newList = filterList.slice(12 * offsetPage, 12 * offsetPage + 12)
        const addList = [...recommendation, ...newList]
        setOffsetPage(pagePlus)
        setRecommendation([...currentSortList(addList)])
        clearTimeout(timeout)
      }, 1500)
    }
  }

  const generateDataPromoPopup = (selectedDataPromo: PromoItemType) => {
    if (selectedDataPromo) {
      const temp: PopupPromoDataItemType[] = [
        {
          title: selectedDataPromo.promoTitle,
          body: [
            {
              title: '',
              body: selectedDataPromo.promoDesc,
            },
          ],
          snk: 'https://www.seva.id/info/promo/toyota-spektakuler/',
        },
      ]

      return temp
    } else {
      return undefined
    }
  }

  const getInstallmentFeePopupDetail = () => {
    if (!!selectedCarInfo?.variants[0]?.monthlyInstallmentSpekta) {
      return (
        selectedCarInfo?.variants[0]?.monthlyInstallmentSpekta?.toString() ??
        '0'
      )
    } else {
      return selectedCarInfo?.variants[0]?.monthlyInstallment?.toString() ?? '0'
    }
  }

  return (
    <>
      <Seo
        title="SEVA - Beli Mobil Terbaru Dengan Cicilan Kredit Terbaik"
        description="Beli mobil terbaru dari Toyota, Daihatsu, BMW dengan Instant Approval*. Proses Aman & Mudah✅ Terintegrasi dengan ACC & TAF✅ SEVA member of ASTRA"
        image={defaultSeoImage}
      />
      <HeaderMobile
        isActive={isActive}
        setIsActive={setIsActive}
        emitClickCityIcon={() => setIsOpenCitySelectorModal(true)}
        setShowAnnouncementBox={setIsShowAnnouncementBox}
        isShowAnnouncementBox={showAnnouncementBox}
      />
      {showLoading ? (
        <MultiUnitSkeleton />
      ) : (
        <div
          className={clsx({
            [styles.container]: !showAnnouncementBox,
            [styles.contentWithSpace]: showAnnouncementBox,
            [styles.announcementboxpadding]: showAnnouncementBox,
            [styles.announcementboxpadding]: false,
          })}
        >
          <div className={styles.titleWrapper}>
            <h1 className={styles.title}>Rekomendasi Mobil Sesuai Budgetmu</h1>
            <span className={styles.info}>
              Berikut rekomendasi mobil sesuai hasil kualifikasi kreditmu.{' '}
              <span onClick={() => setIsPopUpOpened(true)}>
                Pelajari Lebih Lanjut
              </span>
            </span>
          </div>

          <div className={styles.separator}></div>

          <div className={styles.sortAndCounterSection}>
            <div className={styles.sortWrapper} onClick={onClickShowSort}>
              <IconStrawberry width={16} height={16} />
              Urutkan: <p>{sortFilter}</p>
              <IconChevronDown width={16} height={16} color="#13131B" />
            </div>
            <span className={styles.counterText}>
              {multiUnitQuery.multikkResponse.totalItems} Mobil Baru
            </span>
          </div>

          <div className={styles.carListWrapper}>
            <InfiniteScroll
              dataLength={recommendation.length}
              next={fetchMoreData}
              hasMore={hasMore}
              loader={
                <div className={styles.spin}>
                  <Spin />
                </div>
              }
            >
              {recommendation.map(
                (item: MultKKCarRecommendation, index: number) => {
                  return (
                    <CarDetailCardMultiCredit
                      key={index}
                      showToolTip={index === 0}
                      recommendation={item}
                      onClickLabelPromo={onClickLabelPromo}
                      onClickSeeDetail={onClickSeeDetail}
                      setShowTooltipDisclaimer={setIsTooltipOpenDisclaimer}
                      showToolTipDisclaimer={isTooltipOpenDisclaimer}
                      trxCode={trxCode}
                      selectedCityName={multiUnitQuery.cityName}
                      selectedDp={multiUnitQuery.downPaymentAmount}
                      selectedTenure={multiUnitQuery.tenure}
                    />
                  )
                },
              )}
            </InfiniteScroll>
          </div>
        </div>
      )}

      <CSAButton onClick={sendToWhatsapp} additionalstyle={'csa-button-plp'} />
      <PopupMultiCreditQualificationResult
        isOpen={isPopUpOpened}
        onDismissPopup={onDismissPopup}
        onClickClosePopup={onClickClosePopup}
      />
      <FooterMobile />
      <CitySelectorModal
        isOpen={isOpenCitySelectorModal}
        onClickCloseButton={() => setIsOpenCitySelectorModal(false)}
        cityListFromApi={cityListApi}
      />
      <PopupPromo
        open={isOpenPopupPromo}
        onCancel={onCancelPopupPromo}
        data={dataPromoPopup}
        additionalContainerClassname={
          dataPromoPopup?.length === 1 ? styles.popupPromoAutoHeight : undefined
        }
      />
      <PopupCarDetail
        isOpen={isOpenPopupCarDetail}
        dpLabelText={'Minimum DP'}
        dp={multiUnitQuery.downPaymentAmount} // use DP from form page
        dpBeforeDiscount={discountedDp}
        installmentFeeLabelText={'Cicilan mulai dari'}
        installmentFee={getInstallmentFeePopupDetail()}
        installmentFeeBeforeDiscount={
          !!selectedCarInfo?.variants[0]?.monthlyInstallmentSpekta
            ? selectedCarInfo?.variants[0]?.monthlyInstallment.toString()
            : undefined
        }
        price={selectedCarInfo?.variants[0]?.priceValue ?? 0}
        tenure={parseInt(multiUnitQuery.tenure)} // use tenure from form page
        onCancel={onCancelPopupCarDetail}
        carSeats={selectedCarInfo?.variants[0]?.seat}
        engineCapacity={selectedCarInfo?.variants[0]?.engineCapacity}
        fuelType={selectedCarInfo?.variants[0]?.fuelType}
        transmission={selectedCarInfo?.variants[0]?.transmission}
        rasioBahanBakar={selectedCarInfo?.rasioBahanBakar}
        dimenssion={`${selectedCarInfo?.length} x ${selectedCarInfo?.width} x ${selectedCarInfo?.height} mm`}
      />

      <SortingMobile
        open={openSorting}
        onClose={handleShowSort(false)}
        onPickClose={(value) => onFilterSort(value)}
        sortOptionMultiKK={true}
        selectedSortMultiKK={
          sortFilter === 'Harga Tertinggi' ? 'highToLow' : 'lowToHigh'
        }
      />
    </>
  )
}

export default MultiKKResult

export const getServerSideProps: GetServerSideProps<{
  dataMobileMenu: MobileWebTopMenuType[]
  dataFooter: MobileWebFooterMenuType[]
  dataCities: CityOtrOption[]
  dataSearchUsedCar: SearchUsedCar[]
}> = async (ctx) => {
  ctx.res.setHeader(
    'Cache-Control',
    'public, s-maxage=59, stale-while-revalidate=3000',
  )
  const params = new URLSearchParams()
  params.append('query', ' ' as string)

  try {
    const [menuMobileRes, footerRes, cityRes, dataSearchRes]: any =
      await Promise.all([
        getMobileHeaderMenu(),
        getMobileFooterMenu(),
        getCities(),
        getUsedCarSearch('', { params }),
      ])

    return {
      props: {
        dataMobileMenu: menuMobileRes.data,
        dataFooter: footerRes.data,
        dataCities: cityRes,
        dataSearchUsedCar: dataSearchRes.data,
      },
    }
  } catch (e: any) {
    return serverSideManualNavigateToErrorPage(e?.response?.status)
  }
}
