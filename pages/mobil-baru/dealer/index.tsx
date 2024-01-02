import Seo from 'components/atoms/seo'
import { Dealer } from 'components/organisms'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useEffect } from 'react'
import {
  getCities,
  getMobileFooterMenu,
  getMobileHeaderMenu,
  getNewCarBrand,
  getRecommendation,
  getSubArticle,
} from 'services/api'
import { useUtils } from 'services/context/utilsContext'
import { serverSideManualNavigateToErrorPage } from 'utils/handler/navigateErrorPage'
import { defaultSeoImage } from 'utils/helpers/const'

const DealerLandingPage = ({
  dataMobileMenu,
  dataCities,
  dataRecommendation,
  dataFooterMenu,
  dataBrandList,
  dataArticles,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const metaTitle = `Temukan Dealer Mobil Baru Rekanan SEVA di Indonesia | SEVA`
  const metaDesc = `Cari dealer mobil baru terdekat di kota Anda. Dapatkan informasi mengenai harga dan penawaran menarik dari dealer rekanan SEVA hanya di Seva.id`
  const {
    saveMobileWebTopMenus,
    saveCities,
    saveMobileWebFooterMenus,
    saveBrand,
    saveDealerArticles,
  } = useUtils()
  useEffect(() => {
    saveMobileWebTopMenus(dataMobileMenu)
    saveCities(dataCities)
    saveMobileWebFooterMenus(dataFooterMenu)
    saveBrand(dataBrandList)
    saveDealerArticles(dataArticles)
  }, [])

  return (
    <div>
      <Seo title={metaTitle} description={metaDesc} image={defaultSeoImage} />
      <Dealer dataRecommendation={dataRecommendation} page="main" />
    </div>
  )
}

export const getServerSideProps = async (context: any) => {
  context.res.setHeader(
    'Cache-Control',
    'public, s-maxage=59, stale-while-revalidate=3000',
  )
  const params = `?city=jakarta&cityId=118`
  try {
    const [
      recommendationRes,
      menuMobileRes,
      citiesRes,
      footerMenuRes,
      brandList,
      articles,
    ]: any = await Promise.all([
      getRecommendation(params),
      getMobileHeaderMenu(),
      getCities(),
      getMobileFooterMenu(),
      getNewCarBrand(),
      getSubArticle(972),
    ])

    const [
      dataRecommendation,
      dataMobileMenu,
      dataCities,
      dataFooterMenu,
      dataBrandList,
      dataArticles,
    ] = await Promise.all([
      recommendationRes.carRecommendations,
      menuMobileRes.data,
      citiesRes,
      footerMenuRes.data,
      brandList,
      articles,
    ])
    return {
      props: {
        dataRecommendation,
        dataMobileMenu,
        dataCities,
        dataFooterMenu,
        dataBrandList,
        dataArticles,
      },
    }
  } catch (error: any) {
    return serverSideManualNavigateToErrorPage(error?.response?.status)
  }
}

export default DealerLandingPage
