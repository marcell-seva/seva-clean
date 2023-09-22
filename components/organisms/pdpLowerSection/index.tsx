import React, { useContext, useEffect, useState } from 'react'
import { NavigationTabV1 } from 'components/molecules'
import { lowerSectionNavigationTab } from 'config/carVariantList.config'
import styles from 'styles/pages/carVariantList.module.scss'
import {
  CreditTab,
  PriceTab,
  SpecificationTab,
  SummaryTab,
} from 'components/organisms'
import {
  CarModelDetailsResponse,
  CarRecommendation,
  CarVariantDetails,
  MainVideoResponseType,
  VideoDataType,
} from 'utils/types/utils'
import { capitalizeFirstLetter } from 'utils/stringUtils'
import { useRouter } from 'next/router'
import { trackEventCountly } from 'helpers/countly/countly'
import { CountlyEventNames } from 'helpers/countly/eventNames'
import { LoanRank } from 'utils/types/models'
import { useCar } from 'services/context/carContext'
import {
  PreviousButton,
  saveDataForCountlyTrackerPageViewLC,
} from 'utils/navigate'
import { getLocalStorage } from 'utils/handler/localStorage'
import { LanguageCode, LocalStorageKey } from 'utils/enum'
import Seo from 'components/atoms/seo'
import { monthId } from 'utils/handler/date'
import { getCity } from 'utils/hooks/useGetCity'
import {
  formatPriceNumber,
  formatPriceNumberThousandDivisor,
} from 'utils/numberUtils/numberUtils'
import { getModelPriceRange } from 'utils/carModelUtils/carModelUtils'
import { formatShortPrice } from '../OldPdpSectionComponents/FAQ/FAQ'
import { PdpDataLocalContext } from 'pages/mobil-baru/[brand]/[model]/[[...slug]]'

type pdpLowerSectionProps = {
  onButtonClick: (value: boolean) => void
  setPromoName: (value: string) => void
  videoData: VideoDataType
  showAnnouncementBox: boolean | null
  setVariantIdFuelRatio: (value: string) => void
  variantFuelRatio: string | undefined
  isOTO?: boolean
}

