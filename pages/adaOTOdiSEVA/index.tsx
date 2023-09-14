import { InferGetServerSidePropsType } from 'next'
import { createContext, useEffect, useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import { api } from 'services/api'
import { useIsMobileSSr } from 'utils/hooks/useIsMobileSsr'
import {
  HomepageAdaOTOdiSEVA,
  HomepageDesktop,
  HomepageMobile,
} from 'components/organisms'
import { getIsSsrMobile } from 'utils/getIsSsrMobile'
import { getCity } from 'utils/hooks/useGetCity'
import styles from 'styles/pages/adaOTOdiSEVA.module.scss'
import { useUtils } from 'services/context/utilsContext'
import { useCar } from 'services/context/carContext'

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

export const HomePageDataLocalContext2 =
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
  const { saveTypeCar, saveCarOfTheMonth, saveRecommendationToyota } = useCar()
  const { saveArticles, saveCities, saveMobileWebTopMenus } = useUtils()
  const isClientMobile = useMediaQuery({ query: '(max-width: 1024px)' })

  useEffect(() => {
    setIsMobile(isClientMobile)
  }, [isClientMobile])

  useEffect(() => {
    saveMobileWebTopMenus(dataMenu)
    saveArticles(dataMainArticle)
    saveCarOfTheMonth(dataCarofTheMonth)
    saveTypeCar(dataTypeCar)
    saveCities(dataCities)
    saveRecommendationToyota(dataRecToyota)
  }, [])

  return (
    <HomePageDataLocalContext2.Provider
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
      <div className={styles.mobile}>
        <HomepageAdaOTOdiSEVA dataReccomendation={dataReccomendation} />
      </div>
    </HomePageDataLocalContext2.Provider>
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
      api.getMobileHeaderMenu(),
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
