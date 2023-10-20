import { PLP } from 'components/organisms'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import {
  CarRecommendationResponse,
  MinMaxMileage,
  MinMaxPrice,
  MinMaxYear,
  UsedCarRecommendation,
  UsedCarRecommendationResponse,
} from 'utils/types/context'
import {
  CityOtrOption,
  FooterSEOAttributes,
  MobileWebTopMenuType,
  NavbarItemResponse,
} from 'utils/types/utils'
import { getIsSsrMobile } from 'utils/getIsSsrMobile'
import { api } from 'services/api'
import Seo from 'components/atoms/seo'
import { defaultSeoImage } from 'utils/helpers/const'
import { useUtils } from 'services/context/utilsContext'
import { MobileWebFooterMenuType } from 'utils/types/props'
import styles from 'styles/pages/plpUsed.module.scss'
import { CarProvider, UsedCarProvider } from 'services/context'
import { monthId } from 'utils/handler/date'
import { getCarBrand } from 'utils/carModelUtils/carModelUtils'
import { useMediaQuery } from 'react-responsive'
import { useRouter } from 'next/router'
import { getCity } from 'utils/hooks/useGetCity'
import { PLPUsedCar } from 'components/organisms/PLPUsedCar'
import { getUsedCarFunnelRecommendations } from 'utils/handler/funnel'

