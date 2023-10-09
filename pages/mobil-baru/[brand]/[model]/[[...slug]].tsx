import React, { createContext, useEffect, useMemo, useState } from 'react'
import { PdpDesktop, PdpMobile } from 'components/organisms'
import { api } from 'services/api'
import {
  CarModelDetailsResponse,
  CarRecommendation,
  CarVariantDetails,
  MainVideoResponseType,
} from 'utils/types/utils'
import { InferGetServerSidePropsType } from 'next'
import { getIsSsrMobile } from 'utils/getIsSsrMobile'
import { useUtils } from 'services/context/utilsContext'
import { getToken } from 'utils/handler/auth'
import { useIsMobileSSr } from 'utils/hooks/useIsMobileSsr'
import { useMediaQuery } from 'react-responsive'
import { mergeModelDetailsWithLoanRecommendations } from 'services/recommendations'
import Seo from 'components/atoms/seo'
import { defaultSeoImage } from 'utils/helpers/const'
import { formatShortPrice } from 'components/organisms/OldPdpSectionComponents/FAQ/FAQ'
import { LanguageCode } from 'utils/enum'
import {
  formatPriceNumber,
  formatPriceNumberThousandDivisor,
} from 'utils/numberUtils/numberUtils'
import { getModelPriceRange } from 'utils/carModelUtils/carModelUtils'
import { articleDateFormat, monthId } from 'utils/handler/date'
import { useRouter } from 'next/router'
import { getCity } from 'utils/hooks/useGetCity'
import { useCar } from 'services/context/carContext'
import { capitalizeFirstLetter } from 'utils/stringUtils'
import { lowerSectionNavigationTab } from 'config/carVariantList.config'
import styles from 'styles/pages/pdp.module.scss'
import Script from 'next/script'
interface PdpDataLocalContextType {
  /**
   * this variable use "jakarta" as default payload, so that search engine could see page content.
   * need to re-fetch API in client with city from localStorage
   */
  carRecommendationsResDefaultCity: any
  /**
   * this variable use "jakarta" as default payload, so that search engine could see page content.
   * need to re-fetch API in client with city from localStorage
   */
  carModelDetailsResDefaultCity: any
  dataCombinationOfCarRecomAndModelDetailDefaultCity: any
  /**
   * this variable use "jakarta" as default payload, so that search engine could see page content.
   * need to re-fetch API in client with city from localStorage
   */
  carVariantDetailsResDefaultCity: any
  metaTagDataRes: any
  carVideoReviewRes: any
  carArticleReviewRes: any
}
/**
 * used to pass props without drilling through components
 */
