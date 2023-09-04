import { PLP } from 'components/organisms'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Head from 'next/head'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useRouter } from 'next/router'
import { saveLocalStorage } from 'utils/handler/localStorage'
import { LocalStorageKey } from 'utils/enum'
import { getMinMaxPrice, getNewFunnelRecommendations } from 'services/newFunnel'
import { CarRecommendationResponse, MinMaxPrice } from 'utils/types/context'
import { getIsSsrMobile } from 'utils/getIsSsrMobile'
import { FooterSEOAttributes } from 'utils/types/utils'
import PLPDesktop from 'components/organisms/PLPDesktop'
import { useMediaQuery } from 'react-responsive'

const NewCarResultPage = ({
  meta,
  isSsrMobile,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter()
  const id = router.query.brand
  const isMobile = isSsrMobile
  const isClientMobile = useMediaQuery({ query: '(max-width: 1024px)' })

  useEffect(() => {
    if (id && typeof id === 'string' && id.includes('SEVA')) {
      saveLocalStorage(LocalStorageKey.referralTemanSeva, id)
    }
  }, [])

  return (
    <>
      <Head>
        <title>{meta.title}</title>
        <meta name="title" content={meta.title} />
        <meta name="description" content={meta.description} />
        <link rel="icon" href="/favicon.png" />
      </Head>
      {isMobile ? (
        <PLP minmaxPrice={meta.MinMaxPrice} />
      ) : (
        <PLPDesktop
          carRecommendation={meta.carRecommendations}
          footer={meta.footer}
        />
      )}
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
  isSsrMobile: boolean
}> = async (ctx) => {
  ctx.res.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=59',
  )
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
    MinMaxPrice: { maxPriceValue: 0, minPriceValue: 0 },
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

  try {
    const [fetchMeta, fetchFooter] = await Promise.all([
      axios.get(metaTagBaseApi + metabrand),
      axios.get(footerTagBaseApi + metabrand),
    ])

    const metaData = fetchMeta.data.data
    const footerData = fetchFooter.data.data

    if (!priceRangeGroup) {
      const minmaxPriceData = await getMinMaxPrice()
      meta.MinMaxPrice = {
        minPriceValue: minmaxPriceData.minPriceValue,
        maxPriceValue: minmaxPriceData.maxPriceValue,
      }
    }

    const queryParam: any = {
      ...(downPaymentAmount && { downPaymentType: 'amount' }),
      ...(downPaymentAmount && { downPaymentAmount }),
      ...(brand && { brand: String(brand)?.split(',') }),
      ...(bodyType && { bodyType: String(bodyType)?.split(',') }),
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

    return { props: { meta, isSsrMobile: getIsSsrMobile(ctx) } }
  } catch (e) {
    return { props: { meta, isSsrMobile: getIsSsrMobile(ctx) } }
  }
}
