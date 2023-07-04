import React, { createContext, useMemo } from 'react'
import { useMediaQuery } from 'react-responsive'
import { PdpDesktop, PdpMobile } from 'components/organism'
import { api } from 'services/api'
import { CarRecommendation } from 'utils/types/utils'
import { InferGetServerSidePropsType } from 'next'
import Head from 'next/head'
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
})
export default function index({
  carRecommendationsRes,
  carModelDetailsRes,
  carVariantDetailsRes,
  metaTagDataRes,
  carVideoReviewRes,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const isMobile = useMediaQuery({ query: '(max-width: 1024px)' })
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
  return (
    <>
      <Head>
        <title>{meta.title}</title>
        <meta name="title" content={meta.title} />
        <meta name="description" content={meta.description} />
      </Head>
      <PdpDataLocalContext.Provider
        value={{
          carRecommendationsResDefaultCity: carRecommendationsRes,
          carModelDetailsResDefaultCity: carModelDetailsRes,
          carVariantDetailsResDefaultCity: carVariantDetailsRes,
          metaTagDataRes: metaTagDataRes,
          carVideoReviewRes: carVideoReviewRes,
        }}
      >
        {isMobile ? <PdpMobile /> : <PdpDesktop />}
      </PdpDataLocalContext.Provider>
    </>
  )
}
export async function getServerSideProps({ res, query }: any) {
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=59',
  )
  try {
    if (query.slug?.length > 1) {
      return {
        notFound: true,
      }
    }
    const [carRecommendationsRes, metaTagDataRes, carVideoReviewRes]: any =
      await Promise.all([
        api.getRecommendation('?city=jakarta&cityId=118'),
        api.getMetaTagData(query.model.replaceAll('-', '')),
        api.getCarVideoReview(),
      ])
    let id = ''
    const carList = carRecommendationsRes.carRecommendations
    const currentCar = carList.filter(
      (value: CarRecommendation) =>
        value.model.replace(/ +/g, '-').toLowerCase() === query.model,
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
    return {
      props: {
        carRecommendationsRes,
        carModelDetailsRes,
        carVariantDetailsRes,
        metaTagDataRes,
        carVideoReviewRes,
      },
    }
  } catch (error) {
    console.log('qwe error', error)
    return {
      notFound: true,
    }
  }
}
