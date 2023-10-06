import React, { useContext, useEffect, useMemo, useState } from 'react'
import {
  AdaOTOdiSEVALeadsForm,
  FooterMobile,
  HeaderMobile,
  PdpLowerSection,
  PdpUpperSection,
} from 'components/organisms'
import styles from 'styles/pages/carVariantList.module.scss'
import { getLocalStorage, saveLocalStorage } from 'utils/handler/localStorage'
import {
  CarRecommendation,
  CityOtrOption,
  MainVideoResponseType,
  VariantDetail,
  VideoDataType,
  trackDataCarType,
} from 'utils/types/utils'
import { LanguageCode, LocalStorageKey, SessionStorageKey } from 'utils/enum'
import { useLocalStorage } from 'utils/hooks/useLocalStorage'
import { getNewFunnelRecommendations } from 'services/newFunnel'
import { savePreviouslyViewed } from 'utils/carUtils'
import {
  getCarModelDetailsById,
  getCarVariantDetailsById,
  handleRecommendationsAndCarModelDetailsUpdate,
} from 'services/recommendations'
import { getCities } from 'services/cities'
import { decryptValue } from 'utils/encryptionUtils'
import { CSAButton, WhatsappButton } from 'components/atoms'
import { getCustomerAssistantWhatsAppNumber } from 'services/lead'
import { useFunnelQueryData } from 'services/context/funnelQueryContext'
import { getCustomerInfoSeva } from 'services/customer'
import elementId from 'helpers/elementIds'
import {
  CarSearchPageMintaPenawaranParam,
  trackCarVariantPageWaChatbot,
} from 'helpers/amplitude/seva20Tracking'
// import { usePreApprovalCarNotAvailable } from 'pages/component/PreApprovalCarNotAvalable/useModalCarNotAvalable'
import {
  getSessionStorage,
  removeSessionStorage,
  saveSessionStorage,
} from 'utils/handler/sessionStorage'
import { capitalizeFirstLetter, capitalizeWords } from 'utils/stringUtils'
import { useRouter } from 'next/router'
import { PdpDataLocalContext } from 'pages/mobil-baru/[brand]/[model]/[[...slug]]'
import { PdpDataOTOLocalContext } from 'pages/adaSEVAdiOTO/mobil-baru/[brand]/[model]/[[...slug]]'
import { useQuery } from 'utils/hooks/useQuery'
import { api } from 'services/api'
import { useCar } from 'services/context/carContext'
import { getToken } from 'utils/handler/auth'
import {
  formatNumberByLocalization,
  replacePriceSeparatorByLocalization,
} from 'utils/handler/rupiah'
import { LoanRank } from 'utils/types/models'
import { CountlyEventNames } from 'helpers/countly/eventNames'
import {
  trackEventCountly,
  valueForInitialPageProperty,
  valueForUserTypeProperty,
  valueMenuTabCategory,
} from 'helpers/countly/countly'
import { client } from 'utils/helpers/const'
import { defineRouteName } from 'utils/navigate'
import { useUtils } from 'services/context/utilsContext'
import { defaultCity, getCity } from 'utils/hooks/useGetCity'
import dynamic from 'next/dynamic'
import { useAfterInteractive } from 'utils/hooks/useAfterInteractive'
import { Currency } from 'utils/handler/calculation'

const OverlayGallery = dynamic(() =>
  import('components/molecules').then((mod) => mod.OverlayGallery),
)
const CitySelectorModal = dynamic(() =>
  import('components/molecules').then((mod) => mod.CitySelectorModal),
)
const ShareModal = dynamic(() =>
  import('components/molecules').then((mod) => mod.ShareModal),
)
const ProductDetailEmptyState = dynamic(() =>
  import('components/organisms').then((mod) => mod.ProductDetailEmptyState),
)
const PromoPopup = dynamic(() => import('components/organisms/promoPopup'))

export interface CarVariantListPageUrlParams {
  brand: string
  model: string
  tab: string
}

interface NewCarVariantListProps {
  isOTO?: boolean
}

