import { useCitySelectorModal } from 'components/molecules/citySelector/citySelectorModal'
import {
  OriginationLeads,
  useContactUsModal,
} from 'components/molecules/ContactUsModal/ContactUsModal'
import { useDialogModal } from 'components/molecules/dialogModal/DialogModal'
import HeaderVariant from 'components/molecules/header/header'
import { useLoginAlertModal } from 'components/molecules/LoginAlertModal/LoginAlertModal'
import { usePreApprovalCarNotAvailable } from 'components/molecules/PreApprovalCarNotAvalable/useModalCarNotAvalable'
import { StickyButton } from 'components/molecules/StickyButton/StickyButton'
import { useFunnelQueryData } from 'services/context/funnelQueryContext'
import { useModalContext } from 'services/context/modalContext'
import {
  CarSearchPageMintaPenawaranParam,
  trackCarVariantListPageLeadsFormSumit,
} from 'helpers/amplitude/seva20Tracking'
import { setTrackEventMoEngageWithoutValue } from 'helpers/moengage'
import { useRouter } from 'next/router'
import { PdpDataLocalContext } from 'pages/mobil-baru/[brand]/[model]/[[...slug]]'
import { useContext, useEffect, useMemo, useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import { api } from 'services/api'
import { useCar } from 'services/context/carContext'
import { handleRecommendationsAndCarModelDetailsUpdate } from 'services/recommendations'
import styles from 'styles/components/organisms/pdpDesktop.module.scss'
import {
  getLowestDp,
  getLowestInstallment,
  getMinimumDp,
  getMinimumMonthlyInstallment,
  getModelPriceRange,
} from 'utils/carModelUtils/carModelUtils'
import { savePreviouslyViewed } from 'utils/carUtils'
import { defaultSeoImage, hundred, million, ten } from 'utils/helpers/const'
import { variantListUrl } from 'utils/helpers/routes'
import { useLocalStorage } from 'utils/hooks/useLocalStorage'
import { saveLocalStorage } from 'utils/handler/localStorage'
import { LoanRank } from 'utils/types/models'
import { replacePriceSeparatorByLocalization } from 'utils/handler/rupiah'
import { CityOtrOption } from 'utils/types'
import {
  CarModelDetailsResponse,
  CarRecommendation,
  CarVariantDetails,
  MainVideoResponseType,
} from 'utils/types/utils'
import { HeaderAndContent } from '../HeaderAndContent/HeaderAndContent'
import { PageHeaderSeva } from '../PageHeaderSeva/PageHeaderSeva'
import { LanguageCode, LocalStorageKey } from 'utils/enum'
import { defaultCity, getCity } from 'utils/hooks/useGetCity'
import Seo from 'components/atoms/seo'
import { monthId } from 'utils/handler/date'
import { formatShortPrice } from '../OldPdpSectionComponents/FAQ/FAQ'
import {
  formatPriceNumber,
  formatPriceNumberThousandDivisor,
} from 'utils/numberUtils/numberUtils'
import { MainVideoType } from '../ContentPage/Gallery/Video/Video'

export default function index({ metaTagDataRes }: { metaTagDataRes: any }) {
  const router = useRouter()
  const {
    carRecommendationsResDefaultCity,
    carModelDetailsResDefaultCity,
    dataCombinationOfCarRecomAndModelDetailDefaultCity,
    carVariantDetailsResDefaultCity,
    carVideoReviewRes,
  } = useContext(PdpDataLocalContext)

  const { model, brand, slug } = router.query
  const tab = Array.isArray(slug) ? slug[0] : undefined
  const [stickyCTA, setStickyCTA] = useState(false)
  const routerQuery = router.query
  const isMobile = useMediaQuery({ query: '(max-width: 1024px)' })
  const { showModal: showCarNotExistModal, PreApprovalCarNotAvailableModal } =
    usePreApprovalCarNotAvailable()
  const { showModal: showLoginModal, LoginAlertModal } = useLoginAlertModal()
  const { showModal: showContactUsModal, ContactUsModal } = useContactUsModal()
  const { funnelQuery } = useFunnelQueryData()
  const { DialogModal, showModal: showDialogModal } = useDialogModal()
  const [isShowLoading, setShowLoading] = useState(false)

  const [videoReview, setVideoReview] = useState<MainVideoResponseType>()
  useEffect(() => {
    getVideoReview()
  }, [])
  const getVideoReview = async () => {
    const dataVideoReview = carVideoReviewRes
    const filterVideoReview = dataVideoReview.data.filter(
      (video: MainVideoResponseType) => video.modelId === modelDetailData.id,
    )[0]

    if (filterVideoReview) {
      const linkVideo = filterVideoReview.link.split(/[=&]/)[1]
      const idThumbnailVideo = filterVideoReview.thumbnail.substring(
        filterVideoReview.thumbnail.indexOf('d/') + 2,
        filterVideoReview.thumbnail.lastIndexOf('/view'),
      )
      const thumbnailVideo =
        'https://drive.google.com/uc?export=view&id=' + idThumbnailVideo
      const dataMainVideo = {
        uploadedBy: filterVideoReview.accountName,
        videoId: linkVideo,
        title: filterVideoReview.title,
        thumbnailVideo: thumbnailVideo,
      }
      setVideoReview(filterVideoReview)
    }
  }

  const {
    saveCarVariantDetails,
    saveRecommendation,
    carModelDetails,
    saveCarModelDetails,
    carVariantDetails,
    recommendation,
  } = useCar()
  const modelDetailData =
    carModelDetails || dataCombinationOfCarRecomAndModelDetailDefaultCity
  const { showModal: showCitySelectorModal, CitySelectorModal } =
    useCitySelectorModal()
  const [cityOtr] = useLocalStorage<CityOtrOption | null>(
    LocalStorageKey.CityOtr,
    null,
  )
  const isCurrentCitySameWithSSR = getCity().cityCode === defaultCity.cityCode

  const { modal } = useModalContext()

  const cityHandler = async () => {
    if (!cityOtr) {
      showCitySelectorModal()
    }
  }

  const formatTabUrl = (path: string) => {
    return variantListUrl.replace(':tab', path)
  }

  const minimumDp = useMemo(() => {
    if (!modelDetailData) return ''
    return getMinimumDp(modelDetailData.variants, LanguageCode.en, million, ten)
  }, [modelDetailData])

  const minimumMonthlyInstallment = useMemo(() => {
    if (!modelDetailData) return ''
    return getMinimumMonthlyInstallment(
      modelDetailData.variants,
      LanguageCode.en,
      million,
      hundred,
    )
  }, [modelDetailData])

  const onSubmitLeadSuccess = () => {
    showDialogModal()

    const loanRankcr = router.query.loanRankCVL ?? ''
    const trackerProperty: CarSearchPageMintaPenawaranParam = {
      Car_Brand: modelDetailData?.brand as string,
      Car_Model: modelDetailData?.model as string,
      OTR: `Rp${replacePriceSeparatorByLocalization(
        modelDetailData?.variants[0].priceValue as number,
        LanguageCode.id,
      )}`,
      DP: `Rp${minimumDp} Juta`,
      Cicilan: `Rp${minimumMonthlyInstallment} jt/bln`,
      Tenure: `${funnelQuery.tenure || 5} Tahun`, // convert string
      City: cityOtr?.cityName || '',
      Peluang_Kredit:
        funnelQuery.monthlyIncome && funnelQuery.age && loanRankcr
          ? loanRankcr === LoanRank.Green
            ? 'Mudah'
            : loanRankcr === LoanRank.Red
            ? 'Sulit'
            : 'Null'
          : 'Null',
    }
    trackCarVariantListPageLeadsFormSumit(trackerProperty)
    // // prettier-ignore
    window.dataLayer.push({
      event: 'interaction',
      eventCategory: 'Leads Generator',
      eventAction: 'Variant List Page - Hubungi Kami Leads Form',
      eventLabel: 'Kirim Rincian',
    })
    setTrackEventMoEngageWithoutValue('leads_created')
  }

  const mediaCTAArea = () => {
    if (isMobile) return setStickyCTA(true)
    return setStickyCTA(false)
  }

  const getCityParam = () => {
    return `?city=${cityOtr?.cityCode ?? 'jakarta'}&cityId=${
      cityOtr?.id ?? '118'
    }`
  }

  useEffect(() => {
    if (isMobile) {
      // return immediately, so that this useEffect wont run in aleph page
      return
    }

    saveLocalStorage(LocalStorageKey.Model, (model as string) ?? '')
    cityHandler()
    mediaCTAArea()

    if (!isCurrentCitySameWithSSR) {
      api.getRecommendation(getCityParam()).then((result: any) => {
        let id = ''
        const carList = result.carRecommendations
        const currentCar = carList.filter(
          (value: CarRecommendation) =>
            value.model.replace(/ +/g, '-').toLowerCase() === model,
        )

        if (currentCar.length > 0) {
          id = currentCar[0].id
        } else {
          setShowLoading(false)
          showCarNotExistModal()
          return
        }
        savePreviouslyViewed(currentCar[0])

        Promise.all([
          api.getRecommendation(getCityParam()),
          api.getCarModelDetails(id, getCityParam()),
        ])
          .then((response: any) => {
            const runRecommendation =
              handleRecommendationsAndCarModelDetailsUpdate(
                saveRecommendation,
                saveCarModelDetails,
              )

            runRecommendation(response)
            const sortedVariantsOfCurrentModel = response[1].variants
              .map((item: any) => item)
              .sort((a: any, b: any) => a.priceValue - b.priceValue)

            api
              .getCarVariantDetails(
                sortedVariantsOfCurrentModel[0].id, // get cheapest variant
                getCityParam(),
              )
              .then((result3: any) => {
                if (result3.variantDetail.priceValue == null) {
                  showCarNotExistModal()
                }
                saveCarVariantDetails(result3)
                setShowLoading(false)
              })
          })
          .catch(() => {
            showCarNotExistModal()
          })
      })
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
      const currentCar =
        carRecommendationsResDefaultCity.carRecommendations.filter(
          (value: CarRecommendation) =>
            value.model.replace(/ +/g, '-').toLowerCase() === model,
        )
      savePreviouslyViewed(currentCar[0])
    }

    if (modal.isOpenContactUsModal) {
      showContactUsModal()
    }
  }, [])

  const todayDate = new Date()

  const capitalizeWord = (word: string) =>
    word.charAt(0).toUpperCase() + word.slice(1)

  const capitalizeIfString = (value: string) =>
    typeof value === 'string'
      ? value.split('-').map(capitalizeWord).join(' ')
      : ''

  const carBrand = capitalizeIfString(routerQuery.brand as string)
  const carModel = capitalizeIfString(routerQuery.model as string)

  const currentYear = todayDate.getFullYear()
  const currentMonth = monthId(todayDate.getMonth())

  const carOTRValue = carModelDetails?.variants[0].priceValue as number
  const carOTR = isNaN(carOTRValue) ? null : `Rp ${carOTRValue / 1000000} Juta`

  const getMetaTitle = () => {
    switch (tab) {
      case 'kredit':
        return `Kredit ${carBrand} ${carModel} ${currentYear}. Simulasi Cicilan OTR ${
          getCity().cityName
        } dengan Loan Calculator | SEVA`
      case 'spesifikasi':
        return `Spesifikasi ${carBrand} ${carModel} ${currentYear} | SEVA`
      case 'harga':
        return `Harga ${carBrand} ${carModel} ${currentYear} ${
          getCity().cityName
        } Terbaru | SEVA`
    }
    return `Ringkasan Produk ${carBrand} ${carModel} ${currentYear} - Harga OTR Promo Bulan ${currentMonth} | SEVA`
  }

  const getMetaDescription = () => {
    if (carOTR !== null) {
      switch (tab) {
        case 'kredit':
          return `Hitung simulasi cicilan ${carBrand} ${carModel} ${currentYear}. Beli mobil ${carBrand} secara kredit, proses aman & mudah dengan Instant Approval* di SEVA."`
        case 'spesifikasi':
          return `Dapatkan informasi lengkap mengenai spesifikasi ${carBrand} ${carModel} ${currentYear} terbaru di SEVA`
        case 'harga':
          return `Daftar harga ${carBrand} ${carModel} ${currentYear}. Harga mulai dari ${carOTR}, dapatkan informasi mengenai harga ${carBrand} ${carModel} ${currentYear} terbaru di SEVA.`
      }
      return `Beli mobil ${carBrand} ${carModel} 2023 terbaru secara kredit dengan Instant Approval*. Harga mulai ${carOTR}, cari tau spesifikasi, harga, dan kredit di SEVA`
    }
    return null
  }
  const recommendationsDetailData =
    recommendation.length !== 0
      ? recommendation
      : carRecommendationsResDefaultCity.carRecommendations

  return (
    <>
      <Seo
        title={getMetaTitle()}
        description={getMetaDescription() ?? ''}
        image={modelDetailData?.images[0] || defaultSeoImage}
        jsonLd={jsonLD(
          carModelDetails,
          carVariantDetails,
          recommendationsDetailData,
          videoReview,
        )}
      />
      <div className={styles.pageHeaderWrapper}>
        <PageHeaderSeva>{!isMobile ? <HeaderVariant /> : <></>}</PageHeaderSeva>
      </div>
      <div className={styles.container}>
        <HeaderAndContent
          onClickPenawaran={showContactUsModal}
          toLoan={formatTabUrl('kredit')
            .replace(':brand', (brand as string) ?? '')
            .replace(':model', (model as string) ?? '')}
          onSticky={(sticky) => !isMobile && setStickyCTA(sticky)}
          isShowLoading={isShowLoading}
        />
      </div>
      {tab !== 'kredit' && (
        <StickyButton
          onClickPenawaran={showContactUsModal}
          toLoan={formatTabUrl('kredit')
            .replace(':brand', (brand as string) ?? '')
            .replace(':model', (brand as string) ?? '')}
          isSticky={stickyCTA}
        />
      )}

      <CitySelectorModal />
      <PreApprovalCarNotAvailableModal />
      <ContactUsModal
        title={'Punya Pertanyaan?'}
        onSubmitSuccess={onSubmitLeadSuccess}
        originationLeads={OriginationLeads.CarVariantList}
        onCheckLogin={() => {
          showLoginModal()
        }}
        carVariantData={{
          brand: modelDetailData?.brand as string,
          model: modelDetailData?.model as string,
          dp: getLowestDp(modelDetailData?.variants || []),
          monthlyInstallment: getLowestInstallment(
            modelDetailData?.variants || [],
          ),
          tenure: (funnelQuery.tenure as number) || 5,
        }}
      />
      <DialogModal
        title={'Terima kasih 🙌'}
        desc={
          'Agen kami akan segera menghubungi kamu di nomor telpon yang kamu sediakan'
        }
        confirmButtonText={'Ok'}
      />
      <LoginAlertModal />
    </>
  )
}

const getItemListElement = (carModel: CarModelDetailsResponse | null) => {
  return (
    carModel?.variants.map((variant, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: `${carModel?.brand} ${carModel?.model} ${variant.name}`,
        description: `Variant ${carModel?.brand} ${carModel?.model} ${variant.name}`,
        vehicleTransmission: variant.transmission,
        fuelType: variant.fuelType,
        offers: {
          '@type': 'Offer',
          priceCurrency: 'IDR',
          price: variant.priceValue,
        },
      },
    })) || []
  )
}

