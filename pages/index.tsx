import { InferGetServerSidePropsType } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import { api } from 'services/api'
import { useIsMobileSSr } from 'utils/hooks/useIsMobileSsr'
import { HomepageDesktop, HomepageMobile } from 'components/organism'

export default function WithTracker({
  dataBanner,
  dataMenu,
  dataCities,
  dataTestimony,
  dataRecToyota,
  dataRecMVP,
  dataUsage,
  dataMainArticle,
  dataTypeCar,
  dataCarofTheMonth,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [isMobile, setIsMobile] = useState(useIsMobileSSr())

  const isClientMobile = useMediaQuery({ query: '(max-width: 1024px)' })

  useEffect(() => {
    setIsMobile(isClientMobile)
  }, [isClientMobile])

  return <>{isMobile ? <HomepageMobile /> : <HomepageDesktop />}</>
}

export async function getServerSideProps({ res }: any) {
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=59',
  )
  try {
    const [
      bannerRes,
      menuRes,
      citiesRes,
      testimonyRes,
      recTotoyaRes,
      MVPRes,
      usageRes,
      mainArticleRes,
      typeCarRes,
      carofTheMonthRes,
    ]: any = await Promise.all([
      api.getBanner(),
      api.getMenu(),
      api.getCities(),
      api.getTestimony(),
      api.getRecommendation('?brand=Toyota&city=jakarta&cityId=118'),
      api.getRecommendation('?bodyType=MPV&city=jakarta&cityId=118'),
      api.getUsage(),
      api.getMainArticle('65'),
      api.getTypeCar('?city=jakarta'),
      api.getCarofTheMonth(),
    ])
    const [
      dataBanner,
      dataMenu,
      dataCities,
      dataTestimony,
      dataRecToyota,
      dataRecMVP,
      dataUsage,
      dataMainArticle,
      dataTypeCar,
      dataCarofTheMonth,
    ] = await Promise.all([
      bannerRes.data,
      menuRes.data,
      citiesRes,
      testimonyRes.data,
      recTotoyaRes.carRecommendations,
      MVPRes.carRecommendations,
      usageRes.data.attributes,
      mainArticleRes,
      typeCarRes,
      carofTheMonthRes.data,
    ])
    return {
      props: {
        dataBanner,
        dataMenu,
        dataCities,
        dataTestimony,
        dataRecToyota,
        dataRecMVP,
        dataUsage,
        dataMainArticle,
        dataTypeCar,
        dataCarofTheMonth,
      },
    }
  } catch (error) {
    throw error
  }
}
