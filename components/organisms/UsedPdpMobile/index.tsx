import React, { useContext, useEffect, useMemo, useState } from 'react'
import {
  AdaOTOdiSEVALeadsForm,
  FooterMobile,
  HeaderMobile,
  PdpUsedCarLowerSection,
  PdpUsedCarUpperSection,
} from 'components/organisms'
import styles from 'styles/pages/carVariantList.module.scss'
import { getLocalStorage, saveLocalStorage } from 'utils/handler/localStorage'
import { trackDataCarType } from 'utils/types/utils'
import { LanguageCode, LocalStorageKey, SessionStorageKey } from 'utils/enum'
import { useLocalStorage } from 'utils/hooks/useLocalStorage'
import { savePreviouslyViewed } from 'utils/carUtils'
import { decryptValue } from 'utils/encryptionUtils'
import { CSAButton, IconLocation, WhatsappButton } from 'components/atoms'
import { useFunnelQueryData } from 'services/context/funnelQueryContext'
import elementId from 'helpers/elementIds'
import {
  getSessionStorage,
  removeSessionStorage,
  saveSessionStorage,
} from 'utils/handler/sessionStorage'
import {
  addSeparator,
  capitalizeFirstLetter,
  capitalizeWords,
} from 'utils/stringUtils'
import { useRouter } from 'next/router'
import { getToken } from 'utils/handler/auth'
import { valueMenuTabCategory } from 'helpers/countly/countly'
import { useUtils } from 'services/context/utilsContext'
import { defaultCity, getCity } from 'utils/hooks/useGetCity'
import dynamic from 'next/dynamic'
import { getCustomerInfoSeva } from 'utils/handler/customer'
import { useAnnouncementBoxContext } from 'services/context/announcementBoxContext'
import { useAfterInteractive } from 'utils/hooks/useAfterInteractive'
import { UsedPdpDataLocalContext } from 'pages/mobil-bekas/p/[[...slug]]'
import { usedCar } from 'services/context/usedCarContext'
import { useFunnelQueryUsedCarData } from 'services/context/funnelQueryUsedCarContext'
import { UsedCarGallery } from 'components/molecules'
import clsx from 'clsx'

