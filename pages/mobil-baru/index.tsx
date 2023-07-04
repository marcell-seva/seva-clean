import { PLP } from 'components/organism'
import React from 'react'
import axios from 'axios'
import Head from 'next/head'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { getNewFunnelRecommendations } from 'services/newFunnel'
import { CarRecommendationResponse } from 'utils/types/context'

const NewCarResultPage = ({
  meta,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <>
      <Head>
        <title>{meta.title}</title>
        <meta name="title" content={meta.title} />
        <meta name="description" content={meta.description} />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <PLP carRecommendation={meta.carRecommendations} />
    </>
  )
}

export default NewCarResultPage

type PLPProps = {
  title: string
  description: string
  carRecommendations: CarRecommendationResponse
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
}> = async (ctx) => {
  const metabrand = getBrand(ctx.query.brand)
  const metaTagBaseApi =
    'https://api.sslpots.com/api/meta-seos/?filters[location_page3][$eq]=CarSearchResult'
  const meta = {
    title: 'SEVA',
    description: '',
    carRecommendations: {
      carRecommendations: [],
      lowestCarPrice: 0,
      highestCarPrice: 0,
    },
  }

  const {
    downPaymentAmount,
    brand,
    bodyType,
    priceRangeGroup,
    age,
    tenure,
    monthlyIncome,
    sortBy,
  } = ctx.query

  const queryParam: any = {
    ...(downPaymentAmount && { downPaymentType: 'amount' }),
    ...(downPaymentAmount && { downPaymentAmount }),
    ...(brand && { brand: String(brand)?.split(',') }),
    ...(bodyType && { bodyType: String(bodyType)?.split(',') }),
    ...(priceRangeGroup && { priceRangeGroup }),
    ...(age && { age }),
    ...(tenure && { tenure }),
    ...(monthlyIncome && { monthlyIncome }),
    ...(sortBy && { sortBy }),
  }

  try {
    const [fetchMeta, funnel] = await Promise.all([
      axios.get(metaTagBaseApi + metabrand),
      getNewFunnelRecommendations(queryParam),
    ])

    const metaData = fetchMeta.data.data
    const recommendation = funnel.data
    if (metaData && metaData.length > 0) {
      meta.title = metaData[0].attributes.meta_title
      meta.description = metaData[0].attributes.meta_description
    }

    if (recommendation) meta.carRecommendations = recommendation

    return { props: { meta } }
  } catch (e) {
    return { props: { meta } }
  }
}