export default function NewCarVariantList({
  isOTO = false,
}: NewCarVariantListProps) {
  const [isPreviewGalleryOpened, setIsPreviewGalleryOpened] =
    useState<boolean>(false)
  const [status, setStatus] = useState<'loading' | 'empty' | 'exist'>('exist')
  const [galleryIndexActive, setGalleryIndexActive] = useState<number>(0)
  const [dataPreviewImages, setDataPreviewImages] = useState<Array<string>>([])
  const { source }: { source: string } = useQuery(['source'])
  const [isSentCountlyPageView, setIsSentCountlyPageView] = useState(false)
  const filterStorage: any = getLocalStorage(LocalStorageKey.CarFilter)
  const { carVideoReviewRes: dataVideoReview } = useContext(
    isOTO ? PdpDataOTOLocalContext : PdpDataLocalContext,
  )
  const [isModalOpenend, setIsModalOpened] = useState<boolean>(false)

  const [isOpenCitySelectorOTRPrice, setIsOpenCitySelectorOTRPrice] =
    useState(false)

  const closeLeadsForm = () => {
    setIsModalOpened(false)
  }

  const showLeadsForm = () => {
    setIsModalOpened(true)
  }

  const handlePreviewOpened = (payload: number) => {
    setGalleryIndexActive(payload)
    setIsPreviewGalleryOpened(true)
  }

  const handlePreviewClosed = (payload: number) => {
    setGalleryIndexActive(payload)
    setIsPreviewGalleryOpened(false)
  }

  const router = useRouter()

  const brand = router.query.brand as string
  const model = router.query.model as string
  const slug = router.query.slug as string
  const lowerTab = Array.isArray(slug) ? slug[0] : undefined

  const [cityOtr] = useLocalStorage<CityOtrOption | null>(
    LocalStorageKey.CityOtr,
    null,
  )
  const {
    saveCarVariantDetails,
    carModelDetails,
    saveRecommendation,
    saveCarModelDetails,
  } = useCar()
  const {
    carRecommendationsResDefaultCity,
    carModelDetailsResDefaultCity,
    dataCombinationOfCarRecomAndModelDetailDefaultCity,
    carVariantDetailsResDefaultCity,
  } = useContext(isOTO ? PdpDataOTOLocalContext : PdpDataLocalContext)

  const modelDetail =
    carModelDetails || dataCombinationOfCarRecomAndModelDetailDefaultCity

  const initVideoData = {
    thumbnailVideo: '',
    title: '',
    videoSrc: '',
    videoId: '',
    accountName: '',
    date: '',
  }

  const getVideoReview = () => {
    const filterVideoReview = dataVideoReview?.data.filter(
      (video: MainVideoResponseType) => video.modelId === modelDetail?.id,
    )[0]
    if (filterVideoReview) {
      const videoId = filterVideoReview.link.split(/[=&]/)[1]
      const idThumbnailVideo = filterVideoReview.thumbnail.substring(
        filterVideoReview.thumbnail.indexOf('d/') + 2,
        filterVideoReview.thumbnail.lastIndexOf('/view'),
      )
      const thumbnailVideo =
        'https://drive.google.com/uc?export=view&id=' + idThumbnailVideo
      const temp = {
        thumbnailVideo: thumbnailVideo,
        title: filterVideoReview.title,
        videoSrc: filterVideoReview.link,
        videoId: videoId,
        accountName: filterVideoReview.accountName,
        date: filterVideoReview.updatedAt,
      }
      return temp
    }
    return initVideoData
  }

  const [videoData] = useState<VideoDataType>(getVideoReview())
  const [isButtonClick, setIsButtonClick] = useState(false)
  const [promoName, setPromoName] = useState('promo1')
  const [isOpenCitySelectorModal, setIsOpenCitySelectorModal] = useState(false)
  const { cities, dataAnnouncementBox } = useUtils()
  const [isOpenShareModal, setIsOpenShareModal] = useState(false)
  const [connectedRefCode, setConnectedRefCode] = useState('')
  const { funnelQuery } = useFunnelQueryData()
  const referralCodeFromUrl: string | null = getLocalStorage(
    LocalStorageKey.referralTemanSeva,
  )
  const [storedFilter] = useLocalStorage<null>(LocalStorageKey.CarFilter, null)

  const [isActive, setIsActive] = useState(false)

  const loanRankcr = router.query.loanRankCVL ?? ''

  const [showAnnouncementBox, setShowAnnouncementBox] = useState<
    boolean | null
  >(false)
  const [variantIdFuel, setVariantIdFuelRatio] = useState<string | undefined>()
  const [variantFuelRatio, setVariantFuelRatio] = useState<string | undefined>()
  // for disable promo popup after change route
  const isCurrentCitySameWithSSR = getCity().cityCode === defaultCity.cityCode
  const dataCar: trackDataCarType | null = getSessionStorage(
    SessionStorageKey.PreviousCarDataBeforeLogin,
  )

  const getQueryParamForApiRecommendation = () => {
    if (source && source.toLowerCase() === 'plp') {
      return {
        downPaymentType: storedFilter?.downPaymentType,
        downPaymentAmount: storedFilter?.downPaymentAmount,
        downPaymentPercentage: storedFilter?.downPaymentPercentage,
        monthlyIncome: storedFilter?.monthlyIncome,
        tenure: storedFilter?.tenure,
        age: storedFilter?.age,
        priceRangeGroup: storedFilter?.priceRangeGroup,
      }
    } else {
      return {}
    }
  }

  useEffect(() => {
    document.body.style.overflowY = isActive ? 'hidden' : 'auto'
    return () => {
      document.body.style.overflowY = 'auto'
    }
  }, [isActive])

  const sortedCarModelVariant = useMemo(() => {
    return (
      modelDetail?.variants?.sort(function (
        a: VariantDetail,
        b: VariantDetail,
      ) {
        return a.priceValue - b.priceValue
      }) || []
    )
  }, [modelDetail])

  const getMonthlyInstallment = () => {
    return formatNumberByLocalization(
      sortedCarModelVariant[0].monthlyInstallment,
      LanguageCode.id,
      1000000,
      10,
    )
  }

  const getDp = () => {
    if (
      funnelQuery.downPaymentAmount &&
      funnelQuery.downPaymentAmount?.toString().length > 0
    ) {
      return formatNumberByLocalization(
        parseInt(funnelQuery.downPaymentAmount.toString()),
        LanguageCode.id,
        1000000,
        10,
      )
    } else {
      return formatNumberByLocalization(
        sortedCarModelVariant[0].dpAmount,
        LanguageCode.id,
        1000000,
        10,
      )
    }
  }

  const getTenure = () => {
    if (funnelQuery.tenure && funnelQuery.tenure.toString().length > 0) {
      return funnelQuery.tenure
    } else {
      return '5'
    }
  }
  const saveDataCarForLoginPageView = () => {
    const dataCarTmp = {
      CAR_BRAND: brand,
      CAR_MODEL: model,
      CAR_VARIANT: 'Null',
      PELUANG_KREDIT_BADGE: dataCar?.PELUANG_KREDIT_BADGE
        ? dataCar.PELUANG_KREDIT_BADGE
        : loanRankcr
        ? loanRankcr === LoanRank.Green
          ? 'Mudah disetujui'
          : loanRankcr === LoanRank.Red
          ? 'Sulit disetujui'
          : 'Null'
        : 'Null',
      TENOR_OPTION: 'Null',
    }
    saveSessionStorage(
      SessionStorageKey.PreviousCarDataBeforeLogin,
      JSON.stringify(dataCarTmp),
    )
  }

  const trackFloatingWhatsapp = () => {
    if (!modelDetail) return

    const trackerProperty: CarSearchPageMintaPenawaranParam = {
      Car_Brand: brand,
      Car_Model: model,
      OTR: `Rp${replacePriceSeparatorByLocalization(
        modelDetail?.variants[0].priceValue,
        LanguageCode?.id,
      )}`,
      DP: `Rp${getDp()} Juta`,
      Cicilan: `Rp${getMonthlyInstallment()} jt/bln`,
      Tenure: `${funnelQuery?.tenure || 5} Tahun`, // convert string
      City: cityOtr?.cityName || 'Jakarta Pusat',
      Peluang_Kredit:
        funnelQuery?.monthlyIncome && funnelQuery?.age && loanRankcr
          ? loanRankcr === LoanRank.Green
            ? 'Mudah'
            : loanRankcr === LoanRank.Red
            ? 'Sulit'
            : 'Null'
          : 'Null',
    }
    trackCarVariantPageWaChatbot(trackerProperty)
  }
  const trackCountlyFloatingWhatsapp = async () => {
    let temanSevaStatus = 'No'
    if (referralCodeFromUrl) {
      temanSevaStatus = 'Yes'
    } else if (!!getToken()) {
      const response = await getCustomerInfoSeva()
      if (response[0].temanSevaTrxCode) {
        temanSevaStatus = 'Yes'
      }
    }
    trackEventCountly(CountlyEventNames.WEB_WA_DIRECT_CLICK, {
      PAGE_ORIGINATION: 'PDP - ' + valueMenuTabCategory(),
      SOURCE_BUTTON: 'Floating Button',
      CAR_BRAND: carModelDetails?.brand,
      CAR_MODEL: carModelDetails?.model,
      CAR_VARIANT: dataCar?.CAR_VARIANT ? dataCar?.CAR_VARIANT : 'Null',
      PELUANG_KREDIT_BADGE:
        dataCar?.PELUANG_KREDIT_BADGE &&
        dataCar?.PELUANG_KREDIT_BADGE === 'Green'
          ? 'Mudah disetujui'
          : dataCar?.PELUANG_KREDIT_BADGE &&
            dataCar?.PELUANG_KREDIT_BADGE === 'Red'
          ? 'Sulit disetujui'
          : 'Null',
      TENOR_OPTION:
        window.location.href.includes('kredit') &&
        dataCar?.PELUANG_KREDIT_BADGE !== 'Null'
          ? dataCar?.TENOR_OPTION + ' Tahun'
          : 'Null',
      TENOR_RESULT:
        dataCar?.TENOR_RESULT && dataCar?.TENOR_RESULT === 'Green'
          ? 'Mudah disetujui'
          : dataCar?.TENOR_RESULT && dataCar?.TENOR_RESULT === 'Red'
          ? 'Sulit disetujui'
          : 'Null',
      KK_RESULT: 'Null',
      IA_RESULT: 'Null',
      TEMAN_SEVA_STATUS: temanSevaStatus,
      INCOME_LOAN_CALCULATOR: filterStorage?.monthlyIncome
        ? `Rp${Currency(filterStorage?.monthlyIncome)}`
        : 'Null',
      INCOME_KUALIFIKASI_KREDIT: 'Null',
      INCOME_CHANGE: 'Null',
      OCCUPATION: 'Null',
    })
  }
  const onClickFloatingWhatsapp = async () => {
    let message = ''
    trackCountlyFloatingWhatsapp()
    trackFloatingWhatsapp()
    const parsedModel = capitalizeFirstLetter(model.replace(/-/g, ' '))
    const brandModel =
      capitalizeFirstLetter(brand.replace(/-/g, ' ')) +
      ' ' +
      capitalizeFirstLetter(parsedModel.replace(/-/g, ' '))

    const getMessageEnding = () => {
      if (connectedRefCode && connectedRefCode.length > 0) {
        return ` dengan menggunakan kode referral ${connectedRefCode}.`
      } else if (referralCodeFromUrl && referralCodeFromUrl.length > 0) {
        return ` dengan menggunakan kode referral ${referralCodeFromUrl}.`
      } else {
        return '.'
      }
    }

    if (status === 'empty') {
      message = `Halo, saya tertarik dengan mobil ${brandModel} di kota ${cityOtr?.cityName}. Apakah dapat dibantu?`
    } else {
      message =
        `Halo, saya tertarik dengan mobil ${brandModel} dengan DP sebesar Rp ${getDp()} jt dan cicilan per bulannya Rp ${getMonthlyInstallment()} jt selama ${getTenure()} tahun` +
        getMessageEnding()
    }

    const whatsAppUrl = await getCustomerAssistantWhatsAppNumber()
    window.open(`${whatsAppUrl}?text=${encodeURI(message)}`, '_blank')
  }

  const checkConnectedRefCode = async () => {
    if (getToken()) {
      const data: string | null = getLocalStorage(LocalStorageKey.sevaCust)
      if (data === null) {
        getCustomerInfoSeva().then((response) => {
          if (response[0].temanSevaTrxCode) {
            setConnectedRefCode(response[0].temanSevaTrxCode ?? '')
          }
        })
      } else {
        const decryptedData = JSON.parse(decryptValue(data))
        if (decryptedData?.temanSevaTrxCode) {
          setConnectedRefCode(decryptedData?.temanSevaTrxCode)
        }
      }
    }
  }

  const handleAutoscrollOnRender = () => {
    if (
      lowerTab?.toLowerCase() === 'ringkasan' ||
      lowerTab?.toLowerCase() === 'spesifikasi' ||
      lowerTab?.toLowerCase() === 'harga' ||
      lowerTab?.toLowerCase() === 'kredit'
    ) {
      const destinationElm = document.getElementById('pdp-lower-content')
      if (destinationElm) {
        setTimeout(() => {
          destinationElm.scrollIntoView()
          // add more scroll because global page header is fixed position
          window.scrollBy({ top: -100, left: 0 })
        }, 250) // use timeout because components take time to render
      }
    } else {
      window.scrollTo(0, 0)
    }
  }
  const getFuelRatio = () => {
    if (variantIdFuel)
      getCarVariantDetailsById(
        variantIdFuel, // get cheapest variant
      ).then((result) => {
        setVariantFuelRatio(result.variantDetail.rasioBahanBakar)
      })
  }

  const trackCountlyCityOTRClick = () => {
    trackEventCountly(CountlyEventNames.WEB_CITY_SELECTOR_OPEN_CLICK, {
      PAGE_ORIGINATION: 'PDP - ' + valueMenuTabCategory(),
      USER_TYPE: valueForUserTypeProperty(),
      SOURCE_SECTION: 'OTR Price (PDP)',
    })
  }
  const trackCountlyPageView = async () => {
    const pageReferrer = getSessionStorage(SessionStorageKey.PageReferrerPDP)
    const previousSourceButton = getSessionStorage(
      SessionStorageKey.PreviousSourceButtonPDP,
    )

    const isUsingFilterFinancial =
      !!filterStorage?.age &&
      !!filterStorage?.downPaymentAmount &&
      !!filterStorage?.monthlyIncome &&
      !!filterStorage?.tenure

    let pageOrigination = 'PDP - Ringkasan'
    if (!!lowerTab && lowerTab.toLowerCase() === 'kredit') {
      pageOrigination = 'Null'
    } else if (!!lowerTab) {
      pageOrigination = defineRouteName(window.location.href)
    }

    let creditBadge = 'Null'
    if (loanRankcr && loanRankcr.includes(LoanRank.Green)) {
      creditBadge = 'Mudah disetujui'
    } else if (loanRankcr && loanRankcr.includes(LoanRank.Red)) {
      creditBadge = 'Sulit disetujui'
    }

    let temanSevaStatus = 'No'
    if (referralCodeFromUrl) {
      temanSevaStatus = 'Yes'
    } else if (!!getToken()) {
      const response = await getCustomerInfoSeva()
      if (response[0].temanSevaTrxCode) {
        temanSevaStatus = 'Yes'
      }
    }

    if (client && !!window?.Countly?.q) {
      trackEventCountly(CountlyEventNames.WEB_PDP_VIEW, {
        PAGE_REFERRER: pageReferrer ?? 'Null',
        PREVIOUS_SOURCE_BUTTON: previousSourceButton ?? 'Null',
        FINCAP_FILTER_USAGE: isUsingFilterFinancial ? 'Yes' : 'No',
        CAR_BRAND: brand ? capitalizeWords(brand) : 'Null',
        CAR_MODEL: model ? capitalizeWords(model.replaceAll('-', ' ')) : 'Null',
        PAGE_ORIGINATION: pageOrigination,
        PELUANG_KREDIT_BADGE: isUsingFilterFinancial ? creditBadge : 'Null',
        USER_TYPE: valueForUserTypeProperty(),
        INITIAL_PAGE: pageReferrer ? 'No' : valueForInitialPageProperty(),
        TEMAN_SEVA_STATUS: temanSevaStatus,
      })

      setIsSentCountlyPageView(true)
      removeSessionStorage(SessionStorageKey.PageReferrerPDP)
      removeSessionStorage(SessionStorageKey.PreviousSourceButtonPDP)
    }
  }

  useAfterInteractive(() => {
    if (!isSentCountlyPageView) {
      const timeoutCountlyTracker = setTimeout(() => {
        if (!isSentCountlyPageView) {
          trackCountlyPageView()
        }
      }, 1000) // use timeout because countly tracker cant process multiple event triggered at the same time

      return () => clearTimeout(timeoutCountlyTracker)
    }
  }, [])

  useAfterInteractive(() => {
    if (dataAnnouncementBox) {
      const isShowAnnouncement = getSessionStorage(
        getToken()
          ? SessionStorageKey.ShowWebAnnouncementLogin
          : SessionStorageKey.ShowWebAnnouncementNonLogin,
      )
      if (typeof isShowAnnouncement !== 'undefined') {
        setShowAnnouncementBox(isShowAnnouncement as boolean)
      } else {
        setShowAnnouncementBox(true)
      }
    } else {
      setShowAnnouncementBox(false)
    }
  }, [dataAnnouncementBox])

  useEffect(() => {
    checkConnectedRefCode()
    saveDataCarForLoginPageView()
    saveLocalStorage(LocalStorageKey.Model, model)

    if (!isCurrentCitySameWithSSR) {
      getNewFunnelRecommendations(getQueryParamForApiRecommendation()).then(
        (result) => {
          let id = ''
          const carList = result.carRecommendations
          const currentCar = carList.filter(
            (value: CarRecommendation) =>
              value.model.replace(/ +/g, '-').toLowerCase() === model,
          )
          if (currentCar.length > 0) {
            id = currentCar[0].id
            setStatus('exist')
          } else {
            setStatus('empty')
            return
          }
          savePreviouslyViewed(currentCar[0])

          Promise.all([
            getNewFunnelRecommendations(getQueryParamForApiRecommendation()),
            getCarModelDetailsById(id),
          ])
            .then((response) => {
              const runRecommendation =
                handleRecommendationsAndCarModelDetailsUpdate(
                  saveRecommendation,
                  saveCarModelDetails,
                )

              runRecommendation(response)
              const sortedVariantsOfCurrentModel = response[1].variants
                .map((item: any) => item)
                .sort((a: any, b: any) => a.priceValue - b.priceValue)
              getCarVariantDetailsById(
                sortedVariantsOfCurrentModel[0].id, // get cheapest variant
              ).then((result3) => {
                if (result3.variantDetail.priceValue == null) {
                  setStatus('empty')
                } else {
                  saveCarVariantDetails(result3)
                  setStatus('exist')
                }
              })
            })
            .catch(() => {
              setStatus('empty')
            })
        },
      )
    } else {
      const runRecommendation = handleRecommendationsAndCarModelDetailsUpdate(
        saveRecommendation,
        saveCarModelDetails,
      )

      runRecommendation([
        carRecommendationsResDefaultCity,
        carModelDetailsResDefaultCity,
      ])
      saveCarVariantDetails(carVariantDetailsResDefaultCity)
    }
  }, [brand, model, lowerTab])

  useEffect(() => {
    if (carModelDetails) {
      setStatus('exist')
      getVideoReview()
    }
  }, [carModelDetails])

  useEffect(() => {
    if (status === 'exist' && carModelDetails) {
      handleAutoscrollOnRender()
    }
  }, [status, carModelDetails])
  useEffect(() => {
    setIsButtonClick(false)
    if (variantIdFuel) {
      getFuelRatio()
    }
  }, [router, variantIdFuel])

  const renderContent = () => {
    const parsedModel = capitalizeFirstLetter(model.replace(/-/g, ' '))
    const brandModel =
      capitalizeFirstLetter(brand.replace(/-/g, ' ')) +
      ' ' +
      capitalizeFirstLetter(parsedModel.replace(/-/g, ' '))
    switch (status) {
      case 'empty':
        return (
          <>
            <ProductDetailEmptyState
              model={parsedModel}
              message={`${brandModel}  tersedia di`}
            />
            {isOTO ? (
              <CSAButton onClick={showLeadsForm} />
            ) : (
              <WhatsappButton
                onClick={onClickFloatingWhatsapp}
                data-testid={elementId.PDP.FloatingWhatsapp}
              />
            )}
          </>
        )
      case 'exist':
        return (
          <>
            <PdpUpperSection
              isPreviewOpened={isPreviewGalleryOpened}
              emitDataImages={(e: Array<string>) => setDataPreviewImages(e)}
              emitActiveIndex={(e: number) => handlePreviewOpened(e)}
              activeIndex={galleryIndexActive}
              videoData={videoData}
              onClickCityOtrCarOverview={() => {
                setIsOpenCitySelectorModal(true)
                setIsOpenCitySelectorOTRPrice(true)
                trackCountlyCityOTRClick()
              }}
              onClickShareButton={() => setIsOpenShareModal(true)}
              isShowAnnouncementBox={showAnnouncementBox}
              isOTO={isOTO}
            />
            <PdpLowerSection
              onButtonClick={setIsButtonClick}
              setPromoName={setPromoName}
              videoData={videoData}
              showAnnouncementBox={showAnnouncementBox}
              setVariantIdFuelRatio={setVariantIdFuelRatio}
              variantFuelRatio={variantFuelRatio}
              isOTO={isOTO}
            />
            <PromoPopup
              onButtonClick={setIsButtonClick}
              isButtonClick={isButtonClick}
              promoName={promoName}
            />
            {isOTO ? (
              <CSAButton onClick={showLeadsForm} />
            ) : (
              <WhatsappButton
                onClick={onClickFloatingWhatsapp}
                data-testid={elementId.PDP.FloatingWhatsapp}
              />
            )}
          </>
        )
      default:
        return (
          <>
            <ProductDetailEmptyState
              model={capitalizeFirstLetter(parsedModel)}
              message={`${brandModel}  tersedia di`}
            />
            {isOTO ? (
              <CSAButton onClick={showLeadsForm} />
            ) : (
              <WhatsappButton
                onClick={onClickFloatingWhatsapp}
                data-testid={elementId.PDP.FloatingWhatsapp}
              />
            )}
          </>
        )
    }
  }
  return (
    <>
      <div className={styles.container}>
        <HeaderMobile
          isActive={isActive}
          setIsActive={setIsActive}
          style={{
            position: 'fixed',
          }}
          emitClickCityIcon={() => setIsOpenCitySelectorModal(true)}
          setShowAnnouncementBox={setShowAnnouncementBox}
          isShowAnnouncementBox={showAnnouncementBox}
          pageOrigination={'PDP - ' + valueMenuTabCategory()}
          isOTO={isOTO}
        />
        <div className={styles.content}>{renderContent()}</div>
        <FooterMobile pageOrigination="PDP" />
      </div>

      {isPreviewGalleryOpened && (
        <OverlayGallery
          items={dataPreviewImages}
          emitActiveIndex={(e: number) => handlePreviewClosed(e)}
          activeIndex={galleryIndexActive}
        />
      )}
      <CitySelectorModal
        isOpen={isOpenCitySelectorModal}
        onClickCloseButton={() => setIsOpenCitySelectorModal(false)}
        cityListFromApi={cities}
        pageOrigination="PDP"
        sourceButton={isOpenCitySelectorOTRPrice ? 'OTR Price (PDP)' : ''}
      />
      {isModalOpenend && <AdaOTOdiSEVALeadsForm onCancel={closeLeadsForm} />}
      <ShareModal
        open={isOpenShareModal}
        onCancel={() => setIsOpenShareModal(false)}
        data-testid={elementId.PDP.ShareModal.Container}
      />
      {/* <PreApprovalCarNotAvailableModal /> */}
    </>
  )
}
