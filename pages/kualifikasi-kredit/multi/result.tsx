import Spin from 'antd/lib/spin'
import clsx from 'clsx'
import {
  IconChevronDown,
  IconStrawberry,
  WhatsappButton,
} from 'components/atoms'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useMultiUnitQueryContext } from 'services/context/multiUnitQueryContext'
import { LocalStorageKey } from 'utils/enum'
import { getToken } from 'utils/handler/auth'
import { Currency } from 'utils/handler/calculation'
import { multiCreditQualificationPageUrl } from 'utils/helpers/routes'
import { useProtectPage } from 'utils/hooks/useProtectPage/useProtectPage'
import {
  CityOtrOption,
  MobileWebTopMenuType,
  MultKKCarRecommendation,
  PopupPromoDataItemType,
  PromoItemType,
  SearchUsedCar,
} from 'utils/types/utils'
import styles from 'styles/pages/multi-kk-result.module.scss'
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
import { trackEventCountly } from 'helpers/countly/countly'
import { CountlyEventNames } from 'helpers/countly/eventNames'
import { getLocalStorage } from 'utils/handler/localStorage'
import { RouteName } from 'utils/navigate'
import { useUtils } from 'services/context/utilsContext'
import { useAnnouncementBoxContext } from 'services/context/announcementBoxContext'
import { PageLayout } from 'components/templates'
import CarDetailCardMultiCredit from 'components/organisms/carDetailCardMultiCredit'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { MobileWebFooterMenuType } from 'utils/types/props'
import { serverSideManualNavigateToErrorPage } from 'utils/handler/navigateErrorPage'

const discountedDp = undefined // for current promo, it will not affect DP

const SortingMobile = dynamic(
  () => import('components/organisms/sortingMobile'),
  { ssr: false },
)

const PopupPromo = dynamic(
  () => import('components/organisms/popupPromo').then((mod) => mod.PopupPromo),
  { ssr: false },
)

const PopupCarDetail = dynamic(
  () => import('components/organisms/popupCarDetail'),
  { ssr: false },
)

const PopupMultiCreditQualificationResult = dynamic(
  () =>
    import('components/organisms/popUpMultiKKResult').then(
      (mod) => mod.PopupMultiCreditQualificationResult,
    ),
  { ssr: false },
)

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