const getSelectedCar = (
  recommendationsDetailData: CarRecommendation[] | undefined,
  carVariant: CarVariantDetails | null,
) => {
  if (!recommendationsDetailData || !carVariant) return ''
  const selected = recommendationsDetailData.find(
    (item: CarRecommendation) => item.id === carVariant.modelDetail.id,
  )
  return selected || ''
}

const handlingCarLogo = (brand: string) => {
  switch (brand) {
    case 'Toyota':
      return 'https://www.seva.id/_next/image?url=%2Frevamp%2Ficon%2Flogo-toyota.webp&w=48&q=75'
    case 'Daihatsu':
      return 'https://www.seva.id/_next/image?url=%2Frevamp%2Ficon%2Flogo-daihatsu.webp&w=48&q=75'
    case 'Isuzu':
      return 'https://www.seva.id/_next/image?url=%2Frevamp%2Ficon%2Flogo-isuzu.webp&w=48&q=75'
    case 'BMW':
      return 'https://www.seva.id/_next/image?url=%2Frevamp%2Ficon%2Flogo-bmw.webp&w=48&q=75'
    case 'Peugeot':
      return 'https://www.seva.id/_next/image?url=%2Frevamp%2Ficon%2Flogo-peugeot.webp&w=48&q=75'
    default:
      return 'https://www.seva.id/_next/image?url=%2Frevamp%2Ficon%2Flogo-toyota.webp&w=48&q=75'
  }
}

