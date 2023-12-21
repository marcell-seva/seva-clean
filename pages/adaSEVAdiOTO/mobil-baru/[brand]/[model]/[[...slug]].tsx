import React, { createContext, useEffect, useState } from 'react'
import { PdpMobile } from 'components/organisms'

import { CarRecommendation } from 'utils/types/utils'
import { InferGetServerSidePropsType } from 'next'
import { getIsSsrMobile } from 'utils/getIsSsrMobile'
import { useMediaQuery } from 'react-responsive'
import Seo from 'components/atoms/seo'
import { defaultSeoImage } from 'utils/helpers/const'
import { useUtils } from 'services/context/utilsContext'
import { getToken } from 'utils/handler/auth'
import { mergeModelDetailsWithLoanRecommendations } from 'utils/handler/carRecommendation'
import {
  getRecommendation,
  getMetaTagData,
  getCarVideoReview,
  getMobileHeaderMenu,
  getMobileFooterMenu,
  getCities,
  getCarModelDetails,
  getCarVariantDetails,
  getAnnouncementBox as gab,
  getUsedCarSearch,
} from 'services/api'
import { serverSideManualNavigateToErrorPage } from 'utils/handler/navigateErrorPage'
import { useRouter } from 'next/router'
import { monthId } from 'utils/handler/date'
import { lowerSectionNavigationTab } from 'config/carVariantList.config'
import { capitalizeFirstLetter } from 'utils/stringUtils'

interface PdpDataOTOLocalContextType {
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
export const PdpDataOTOLocalContext = createContext<PdpDataOTOLocalContextType>(
  {
    carRecommendationsResDefaultCity: null,
    carModelDetailsResDefaultCity: null,
    dataCombinationOfCarRecomAndModelDetailDefaultCity: null,
    carVariantDetailsResDefaultCity: null,
    metaTagDataRes: null,
    carVideoReviewRes: null,
    carArticleReviewRes: null,
  },
)
export default function index({
  carRecommendationsRes,
  carModelDetailsRes,
  dataCombinationOfCarRecomAndModelDetail,
  carVariantDetailsRes,
  metaTagDataRes,
  carVideoReviewRes,
  carArticleReviewRes,
  dataHeader,
  dataFooter,
  dataCities,
  dataSearchUsedCar,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter()
  const { model, brand, slug } = router.query
  const [upperTabSlug, lowerTabSlug] = slug?.length
    ? (slug as Array<string>)
    : []

  const path = lowerTabSlug ? capitalizeFirstLetter(lowerTabSlug) : ''
  const [selectedTabValue, setSelectedTabValue] = useState(
    path ||
      lowerSectionNavigationTab.filter((item) => item.label !== 'Kredit')[0]
        .value,
  )
  const {
    saveDataAnnouncementBox,
    saveMobileWebTopMenus,
    saveMobileWebFooterMenus,
    saveCities,
    saveDataSearchUsedCar,
  } = useUtils()

  useEffect(() => {
    saveMobileWebTopMenus(dataHeader)
    saveMobileWebFooterMenus(dataFooter)
    saveCities(dataCities)
    saveDataSearchUsedCar(dataSearchUsedCar)
    getAnnouncementBox()
  }, [])

  const capitalizeWord = (word: string) =>
    word.charAt(0).toUpperCase() + word.slice(1)

  const capitalizeIfString = (value: string) =>
    typeof value === 'string'
      ? value.split('-').map(capitalizeWord).join(' ')
      : ''

  const carBrand = capitalizeIfString(brand as string)
  const carModel = capitalizeIfString(model as string)
  const todayDate = new Date()

  const getMetaTitle = () => {
    switch (selectedTabValue?.toLocaleLowerCase()) {
      case 'spesifikasi':
        return `Spesifikasi ${carBrand} ${carModel} ${todayDate.getFullYear()} - Harga OTR Promo Bulan ${monthId(
          todayDate.getMonth(),
        )} ${todayDate.getFullYear()} | SEVA x OTO`
      case 'harga':
        return `Harga OTR ${carBrand} ${carModel} ${todayDate.getFullYear()} - Simulasi Kredit dan Cicilan dengan Loan Calculator | SEVA x OTO`
      default:
        return `${carBrand} ${carModel} ${todayDate.getFullYear()} - Harga OTR Promo Bulan ${monthId(
          todayDate.getMonth(),
        )} ${todayDate.getFullYear()} | SEVA x OTO`
    }
  }

  const getMetaDescription = () => {
    switch (selectedTabValue?.toLocaleLowerCase()) {
      case 'spesifikasi':
        return `Temukan spesifikasi ${carBrand} ${carModel} terbaru ${todayDate.getFullYear()}. Dapatkan informasi fitur, dimensi, mesin, kapasitas tempat duduk & keamanan hanya di SEVA`
      case 'harga':
        return `Dapatkan simulasi cicilan mobil ${carBrand} ${carModel} ${todayDate.getFullYear()} dengan Loan Calculator. Beli mobil baru secara kredit dengan Instant Approval hanya di SEVA`
      default:
        return `Beli mobil ${carBrand} ${carModel} terbaru ${todayDate.getFullYear()} secara kredit dengan Instant Approval*. Cari tau spesifikasi, harga, dan hitung simulasi kredit melalui SEVA`
    }
  }

  const getAnnouncementBox = () => {
    try {
      const res: any = gab({
        headers: {
          'is-login': getToken() ? 'true' : 'false',
        },
      })
      saveDataAnnouncementBox(res.data)
    } catch (error) {}
  }

  useEffect(() => {
    if (lowerTabSlug) {
      const path = capitalizeFirstLetter(lowerTabSlug)
      setSelectedTabValue(path)
    }
  }, [])

  return (
    <>
      <Seo
        title={getMetaTitle()}
        description={getMetaDescription()}
        image={defaultSeoImage}
      />
      <PdpDataOTOLocalContext.Provider
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
        <PdpMobile isOTO={true} />
      </PdpDataOTOLocalContext.Provider>
    </>
  )
}
export async function getServerSideProps(context: any) {
  context.res.setHeader(
    'Cache-Control',
    'public, s-maxage=59, stale-while-revalidate=3000',
  )

  try {
    if (context.query.slug?.length > 3) {
      return {
        notFound: true,
      }
    }
    const params = new URLSearchParams()
    params.append('query', '' as string)
    const [
      carRecommendationsRes,
      metaTagDataRes,
      carVideoReviewRes,
      menuRes,
      footerRes,
      cityRes,
      dataSearchRes,
    ]: any = await Promise.all([
      getRecommendation('?city=jakarta&cityId=118'),
      getMetaTagData(context.query.model.replaceAll('-', '')),
      getCarVideoReview(),
      getMobileHeaderMenu(),
      getMobileFooterMenu(),
      getCities(),
      getUsedCarSearch('', { params }),
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
    const carModelDetailsRes: any = await getCarModelDetails(
      id,
      '?city=jakarta&cityId=118',
    )
    const sortedVariantsOfCurrentModel = carModelDetailsRes.variants
      .map((item: any) => item)
      .sort((a: any, b: any) => a.priceValue - b.priceValue)
    const carVariantDetailsRes: any = await getCarVariantDetails(
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
        dataHeader: menuRes.data,
        dataFooter: footerRes.data,
        dataCities: cityRes,
        dataSearchUsedCar: dataSearchRes.data,
      },
    }
  } catch (error: any) {
    return serverSideManualNavigateToErrorPage(error?.response?.status)
  }
}