export const PdpDataLocalContext = createContext<PdpDataLocalContextType>({
  carRecommendationsResDefaultCity: null,
  carModelDetailsResDefaultCity: null,
  dataCombinationOfCarRecomAndModelDetailDefaultCity: null,
  carVariantDetailsResDefaultCity: null,
  metaTagDataRes: null,
  carVideoReviewRes: null,
  carArticleReviewRes: null,
})
export default function index({
  carRecommendationsRes,
  carModelDetailsRes,
  dataCombinationOfCarRecomAndModelDetail,
  carVariantDetailsRes,
  metaTagDataRes,
  carVideoReviewRes,
  carArticleReviewRes,
  dataDesktopMenu,
  dataMobileMenu,
  dataFooter,
  dataCities,
  selectedVideoReview,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const {
    saveDataAnnouncementBox,
    saveDesktopWebTopMenu,
    saveMobileWebTopMenus,
    saveMobileWebFooterMenus,
    saveCities,
  } = useUtils()
  const router = useRouter()
  const { model, brand, slug } = router.query
  const [isMobile, setIsMobile] = useState(useIsMobileSSr())
  const isClientMobile = useMediaQuery({ query: '(max-width: 1024px)' })
  const { carModelDetails, recommendation } = useCar()
  const lowerTab = router.query.slug as string
  const path = lowerTab ? capitalizeFirstLetter(lowerTab[0]) : ''
  const [selectedTabValue, setSelectedTabValue] = useState(
    path ||
      lowerSectionNavigationTab.filter((item) => item.label !== 'Kredit')[0]
        .value,
  )

  const meta = useMemo(() => {
    const title =
      metaTagDataRes.data && metaTagDataRes.data.length > 0
        ? metaTagDataRes.data[0].attributes.meta_title
        : 'SEVA'
    const description =
      metaTagDataRes.data && metaTagDataRes.data.length > 0
        ? metaTagDataRes.data[0].attributes.meta_description
        : ''
    return { title, description }
  }, [metaTagDataRes])

  useEffect(() => {
    saveDesktopWebTopMenu(dataDesktopMenu)
    saveMobileWebTopMenus(dataMobileMenu)
    saveMobileWebFooterMenus(dataFooter)
    saveCities(dataCities)
    getAnnouncementBox()
  }, [])

  useEffect(() => {
    setIsMobile(isClientMobile)
  }, [isClientMobile])

  const getAnnouncementBox = async () => {
    try {
      const res: any = await api.getAnnouncementBox({
        headers: {
          'is-login': getToken() ? 'true' : 'false',
        },
      })
      saveDataAnnouncementBox(res.data)
    } catch (error) {}
  }

  const todayDate = new Date()

  const capitalizeWord = (word: string) =>
    word.charAt(0).toUpperCase() + word.slice(1)

  const capitalizeIfString = (value: string) =>
    typeof value === 'string'
      ? value.split('-').map(capitalizeWord).join(' ')
      : ''

  const carBrand = capitalizeIfString(brand as string)
  const carModel = capitalizeIfString(model as string)

  const currentYear = todayDate.getFullYear()
  const currentMonth = monthId(todayDate.getMonth())

  const carOTRValueArray = dataCombinationOfCarRecomAndModelDetail?.variants.map(item => Number(item.priceValue))
  const carOTRValue = Math.min(...carOTRValueArray as number[])
  const carOTR = `Rp ${carOTRValue / 1000000} juta`

  const getMetaTitle = () => {
    if (isMobile) {
      switch (selectedTabValue) {
        case 'Kredit':
          return `Kredit ${carBrand} ${carModel} ${currentYear}. Simulasi Cicilan OTR ${
            getCity().cityName
          } dengan Loan Calculator | SEVA`
        case 'Spesifikasi':
          return `Spesifikasi ${carBrand} ${carModel} ${currentYear} | SEVA`
        case 'Harga':
          return `Harga OTR ${carBrand} ${carModel} ${currentYear} ${
            getCity().cityName
          } Terbaru | SEVA`
        default:
          return `Ringkasan Produk ${carBrand} ${carModel} ${currentYear} - Harga OTR Promo Bulan ${currentMonth} | SEVA`
      }
    } else {
      if (Array.isArray(slug)) {
        const titles = slug.map((s) => {
          switch (s) {
            case 'kredit':
              return `Kredit ${carBrand} ${carModel} ${currentYear}. Simulasi Cicilan OTR ${
                getCity().cityName
              } dengan Loan Calculator | SEVA`
            case 'spesifikasi':
              return `Spesifikasi ${carBrand} ${carModel} ${currentYear} | SEVA`
            case 'harga':
              return `Harga OTR ${carBrand} ${carModel} ${currentYear} ${
                getCity().cityName
              } Terbaru | SEVA`
            default:
              return `Ringkasan Produk ${carBrand} ${carModel} ${currentYear} - Harga OTR Promo Bulan ${currentMonth} | SEVA`
          }
        })

        return titles.join(' | ')
      } else {
        return `Ringkasan Produk ${carBrand} ${carModel} ${currentYear} - Harga OTR Promo Bulan ${currentMonth} | SEVA`
      }
    }
  }

  const getMetaDescription = () => {
    if (isMobile) {
      switch (selectedTabValue) {
        case 'Kredit':
          return `Hitung simulasi cicilan ${carBrand} ${carModel} ${currentYear}. Beli mobil ${carBrand} secara kredit, proses aman & mudah dengan Instant Approval* di SEVA."`
        case 'Spesifikasi':
          return `Dapatkan informasi lengkap mengenai spesifikasi ${carBrand} ${carModel} ${currentYear} terbaru di SEVA`
        case 'Harga':
          return `Daftar harga ${carBrand} ${carModel} ${currentYear}. Harga mulai dari ${carOTR}, dapatkan informasi mengenai harga ${carBrand} ${carModel} ${currentYear} terbaru di SEVA.`

        default:
          return `Beli mobil ${carBrand} ${carModel} ${currentYear} terbaru secara kredit dengan Instant Approval*. Harga mulai ${carOTR}, cari tau spesifikasi, harga, dan kredit di SEVA`
      }
    }
    if (Array.isArray(slug)) {
      const descriptions = slug.map((s) => {
        switch (s) {
          case 'kredit':
            return `Hitung simulasi cicilan ${carBrand} ${carModel} ${currentYear}. Beli mobil ${carBrand} secara kredit, proses aman & mudah dengan Instant Approval* di SEVA."`
          case 'spesifikasi':
            return `Dapatkan informasi lengkap mengenai spesifikasi ${carBrand} ${carModel} ${currentYear} terbaru di SEVA`
          case 'harga':
            return `Daftar harga ${carBrand} ${carModel} ${currentYear}. Harga mulai dari ${carOTR}, dapatkan informasi mengenai harga ${carBrand} ${carModel} ${currentYear} terbaru di SEVA.`

          default:
            return `Beli mobil ${carBrand} ${carModel} ${currentYear} terbaru secara kredit dengan Instant Approval*. Harga mulai ${carOTR}, cari tau spesifikasi, harga, dan kredit di SEVA`
        }
      })

      return descriptions.join(' ')
    }
    return `Beli mobil ${carBrand} ${carModel} ${currentYear} terbaru secara kredit dengan Instant Approval*. Harga mulai ${carOTR}, cari tau spesifikasi, harga, dan kredit di SEVA`
  }

  const modelDetailData =
    carModelDetails || dataCombinationOfCarRecomAndModelDetail
  const recommendationsDetailData =
    recommendation.length !== 0
      ? recommendation
      : carRecommendationsRes?.carRecommendations

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

  return (
    <>
      <Seo
        title={getMetaTitle()}
        description={getMetaDescription() ?? ''}
        image={modelDetailData?.images[0] || defaultSeoImage}
      />
      <Script
        id="product-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            jsonLD(
              dataCombinationOfCarRecomAndModelDetail,
              carVariantDetailsRes,
              recommendationsDetailData,
              selectedVideoReview ?? null,
            ),
          ),
        }}
        key="product-jsonld"
      />
      <PdpDataLocalContext.Provider
        value={{
          carRecommendationsResDefaultCity: carRecommendationsRes,
          carModelDetailsResDefaultCity: carModelDetailsRes,
          dataCombinationOfCarRecomAndModelDetailDefaultCity:
            dataCombinationOfCarRecomAndModelDetail,
          carVariantDetailsResDefaultCity: carVariantDetailsRes,
          metaTagDataRes: metaTagDataRes,
          carVideoReviewRes: carVideoReviewRes,
          carArticleReviewRes: carArticleReviewRes,
        }}
      >
        <div className={styles.mobile}>
          <PdpMobile />
        </div>
        <div className={styles.desktop}>
          <PdpDesktop metaTagDataRes={metaTagDataRes} />
        </div>
      </PdpDataLocalContext.Provider>
    </>
  )
}
export async function getServerSideProps(context: any) {
  context.res.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=59',
  )
  try {
    if (context.query.slug?.length > 1) {
      return {
        notFound: true,
      }
    }

    const [
      carRecommendationsRes,
      metaTagDataRes,
      carVideoReviewRes,
      menuMobileRes,
      footerRes,
      cityRes,
      menuDesktopRes,
    ]: any = await Promise.all([
      api.getRecommendation('?city=jakarta&cityId=118'),
      api.getMetaTagData(context.query.model.replaceAll('-', '')),
      api.getCarVideoReview(),
      api.getMobileHeaderMenu(),
      api.getMobileFooterMenu(),
      api.getCities(),
      api.getMenu(),
    ])
    let id = ''
    const carList = carRecommendationsRes.carRecommendations
    const currentCar = carList.filter(
      (value: CarRecommendation) =>
        value.model.replace(/ +/g, '-').toLowerCase() === context.query.model,
    )
    if (currentCar.length > 0) {
      id = currentCar[0].id
    } else {
      return {
        notFound: true,
      }
    }
    const carModelDetailsRes: any = await api.getCarModelDetails(
      id,
      '?city=jakarta&cityId=118',
    )
    const sortedVariantsOfCurrentModel = carModelDetailsRes.variants
      .map((item: any) => item)
      .sort((a: any, b: any) => a.priceValue - b.priceValue)
    const carVariantDetailsRes: any = await api.getCarVariantDetails(
      sortedVariantsOfCurrentModel[0].id,
      '?city=jakarta&cityId=118',
    )

    const [carArticleReviewRes] = await Promise.all([
      fetch('https://www.seva.id/wp-json/seva/latest-posts/972').then((res) =>
        res.json(),
      ),
    ])

    const dataCombinationOfCarRecomAndModelDetail =
      mergeModelDetailsWithLoanRecommendations(
        carRecommendationsRes.carRecommendations,
        carModelDetailsRes,
      )

    const selectedVideoReview = carVideoReviewRes.data.find(
      (video: MainVideoResponseType) => {
        return video.modelId === carModelDetailsRes?.id
      },
    )

    return {
      props: {
        carRecommendationsRes,
        carModelDetailsRes,
        dataCombinationOfCarRecomAndModelDetail,
        carVariantDetailsRes,
        metaTagDataRes,
        carVideoReviewRes,
        carArticleReviewRes,
        isSsrMobile: getIsSsrMobile(context),
        dataMobileMenu: menuMobileRes.data,
        dataFooter: footerRes.data,
        dataCities: cityRes,
        dataDesktopMenu: menuDesktopRes.data,
        selectedVideoReview: selectedVideoReview || null,
      },
    }
  } catch (error) {
    console.log('qwe error', error)
    return {
      props: {
        notFound: true,
        dataMobileMenu: [],
        dataFooter: [],
        dataCities: [],
        dataDesktopMenu: [],
        isSsrMobileLocal: getIsSsrMobile(context),
      },
    }
  }
}

