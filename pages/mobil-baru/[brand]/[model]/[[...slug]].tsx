import React, { createContext, useEffect, useMemo, useState } from 'react'
import { PdpDesktop, PdpMobile } from 'components/organisms'
import { api } from 'services/api'
import { CarRecommendation } from 'utils/types/utils'
import { InferGetServerSidePropsType } from 'next'
import Head from 'next/head'
import { getIsSsrMobile } from 'utils/getIsSsrMobile'
import { useIsMobileSSr } from 'utils/hooks/useIsMobileSsr'
import { useMediaQuery } from 'react-responsive'
import Seo from 'components/atoms/seo'
import { defaultSeoImage } from 'utils/helpers/const'
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
  carVariantDetailsResDefaultCity: null,
  metaTagDataRes: null,
  carVideoReviewRes: null,
  carArticleReviewRes: null,
})
export default function index({
  carRecommendationsRes,
  carModelDetailsRes,
  carVariantDetailsRes,
  metaTagDataRes,
  carVideoReviewRes,
  carArticleReviewRes,
  dataMenu,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [isMobile, setIsMobile] = useState(useIsMobileSSr())

  const isClientMobile = useMediaQuery({ query: '(max-width: 1024px)' })

  useEffect(() => {
    setIsMobile(isClientMobile)
  }, [isClientMobile])

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

  console.log('datas', meta)
  return (
    <>
      <Seo
        title={meta.title}
        description={meta.description}
        image={carModelDetailsRes.images[0] || defaultSeoImage}
      />

      <PdpDataLocalContext.Provider
        value={{
          carRecommendationsResDefaultCity: carRecommendationsRes,
          carModelDetailsResDefaultCity: carModelDetailsRes,
          carVariantDetailsResDefaultCity: carVariantDetailsRes,
          metaTagDataRes: metaTagDataRes,
          carVideoReviewRes: carVideoReviewRes,
          carArticleReviewRes: carArticleReviewRes,
        }}
      >
        {!isMobile ? <PdpDesktop /> : <PdpMobile />}
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
      menuRes,
    ]: any = await Promise.all([
      api.getRecommendation('?city=jakarta&cityId=118'),
      api.getMetaTagData(context.query.model.replaceAll('-', '')),
      api.getCarVideoReview(),
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

    return {
      props: {
        dataMenu: menuRes.data,
        carRecommendationsRes,
        carModelDetailsRes,
        carVariantDetailsRes,
        metaTagDataRes,
        carVideoReviewRes,
        carArticleReviewRes,
        isSsrMobile: getIsSsrMobile(context),
      },
    }
  } catch (error) {
    console.log('qwe error', error)
    return {
      notFound: true,
    }
  }
}
