import React, { useContext, useEffect, useMemo, useState } from 'react'
import {
  FooterMobile,
  HeaderMobile,
  PDPSkeleton,
  PdpLowerSection,
  PdpUpperSection,
  ProductDetailEmptyState,
} from 'components/organisms'
import styles from 'styles/pages/carVariantList.module.scss'
import { getLocalStorage, saveLocalStorage } from 'utils/handler/localStorage'
import {
  AnnouncementBoxDataType,
  CarRecommendation,
  CityOtrOption,
  MainVideoResponseType,
  VariantDetail,
  VideoDataType,
} from 'utils/types/utils'
import { LanguageCode, LocalStorageKey, SessionStorageKey } from 'utils/enum'
import { useLocalStorage } from 'utils/hooks/useLocalStorage'
import {
  getCarVideoReview,
  getNewFunnelRecommendations,
} from 'services/newFunnel'
import { savePreviouslyViewed } from 'utils/carUtils'
import {
  getCarModelDetailsById,
  getCarVariantDetailsById,
  handleRecommendationsAndCarModelDetailsUpdate,
} from 'services/recommendations'
import {
  CitySelectorModal,
  OverlayGallery,
  ShareModal,
} from 'components/molecules'
import PromoPopup from 'components/organisms/promoPopup'
import { getCities } from 'services/cities'
import { decryptValue } from 'utils/encryptionUtils'
import { WhatsappButton } from 'components/atoms'
import { getCustomerAssistantWhatsAppNumber } from 'services/lead'
import { useFunnelQueryData } from 'services/context/funnelQueryContext'
import { getCustomerInfoSeva } from 'services/customer'
import elementId from 'helpers/elementIds'
import {
  CarSearchPageMintaPenawaranParam,
  trackCarVariantPageWaChatbot,
} from 'helpers/amplitude/seva20Tracking'
// import { usePreApprovalCarNotAvailable } from 'pages/component/PreApprovalCarNotAvalable/useModalCarNotAvalable'
import { getSessionStorage } from 'utils/handler/sessionStorage'
import { AxiosResponse } from 'axios'
import { capitalizeFirstLetter } from 'utils/stringUtils'
import { useRouter } from 'next/router'
import { PdpDataLocalContext } from 'pages/mobil-baru/[brand]/[model]/[[...slug]]'
import { useQuery } from 'utils/hooks/useQuery'
import { api } from 'services/api'
import { useCar } from 'services/context/carContext'
import { getToken } from 'utils/handler/auth'
import {
  formatNumberByLocalization,
  replacePriceSeparatorByLocalization,
} from 'utils/handler/rupiah'
import { LoanRank } from 'utils/types/models'
import { useUtils } from 'services/context/utilsContext'

export interface CarVariantListPageUrlParams {
  brand: string
  model: string
  tab: string
}

