import { PLP } from 'components/organisms'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useRouter } from 'next/router'
import { saveLocalStorage } from 'utils/handler/localStorage'
import { LocalStorageKey } from 'utils/enum'
import { CarRecommendationResponse, MinMaxPrice } from 'utils/types/context'
import {
  CityOtrOption,
  FooterSEOAttributes,
  MobileWebTopMenuType,
  NavbarItemResponse,
  SearchUsedCar,
} from 'utils/types/utils'
import { defaultSeoImage } from 'utils/helpers/const'
import { useUtils } from 'services/context/utilsContext'
import { MobileWebFooterMenuType } from 'utils/types/props'
import Seo from 'components/atoms/seo'
import { monthId } from 'utils/handler/date'
import { getCarBrand } from 'utils/carModelUtils/carModelUtils'
import { useIsMobileSSr } from 'utils/hooks/useIsMobileSsr'
import { useMediaQuery } from 'react-responsive'
import { CarProvider } from 'services/context'
import { getIsSsrMobile } from 'utils/getIsSsrMobile'
import { getCity } from 'utils/hooks/useGetCity'
import { getNewFunnelRecommendations } from 'utils/handler/funnel'
import {
  getMenu,
  getMobileHeaderMenu,
  getMobileFooterMenu,
  getCities,
  getMinMaxPrice,
  getUsedCarSearch,
} from 'services/api'
import { serverSideManualNavigateToErrorPage } from 'utils/handler/navigateErrorPage'
import { default as customAxiosGet } from 'services/api/get'

