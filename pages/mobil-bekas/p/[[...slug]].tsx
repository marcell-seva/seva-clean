import React, { createContext, useEffect, useMemo, useState } from 'react'
import { UsedPdpMobile } from 'components/organisms'
import styles from 'styles/pages/pdpUsed.module.scss'
import { CityOtrOption } from 'utils/types/utils'
import { InferGetServerSidePropsType } from 'next'
import { getIsSsrMobile } from 'utils/getIsSsrMobile'
import { useUtils } from 'services/context/utilsContext'
import { getToken } from 'utils/handler/auth'
import { formatPriceNumberThousand } from 'utils/numberUtils/numberUtils'
import { convertStringDateToMonthYear, monthId } from 'utils/handler/date'
import { useRouter } from 'next/router'
import { getCity, saveCity } from 'utils/hooks/useGetCity'
import { capitalizeFirstLetter } from 'utils/stringUtils'
import { lowerSectionNavigationTab } from 'config/carVariantList.config'
import { defaultSeoImage } from 'utils/helpers/const'
import {
  getMobileHeaderMenu,
  getMobileFooterMenu,
  getCities,
  getMenu,
  getAnnouncementBox as gab,
  getUsedCarBySKU,
  getUsedCarRecommendations,
  getUsedNewCarRecommendations,
  getUsedCarSearch,
} from 'services/api'
import Seo from 'components/atoms/seo'
import Script from 'next/script'
import { serverSideManualNavigateToErrorPage } from 'utils/handler/navigateErrorPage'
/**
 * used to pass props without drilling through components
 */
interface UsedPdpDataLocalContextType {
  // /**
  //  * this variable use "jakarta" as default payload, so that search engine could see page content.
  //  * need to re-fetch API in client with city from localStorage
  //  */
  usedCarRecommendations: any
  // /**
  //  * this variable use "jakarta" as default payload, so that search engine could see page content.
  //  * need to re-fetch API in client with city from localStorage
  //  */
  usedCarModelDetailsRes: any

  usedCarNewRecommendations: any
  // dataCombinationOfCarRecomAndModelDetailDefaultCity: any
  // /**
  //  * this variable use "jakarta" as default payload, so that search engine could see page content.
  //  * need to re-fetch API in client with city from localStorage
  //  */
  // carVariantDetailsResDefaultCity: any
  // metaTagDataRes: any
  // carVideoReviewRes: any
  // carArticleReviewRes: any
}
/**
 * used to pass props without drilling through components
 */
export const UsedPdpDataLocalContext =
  createContext<UsedPdpDataLocalContextType>({
    usedCarRecommendations: null,
    usedCarModelDetailsRes: null,
    usedCarNewRecommendations: null,
  })
