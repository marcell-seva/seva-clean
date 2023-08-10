import { InferGetServerSidePropsType } from 'next'
import Head from 'next/head'
import { createContext, useEffect, useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import { api } from 'services/api'
import { useIsMobileSSr } from 'utils/hooks/useIsMobileSsr'
import { HomepageDesktop, HomepageMobile } from 'components/organisms'
import { getIsSsrMobile } from 'utils/getIsSsrMobile'
import { getCity } from 'utils/hooks/useGetCity'

interface HomePageDataLocalContextType {
  dataBanner: any
  dataMenu: any
  dataCities: any
  dataTestimony: any
  dataRecToyota: any
  dataRecMVP: any
  dataUsage: any
  dataMainArticle: any
  dataTypeCar: any
  dataCarofTheMonth: any
}
/**
 * used to pass props without drilling through components
 */
export const HomePageDataLocalContext =
  createContext<HomePageDataLocalContextType>({
    dataBanner: null,
    dataMenu: null,
    dataCities: null,
    dataTestimony: null,
    dataRecToyota: null,
    dataRecMVP: null,
    dataUsage: null,
    dataMainArticle: null,
    dataTypeCar: null,
    dataCarofTheMonth: null,
  })

export default function WithTracker({
  dataReccomendation,
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

  return (
    <HomePageDataLocalContext.Provider
      value={{
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
      }}
    >
      <>
        {isMobile ? (
          <HomepageMobile dataReccomendation={dataReccomendation} />
        ) : (
          <HomepageDesktop />
        )}
      </>
    </HomePageDataLocalContext.Provider>
  )
}

export async function getServerSideProps(context: any) {
  context.res.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=59',
  )
  const params = `?city=${getCity().cityCode}&cityId=${getCity().id}`
  try {
    const [
      recommendationRes,
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
      api.getRecommendation(params),
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
      dataReccomendation,
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
      recommendationRes.carRecommendations,
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
        dataReccomendation,
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
        isSsrMobile: getIsSsrMobile(context),
      },
    }
  } catch (error) {
    throw error
  }
}
