import Seo from 'components/atoms/seo'
import { Dealer } from 'components/organisms'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import {
  getCities,
  getDealer,
  getMobileFooterMenu,
  getMobileHeaderMenu,
  getRecommendation,
  getTagArticle,
} from 'services/api'
import { useUtils } from 'services/context/utilsContext'
import { serverSideManualNavigateToErrorPage } from 'utils/handler/navigateErrorPage'
import { defaultSeoImage } from 'utils/helpers/const'
import { capitalizeFirstLetter, capitalizeWords } from 'utils/stringUtils'

const DealerBrand = ({
  dataMobileMenu,
  dataCities,
  dataRecommendation,
  dataFooterMenu,
  dataDealerBranch,
  dataTagArticle,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter()
  const getUrlBrand = router.query.brand?.toString() ?? ''
  const metaTitle = `Temukan  Dealer Mobil ${
    getUrlBrand.toLowerCase() === 'bmw'
      ? getUrlBrand.toUpperCase()
      : capitalizeFirstLetter(getUrlBrand)
  } di Indonesia | SEVA`
  const metaDesc = `Temukan dealer ${
    getUrlBrand.toLowerCase() === 'bmw'
      ? getUrlBrand.toUpperCase()
      : capitalizeFirstLetter(getUrlBrand)
  } terdekat dengan Anda. Dapatkan informasi mengenai harga dan penawaran terbaik dari dealer rekanan SEVA hanya di Seva.id`

  const {
    saveMobileWebTopMenus,
    saveCities,
    saveMobileWebFooterMenus,
    saveDealerBrand,
    saveDealerArticles,
  } = useUtils()
  useEffect(() => {
    saveMobileWebTopMenus(dataMobileMenu)
    saveCities(dataCities)
    saveMobileWebFooterMenus(dataFooterMenu)
    saveDealerBrand(dataDealerBranch)
    saveDealerArticles(dataTagArticle)
  }, [])

  return (
    <div>
      <Seo title={metaTitle} description={metaDesc} image={defaultSeoImage} />
      <Dealer dataRecommendation={dataRecommendation} page="brand" />
    </div>
  )
}

export const getServerSideProps = async (context: any) => {
  context.res.setHeader(
    'Cache-Control',
    'public, s-maxage=59, stale-while-revalidate=3000',
  )

  const { brand } = context.query

  const params = `?brand=${capitalizeWords(brand)}&city=jakarta&cityId=118`
  try {
    const [
      recommendationRes,
      menuMobileRes,
      citiesRes,
      footerMenuRes,
      dealerBranchRes,
      articleRes,
    ]: any = await Promise.all([
      getRecommendation(params),
      getMobileHeaderMenu(),
      getCities(),
      getMobileFooterMenu(),
      getDealer(`?brand=${capitalizeWords(brand)}`),
      getTagArticle(`?tag_name=${brand.toLowerCase()}`),
    ])

    const [
      dataRecommendation,
      dataMobileMenu,
      dataCities,
      dataFooterMenu,
      dataDealerBranch,
      dataTagArticle,
    ] = await Promise.all([
      recommendationRes.carRecommendations,
      menuMobileRes.data,
      citiesRes,
      footerMenuRes.data,
      dealerBranchRes.data,
      articleRes,
    ])
    return {
      props: {
        dataRecommendation,
        dataMobileMenu,
        dataCities,
        dataFooterMenu,
        dataDealerBranch,
        dataTagArticle,
      },
    }
  } catch (error: any) {
    return serverSideManualNavigateToErrorPage(error?.response?.status)
  }
}

export default DealerBrand
