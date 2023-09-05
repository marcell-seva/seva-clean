import { PLP } from 'components/organisms'
import React, { useEffect } from 'react'
import axios from 'axios'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { getMinMaxPrice, getNewFunnelRecommendations } from 'services/newFunnel'
import { CarRecommendationResponse, MinMaxPrice } from 'utils/types/context'
import {
  CarRecommendation,
  CityOtrOption,
  FooterSEOAttributes,
  MobileWebTopMenuType,
  NavbarItemResponse,
} from 'utils/types/utils'
import PLPDesktop from 'components/organisms/PLPDesktop'
import { getIsSsrMobile } from 'utils/getIsSsrMobile'
import { api } from 'services/api'
import Seo from 'components/atoms/seo'
import { defaultSeoImage } from 'utils/helpers/const'
import { useUtils } from 'services/context/utilsContext'
import { MobileWebFooterMenuType } from 'utils/types/props'
import styles from 'styles/pages/plp.module.scss'

const NewCarResultPage = ({
  meta,
  isSsrMobile,
  dataHeader,
  dataFooter,
  dataCities,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { saveMobileWebTopMenus, saveMobileWebFooterMenus, saveCities } =
    useUtils()
  const isMobile = isSsrMobile

  useEffect(() => {
    saveMobileWebTopMenus(dataHeader)
    saveMobileWebFooterMenus(dataFooter)
    saveCities(dataCities)
  }, [])

  return (
    <>
      <Seo
        title={meta.title}
        description={meta.description}
        image={defaultSeoImage}
      />

      <div className={styles.mobile}>
        <PLP
          carRecommendation={meta.carRecommendations}
          minmaxPrice={meta.MinMaxPrice}
          alternativeRecommendation={meta.alternativeCarRecommendation}
        />
      </div>
      <div className={styles.desktop}>
        <PLPDesktop
          carRecommendation={meta.carRecommendations}
          footer={meta.footer}
        />
      </div>
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
  alternativeCarRecommendation: CarRecommendation[]
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
  dataHeader: MobileWebTopMenuType[]
  dataFooter: MobileWebFooterMenuType[]
  dataCities: CityOtrOption[]
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
    MinMaxPrice: { maxPriceValue: 0, minPriceValue: 0 },
    carRecommendations: {
      carRecommendations: [],
      lowestCarPrice: 0,
      highestCarPrice: 0,
    },
    alternativeCarRecommendation: [],
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
    const [fetchMeta, fetchFooter, menuRes, footerRes, cityRes]: any =
      await Promise.all([
        axios.get(metaTagBaseApi + metabrand),
        axios.get(footerTagBaseApi + metabrand),
        api.getMobileHeaderMenu(),
        api.getMobileFooterMenu(),
        api.getCities(),
      ])

    const metaData = fetchMeta.data.data
    const footerData = fetchFooter.data.data

    if (!priceRangeGroup) {
      const minmax = await getMinMaxPrice()
      const minmaxPriceData = minmax
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

    const [funnel, alternative] = await Promise.all([
      getNewFunnelRecommendations({ ...queryParam }),
      getNewFunnelRecommendations({ ...queryParam, brand: [] }),
    ])

    const recommendation = funnel
    const alternativeData = alternative

    if (metaData && metaData.length > 0) {
      meta.title = metaData[0].attributes.meta_title
      meta.description = metaData[0].attributes.meta_description
    }

    if (footerData && footerData.length > 0) {
      meta.footer = footerData[0].attributes
    }

    if (recommendation) {
      meta.carRecommendations = recommendation
    }
    meta.alternativeCarRecommendation = alternativeData.carRecommendations

    return {
      props: {
        meta,
        isSsrMobile: getIsSsrMobile(ctx),
        dataHeader: menuRes.data,
        dataFooter: footerRes.data,
        dataCities: cityRes,
      },
    }
  } catch (e) {
    return {
      props: {
        meta,
        isSsrMobile: getIsSsrMobile(ctx),
        dataHeader: [],
        dataFooter: [],
        dataCities: [],
      },
    }
  }
}