export default function NewCarVariantList() {
  const [isPreviewGalleryOpened, setIsPreviewGalleryOpened] =
    useState<boolean>(false)
  const [status, setStatus] = useState<'loading' | 'empty' | 'exist'>('exist')
  const [galleryIndexActive, setGalleryIndexActive] = useState<number>(0)
  const [dataPreviewImages, setDataPreviewImages] = useState<Array<string>>([])
  const { source }: { source: string } = useQuery(['source'])

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
  const tab = router.query.tab as string

  const [cityOtr] = useLocalStorage<CityOtrOption | null>(
    LocalStorageKey.CityOtr,
    null,
  )
  // const { PreApprovalCarNotAvailableModal } = usePreApprovalCarNotAvailable()

  const {
    saveCarVariantDetails,
    carModelDetails,
    saveRecommendation,
    saveCarModelDetails,
  } = useCar()
  const { carModelDetailsResDefaultCity } = useContext(PdpDataLocalContext)

  const modelDetail = carModelDetails || carModelDetailsResDefaultCity

  const [videoData, setVideoData] = useState<VideoDataType>({
    thumbnailVideo: '',
    title: '',
    videoSrc: '',
    videoId: '',
    accountName: '',
    date: '',
  })
  const [isButtonClick, setIsButtonClick] = useState(false)
  const [promoName, setPromoName] = useState('promo1')
  const [isOpenCitySelectorModal, setIsOpenCitySelectorModal] = useState(false)
  const { cities, dataAnnouncementBox, saveDataAnnouncementBox } = useUtils()
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
  >(
    getSessionStorage(
      getToken()
        ? SessionStorageKey.ShowWebAnnouncementLogin
        : SessionStorageKey.ShowWebAnnouncementNonLogin,
    ) ?? true,
  )
  const [variantIdFuel, setVariantIdFuelRatio] = useState<string | undefined>()
  const [variantFuelRatio, setVariantFuelRatio] = useState<string | undefined>()
  // for disable promo popup after change route

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
      modelDetail?.variants.sort(function (a: VariantDetail, b: VariantDetail) {
        return a.priceValue - b.priceValue
      }) || []
    )
  }, [modelDetail])

  const getVideoReview = async () => {
    const { carVideoReviewRes: dataVideoReview } =
      useContext(PdpDataLocalContext)
    const filterVideoReview = dataVideoReview.data.filter(
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
      setVideoData(temp)
    }
  }

  useEffect(() => {
    document.body.style.overflowY = isActive ? 'hidden' : 'auto'
    return () => {
      document.body.style.overflowY = 'auto'
    }
  }, [isActive])

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

  const onClickFloatingWhatsapp = async () => {
    let message = ''

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
      tab?.toLowerCase() === 'ringkasan' ||
      tab?.toLowerCase() === 'spesifikasi' ||
      tab?.toLowerCase() === 'harga' ||
      tab?.toLowerCase() === 'kredit'
    ) {
      const destinationElm = document.getElementById('pdp-lower-content')
      if (destinationElm) {
        setTimeout(() => {
          destinationElm.scrollIntoView()
          // add more scroll because global page header is fixed position
          window.scrollBy({ top: -100, left: 0 })
        }, 500) // use timeout because components take time to render
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

  useEffect(() => {
    getAnnouncementBox()
  }, [])

  const getAnnouncementBox = () => {
    try {
      const res: any = api.getAnnouncementBox({
        headers: {
          'is-login': getToken() ? 'true' : 'false',
        },
      })
      saveDataAnnouncementBox(res.data)
      setShowAnnouncementBox(res.data !== undefined)
    } catch (error) {}
  }

  useEffect(() => {
    checkConnectedRefCode()

    if (tab && tab.includes('SEVA')) {
      saveLocalStorage(LocalStorageKey.referralTemanSeva, tab)
    }
    saveLocalStorage(LocalStorageKey.Model, model)

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
  }, [brand, model, tab])

  useEffect(() => {
    if (carModelDetails) {
      setStatus('exist')
      getVideoReview()
    } else {
      setStatus('loading')
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
      case 'loading':
        return <PDPSkeleton />
      case 'empty':
        return (
          <>
            <ProductDetailEmptyState
              model={parsedModel}
              message={`${brandModel}  tersedia di`}
            />
            <WhatsappButton
              onClick={onClickFloatingWhatsapp}
              data-testid={elementId.PDP.FloatingWhatsapp}
            />
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
              onClickCityOtrCarOverview={() => setIsOpenCitySelectorModal(true)}
              onClickShareButton={() => setIsOpenShareModal(true)}
              isShowAnnouncementBox={showAnnouncementBox}
            />
            <PdpLowerSection
              onButtonClick={setIsButtonClick}
              setPromoName={setPromoName}
              videoData={videoData}
              showAnnouncementBox={showAnnouncementBox}
              setVariantIdFuelRatio={setVariantIdFuelRatio}
              variantFuelRatio={variantFuelRatio}
            />
            <PromoPopup
              onButtonClick={setIsButtonClick}
              isButtonClick={isButtonClick}
              promoName={promoName}
            />
            <WhatsappButton
              onClick={onClickFloatingWhatsapp}
              data-testid={elementId.PDP.FloatingWhatsapp}
            />
          </>
        )
      default:
        return (
          <>
            <ProductDetailEmptyState
              model={capitalizeFirstLetter(parsedModel)}
              message={`${brandModel}  tersedia di`}
            />
            <WhatsappButton
              onClick={onClickFloatingWhatsapp}
              data-testid={elementId.PDP.FloatingWhatsapp}
            />
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
        />
        <div className={styles.content}>{renderContent()}</div>
        {status !== 'loading' && <FooterMobile />}
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
      />

      <ShareModal
        open={isOpenShareModal}
        onCancel={() => setIsOpenShareModal(false)}
        data-testid={elementId.PDP.ShareModal.Container}
      />
      {/* <PreApprovalCarNotAvailableModal /> */}
    </>
  )
}
