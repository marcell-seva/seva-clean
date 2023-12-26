import { Dealer } from 'components/organisms'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useEffect } from 'react'
import { getCities, getMobileHeaderMenu, getRecommendation } from 'services/api'
import { useUtils } from 'services/context/utilsContext'
import { serverSideManualNavigateToErrorPage } from 'utils/handler/navigateErrorPage'

const index = ({
  dataMobileMenu,
  dataCities,
  dataRecommendation,
  ssr,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { saveMobileWebTopMenus, saveCities } = useUtils()
  useEffect(() => {
    saveMobileWebTopMenus(dataMobileMenu)
    saveCities(dataCities)
  }, [])

  return (
    <div>
      <Dealer dataRecommendation={dataRecommendation} ssr={ssr} />
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
    const [recommendationRes, menuMobileRes, citiesRes]: any =
      await Promise.all([
        getRecommendation(params),
        getMobileHeaderMenu(),
        getCities(),
      ])

    const [dataRecommendation, dataMobileMenu, dataCities] = await Promise.all([
      recommendationRes.carRecommendations,
      menuMobileRes.data,
      citiesRes,
    ])
    return {
      props: {
        dataRecommendation,
        dataMobileMenu,
        dataCities,
        ssr: 'success',
      },
    }
  } catch (error: any) {
    return serverSideManualNavigateToErrorPage(error?.response?.status)
  }
}

export default index
