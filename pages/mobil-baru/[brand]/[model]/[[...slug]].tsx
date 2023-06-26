import React from 'react'
import { useMediaQuery } from 'react-responsive'
import { PdpDesktop, PdpMobile } from 'components/organism'
import { api } from 'services/api'
import { CarRecommendation } from 'utils/types/utils'

export default function index() {
  const isMobile = useMediaQuery({ query: '(max-width: 1024px)' })

  if (isMobile) {
    return <PdpMobile />
  } else {
    return <PdpDesktop />
  }
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
