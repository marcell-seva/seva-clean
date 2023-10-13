import { PLP } from 'components/organisms'
import React, { useEffect } from 'react'
import axios from 'axios'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { CarRecommendationResponse, MinMaxPrice } from 'utils/types/context'
import {
  CityOtrOption,
  FooterSEOAttributes,
  MobileWebTopMenuType,
  NavbarItemResponse,
} from 'utils/types/utils'
import { getIsSsrMobile } from 'utils/getIsSsrMobile'
import { api } from 'services/api'
import Seo from 'components/atoms/seo'
import { defaultSeoImage } from 'utils/helpers/const'
import { useUtils } from 'services/context/utilsContext'
import { MobileWebFooterMenuType } from 'utils/types/props'
import styles from 'styles/pages/plp.module.scss'
import { CarProvider } from 'services/context'
import { generateBlurRecommendations } from 'utils/generateBlur'
import { monthId } from 'utils/handler/date'
import { getCity } from 'utils/hooks/useGetCity'
import { getNewFunnelRecommendations } from 'utils/handler/funnel'

const NewCarResultPage = ({
  meta,
  dataHeader,
  dataFooter,
  dataCities,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { saveMobileWebTopMenus, saveMobileWebFooterMenus, saveCities } =
    useUtils()

  useEffect(() => {
    saveMobileWebTopMenus(dataHeader)
    saveMobileWebFooterMenus(dataFooter)
    saveCities(dataCities)
  }, [])

  const todayDate = new Date()

  const metaTitle =
    meta.title.slice(0, 23) +
    ` - Harga OTR dengan Promo Cicilan bulan ${monthId(
      todayDate.getMonth(),
    )} | SEVA`
  const metaDesc = `Temukan beragam mobil ${todayDate.getFullYear()} terbaru di SEVA. Beli mobil secara kredit dengan Instant Approval*.`

  return (
    <>
      <Seo title={metaTitle} description={metaDesc} image={defaultSeoImage} />

      <CarProvider
        car={null}
        carOfTheMonth={[]}
        typeCar={null}
        carModel={null}
        carModelDetails={null}
        carVariantDetails={null}
        recommendation={meta.carRecommendations.carRecommendations}
        recommendationToyota={[]}
      >
        <PLP minmaxPrice={meta.MinMaxPrice} isOTO={true} />
      </CarProvider>
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
      const params = new URLSearchParams()
      getCity().cityCode && params.append('city', getCity().cityCode as string)

      const minmax = await api.getMinMaxPrice('', { params })
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

    const [funnel] = await Promise.all([
      getNewFunnelRecommendations({ ...queryParam }),
    ])

    const generateRecommendation = await generateBlurRecommendations(
      funnel.carRecommendations,
    )
    const recommendation = {
      carRecommendations: generateRecommendation
        ? [...generateRecommendation]
        : funnel.carRecommendations,
      lowestCarPrice: funnel.lowestCarPrice,
      highestCarPrice: funnel.highestCarPrice,
    }

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