const NewCarResultPage = ({
  meta,
  dataDesktopMenu,
  dataMobileMenu,
  dataFooter,
  dataCities,
  dataSearchUsedCar,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter()
  const id = router.query.brand
  const isSevaUrl = typeof id === 'string' && id.includes('SEVA')
  const {
    saveDesktopWebTopMenu,
    saveMobileWebTopMenus,
    saveMobileWebFooterMenus,
    saveCities,
    saveDataSearchUsedCar,
  } = useUtils()
  const [isMobile, setIsMobile] = useState(useIsMobileSSr())
  const isClientMobile = useMediaQuery({ query: '(max-width: 1024px)' })

  useEffect(() => {
    saveDesktopWebTopMenu(dataDesktopMenu)
    saveMobileWebTopMenus(dataMobileMenu)
    saveMobileWebFooterMenus(dataFooter)
    saveCities(dataCities)
    saveDataSearchUsedCar(dataSearchUsedCar)
    if (id && isSevaUrl) {
      saveLocalStorage(LocalStorageKey.referralTemanSeva, id)
    }
  }, [])

  useEffect(() => {
    setIsMobile(isClientMobile)
  }, [isClientMobile])

  const todayDate = new Date()

  const getUrlBrand = router.query.brand?.toString() ?? ''
  const carBrand = getUrlBrand.charAt(0).toUpperCase() + getUrlBrand.slice(1)

  const metaTitle = isSevaUrl
    ? `Beli Mobil Baru ${todayDate.getFullYear()} - Harga OTR dengan Promo Cicilan Bulan ${monthId(
        todayDate.getMonth(),
      )} | SEVA`
    : isBodyType(carBrand)
    ? `Daftar Mobil Baru ${carBrand.toUpperCase()} ${todayDate.getFullYear()} - Promo Cicilan Bulan ${monthId(
        todayDate.getMonth(),
      )} | SEVA`
    : `Harga OTR ${carBrand} ${todayDate.getFullYear()} - Promo Cicilan bulan ${monthId(
        todayDate.getMonth(),
      )} | SEVA `
  const metaDesc = isSevaUrl
    ? `Beli mobil  ${todayDate.getFullYear()} di SEVA. Beli mobil secara kredit dengan Instant Approval*.`
    : isBodyType(carBrand)
    ? `Beli mobil ${carBrand.toUpperCase()} ${todayDate.getFullYear()} terbaru secara kredit dengan Instant Approval*. Cari tau spesifikasi, harga, promo, dan kredit di SEVA`
    : `Beli mobil baru ${carBrand} ${todayDate.getFullYear()} secara kredit dengan Instant Approval*. Cari tau spesifikasi, harga, promo, dan kredit di SEVA`

  return (
    <>
      <Seo title={metaTitle} description={metaDesc} image={defaultSeoImage} />
      <CarProvider
        car={null}
        carOfTheMonth={[]}
        typeCar={null}
        carModel={null}
        carModelDetails={null}
        carVariantDetails={null}
        recommendation={meta.carRecommendations.carRecommendations}
        recommendationToyota={[]}
      >
        <PLP minmaxPrice={meta.MinMaxPrice} />
      </CarProvider>
    </>
  )
}

export default NewCarResultPage

type PLPProps = {
  title: string
  description: string
  footer: FooterSEOAttributes
  MinMaxPrice: MinMaxPrice
  carRecommendations: CarRecommendationResponse
}

export const isBrand = (brand: string | string[] | undefined) => {
  if (Array.isArray(brand)) {
    return brand.every(
      (item) =>
        item.toLowerCase() === 'toyota' ||
        item.toLowerCase() === 'isuzu' ||
        item.toLowerCase() === 'daihatsu' ||
        item.toLowerCase() === 'peugeot' ||
        item.toLowerCase() === 'bmw' ||
        item.toLowerCase() === 'hyundai',
    )
  } else if (brand) {
    const arrSplit = brand?.split(',')
    return arrSplit.every(
      (item) =>
        item.toLowerCase() === 'toyota' ||
        item.toLowerCase() === 'isuzu' ||
        item.toLowerCase() === 'daihatsu' ||
        item.toLowerCase() === 'peugeot' ||
        item.toLowerCase() === 'bmw' ||
        item.toLowerCase() === 'hyundai',
    )
  }
  return false
}

export const isBodyType = (bodyType: string | string[] | undefined) => {
  if (Array.isArray(bodyType)) {
    return bodyType.every(
      (item) =>
        item.toLowerCase() === 'mpv' ||
        item.toLowerCase() === 'suv' ||
        item.toLowerCase() === 'sedan' ||
        item.toLowerCase() === 'hatchback' ||
        item.toLowerCase() === 'sport',
    )
  } else if (bodyType) {
    const arrType = bodyType?.split(',')
    return arrType.every(
      (item) =>
        item.toLowerCase() === 'mpv' ||
        item.toLowerCase() === 'suv' ||
        item.toLowerCase() === 'sedan' ||
        item.toLowerCase() === 'hatchback' ||
        item.toLowerCase() === 'sport',
    )
  }
  return false
}

export const getServerSideProps: GetServerSideProps<{
  meta: PLPProps
  dataDesktopMenu: NavbarItemResponse[]
  dataMobileMenu: MobileWebTopMenuType[]
  dataFooter: MobileWebFooterMenuType[]
  dataCities: CityOtrOption[]
  dataSearchUsedCar: SearchUsedCar[]
}> = async (ctx) => {
  ctx.res.setHeader(
    'Cache-Control',
    'public, s-maxage=59, stale-while-revalidate=3000',
  )
  const metabrand = getCarBrand(ctx.query.brand)
  const metaTagBaseApi =
    'https://api.sslpots.com/api/meta-seos/?filters[location_page3][$eq]=CarSearchResult'
  const footerTagBaseApi =
    'https://api.sslpots.com/api/footer-seos/?filters[location_page2][$eq]=CarSearchResult'
  const meta = {
    title: 'SEVA',
    description: '',
    footer: {
      location_tag: '',
      location_page2: '',
      title_1: '',
      Title_2: '',
      Title_3: '',
      content_1: '',
      Content_2: '',
      Content_3: '',
      createdAt: '',
      updatedAt: '',
      publishedAt: '',
    },
    MinMaxPrice: { maxPriceValue: 0, minPriceValue: 0 },
    carRecommendations: {
      carRecommendations: [],
      lowestCarPrice: 0,
      highestCarPrice: 0,
    },
  }

  const {
    search,
    downPaymentAmount,
    brand: brandQueryOrLastSlug,
    bodyType,
    priceRangeGroup,
    age,
    tenure,
    monthlyIncome,
    sortBy,
  } = ctx.query
  const params = new URLSearchParams()
  params.append('query', '' as string)

  const brand = brandQueryOrLastSlug?.includes('SEVA')
    ? ''
    : brandQueryOrLastSlug

  try {
    const [
      fetchMeta,
      fetchFooter,
      menuDesktopRes,
      menuMobileRes,
      footerRes,
      cityRes,
      dataSearchRes,
    ] = await Promise.all([
      customAxiosGet(metaTagBaseApi + metabrand),
      customAxiosGet(footerTagBaseApi + metabrand),
      getMenu(),
      getMobileHeaderMenu(),
      getMobileFooterMenu(),
      getCities(),
      getUsedCarSearch('', { params }),
    ])

    const metaData = fetchMeta.data
    const footerData = fetchFooter.data

    if (!priceRangeGroup) {
      const params = new URLSearchParams()
      getCity().cityCode && params.append('city', getCity().cityCode as string)

      const minmaxPriceData = await getMinMaxPrice('', { params })
      meta.MinMaxPrice = {
        minPriceValue: minmaxPriceData.minPriceValue,
        maxPriceValue: minmaxPriceData.maxPriceValue,
      }
    }

    const queryParam: any = {
      ...(search && { search: String(search) }),
      ...(downPaymentAmount && { downPaymentType: 'amount' }),
      ...(downPaymentAmount && { downPaymentAmount }),
      ...(!isBodyType(brand) && brand !== ''
        ? {
            brand: String(brand)
              ?.split(',')
              .map((item) => getCarBrand(item)),
          }
        : {}),
      ...(bodyType
        ? { bodyType: String(bodyType)?.split(',') }
        : isBodyType(brand) && brand !== ''
        ? { bodyType: String(brand)?.toUpperCase()?.split(',') }
        : {}),
      ...(priceRangeGroup
        ? { priceRangeGroup }
        : {
            priceRangeGroup: `${meta.MinMaxPrice.minPriceValue}-${meta.MinMaxPrice.maxPriceValue}`,
          }),
      ...(age && { age }),
      ...(tenure && { tenure }),
      ...(monthlyIncome && { monthlyIncome }),
      ...(sortBy && { sortBy }),
    }

    const [funnel] = await Promise.all([
      getNewFunnelRecommendations({ ...queryParam }),
    ])

    const recommendation = funnel

    if (metaData && metaData.length > 0) {
      meta.title = metaData[0].attributes.meta_title
      meta.description = metaData[0].attributes.meta_description
    }

    if (footerData && footerData.length > 0) {
      meta.footer = footerData[0].attributes
    }

    if (recommendation) meta.carRecommendations = recommendation

    return {
      props: {
        meta,
        dataDesktopMenu: menuDesktopRes.data,
        dataMobileMenu: menuMobileRes.data,
        dataFooter: footerRes.data,
        dataCities: cityRes,
        isSsrMobile: getIsSsrMobile(ctx),
        dataSearchUsedCar: dataSearchRes.data,
      },
    }
  } catch (e: any) {
    return serverSideManualNavigateToErrorPage(e?.response?.status)
  }
}