export const PdpLowerSection = ({
  onButtonClick,
  setPromoName,
  videoData,
  showAnnouncementBox,
  setVariantIdFuelRatio,
  variantFuelRatio,
  isOTO = false,
}: pdpLowerSectionProps) => {
  const router = useRouter()
  const lowerTab = router.query.slug as string
  const path = lowerTab ? capitalizeFirstLetter(lowerTab[0]) : ''
  const [selectedTabValue, setSelectedTabValue] = useState(
    path ||
      lowerSectionNavigationTab.filter((item) => item.label !== 'Kredit')[0]
        .value,
  )
  const { carModelDetails, carVariantDetails, recommendation } = useCar()
  const filterStorage: any = getLocalStorage(LocalStorageKey.CarFilter)
  const {
    dataCombinationOfCarRecomAndModelDetailDefaultCity,
    carVideoReviewRes,
    carRecommendationsResDefaultCity,
  } = useContext(PdpDataLocalContext)

  const isUsingFilterFinancial =
    !!filterStorage?.age &&
    !!filterStorage?.downPaymentAmount &&
    !!filterStorage?.monthlyIncome &&
    !!filterStorage?.tenure
  const recommendationsDetailData =
    recommendation.length !== 0
      ? recommendation
      : carRecommendationsResDefaultCity.carRecommendations
  const loanRankcr = router.query.loanRankCVL ?? ''
  const upperTab = router.query.tab as string
  const modelDetailData =
    carModelDetails || dataCombinationOfCarRecomAndModelDetailDefaultCity
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

  const trackClickLowerTabCountly = (value: string) => {
    let creditBadge = 'Null'
    if (loanRankcr && loanRankcr.includes(LoanRank.Green)) {
      creditBadge = 'Mudah disetujui'
    } else if (loanRankcr && loanRankcr.includes(LoanRank.Red)) {
      creditBadge = 'Sulit disetujui'
    }

    trackEventCountly(CountlyEventNames.WEB_PDP_TAB_CONTENT_CLICK, {
      MENU_TAB_CATEGORY: value,
      PELUANG_KREDIT_BADGE: isUsingFilterFinancial ? creditBadge : 'Null',
      CAR_BRAND: carModelDetails?.brand ?? '',
      CAR_MODEL: carModelDetails?.model ?? '',
      VISUAL_TAB_CATEGORY: upperTab ? upperTab : 'Warna',
    })
  }

  const onSelectLowerTab = (
    value: string,
    isExecuteFromClickingTab?: boolean,
  ) => {
    if (value.toLowerCase() === 'kredit' && isExecuteFromClickingTab) {
      saveDataForCountlyTrackerPageViewLC(PreviousButton.undefined)
    }
    trackClickLowerTabCountly(value)
    setSelectedTabValue(value)
    const destinationElm = document.getElementById('pdp-lower-content')
    const urlWithoutSlug = window.location.href
      .replace('/ringkasan', '')
      .replace('/spesifikasi', '')
      .replace('/harga', '')
      .replace('/kredit', '')
    const lastIndexUrl = window.location.href.slice(-1)

    if (lastIndexUrl === '/') {
      window.history.pushState(
        null,
        '',
        urlWithoutSlug + value.toLocaleLowerCase(),
      )
    } else {
      window.history.pushState(
        null,
        '',
        urlWithoutSlug +
          '/' +
          (value !== 'Ringkasan' ? value.toLocaleLowerCase() : ''),
      )
    }

    if (destinationElm) {
      destinationElm.scrollIntoView()
      // add more scroll because global page header is fixed position
      window.scrollBy({ top: -100, left: 0 })
    }
  }

  useEffect(() => {
    setTabFromDirectUrl()
  }, [])

  const setTabFromDirectUrl = () => {
    const slug = router.query.slug

    if (slug) {
      const path = capitalizeFirstLetter(slug[0])
      setSelectedTabValue(path)
    }
  }
  const todayDate = new Date()
  const currentYear = todayDate.getFullYear()
  const currentMonth = monthId(todayDate.getMonth())
  const carOTRValue = carModelDetails?.variants[0].priceValue as number
  const carOTR = isNaN(carOTRValue) ? null : `Rp ${carOTRValue / 1000000} Juta`

  const renderContent = () => {
    switch (selectedTabValue) {
      case 'Ringkasan':
        return (
          <>
            <Seo
              title={`Ringkasan Produk ${carModelDetails?.brand} ${carModelDetails?.model} ${currentYear} - Harga OTR Promo Bulan ${currentMonth} | SEVA`}
              description={`Hitung simulasi cicilan ${carModelDetails?.brand} ${carModelDetails?.model}  ${currentYear}. Beli mobil ${carModelDetails?.brand} secara kredit, proses aman & mudah dengan Instant Approval* di SEVA."`}
              image={carModelDetails?.images[0] as string}
              jsonLd={jsonLD(
                carModelDetails,
                carVariantDetails,
                recommendationsDetailData,
                videoReview,
              )}
            />
            <SummaryTab
              setPromoName={setPromoName}
              onButtonClick={onButtonClick}
              videoData={videoData}
              setSelectedTabValue={onSelectLowerTab}
              setVariantIdFuelRatio={setVariantIdFuelRatio}
              variantFuelRatio={variantFuelRatio}
              isOTO={isOTO}
            />
          </>
        )
      case 'Spesifikasi':
        return (
          <>
            <Seo
              title={`Spesifikasi ${carModelDetails?.brand} ${carModelDetails?.model} ${currentYear} | SEVA`}
              description={`Dapatkan informasi lengkap mengenai spesifikasi ${carModelDetails?.brand} ${carModelDetails?.model} ${currentYear} terbaru di SEVA`}
              image={carModelDetails?.images[0] as string}
              jsonLd={jsonLD(
                carModelDetails,
                carVariantDetails,
                recommendationsDetailData,
                videoReview,
              )}
            />
            <SpecificationTab />
          </>
        )
      case 'Harga':
        return (
          <>
            <Seo
              title={`Harga ${carModelDetails?.brand} ${
                carModelDetails?.model
              } ${currentYear} ${getCity().cityName} Terbaru | SEVA`}
              description={`Daftar harga ${carModelDetails?.brand} ${carModelDetails?.model} ${currentYear}. Harga mulai dari ${carOTR}, dapatkan informasi mengenai harga ${carModelDetails?.brand} ${carModelDetails?.model} ${currentYear} terbaru di SEVA.`}
              image={carModelDetails?.images[0] as string}
              jsonLd={jsonLD(
                carModelDetails,
                carVariantDetails,
                recommendationsDetailData,
                videoReview,
              )}
            />

            <PriceTab
              setSelectedTabValue={onSelectLowerTab}
              setVariantIdFuelRatio={setVariantIdFuelRatio}
              variantFuelRatio={variantFuelRatio}
              isOTO={isOTO}
            />
          </>
        )
      case 'Kredit':
        return (
          <>
            <Seo
              title={`Kredit ${carModelDetails?.brand} ${
                carModelDetails?.model
              } ${currentYear}. Simulasi Cicilan OTR ${
                getCity().cityName
              } dengan Loan Calculator | SEVA`}
              description={`Hitung simulasi cicilan ${carModelDetails?.brand} ${carModelDetails?.model} ${currentYear}. Beli mobil ${carModelDetails?.brand} secara kredit, proses aman & mudah dengan Instant Approval* di SEVA."`}
              image={carModelDetails?.images[0] as string}
              jsonLd={jsonLD(
                carModelDetails,
                carVariantDetails,
                recommendationsDetailData,
                videoReview,
              )}
            />
            <CreditTab />
          </>
        )
      default:
        return (
          <>
            <Seo
              title={`Ringkasan Produk ${carModelDetails?.brand} ${carModelDetails?.model} ${currentYear} - Harga OTR Promo Bulan ${currentMonth} | SEVA`}
              description={`Hitung simulasi cicilan ${carModelDetails?.brand} ${carModelDetails?.model}  ${currentYear}. Beli mobil ${carModelDetails?.brand} secara kredit, proses aman & mudah dengan Instant Approval* di SEVA."`}
              image={carModelDetails?.images[0] as string}
              jsonLd={jsonLD(
                carModelDetails,
                carVariantDetails,
                recommendationsDetailData,
                videoReview,
              )}
            />
            <SummaryTab
              setPromoName={setPromoName}
              onButtonClick={onButtonClick}
              videoData={videoData}
              setSelectedTabValue={onSelectLowerTab}
              setVariantIdFuelRatio={setVariantIdFuelRatio}
              variantFuelRatio={variantFuelRatio}
            />
          </>
        )
    }
  }

  return (
    <div>
      <NavigationTabV1
        itemList={
          isOTO
            ? lowerSectionNavigationTab.filter(
                (item) => item.label !== 'Kredit',
              )
            : lowerSectionNavigationTab
        }
        onSelectTab={(value) => onSelectLowerTab(value, true)}
        selectedTabValueProps={selectedTabValue}
        showAnnouncementBox={showAnnouncementBox}
      />
      <div id="pdp-lower-content" className={styles.pdpLowerSection}>
        {renderContent()}
      </div>
    </div>
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