const getItemListElement = (carModel: CarModelDetailsResponse) => {
  const resultList = carModel?.variants.map((variant, index) => {
    return {
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
    }
  })
  return resultList || []
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
  carModel: CarModelDetailsResponse | undefined,
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
  const filterImageBasedOnType = (
    data: Array<string> | undefined,
    type: string,
  ): Array<string> | undefined => {
    return data?.filter((item: string) => {
      return item.toLowerCase().includes(type)
    })
  }
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
      uploadDate: videoReview?.createdAt
        ? articleDateFormat(new Date(videoReview?.createdAt), 'id')
        : undefined,
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
      description: carVariant?.variantDetail?.description?.id && {
        id: carVariant?.variantDetail?.description?.id,
      },
      brand: {
        '@type': 'Brand',
        name: carModel?.brand,
        logo: handlingCarLogo(carModel?.brand ?? ''),
      },
      vehicleSeatingCapacity: {
        '@type': 'QuantitativeValue',
        value: carVariant?.variantDetail.carSeats + ' Kursi',
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
        tenor: carModel?.variants[0].tenure + ' Tahun',
      },
    },
    itemList: {
      '@type': 'ItemList',
      name: `Variant ${carModel?.brand} ${carModel?.model}`,
      description: `Daftar Variant ${carModel?.brand} ${carModel?.model} 2023`,
      itemListOrder: 'http://schema.org/ItemListOrderDescending',
      numberOfItems: carModel?.variants.length,
      itemListElement: carModel ? getItemListElement(carModel) : [],
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
          name: `Berapa Harga Toyota ${carModel?.model}?`,
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
            text: `Panjang dimensi Toyota ${carModel?.model} adalah ${
              selectedCar.length
            } mm dan lebarnya ${
              selectedCar ? selectedCar.width : ''
            } mm, dan tinggi ${selectedCar ? selectedCar.height : ''} mm.`,
          },
        },
      ],
    },
    SiteNavigationElement: {
      '@type': 'SiteNavigationElement',
      name: 'SEVA',
      potencialAction: [
        {
          '@type': 'Action',
          name: 'Mobil',
          url: 'https://www.seva.id/mobil-baru',
        },
        {
          '@type': 'Action',
          name: 'Fasilitas Dana',
          url: 'https://www.seva.id/fasilitas-dana',
        },
        {
          '@type': 'Action',
          name: 'Layanan Surat Kendaraan',
          url: 'https://www.seva.id/layanan-surat-kendaraan',
        },
        {
          '@type': 'Action',
          name: 'Tentang SEVA',
          url: 'https://www.seva.id/info/tentang-kami/',
        },
        {
          '@type': 'Action',
          name: 'Promo',
          url: 'https://www.seva.id/info/promo/',
        },
        {
          '@type': 'Action',
          name: 'Teman SEVA',
          url: 'https://www.seva.id/teman-seva/dashboard',
        },
        {
          '@type': 'Action',
          name: 'Berita Utama Otomotif',
          url: 'https://www.seva.id/blog/category/otomotif/',
        },
        {
          '@type': 'Action',
          name: 'Review Otomotif',
          url: 'https://www.seva.id/blog/category/otomotif/review-otomotif/',
        },
        {
          '@type': 'Action',
          name: 'Tips & Rekomendasi',
          url: 'https://www.seva.id/blog/category/otomotif/tips-rekomendasi-otomotif/',
        },
        {
          '@type': 'Action',
          name: 'Keuangan',
          url: 'https://www.seva.id/blog/category/keuangan/',
        },
        {
          '@type': 'Action',
          name: 'Semua Artikel',
          url: 'https://www.seva.id/blog/',
        },
        {
          '@type': 'Action',
          name: 'Akun Saya',
          url: 'https://www.seva.id/akun/profil',
        },
      ],
    },
    ImageObject: [
      {
        '@type': 'ImageObject',
        contentUrl: (filterImageBasedOnType(carModel?.images, 'eksterior') as string[])?.length ?
          filterImageBasedOnType(carModel?.images, 'eksterior')?.[0] : carModel?.images?.[0],
        mainEntityOfPage: `https://www.seva.id/mobil-baru/${carModel?.brand}/${carModel?.model}?tab=Eksterior`,
        representativeOfPage: 'http://schema.org/True',
        isFamilyFriendly: 'http://schema.org/True',
        isAccesibleForFree: 'http://schema.org/False',
      },
      {
        '@type': 'ImageObject',
        contentUrl: (filterImageBasedOnType(carModel?.images, 'eksterior') as string[])?.length ?
          filterImageBasedOnType(carModel?.images, 'interior')?.[0] : carModel?.images?.[0],
        mainEntityOfPage: `https://www.seva.id/mobil-baru/${carModel?.brand}/${carModel?.model}?tab=Interior`,
        representativeOfPage: 'https://schema.org/True',
        isFamilyFriendly: 'https://schema.org/True',
        isAccesibleForFree: 'https://schema.org/False',
      },
    ],
    NewsArticle: [
      {
        '@type': 'NewsArticle',
        mainEntityOfPage: `https://www.seva.id/mobil-baru/${carModel?.brand}/${carModel?.model}?tab=Eksterior`,
        headline: 'Promo Toyota Spektakuler',
        abstract:
          'Dapatkan bunga spesial mulai dari 0%, bebas biaya administrasi atau bebas 2 tahun asuransi comprehensive hingga 20 juta rupiah untuk pembelian mobil baru Toyota Veloz, Avanza, Raize, dan Rush secara kredit',
        image:
          'https://www.seva.id/info/wp-content/uploads/2023/01/Seva_Promo-Toyota-2_SEVA-TSO-1040x336-1.png.webp',
        datePublished: '2022-11-22',
        publisher: {
          '@type': '-',
          name: 'Organization SEVA by Astra',
          logo: {
            '@type': 'ImageObject',
            url: 'https://cdn.seva.id/blog/media/2022/07/Seva-LogoxAF_Seva-PrimarybyAstraFinancial3.png',
          },
        },
      },
      {
        '@type': 'NewsArticle',
        mainEntityOfPage: `https://www.seva.id/mobil-baru/${carModel?.brand}/${carModel?.model}?tab=Eksterior`,
        headline: 'Promo Potongan DP & Cashback Daihatsu',
        abstract:
          'Dapatkan cashback tambahan trade-in senilai 1 juta rupiah untuk pembelian mobil baru Brand Daihatsu semua tipe (LCGC dan non-LCGC)',
        image: 'https://www.seva.id/revamp/illustration/PromoTradeIn.webp',
        datePublished: '2022-11-24',
        publisher: {
          '@type': '-',
          name: 'Organization SEVA by Astra',
          logo: {
            '@type': 'ImageObject',
            url: 'https://cdn.seva.id/blog/media/2022/07/Seva-LogoxAF_Seva-PrimarybyAstraFinancial3.png',
          },
        },
      },
    ],
  }
}