const MultiKKResult = ({
  dataMobileMenu,
  dataFooter,
  dataCities,
  dataSearchUsedCar,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  useProtectPage()
  const router = useRouter()
  const [offsetPage, setOffsetPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const { multiUnitQuery } = useMultiUnitQueryContext()
  const sortedRecommendation = sortHighToLowList(
    multiUnitQuery.filteredCarList,
  ).slice(0, 12)
  const [recommendation, setRecommendation] = useState(sortedRecommendation)
  const [isPopUpOpened, setIsPopUpOpened] = useState(false)
  const [isOpenPopupPromo, setIsOpenPopupPromo] = useState(false)
  const [isOpenPopupCarDetail, setIsOpenPopupCarDetail] = useState(false)
  const [openSorting, setOpenSorting] = useState(false)
  const [isTooltipOpenDisclaimer, setIsTooltipOpenDisclaimer] = useState(false)
  const [selectedCarInfo, setSelectedCarInfo] =
    useState<MultKKCarRecommendation>()
  const [dataPromoPopup, setDataPromoPopup] =
    useState<PopupPromoDataItemType[]>()
  const { showAnnouncementBox, saveShowAnnouncementBox } =
    useAnnouncementBoxContext()
  const {
    saveDataAnnouncementBox,
    saveMobileWebTopMenus,
    saveMobileWebFooterMenus,
    saveCities,
    saveDataSearchUsedCar,
  } = useUtils()

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
      // no need to validate temanSevaTrxCode
    ) {
      return true
    }

    return false
  }

  const getAnnouncementBox = async () => {
    try {
      const res: any = await gab({
        headers: {
          'is-login': getToken() ? 'true' : 'false',
        },
      })
      saveDataAnnouncementBox(res.data)
    } catch (error) {}
  }
  const sendToWhatsapp = async () => {
    let temanSevaStatus = 'No'

    const referralCodeFromUrl: string | null = getLocalStorage(
      LocalStorageKey.referralTemanSeva,
    )
    if (referralCodeFromUrl) {
      temanSevaStatus = 'Yes'
    } else if (!!getToken()) {
      const response = await getCustomerInfoSeva()
      if (response[0].temanSevaTrxCode) {
        temanSevaStatus = 'Yes'
      }
    }
    trackEventCountly(CountlyEventNames.WEB_WA_DIRECT_CLICK, {
      PAGE_ORIGINATION: 'Multi-Unit Kualifikasi Kredit Result',
      SOURCE_BUTTON: 'Floating Button',
      CAR_BRAND: 'Null',
      CAR_MODEL: 'Null',
      CAR_VARIANT: 'Null',
      PELUANG_KREDIT_BADGE: 'Null',
      TENOR_OPTION: multiUnitQuery.tenure,
      TENOR_RESULT: 'Null',
      KK_RESULT: 'Null',
      IA_RESULT: 'Null',
      TEMAN_SEVA_STATUS: temanSevaStatus,
      INCOME_LOAN_CALCULATOR: 'Null',
      INCOME_KUALIFIKASI_KREDIT: 'Null',
      INCOME_CHANGE: 'Null',
      OCCUPATION: multiUnitQuery.occupation?.toString().replace('&', 'and'),
    })
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
        trackEventCountly(
          CountlyEventNames.WEB_MULTI_KK_PAGE_RESULT_PROMO_BADGE_CLICK,
          { PROMO_AMOUNT: 1 },
        )
      }
      trackEventCountly(
        CountlyEventNames.WEB_MULTI_KK_PAGE_RESULT_PROMO_POPUP_VIEW,
        { PROMO_TITLE: selectedDataPromo.promoTitle },
      )
    }
  }
  const removeLocalStorage = () => {
    localStorage.removeItem('MultiKKFormData')
  }

  const trackMultiKKResult = () => {
    const resultMudah = multiUnitQuery.multikkResponse.carRecommendations.some(
      (x) => x.creditQualificationStatus.toLowerCase() === 'mudah',
    )
    const resultSedang = multiUnitQuery.multikkResponse.carRecommendations.some(
      (x) => x.creditQualificationStatus.toLowerCase() === 'sedang',
    )
    const resultSulit = multiUnitQuery.multikkResponse.carRecommendations.some(
      (x) => x.creditQualificationStatus.toLowerCase() === 'sulit',
    )
    const resultStatus = []
    if (resultMudah) resultStatus.push('Mudah')
    if (resultSedang) resultStatus.push('Sedang')
    if (resultSulit) resultStatus.push('Sulit')
    const track = {
      KUALIFIKASI_KREDIT_RESULT: resultStatus.join(', '),
      TOTAL_CAR: multiUnitQuery.multikkResponse.totalItems,
    }

    trackEventCountly(CountlyEventNames.WEB_MULTI_KK_PAGE_RESULT_VIEW, track)
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
    trackEventCountly(CountlyEventNames.WEB_MULTI_KK_PAGE_RESULT_SORT_CLICK)
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
      trackEventCountly(
        CountlyEventNames.WEB_MULTI_KK_PAGE_RESULT_COACHMARK_VIEW,
      )
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
      <PageLayout
        pageOrigination={RouteName.MultiUnitResult}
        sourceButton="Location Icon (Navbar)"
        shadowBox={false}
      >
        {() => (
          <>
            <div
              className={clsx({
                [styles.mobileView]: true,
                [styles.container]: !showAnnouncementBox,
                [styles.contentWithSpace]: showAnnouncementBox,
                [styles.announcementboxpadding]: showAnnouncementBox,
                [styles.announcementboxpadding]: false,
              })}
            >
              <div className={styles.titleWrapper}>
                <h1 className={styles.title}>
                  Rekomendasi Mobil Sesuai Budgetmu
                </h1>
                <span className={styles.info}>
                  Berikut rekomendasi mobil sesuai hasil kualifikasi kreditmu.{' '}
                  <span
                    onClick={() => {
                      setIsPopUpOpened(true)
                      trackEventCountly(
                        CountlyEventNames.WEB_MULTI_KK_PAGE_RESULT_LEARN_MORE_CLICK,
                      )
                    }}
                  >
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
                          order={index}
                          showToolTip={index === 0}
                          recommendation={item}
                          onClickLabelPromo={onClickLabelPromo}
                          onClickSeeDetail={(data) => {
                            onClickSeeDetail(data)
                            const track = {
                              CAR_BRAND: item.brand,
                              CAR_MODEL: item.model,
                              CAR_ORDER: index + 1,
                              KUALIFIKASI_KREDIT_RESULT:
                                item.creditQualificationStatus,
                              PROMO_AMOUNT: item.promo ? '1' : '0',
                            }

                            trackEventCountly(
                              CountlyEventNames.WEB_MULTI_KK_PAGE_CAR_DETAIL_CLICK,
                              track,
                            )
                          }}
                          setShowTooltipDisclaimer={setIsTooltipOpenDisclaimer}
                          showToolTipDisclaimer={isTooltipOpenDisclaimer}
                          trxCode={multiUnitQuery.trxCode}
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
            <WhatsappButton
              onClick={sendToWhatsapp}
              additionalStyle={'csa-button-plp'}
            />
          </>
        )}
      </PageLayout>
      <PopupMultiCreditQualificationResult
        isOpen={isPopUpOpened}
        onDismissPopup={onDismissPopup}
        onClickClosePopup={onClickClosePopup}
      />
      <PopupPromo
        open={isOpenPopupPromo}
        onCancel={onCancelPopupPromo}
        data={dataPromoPopup}
        additionalContainerClassname={
          dataPromoPopup?.length === 1 ? styles.popupPromoAutoHeight : undefined
        }
        onClickSNK={(promo) =>
          trackEventCountly(
            CountlyEventNames.WEB_MULTI_KK_PAGE_RESULT_PROMO_SNK_CLICK,
            { PROMO_TITLE: promo.title },
          )
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
        onPickClose={(value, label) => {
          onFilterSort(value)
          trackEventCountly(
            CountlyEventNames.WEB_MULTI_KK_PAGE_RESULT_SORT_OPTION_CLICK,
            { SORT_OPTION: label },
          )
        }}
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
  params.append('query', '' as string)

  try {
    const [menuMobileRes, footerRes, cityRes, dataSearchRes]: any =
      await Promise.all([
        getMobileHeaderMenu(),
        getMobileFooterMenu(),
        getCities(),
        getUsedCarSearch(),
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