const UsedCarOverlayGallery = dynamic(() =>
  import('components/molecules').then((mod) => mod.UsedCarOverlayGallery),
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

interface UsedCarVariantListProps {
  isOTO?: boolean
}

export default function UsedCarVariantList({
  isOTO = false,
}: UsedCarVariantListProps) {
  const [isPreviewGalleryOpened, setIsPreviewGalleryOpened] =
    useState<boolean>(false)
  const [status, setStatus] = useState<'loading' | 'empty' | 'exist'>('exist')
  const [galleryIndexActive, setGalleryIndexActive] = useState<number>(0)
  const [dataPreviewImages, setDataPreviewImages] = useState<Array<string>>([])
  // const { source }: { source: string } = useQuery(['source'])
  // const [isSentCountlyPageView, setIsSentCountlyPageView] = useState(false)
  // const filterStorage: any = getLocalStorage(LocalStorageKey.CarFilter)
  // const { carVideoReviewRes: dataVideoReview } = useContext(
  //   isOTO ? PdpDataOTOLocalContext : PdpDataLocalContext,
  // )
  const { usedCarModelDetailsRes } = useContext(UsedPdpDataLocalContext)
  const [isModalOpenend, setIsModalOpened] = useState<boolean>(false)

  // const [isOpenCitySelectorOTRPrice, setIsOpenCitySelectorOTRPrice] =
  //   useState(false)

  const IsShowBadgeCreditOpportunity = getSessionStorage(
    SessionStorageKey.IsShowBadgeCreditOpportunity,
  )

  const { detail } = usedCar()

  // const isUsingFilterFinancial =
  //   !!filterStorage?.age &&
  //   !!filterStorage?.downPaymentAmount &&
  //   !!filterStorage?.monthlyIncome &&
  //   !!filterStorage?.tenure

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

  // const brand = router.query.brand as string
  // const model = router.query.model as string
  // const slug = router.query.slug

  const [lowerTabSlug] = ['Deskripsi', 'Kredit']

  const [selectedLowerTab, setSelectedLowerTab] = useState<string>(lowerTabSlug)
  // const [selectedUpperTab, setSelectedUpperTab] = useState<string>(upperTabSlug)

  // const [cityOtr, setCityOtr] = useState(getCity())
  // const {
  //   saveCarVariantDetails,
  //   carModelDetails,
  //   saveRecommendation,
  //   saveCarModelDetails,
  // } = useCar()
  // const {
  //   carRecommendationsResDefaultCity,
  //   carModelDetailsResDefaultCity,
  //   dataCombinationOfCarRecomAndModelDetailDefaultCity,
  //   carVariantDetailsResDefaultCity,
  // } = useContext(isOTO ? PdpDataOTOLocalContext : UsedPdpDataLocalContext)

  // const modelDetail =
  //   carModelDetails || dataCombinationOfCarRecomAndModelDetailDefaultCity

  // const initVideoData = {
  //   thumbnailVideo: '',
  //   title: '',
  //   videoSrc: '',
  //   videoId: '',
  //   accountName: '',
  //   date: '',
  // }

  // const getVideoReview = () => {
  //   const filterVideoReview = dataVideoReview?.data.filter(
  //     (video: MainVideoResponseType) => video.modelId === modelDetail?.id,
  //   )[0]
  //   if (filterVideoReview) {
  //     const videoId = filterVideoReview.link.split(/[=&]/)[1]
  //     const idThumbnailVideo = filterVideoReview.thumbnail.substring(
  //       filterVideoReview.thumbnail.indexOf('d/') + 2,
  //       filterVideoReview.thumbnail.lastIndexOf('/view'),
  //     )
  //     const thumbnailVideo =
  //       'https://drive.google.com/uc?export=view&id=' + idThumbnailVideo
  //     const temp = {
  //       thumbnailVideo: thumbnailVideo,
  //       title: filterVideoReview.title,
  //       videoSrc: filterVideoReview.link,
  //       videoId: videoId,
  //       accountName: filterVideoReview.accountName,
  //       date: filterVideoReview.updatedAt,
  //     }
  //     return temp
  //   }
  //   return initVideoData
  // }

  // const [videoData] = useState<VideoDataType>(getVideoReview())
  const [isButtonClick, setIsButtonClick] = useState(false)
  const [promoName, setPromoName] = useState('promo1')
  const [isOpenCitySelectorModal, setIsOpenCitySelectorModal] = useState(false)
  const { cities, dataAnnouncementBox } = useUtils()
  const [isOpenShareModal, setIsOpenShareModal] = useState(false)
  const [connectedRefCode, setConnectedRefCode] = useState('')
  const { funnelQuery } = useFunnelQueryUsedCarData()
  const referralCodeFromUrl: string | null = getLocalStorage(
    LocalStorageKey.referralTemanSeva,
  )
  const [storedFilter] = useLocalStorage<null>(LocalStorageKey.CarFilter, null)

  const [isActive, setIsActive] = useState(false)

  // const loanRankcr = router.query.loanRankCVL ?? ''
  const { showAnnouncementBox, saveShowAnnouncementBox } =
    useAnnouncementBoxContext()
  const [variantIdFuel, setVariantIdFuelRatio] = useState<string | undefined>()
  const [variantFuelRatio, setVariantFuelRatio] = useState<string | undefined>()
  // for disable promo popup after change route
  const isCurrentCitySameWithSSR = getCity().cityCode === defaultCity.cityCode
  const dataCar: trackDataCarType | null = getSessionStorage(
    SessionStorageKey.PreviousCarDataBeforeLogin,
  )

  useEffect(() => {
    document.body.style.overflowY = isActive ? 'hidden' : 'auto'
    return () => {
      document.body.style.overflowY = 'auto'
    }
  }, [isActive])

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

  // const handleAutoscrollOnRender = () => {
  //   if (
  //     lowerTabSlug?.toLowerCase() === 'ringkasan' ||
  //     lowerTabSlug?.toLowerCase() === 'spesifikasi' ||
  //     lowerTabSlug?.toLowerCase() === 'harga' ||
  //     lowerTabSlug?.toLowerCase() === 'kredit'
  //   ) {
  //     const destinationElm = document.getElementById('pdp-lower-content')
  //     if (destinationElm) {
  //       setTimeout(() => {
  //         destinationElm.scrollIntoView()
  //         // add more scroll because global page header is fixed position
  //         window.scrollBy({ top: -100, left: 0 })
  //       }, 250) // use timeout because components take time to render
  //     }
  //   }
  // }
  // const getFuelRatio = () => {
  //   if (variantIdFuel)
  //     getCarVariantDetailsById(
  //       variantIdFuel, // get cheapest variant
  //     ).then((result) => {
  //       setVariantFuelRatio(result.variantDetail.rasioBahanBakar)
  //     })
  // }

  // const trackCountlyCityOTRClick = () => {
  //   trackEventCountly(CountlyEventNames.WEB_CITY_SELECTOR_OPEN_CLICK, {
  //     PAGE_ORIGINATION: 'PDP - ' + valueMenuTabCategory(),
  //     USER_TYPE: valueForUserTypeProperty(),
  //     SOURCE_SECTION: 'OTR Price (PDP)',
  //   })
  // }
  // const trackCountlyPageView = async () => {
  //   const pageReferrer = getSessionStorage(SessionStorageKey.PageReferrerPDP)
  //   const previousSourceButton = getSessionStorage(
  //     SessionStorageKey.PreviousSourceButtonPDP,
  //   )

  //   const isUsingFilterFinancial =
  //     !!filterStorage?.age &&
  //     !!filterStorage?.downPaymentAmount &&
  //     !!filterStorage?.monthlyIncome &&
  //     !!filterStorage?.tenure

  //   let pageOrigination = 'PDP - Ringkasan'
  //   if (!!lowerTabSlug && lowerTabSlug.toLowerCase() === 'kredit') {
  //     pageOrigination = 'Null'
  //   } else if (!!lowerTabSlug) {
  //     pageOrigination = defineRouteName(window.location.href)
  //   }

  //   let creditBadge = 'Null'
  //   if (loanRankcr && loanRankcr.includes(LoanRank.Green)) {
  //     creditBadge = 'Mudah disetujui'
  //   } else if (loanRankcr && loanRankcr.includes(LoanRank.Red)) {
  //     creditBadge = 'Sulit disetujui'
  //   }

  //   let temanSevaStatus = 'No'
  //   if (referralCodeFromUrl) {
  //     temanSevaStatus = 'Yes'
  //   } else if (!!getToken()) {
  //     const response = await getCustomerInfoSeva()
  //     if (response[0].temanSevaTrxCode) {
  //       temanSevaStatus = 'Yes'
  //     }
  //   }

  //   if (client && !!window?.Countly?.q) {
  //     trackEventCountly(CountlyEventNames.WEB_PDP_VIEW, {
  //       PAGE_REFERRER: pageReferrer ?? 'Null',
  //       PREVIOUS_SOURCE_BUTTON: previousSourceButton ?? 'Null',
  //       FINCAP_FILTER_USAGE: isUsingFilterFinancial ? 'Yes' : 'No',
  //       CAR_BRAND: brand ? capitalizeWords(brand) : 'Null',
  //       CAR_MODEL: model ? capitalizeWords(model.replaceAll('-', ' ')) : 'Null',
  //       PAGE_ORIGINATION: pageOrigination,
  //       PELUANG_KREDIT_BADGE: isUsingFilterFinancial ? creditBadge : 'Null',
  //       USER_TYPE: valueForUserTypeProperty(),
  //       INITIAL_PAGE: pageReferrer ? 'No' : valueForInitialPageProperty(),
  //       TEMAN_SEVA_STATUS: temanSevaStatus,
  //     })

  //     setIsSentCountlyPageView(true)
  //     removeSessionStorage(SessionStorageKey.PageReferrerPDP)
  //     removeSessionStorage(SessionStorageKey.PreviousSourceButtonPDP)
  //   }
  // }

  // useAfterInteractive(() => {
  //   if (!isSentCountlyPageView) {
  //     const timeoutCountlyTracker = setTimeout(() => {
  //       if (!isSentCountlyPageView) {
  //         trackCountlyPageView()
  //       }
  //     }, 1000) // use timeout because countly tracker cant process multiple event triggered at the same time

  //     return () => clearTimeout(timeoutCountlyTracker)
  //   }
  // }, [])

  useAfterInteractive(() => {
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
  }, [dataAnnouncementBox])

  // useEffect(() => {
  //   checkConnectedRefCode()
  //   saveDataCarForLoginPageView()
  //   saveLocalStorage(LocalStorageKey.Model, model)

  //   if (!isCurrentCitySameWithSSR) {
  //     getNewFunnelRecommendations(getQueryParamForApiRecommendation()).then(
  //       (result) => {
  //         let id = ''
  //         const carList = result.carRecommendations
  //         const currentCar = carList.filter(
  //           (value: CarRecommendation) =>
  //             value.model.replace(/ +/g, '-').toLowerCase() === model,
  //         )
  //         if (currentCar.length > 0) {
  //           id = currentCar[0].id
  //           // setStatus('exist')
  //         } else {
  //           // setStatus('empty')
  //           return
  //         }
  //         savePreviouslyViewed(currentCar[0])

  //         Promise.all([
  //           getNewFunnelRecommendations(getQueryParamForApiRecommendation()),
  //           getCarModelDetailsById(id),
  //         ])
  //           .then((response) => {
  //             const runRecommendation =
  //               handleRecommendationsAndCarModelDetailsUpdate(
  //                 saveRecommendation,
  //                 saveCarModelDetails,
  //               )

  //             runRecommendation(response)
  //             const sortedVariantsOfCurrentModel = response[1].variants
  //               .map((item: any) => item)
  //               .sort((a: any, b: any) => a.priceValue - b.priceValue)
  //             getCarVariantDetailsById(
  //               sortedVariantsOfCurrentModel[0].id, // get cheapest variant
  //             ).then((result3) => {
  //               if (result3.variantDetail.priceValue == null) {
  //                 // setStatus('empty')
  //               } else {
  //                 saveCarVariantDetails(result3)
  //                 // setStatus('exist')
  //               }
  //             })
  //           })
  //           .catch(() => {
  //             // setStatus('empty')
  //           })
  //       },
  //     )
  //   } else {
  //     const runRecommendation = handleRecommendationsAndCarModelDetailsUpdate(
  //       saveRecommendation,
  //       saveCarModelDetails,
  //     )

  //     runRecommendation([
  //       carRecommendationsResDefaultCity,
  //       carModelDetailsResDefaultCity,
  //     ])
  //     saveCarVariantDetails(carVariantDetailsResDefaultCity)
  //   }
  // }, [brand, model, lowerTabSlug])

  useEffect(() => {
    if (detail) {
      setStatus('exist')
      // getVideoReview()
    }
  }, [detail])

  useEffect(() => {
    if (status === 'exist' && detail) {
      // handleAutoscrollOnRender()
    }
  }, [status, detail])
  // useEffect(() => {
  //   setIsButtonClick(false)
  //   if (variantIdFuel) {
  //     getFuelRatio()
  //   }
  // }, [router, variantIdFuel])

  // useEffect(() => {
  //   const upperTabUrl = selectedUpperTab
  //     ? selectedUpperTab.toLocaleLowerCase()
  //     : 'warna'
  //   const lowerTabUrl = selectedLowerTab
  //     ? selectedLowerTab.toLocaleLowerCase()
  //     : 'ringkasan'
  //   const urlOTO = isOTO ? '/adaSEVAdiOTO' : ''
  //   const cityUrl = citySlug ? `/${citySlug}` : ''
  //   window.history.pushState(
  //     null,
  //     '',
  //     `${window.location.origin}${urlOTO}/mobil-baru/${brand}/${model}/${upperTabUrl}/${lowerTabUrl}${cityUrl}`,
  //   )
  // }, [selectedLowerTab, selectedUpperTab])

  // useEffect(() => {
  //   if (cityOtr.cityCode !== getCity().cityCode) {
  //     setCityOtr(getCity())
  //   }
  //   checkCitySlug(citySlug, cities, setCityOtr)
  // }, [citySlug, cities])

  const renderContent = () => {
    // const parsedModel = capitalizeFirstLetter(model.replace(/-/g, ' '))
    // const brandModel =
    //   capitalizeFirstLetter(brand.replace(/-/g, ' ')) +
    //   ' ' +
    //   capitalizeFirstLetter(parsedModel.replace(/-/g, ' '))
    switch (status) {
      case 'empty':
        return (
          <>
            <ProductDetailEmptyState
              model={''}
              message={`${''}  tersedia di`}
            />
            {!isPreviewGalleryOpened && <CSAButton onClick={showLeadsForm} />}
          </>
        )
      case 'exist':
        return (
          <>
            <PdpUsedCarUpperSection
              isPreviewOpened={isPreviewGalleryOpened}
              activeIndex={galleryIndexActive}
              emitActiveIndex={(e: number) => handlePreviewOpened(e)}
              emitDataImages={(e: Array<string>) => setDataPreviewImages(e)}
            />
            {/* <PdpUpperSection
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
              onChangeTab={(value: any) => setSelectedUpperTab(value)}
              onClickShareButton={() => setIsOpenShareModal(true)}
              isShowAnnouncementBox={showAnnouncementBox}
              isOTO={isOTO}
              cityOtr={cityOtr}
            />
            <PdpLowerSection
              onButtonClick={setIsButtonClick}
              onChangeTab={(value: any) => setSelectedLowerTab(value)}
              setPromoName={setPromoName}
              videoData={videoData}
              showAnnouncementBox={showAnnouncementBox}
              setVariantIdFuelRatio={setVariantIdFuelRatio}
              variantFuelRatio={variantFuelRatio}
              isOTO={isOTO}
              isShowAnnouncementBox={showAnnouncementBox}
            />
            <PromoPopup
              onButtonClick={setIsButtonClick}
              isButtonClick={isButtonClick}
              promoName={promoName}
            /> */}
            <div className={styles.wrapper}>
              <h2 className={styles.titleCar}>
                {`${usedCarModelDetailsRes.brandName}  ${usedCarModelDetailsRes.modelName} ${usedCarModelDetailsRes.variantName} ${usedCarModelDetailsRes.nik}`}
              </h2>
              <h3 className={styles.titlePrice}>
                Rp
                {addSeparator(usedCarModelDetailsRes.priceValue.split('.')[0])}
              </h3>
              <div className={styles.wrapperLocation}>
                <IconLocation width={18} height={18} color="#B4231E" />
                <p className={styles.titleLocation}>
                  {usedCarModelDetailsRes.cityName}
                </p>
              </div>
            </div>
            <PdpUsedCarLowerSection
              onButtonClick={setIsButtonClick}
              onChangeTab={(value: any) => setSelectedLowerTab(value)}
              setPromoName={setPromoName}
              showAnnouncementBox={showAnnouncementBox}
              isShowAnnouncementBox={showAnnouncementBox}
            />
            {!isPreviewGalleryOpened && <CSAButton onClick={showLeadsForm} />}
          </>
        )
      default:
        return (
          <>
            <ProductDetailEmptyState model={''} message={''} />
            {!isPreviewGalleryOpened && <CSAButton onClick={showLeadsForm} />}
          </>
        )
    }
  }
  return (
    <>
      <div
        className={clsx({
          [styles.container]: true,
          [styles.showAAnnouncementBox]: showAnnouncementBox,
        })}
      >
        <HeaderMobile
          isActive={isActive}
          setIsActive={setIsActive}
          style={{
            position: 'fixed',
          }}
          emitClickCityIcon={() => setIsOpenCitySelectorModal(true)}
          setShowAnnouncementBox={saveShowAnnouncementBox}
          isShowAnnouncementBox={showAnnouncementBox}
          pageOrigination={'PDP - ' + valueMenuTabCategory()}
          isOTO={isOTO}
        />
        <div className={styles.content}>{renderContent()}</div>
        <FooterMobile pageOrigination="PDP - " />
      </div>

      {isPreviewGalleryOpened && (
        <UsedCarOverlayGallery
          items={dataPreviewImages}
          emitActiveIndex={(e: number) => handlePreviewClosed(e)}
          activeIndex={galleryIndexActive}
        />
      )}
      <CitySelectorModal
        isOpen={isOpenCitySelectorModal}
        onClickCloseButton={() => {
          setIsOpenCitySelectorModal(false)
        }}
        cityListFromApi={cities}
        pageOrigination="PDP"
        // sourceButton={isOpenCitySelectorOTRPrice ? 'OTR Price (PDP)' : ''}
        sourceButton={''}
      />
      {isModalOpenend && (
        <AdaOTOdiSEVALeadsForm onCancel={closeLeadsForm} onPage="PDP" />
      )}
      <ShareModal
        open={isOpenShareModal}
        onCancel={() => setIsOpenShareModal(false)}
        data-testid={elementId.PDP.ShareModal.Container}
      />
      {/* <PreApprovalCarNotAvailableModal /> */}
    </>
  )
}