const jsonLD = (
  carModel: CarModelDetailsResponse | null,
  carVariant: CarVariantDetails | null,
  recommendationsDetailData?: CarRecommendation[],
  videoReview?: MainVideoResponseType,
) => {
  const lowestAssetPrice = carModel?.variants[0].priceValue
  const highestAssetPrice =
    carModel?.variants[carModel?.variants.length - 1].priceValue
  const highLowPrice = {
    highestAssetPrice: highestAssetPrice || 0,
    lowestAssetPrice: lowestAssetPrice || 0,
  }
  const formatLowestPrice = formatPriceNumber(
    carModel?.variants[0].priceValue ?? 0,
  )
  const selectedCar = getSelectedCar(recommendationsDetailData, carVariant)

  const priceRange =
    carModel?.variants[carModel?.variants.length - 1].priceValue ===
    carModel?.variants[0].priceValue
      ? formatLowestPrice >= 1000
        ? formatPriceNumberThousandDivisor(formatLowestPrice, LanguageCode.id)
        : formatLowestPrice
      : getModelPriceRange(highLowPrice, LanguageCode.id)

  return {
    videoObject: {
      '@type': 'VideoObject',
      name: videoReview?.title,
      description: videoReview?.title,
      thumbnailUrl: videoReview?.thumbnail,
      uploadDate: videoReview?.createdAt,
      embedUrl: videoReview?.link,
      publisher: {
        '@type': 'Organization',
        name: videoReview?.accountName,
        logo: 'https://yt3.googleusercontent.com/ytc/AOPolaSQYe9yssWU8fmq-MB-nmuifNUMpOnGYYALyEDL=s176-c-k-c0x00ffffff-no-rj',
      },
    },
    product: {
      '@type': 'Product',
      name: `${carModel?.brand} ${carModel?.model}`,
      model: `${carModel?.model}`,
      image: carModel?.images[0],
      url: `https://www.seva.id/mobil-baru/${carModel?.brand.toLocaleLowerCase()}/${carModel?.model
        .replace(' ', '-')
        .toLocaleLowerCase()}`,
      bodyType: carVariant?.variantDetail.bodyType,
      description: carVariant?.variantDetail.description,
      brand: {
        '@type': 'Brand',
        name: carModel?.brand,
        logo: handlingCarLogo(carModel?.brand ?? ''),
      },
      vehicleSeatingCapacity: {
        '@type': 'QuantitativeValue',
        value: carVariant?.variantDetail.carSeats,
      },
      fuelType: {
        '@type': 'QualitativeValue',
        name: carVariant?.variantDetail.fuelType,
      },
      vehicleTransmission: {
        '@type': 'QualitativeValue',
        name: carVariant?.variantDetail.transmission,
      },
      vehicleEngine: {
        '@type': 'EngineSpecification',
        name: `Mesin ${carVariant?.variantDetail.engineCapacity} cc`,
      },
      manufacturer: {
        '@type': 'Organization',
        name: carModel?.brand,
      },
      offers: {
        '@type': 'Offer',
        priceCurrency: 'IDR',
        lowPrice: carModel?.variants[0].priceValue,
        highPrice: carModel?.variants[carModel?.variants.length - 1].priceValue,
        offerCicilan: carModel?.variants[0].monthlyInstallment,
        offerDp: carModel?.variants[0].dpAmount,
        tenor: carModel?.variants[0].tenure,
      },
    },
    itemList: {
      '@type': 'ItemList',
      name: `Variant ${carModel?.brand} ${carModel?.model}`,
      description: `Daftar Variant ${carModel?.brand} ${carModel?.model} 2023`,
      itemListOrder: 'http://schema.org/ItemListOrderDescending',
      numberOfItems: carModel?.variants.length,
      itemListElement: getItemListElement(carModel),
    },
    FAQPage: {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: `Berapa Cicilan / Kredit Bulanan ${carModel?.brand} ${carModel?.model} Terendah?`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: ` Cicilan / kredit bulanan terendah untuk ${
              carModel?.brand
            } ${carModel?.model} dimulai dari Rp ${formatShortPrice(
              carModel?.variants[0].priceValue || 0,
            )} juta untuk ${
              (carModel?.variants[0].tenure ?? 0) * 12
            } bulan dengan DP Rp ${formatShortPrice(
              carModel?.variants[0].dpAmount ?? 0,
            )} juta.`,
          },
        },
        {
          '@type': 'Question',
          name: 'Berapa Harga Toyota Rush?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: `Harga ${carModel?.brand} ${carModel?.model} dimulai dari kisaran harga Rp ${priceRange} juta.`,
          },
        },
        {
          '@type': 'Question',
          name: `Berapa Panjang Mobil ${carModel?.brand} ${carModel?.model}?`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: `Panjang dimensi Toyota Rush adalah ${
              selectedCar.length
            } mm dan lebarnya ${
              selectedCar ? selectedCar.width : ''
            } mm, dan tinggi ${selectedCar ? selectedCar.height : ''} mm.`,
          },
        },
      ],
    },
  }
}
