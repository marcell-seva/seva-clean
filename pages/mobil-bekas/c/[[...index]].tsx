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
  BrandList,
  CityOtrOption,
  FooterSEOAttributes,
  MobileWebTopMenuType,
  NavbarItemResponse,
} from 'utils/types/utils'
import { getIsSsrMobile } from 'utils/getIsSsrMobile'
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
import { capitalizeFirstLetter } from 'utils/stringUtils'
import { PLPUsedCar } from 'components/organisms/PLPUsedCar'
import { getUsedCarFunnelRecommendations } from 'utils/handler/funnel'
import { getToken } from 'utils/handler/auth'
import {
  getMenu,
  getMobileHeaderMenu,
  getMobileFooterMenu,
  getCities,
  getMinMaxPriceUsedCar,
  getMinMaxYearsUsedCar,
  getMinMaxMileageUsedCar,
  getAnnouncementBox as gab,
  getBrandList,
  getUsedCarCityList,
} from 'services/api'

const UsedCarResultPage = ({
  meta,
  dataMobileMenu,
  dataFooter,
  dataCities,
  isSsrMobileLocal,
  cityList,
  brandList,
  brandSlug,
  citySlug,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter()
  const todayDate = new Date()
  let metaTitle
  let metaDescription
  if (
    brandSlug !== null &&
    brandSlug !== undefined &&
    citySlug !== null &&
    citySlug !== undefined
  ) {
    const loc = citySlug[0].cityName
    router.query.brand = brandSlug
    metaTitle = `Jual Beli Mobil ${capitalizeFirstLetter(
      brandSlug,
    )} di ${loc} Bekas - Promo Kredit ${monthId(todayDate.getMonth())} | SEVA`
    metaDescription = `Beli mobil bekas ${capitalizeFirstLetter(
      brandSlug,
    )} di ${loc} secara kredit. Cari tau spesifikasi, harga, dan promo bulan ${monthId(
      todayDate.getMonth(),
    )?.toLowerCase()} di SEVA`
  } else {
    if (brandSlug !== null && brandSlug !== undefined) {
      router.query.brand = brandSlug
      metaTitle = `Jual Beli Mobil ${capitalizeFirstLetter(
        brandSlug,
      )} Bekas - Promo Kredit ${monthId(todayDate.getMonth())} | SEVA`
      metaDescription = `Beli mobil bekas ${capitalizeFirstLetter(
        brandSlug,
      )} secara kredit. Cari tau spesifikasi, harga, dan promo bulan ${monthId(
        todayDate.getMonth(),
      )?.toLowerCase()} di SEVA`
    } else if (citySlug !== null && citySlug !== undefined) {
      const loc = citySlug[0]?.cityName
      metaTitle = `Jual Beli Mobil Bekas di ${loc} - Promo Kredit ${monthId(
        todayDate.getMonth(),
      )} | SEVA`
      metaDescription = `Beli mobil bekas di ${loc} secara kredit. Cari tau spesifikasi, harga, dan promo bulan ${monthId(
        todayDate.getMonth(),
      )?.toLowerCase()} di SEVA`
    } else {
      metaTitle = `Jual Beli Mobil Bekas - Promo Kredit ${monthId(
        todayDate.getMonth(),
      )} | SEVA`
      metaDescription = `Jual beli mobil bekas di SEVA. Temukan promo kredit bulan ${monthId(
        todayDate.getMonth(),
      )?.toLowerCase()}`
    }
  }

  const [isMobile, setIsMobile] = useState(isSsrMobileLocal)
  const isClientMobile = useMediaQuery({ query: '(max-width: 1024px)' })
  const {
    saveDesktopWebTopMenu,
    saveMobileWebTopMenus,
    saveMobileWebFooterMenus,
    saveCities,
    saveDataAnnouncementBox,
  } = useUtils()

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

  useEffect(() => {
    saveMobileWebTopMenus(dataMobileMenu)
    saveMobileWebFooterMenus(dataFooter)
    saveCities(dataCities)
    getAnnouncementBox()
  }, [])

  useEffect(() => {
    setIsMobile(isClientMobile)
  }, [isClientMobile])
  return (
    <>
      <Seo
        title={metaTitle}
        description={metaDescription}
        image={defaultSeoImage}
      />
      <UsedCarProvider
        car={null}
        carOfTheMonth={[]}
        typeCar={null}
        carModel={null}
        carModelDetails={null}
        carVariantDetails={null}
        recommendation={meta.carRecommendations.carRecommendations}
        recommendationToyota={[]}
        detail={null}
        totalItems={meta.carRecommendations.totalItems}
        cityList={cityList}
        brandList={brandList}
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
    return 'other'
  }
}

interface CitySlug {
  cityId: number
  cityName: string
  cityCode: number
  province?: string
}

export const getServerSideProps: GetServerSideProps<{
  meta: PLPProps
  dataDesktopMenu: NavbarItemResponse[]
  dataMobileMenu: MobileWebTopMenuType[]
  dataFooter: MobileWebFooterMenuType[]
  dataCities: CityOtrOption[]
  isSsrMobileLocal: boolean
  brandSlug?: string | null
  citySlug?: CitySlug[] | null
  cityList: CityOtrOption[]
  brandList: BrandList[]
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

  const { priceStart, priceEnd, yearStart, yearEnd, mileageStart, mileageEnd } =
    ctx.query

  try {
    const [
      fetchFooter,
      menuDesktopRes,
      menuMobileRes,
      footerRes,
      cityRes,
      usedCarCityList,
      usedCarBrandList,
    ]: any = await Promise.all([
      axios.get(footerTagBaseApi + metabrand),
      getMenu(),
      getMobileHeaderMenu(),
      getMobileFooterMenu(),
      getCities(),
      getUsedCarCityList(),
      getBrandList(''),
    ])

    const cityList = usedCarCityList.data
    const brandList = usedCarBrandList.data

    const footerData = fetchFooter.data.data

    if (!priceStart && !priceEnd) {
      const minmax = await getMinMaxPriceUsedCar('')
      const minmaxPriceData = minmax.data
      minmaxPriceData.minPrice = parseInt(
        minmaxPriceData.minPrice.replace(/^0+/, ''),
      )
      minmaxPriceData.maxPrice = parseInt(
        minmaxPriceData.maxPrice.replace(/^0+/, ''),
      )
      meta.MinMaxPrice = {
        minPriceValue: minmaxPriceData.minPrice,
        maxPriceValue: minmaxPriceData.maxPrice,
      }
    }
    if (!yearStart && !yearEnd) {
      const minmax = await getMinMaxYearsUsedCar('')
      const minmaxYearData = minmax.data

      meta.MinMaxYear = {
        minYearValue: minmaxYearData.minYears,
        maxYearValue: minmaxYearData.maxYears,
      }
    }

    if (!mileageStart && !mileageEnd) {
      const minmax = await getMinMaxMileageUsedCar('')
      const minmaxMileageData = minmax.data
      meta.MinMaxMileage = {
        minMileageValue: minmaxMileageData.minMileages,
        maxMileageValue: minmaxMileageData.maxMileages,
      }
    }

    const allBrand = await getBrandList('?isAll=true')
    const allCity = await getUsedCarCityList()

    const checkData = ctx.query.index
    let brandSlug
    let locSlug

    if (checkData !== undefined) {
      if (checkData.length === 2) {
        const resultCheck = allBrand.data.filter(
          (item: any) => item.makeCode === checkData[0].toLowerCase(),
        )
        const resultCheck2 = allCity.data.filter(
          (item: any) =>
            item.cityName.toLowerCase() ===
            checkData[1].split('-').join(' ').toLowerCase(),
        )
        if (resultCheck.length !== 0 && resultCheck2.length !== 0) {
          brandSlug = resultCheck[0].makeCode
          locSlug = resultCheck2
        }
      } else {
        const resultCheck = allBrand.data.filter(
          (item: any) => item.makeCode === checkData[0].toLowerCase(),
        )

        if (resultCheck.length !== 0) {
          brandSlug = resultCheck[0].makeCode
        } else {
          const resultCheck2 = allCity.data.filter((item: any) =>
            item.cityName
              .toLowerCase()
              .includes(checkData[0].split('-').join(' ').toLowerCase()),
          )

          if (resultCheck2 !== 0) {
            if (resultCheck2.length > 1) {
              const lastChosen = resultCheck2.filter((item: any) =>
                item.cityName.toLowerCase().includes('kota'),
              )
              if (lastChosen.length > 0) {
                locSlug = lastChosen
              } else {
                const jakpus = resultCheck2.filter((item: any) =>
                  item.cityName.toLowerCase().includes('pusat'),
                )
                locSlug = jakpus
              }
            } else {
              locSlug = resultCheck2
            }
          }
        }
      }
    }

    const queryParam: any = {
      ...(brandSlug && {
        brand: String(brandSlug)
          ?.split(',')
          .map((item) => getCarBrand(item)),
      }),
      ...(locSlug && { cityId: locSlug.map((city: any) => city.cityId) }),
      ...{ sortBy: 'lowToHigh' },
      ...{ page: '1' },
      ...{ perPage: '10' },
    }

    const response = await getUsedCarFunnelRecommendations({ ...queryParam })

    const recommendation = response.carData
    const totalItems = response.totalItems

    if (footerData && footerData.length > 0) {
      meta.footer = footerData[0].attributes
    }

    if (recommendation) {
      meta.carRecommendations.carRecommendations = recommendation
      meta.carRecommendations.totalItems = totalItems
    }

    return {
      props: {
        meta,
        brandSlug: brandSlug === undefined ? null : brandSlug,
        citySlug: locSlug === undefined ? null : locSlug,
        dataDesktopMenu: menuDesktopRes.data,
        dataMobileMenu: menuMobileRes.data,
        dataFooter: footerRes.data,
        dataCities: cityRes,
        cityList,
        brandList,
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
        cityList: [],
        brandList: [],
        isSsrMobile: getIsSsrMobile(ctx),
        isSsrMobileLocal: getIsSsrMobile(ctx),
      },
    }
  }
}