export default function index({
  usedCarRecommendationRes,
  newCarRecommendationRes,
  carModelDetailsRes,
  dataDesktopMenu,
  dataMobileMenu,
  dataFooter,
  dataCities,
  dataSearchUsedCar,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const {
    saveDataAnnouncementBox,
    saveDesktopWebTopMenu,
    saveMobileWebTopMenus,
    saveMobileWebFooterMenus,
    saveCities,
    saveDataSearchUsedCar,
  } = useUtils()
  const router = useRouter()
  const { slug } = router.query
  const [upperTabSlug, lowerTabSlug, citySlug] = slug?.length
    ? (slug as Array<string>)
    : []

  const path = lowerTabSlug ? capitalizeFirstLetter(lowerTabSlug) : ''
  const [selectedTabValue, setSelectedTabValue] = useState(
    path ||
      lowerSectionNavigationTab.filter((item) => item.label !== 'Kredit')[0]
        .value,
  )
  const [currentCity, setCurrentCity] = useState(getCity())

  const { brandName, modelName, variantName, nik, cityName, carGallery } =
    carModelDetailsRes

  useEffect(() => {
    saveDesktopWebTopMenu(dataDesktopMenu)
    saveMobileWebTopMenus(dataMobileMenu)
    saveMobileWebFooterMenus(dataFooter)
    saveCities(dataCities)
    saveDataSearchUsedCar(dataSearchUsedCar)
    getAnnouncementBox()
    checkCitySlug(citySlug, dataCities, setCurrentCity)
  }, [])

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

  const todayDate = new Date()

  const capitalizeWord = (word: string) =>
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()

  const carModel =
    modelName?.split(' ').length > 1
      ? `${capitalizeWord(modelName.split(' ')[0] as string)}
         ${capitalizeWord(modelName.split(' ')[1] as string)}`
      : modelName

  const currentMonth = monthId(todayDate.getMonth())

  const getMetaTitle = () => {
    switch (selectedTabValue?.toLocaleLowerCase()) {
      case 'kredit':
        return `Kredit mobil bekas ${brandName} ${carModel} ${variantName} ${nik} di ${cityName} | SEVA`
      default:
        return `Beli mobil bekas ${brandName} ${carModel} ${variantName} ${nik} di ${cityName} | SEVA`
    }
  }

  const getMetaDescription = () => {
    switch (selectedTabValue?.toLocaleLowerCase()) {
      case 'kredit':
        return `Kredit mobil bekas ${brandName} ${carModel} ${variantName} ${nik} di ${cityName}. Dapatkan informasi mengenai harga dan promo bulan ${currentMonth?.toLowerCase()} di SEVA`

      default:
        return `Beli mobil bekas ${brandName} ${carModel} ${variantName} ${nik} di ${cityName} secara kredit. Cari tau spesifikasi, dan harga, dan promo bulan ${currentMonth?.toLowerCase()} di SEVA`
    }
  }

  useEffect(() => {
    setTabFromDirectUrl()
  }, [])

  const setTabFromDirectUrl = () => {
    if (lowerTabSlug) {
      const path = capitalizeFirstLetter(lowerTabSlug)
      setSelectedTabValue(path)
    }
  }

  return (
    <div className={styles.mobile}>
      <Seo
        title={getMetaTitle()}
        description={getMetaDescription() ?? ''}
        image={carGallery[0]?.url ?? defaultSeoImage}
      />
      <Script
        id="product-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLD(carModelDetailsRes)),
        }}
        key="product-jsonld"
      />
      <UsedPdpDataLocalContext.Provider
        value={{
          usedCarModelDetailsRes: carModelDetailsRes,
          usedCarRecommendations: usedCarRecommendationRes,
          usedCarNewRecommendations: newCarRecommendationRes,
        }}
      >
        <UsedPdpMobile />
      </UsedPdpDataLocalContext.Provider>
    </div>
  )
}
export async function getServerSideProps(context: any) {
  context.res.setHeader(
    'Cache-Control',
    'public, s-maxage=59, stale-while-revalidate=3000',
  )
  try {
    const params = new URLSearchParams()
    params.append('query', '' as string)
    let id = context.query.slug[0]
    const parts = id.split('/')
    const combined = parts[parts.length - 1].split('-').slice(-5)
    const uuid = combined.join('-')
    const [
      menuMobileRes,
      footerRes,
      cityRes,
      menuDesktopRes,
      carDetailRes,
      dataSearchRes,
    ]: any = await Promise.all([
      getMobileHeaderMenu(),
      getMobileFooterMenu(),
      getCities(),
      getMenu(),
      getUsedCarBySKU(uuid, ''),
      getUsedCarSearch('', { params }),
    ])

    const [carRecommendationsRes, newCarRecommendationsRes]: any =
      await Promise.all([
        getUsedCarRecommendations(`?bodyType=${carDetailRes.data[0].typeName}`),
        getUsedNewCarRecommendations(
          `?modelName=${carDetailRes.data[0].modelName}&bodyType=${carDetailRes.data[0].typeName}`,
        ),
      ])

    return {
      props: {
        usedCarRecommendationRes: carRecommendationsRes.carData,
        newCarRecommendationRes: newCarRecommendationsRes.carData,
        carModelDetailsRes: carDetailRes.data[0],
        isSsrMobile: getIsSsrMobile(context),
        dataMobileMenu: menuMobileRes.data,
        dataFooter: footerRes.data,
        dataCities: cityRes,
        dataDesktopMenu: menuDesktopRes.data,
        dataSearchUsedCar: dataSearchRes.data,
      },
    }
  } catch (error: any) {
    return serverSideManualNavigateToErrorPage(error?.response?.status)
  }
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

const jsonLD = (carModel: any) => {
  return {
    product: {
      '@type': 'Product',
      name: `${carModel?.brandName} ${capitalizeFirstLetter(
        carModel?.modelName,
      )} ${carModel?.variantName} ${carModel?.nik}`,
      model: `${carModel?.modelName}`,
      image: carModel?.carGallery[0]?.url,
      url: carModel?.sevaUrl,
      bodyType: carModel?.typeName,
      description: `Mobil Bekas ${carModel?.brandName} ${capitalizeFirstLetter(
        carModel?.modelName,
      )} ${carModel?.variantName} ${carModel?.nik}`,
      brand: {
        '@type': 'Brand',
        name: carModel?.brandName,
        logo: handlingCarLogo(carModel?.brandName ?? ''),
      },
      vehicleMileage: {
        '@type': 'QuantitativeValue',
        name: `${formatPriceNumberThousand(carModel?.mileage)} km`,
      },
      vehicleColor: {
        '@type': 'ColorSpecification',
        name: `${carModel?.color}`,
      },
      vehicleLocation: {
        '@type': 'LocationSpecification',
        name: `${carModel?.cityName}`,
      },
      vehicleTaxDate: {
        '@type': 'TaxDateSpecification',
        name: `${convertStringDateToMonthYear(carModel?.taxDate)}`,
      },
      vehicleManufactureYear: {
        '@type': 'ManufactureYearSpecification',
        name: `${carModel?.nik}`,
      },
      vehicleTransmission: {
        '@type': 'QualitativeValue',
        name: carModel?.carSpecifications?.find(
          (spec: any) => spec.specCode === 'transmission',
        ).value,
      },
      vehicleLicensePlate: {
        '@type': 'LicensePlateValue',
        name: carModel?.plate,
      },
      fuelType: {
        '@type': 'QualitativeValue',
        name: carModel?.carSpecifications?.find(
          (spec: any) => spec.specCode === 'fuel-type',
        ).value,
      },
      manufacturer: {
        '@type': 'Organization',
        name: carModel?.brandName,
      },
      offers: {
        '@type': 'AggregateOffer',
        priceCurrency: `IDR ${carModel?.priceValue.split('.')[0]}`,
      },
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
          name: 'Mobil',
          url: 'https://www.seva.id/mobil-bekas',
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
        contentUrl: carModel?.carGallery[0]?.url,
        mainEntityOfPage: `${carModel?.sevaUrl}`,
        representativeOfPage: 'https://schema.org/True',
        isFamilyFriendly: 'https://schema.org/True',
        isAccesibleForFree: 'https://schema.org/False',
      },
    ],
  }
}

export const checkCitySlug = (
  citySlug: string | undefined,
  dataCities: Array<CityOtrOption>,
  setState: (city: CityOtrOption) => void,
) => {
  if (citySlug) {
    const cityOtrFromUrl = dataCities.find(
      (city) =>
        city.cityName.replace(/[^a-zA-Z]+/g, '').toLocaleLowerCase() ===
        citySlug.replace(/[^a-zA-Z]+/g, '').toLocaleLowerCase(),
    )
    if (cityOtrFromUrl && cityOtrFromUrl?.cityCode !== getCity().cityCode) {
      saveCity(cityOtrFromUrl)
      setState(cityOtrFromUrl)
    }
  }
}
