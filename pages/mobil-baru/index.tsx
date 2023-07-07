import { PdpDesktop, PLP } from 'components/organism'
import React from 'react'
import axios from 'axios'
import Head from 'next/head'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { getNewFunnelRecommendations } from 'services/newFunnel'
import { CarRecommendationResponse } from 'utils/types/context'
import { FooterSEOAttributes } from 'utils/types/utils'
import { useMediaQuery } from 'react-responsive'
import PLPDesktop from 'components/organism/PLPDesktop'
import { useIsMobile } from 'utils/index'
import { getIsSsrMobile } from 'utils/getIsSsrMobile'

const NewCarResultPage = ({
  meta,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const isMobile = useIsMobile()
  return (
    <>
      <Head>
        <title>{meta.title}</title>
        <meta name="title" content={meta.title} />
        <meta name="description" content={meta.description} />
        <link rel="icon" href="/favicon.png" />
      </Head>
      {isMobile ? (
        <PLP carRecommendation={meta.carRecommendations} />
      ) : (
        <PLPDesktop footer={meta.footer} />
      )}
    </>
  )
}

export default NewCarResultPage

type PLPProps = {
  title: string
  description: string
  footer: FooterSEOAttributes
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
    const [fetchMeta, fetchFooter, funnel] = await Promise.all([
      axios.get(metaTagBaseApi + metabrand),
      axios.get(footerTagBaseApi + metabrand),
      getNewFunnelRecommendations(queryParam),
    ])

    const metaData = fetchMeta.data.data
    const footerData = fetchFooter.data.data
    const recommendation = funnel.data
    if (metaData && metaData.length > 0) {
      meta.title = metaData[0].attributes.meta_title
      meta.description = metaData[0].attributes.meta_description
    }

    if (footerData && footerData.length > 0) {
      meta.footer = footerData[0].attributes
    }

    if (recommendation) meta.carRecommendations = recommendation

    return { props: { meta, isSsrMobile: getIsSsrMobile(ctx) } }
  } catch (e) {
    return { props: { meta, isSsrMobile: getIsSsrMobile(ctx) } }
  }
}