const UsedCarResultPage = ({
  meta,
  dataMobileMenu,
  dataFooter,
  dataCities,
  isSsrMobileLocal,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter()
  const todayDate = new Date()
  const brand = router.query.brand
  const metaTitle = `Beli Mobil Terbaru ${todayDate.getFullYear()} - Harga OTR dengan Promo Cicilan bulan ${monthId(
    todayDate.getMonth(),
  )} | SEVA`
  const metaDesc = `Beli mobil ${todayDate.getFullYear()} terbaru di SEVA. Beli mobil secara kredit dengan Instant Approval*.`
  const metaBrandDesc = `Beli mobil ${brand} ${todayDate.getFullYear()} terbaru secara kredit dengan Instant Approval*. Cari tau spesifikasi, harga, promo, dan kredit di SEVA`
  const descTag = router.query.brand ? metaBrandDesc : metaDesc
  const [isMobile, setIsMobile] = useState(isSsrMobileLocal)
  const isClientMobile = useMediaQuery({ query: '(max-width: 1024px)' })
  const {
    saveDesktopWebTopMenu,
    saveMobileWebTopMenus,
    saveMobileWebFooterMenus,
    saveCities,
  } = useUtils()

  useEffect(() => {
    saveMobileWebTopMenus(dataMobileMenu)
    saveMobileWebFooterMenus(dataFooter)
    saveCities(dataCities)
  }, [])

  useEffect(() => {
    setIsMobile(isClientMobile)
  }, [isClientMobile])
  return (
    <>
      <Seo title={metaTitle} description={descTag} image={defaultSeoImage} />
      <UsedCarProvider
        car={null}
        carOfTheMonth={[]}
        typeCar={null}
        carModel={null}
        carModelDetails={null}
        carVariantDetails={null}
        recommendation={meta.carRecommendations.carRecommendations}
        recommendationToyota={[]}
        totalItems={meta.carRecommendations.totalItems}
      >
        <div className={styles.mobile}>
          <PLPUsedCar
            minmaxPrice={meta.MinMaxPrice}
            minmaxMileage={meta.MinMaxMileage}
            minmaxYear={meta.MinMaxYear}
          />
        </div>
      </UsedCarProvider>
    </>
  )
}

export default UsedCarResultPage

type PLPProps = {
  title: string
  description: string
  footer: FooterSEOAttributes
  MinMaxPrice: MinMaxPrice
  MinMaxYear: MinMaxYear
  MinMaxMileage: MinMaxMileage
  carRecommendations: UsedCarRecommendationResponse
}

const getBrand = (brand: string | string[] | undefined) => {
  if (String(brand).toLowerCase() === 'toyota') {
    return 'Toyota'
  } else if (String(brand).toLowerCase() === 'daihatsu') {
    return 'Daihatsu'
  } else if (String(brand).toLowerCase() === 'bmw') {
    return 'Bmw'
  } else {
    return ''
  }
}

export const getServerSideProps: GetServerSideProps<{
  meta: PLPProps
  dataDesktopMenu: NavbarItemResponse[]
  dataMobileMenu: MobileWebTopMenuType[]
  dataFooter: MobileWebFooterMenuType[]
  dataCities: CityOtrOption[]
  isSsrMobileLocal: boolean
}> = async (ctx) => {
  ctx.res.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=59',
  )
  const metabrand = getBrand(ctx.query.brand)
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
    MinMaxYear: { maxYearValue: 0, minYearValue: 0 },
    MinMaxMileage: { maxMileageValue: 0, minMileageValue: 0 },
    carRecommendations: {
      carRecommendations: [],
      totalItems: 0,
    },
  }

  const {
    brand,
    priceStart,
    priceEnd,
    yearStart,
    yearEnd,
    mileageStart,
    mileageEnd,
    tenure,
    transmission,
    city_id,
    sortBy,
  } = ctx.query

  try {
    const [
      fetchFooter,
      menuDesktopRes,
      menuMobileRes,
      footerRes,
      cityRes,
    ]: any = await Promise.all([
      axios.get(footerTagBaseApi + metabrand),
      api.getMenu(),
      api.getMobileHeaderMenu(),
      api.getMobileFooterMenu(),
      api.getCities(),
    ])

    const footerData = fetchFooter.data.data

    if (!priceStart && !priceEnd) {
      const minmax = await api.getMinMaxPriceUsedCar('')
      const minmaxPriceData = minmax.data
      meta.MinMaxPrice = {
        minPriceValue: minmaxPriceData.minPrice,
        maxPriceValue: minmaxPriceData.maxPrice,
      }
    }
    if (!yearStart && !yearEnd) {
      const minmax = await api.getMinMaxYearsUsedCar('')
      const minmaxYearData = minmax.data

      meta.MinMaxYear = {
        minYearValue: minmaxYearData.minYears,
        maxYearValue: minmaxYearData.maxYears,
      }
    }

    if (!mileageStart && !mileageEnd) {
      const minmax = await api.getMinMaxMileageUsedCar('')
      const minmaxMileageData = minmax.data
      meta.MinMaxMileage = {
        minMileageValue: minmaxMileageData.minMileages,
        maxMileageValue: minmaxMileageData.maxMileages,
      }
    }

    const queryParam: any = {
      ...(brand && {
        brand: String(brand)
          ?.split(',')
          .map((item) => getCarBrand(item)),
      }),
      ...(priceStart && priceEnd
        ? { priceStart, priceEnd }
        : {
            priceStart: meta.MinMaxPrice.minPriceValue,
            priceEnd: meta.MinMaxPrice.maxPriceValue,
          }),
      ...(yearStart && yearEnd
        ? { yearStart, yearEnd }
        : {
            yearStart: meta.MinMaxYear.minYearValue,
            yearEnd: meta.MinMaxYear.maxYearValue,
          }),
      ...(mileageStart && mileageEnd
        ? { mileageStart, mileageEnd }
        : {
            mileageStart: meta.MinMaxMileage.minMileageValue,
            mileageEnd: meta.MinMaxMileage.maxMileageValue,
          }),
      ...(tenure && { tenure }),
      ...(transmission && { transmission }),
      ...(city_id && { city_id }),
      ...(sortBy && { sortBy }),
    }

    const [funnel] = await Promise.all([
      getUsedCarFunnelRecommendations({ ...queryParam }),
    ])

    const recommendation = funnel

    if (footerData && footerData.length > 0) {
      meta.footer = footerData[0].attributes
    }

    if (recommendation) {
      meta.carRecommendations = recommendation
    }

    return {
      props: {
        meta,
        dataDesktopMenu: menuDesktopRes.data,
        dataMobileMenu: menuMobileRes.data,
        dataFooter: footerRes.data,
        dataCities: cityRes,
        isSsrMobile: getIsSsrMobile(ctx),
        isSsrMobileLocal: getIsSsrMobile(ctx),
      },
    }
  } catch (e) {
    return {
      props: {
        meta,
        dataDesktopMenu: [],
        dataMobileMenu: [],
        dataFooter: [],
        dataCities: [],
        isSsrMobile: getIsSsrMobile(ctx),
        isSsrMobileLocal: getIsSsrMobile(ctx),
      },
    }
  }
}
