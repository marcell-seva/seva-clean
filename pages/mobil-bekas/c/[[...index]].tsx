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
  SearchUsedCar,
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
  getUsedCarSearch,
} from 'services/api'
import { default as customAxiosGet } from 'services/api/get'
import { serverSideManualNavigateToErrorPage } from 'utils/handler/navigateErrorPage'
import Script from 'next/script'

const UsedCarResultPage = ({
  meta,
  dataMobileMenu,
  dataFooter,
  dataCities,
  cityList,
  brandList,
  brandSlug,
  citySlug,
  dataSearchUsedCar,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter()
  const todayDate = new Date()
  let metaTitle
  let metaDescription
  let loca
  let merek
  if (
    brandSlug !== null &&
    brandSlug !== undefined &&
    citySlug !== null &&
    citySlug !== undefined
  ) {
    const loc =
      citySlug[0].cityName.split(' ').length > 1
        ? citySlug[0].cityName.split(' ')[1]
        : citySlug[0].cityName

    loca = loc

    router.query.brand = brandSlug

    merek = brandSlug
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

      merek = brandSlug
      metaTitle = `Jual Beli Mobil ${capitalizeFirstLetter(
        brandSlug,
      )} Bekas - Promo Kredit ${monthId(todayDate.getMonth())} | SEVA`
      metaDescription = `Beli mobil bekas ${capitalizeFirstLetter(
        brandSlug,
      )} secara kredit. Cari tau spesifikasi, harga, dan promo bulan ${monthId(
        todayDate.getMonth(),
      )?.toLowerCase()} di SEVA`
    } else if (citySlug !== null && citySlug !== undefined) {
      const loc =
        citySlug[0].cityName.split(' ').length > 1
          ? citySlug[0].cityName.split(' ')[1]
          : citySlug[0].cityName

      loca = loc
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
  const isClientMobile = useMediaQuery({ query: '(max-width: 1024px)' })
  const {
    saveMobileWebTopMenus,
    saveMobileWebFooterMenus,
    saveCities,
    saveDataAnnouncementBox,
    saveDataSearchUsedCar,
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
    saveDataSearchUsedCar(dataSearchUsedCar)
    getAnnouncementBox()
  }, [])
  return (
    <>
      <h1 style={{ display: 'none' }}>
        Mobil Bekas {merek} {loca}
      </h1>
      <Seo
        title={metaTitle}
        description={metaDescription}
        image={defaultSeoImage}
      />
      {brandSlug && (
        <Script
          id="product-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLD(brandSlug)),
          }}
          key="product-jsonld"
        />
      )}
      <UsedCarProvider
        car={null}
        carOfTheMonth={[]}
        typeCar={null}
        carModel={null}
        carModelDetails={null}
        carVariantDetails={null}
        recommendation={meta?.carRecommendations?.carRecommendations}
        recommendationToyota={[]}
        detail={null}
        totalItems={meta?.carRecommendations?.totalItems}
        cityList={cityList}
        brandList={brandList}
      >
        <div className={styles.mobile}>
          <PLPUsedCar
            minmaxPrice={meta?.MinMaxPrice}
            minmaxMileage={meta?.MinMaxMileage}
            minmaxYear={meta?.MinMaxYear}
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
  dataSearchUsedCar: SearchUsedCar[]
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
    search,
    priceStart,
    priceEnd,
    yearStart,
    yearEnd,
    mileageStart,
    mileageEnd,
    brand,
    modelName,
    transmission,
  } = ctx.query

  const params = new URLSearchParams()
  params.append('query', '' as string)

  try {
    const [
      fetchFooter,
      menuDesktopRes,
      menuMobileRes,
      footerRes,
      cityRes,
      usedCarCityList,
      usedCarBrandList,
      dataSearchRes,
    ]: any = await Promise.all([
      customAxiosGet(footerTagBaseApi + metabrand),
      getMenu(),
      getMobileHeaderMenu(),
      getMobileFooterMenu(),
      getCities(),
      getUsedCarCityList(),
      getBrandList(''),
      getUsedCarSearch(''),
    ])

    const cityList = usedCarCityList.data
    const brandList = usedCarBrandList.data

    const footerData = fetchFooter.data

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
      console.log('flag1', minmaxPriceData)
    }
    if (!yearStart && !yearEnd) {
      const minmax = await getMinMaxYearsUsedCar('')
      const minmaxYearData = minmax.data

      meta.MinMaxYear = {
        minYearValue: minmaxYearData.minYears,
        maxYearValue: minmaxYearData.maxYears,
      }
      console.log('flag2', minmaxYearData)
    }

    if (!mileageStart && !mileageEnd) {
      const minmax = await getMinMaxMileageUsedCar('')
      const minmaxMileageData = minmax.data
      meta.MinMaxMileage = {
        minMileageValue: minmaxMileageData.minMileages,
        maxMileageValue: minmaxMileageData.maxMileages,
      }
      console.log('flag3', minmaxMileageData)
    }

    const allBrand = await getBrandList('?isAll=true')
    const allCity = await getUsedCarCityList()

    console.log('flag4', allBrand, allCity)

    const checkData = ctx.query.index
    let brandSlug
    let locSlug

    if (checkData !== undefined) {
      if (checkData.length === 2) {
        const resultCheck = allBrand.data.filter(
          (item: any) => item.makeCode === checkData[0].toLowerCase(),
        )
        const resultCheck2 = allCity.data.filter((item: any) =>
          item.cityName
            .toLowerCase()
            .includes(checkData[1].split('-').join(' ').toLowerCase()),
        )

        if (resultCheck.length !== 0 && resultCheck2.length !== 0) {
          brandSlug = resultCheck[0].makeCode

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
          console.log('flag5', resultCheck)
        }
        console.log('flag6', checkData)
      } else {
        const resultCheck = allBrand.data.filter(
          (item: any) => item.makeCode === checkData[0].toLowerCase(),
        )
        if (resultCheck.length !== 0) {
          brandSlug = resultCheck[0].makeCode
          console.log('flag7', brandSlug)
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
              console.log('flag8', lastChosen)
            } else {
              locSlug = resultCheck2
              console.log('flag9', locSlug)
            }
          }
          console.log('flag10', resultCheck2)
        }
        console.log('flag11', allBrand)
      }
    }

    const queryModel: any = {
      ...(search && { search: String(search) }),
      ...(brand && {
        brand: String(brand)
          ?.split(',')
          .map((item) => getCarBrand(item)),
      }),
      ...(modelName && { modelName: String(modelName).split('%2C') }),
      ...(yearStart && { yearStart: yearStart }),
      ...(yearEnd && { yearEnd: yearEnd }),
      ...(transmission && { transmission: String(transmission).split(',') }),
      ...{ sortBy: 'newest' },
      ...{ page: '1' },
      ...{ perPage: '10' },
    }

    const queryParam: any = {
      ...(search && { search: String(search) }),
      ...(brandSlug && {
        brand: String(brandSlug)
          ?.split(',')
          .map((item) => getCarBrand(item)),
      }),
      ...(locSlug && { cityId: locSlug.map((city: any) => city.cityId) }),
      ...{ sortBy: 'newest' },
      ...{ page: '1' },
      ...{ perPage: '10' },
    }

    const response = await getUsedCarFunnelRecommendations(
      modelName || brand || yearEnd || yearStart || transmission
        ? { ...queryModel }
        : { ...queryParam },
    )

    console.log('flag12', response)

    const recommendation = response.carData
    const totalItems = response.totalItems

    if (footerData && footerData.length > 0) {
      meta.footer = footerData[0].attributes
      console.log('flag13', meta)
    }

    if (recommendation) {
      meta.carRecommendations.carRecommendations = recommendation
      meta.carRecommendations.totalItems = totalItems
      console.log('flag14', meta)
    }

    console.log('flag final', meta)

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
        dataSearchUsedCar: dataSearchRes.data,
      },
    }
  } catch (e: any) {
    console.log('error', e)
    return serverSideManualNavigateToErrorPage(e?.response?.status)
  }
}

const jsonLD = (carModel: string | undefined) => {
  return {
    brand: {
      '@type': 'Brand',
      name: carModel,
      url: `https://www.seva.id/mobil-bekas/c/${carModel}`,
    },
    SiteNavigationElement: {
      '@type': 'SiteNavigationElement',
      name: 'SEVA',
      potentialAction: [
        {
          '@type': 'Action',
          name: 'Mobil',
          url: 'https://www.seva.id/mobil-baru',
        },
        {
          '@type': 'Action',
          name: 'Mobil',
          url: 'https://www.seva.id/mobil-bekas/c',
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
  }
}
