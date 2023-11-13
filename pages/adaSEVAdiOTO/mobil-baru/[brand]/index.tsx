import { PLP } from 'components/organisms'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Head from 'next/head'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useRouter } from 'next/router'
import { saveLocalStorage } from 'utils/handler/localStorage'
import { LocalStorageKey } from 'utils/enum'
import { CarRecommendationResponse, MinMaxPrice } from 'utils/types/context'
import { getIsSsrMobile } from 'utils/getIsSsrMobile'
import {
  CityOtrOption,
  FooterSEOAttributes,
  MobileWebTopMenuType,
} from 'utils/types/utils'
import { defaultSeoImage } from 'utils/helpers/const'
import styles from 'styles/pages/plp.module.scss'
import { useUtils } from 'services/context/utilsContext'
import { MobileWebFooterMenuType } from 'utils/types/props'

import Seo from 'components/atoms/seo'
import { monthId } from 'utils/handler/date'
import { getCity } from 'utils/hooks/useGetCity'
import { getNewFunnelRecommendations } from 'utils/handler/funnel'
import {
  getMobileHeaderMenu,
  getMobileFooterMenu,
  getCities,
  getMinMaxPrice,
} from 'services/api'

const NewCarResultPage = ({
  meta,
  dataHeader,
  dataFooter,
  dataCities,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter()
  const id = router.query.brand
  const { saveMobileWebTopMenus, saveMobileWebFooterMenus, saveCities } =
    useUtils()

  useEffect(() => {
    saveMobileWebTopMenus(dataHeader)
    saveMobileWebFooterMenus(dataFooter)
    saveCities(dataCities)

    if (id && typeof id === 'string' && id.includes('SEVA')) {
      saveLocalStorage(LocalStorageKey.referralTemanSeva, id)
    }
  }, [])

  const todayDate = new Date()

  const metaTitle =
    `Harga OTR ` +
    meta.title.split('20')[0] +
    ` ${todayDate.getFullYear()} - Promo Cicilan bulan ${monthId(
      todayDate.getMonth(),
    )} | SEVA`
  const metaDesc = `Beli mobil Toyota ${todayDate.getFullYear()} terbaru secara kredit dengan Instant Approval*. Cari tau spesifikasi, harga, promo, dan kredit di SEVA`

  return (
    <>
      <Seo title={metaTitle} description={metaDesc} image={defaultSeoImage} />
      <PLP minmaxPrice={meta.MinMaxPrice} isOTO={true} />
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
  dataHeader: MobileWebTopMenuType[]
  dataFooter: MobileWebFooterMenuType[]
  dataCities: CityOtrOption[]
}> = async (ctx) => {
  ctx.res.setHeader(
    'Cache-Control',
    'public, s-maxage=59, stale-while-revalidate=3000',
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
    const [fetchMeta, fetchFooter, menuRes, footerRes, cityRes] =
      await Promise.all([
        axios.get(metaTagBaseApi + metabrand),
        axios.get(footerTagBaseApi + metabrand),
        getMobileHeaderMenu(),
        getMobileFooterMenu(),
        getCities(),
      ])

    const metaData = fetchMeta.data.data
    const footerData = fetchFooter.data.data

    if (!priceRangeGroup) {
      const params = new URLSearchParams()
      getCity().cityCode && params.append('city', getCity().cityCode as string)
      const minmaxPriceData = await getMinMaxPrice('', { params })
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

    return {
      props: {
        meta,
        dataHeader: menuRes.data,
        dataFooter: footerRes.data,
        dataCities: cityRes,
      },
    }
  } catch (e) {
    return {
      props: {
        meta,
        dataHeader: [],
        dataFooter: [],
        dataCities: [],
      },
    }
  }
}
