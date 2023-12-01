/* eslint-disable react/no-children-prop */
import Seo from 'components/atoms/seo'
import { CreditQualificationRejected } from 'components/organisms/resultPages/rejected'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useEffect, useMemo } from 'react'
import {
  getCities,
  getMetaTagData,
  getMobileFooterMenu,
  getMobileHeaderMenu,
  getAnnouncementBox as gab,
  getUsedCarSearch,
} from 'services/api'
import { useUtils } from 'services/context/utilsContext'

import styles from 'styles/pages/kualifikasi-kredit-result.module.scss'
import { getToken } from 'utils/handler/auth'
import { serverSideManualNavigateToErrorPage } from 'utils/handler/navigateErrorPage'
import { defaultSeoImage } from 'utils/helpers/const'
import { CityOtrOption } from 'utils/types'
import { MobileWebFooterMenuType } from 'utils/types/props'
import { MobileWebTopMenuType, SearchUsedCar } from 'utils/types/utils'

export interface Params {
  brand: string
  model: string
  tab: string
}

const CreditQualificationPageRejected = ({
  dataMobileMenu,
  dataFooter,
  dataCities,
  dataSearchUsedCar,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const {
    saveMobileWebTopMenus,
    saveMobileWebFooterMenus,
    saveCities,
    saveDataAnnouncementBox,
    saveDataSearchUsedCar,
  } = useUtils()
  const getAnnouncementBox = async () => {
    try {
      const res: any = await gab({
        headers: {
          'is-login': getToken() ? 'true' : 'false',
        },
      })
      saveDataAnnouncementBox(res.data)
    } catch (error) {}
  }

  useEffect(() => {
    saveMobileWebTopMenus(dataMobileMenu)
    saveMobileWebFooterMenus(dataFooter)
    saveCities(dataCities)
    saveDataSearchUsedCar(dataSearchUsedCar)
    getAnnouncementBox()
  }, [])

  return (
    <>
      <div className={styles.container}>
        <CreditQualificationRejected />
      </div>
    </>
  )
}

export default CreditQualificationPageRejected

export const getServerSideProps: GetServerSideProps<{
  dataMobileMenu: MobileWebTopMenuType[]
  dataFooter: MobileWebFooterMenuType[]
  dataCities: CityOtrOption[]
  dataSearchUsedCar: SearchUsedCar[]
}> = async (ctx) => {
  ctx.res.setHeader(
    'Cache-Control',
    'public, s-maxage=59, stale-while-revalidate=3000',
  )
  const params = new URLSearchParams()
  params.append('query', ' ' as string)

  try {
    const [menuMobileRes, footerRes, cityRes, dataSearchRes]: any =
      await Promise.all([
        getMobileHeaderMenu(),
        getMobileFooterMenu(),
        getCities(),
        getUsedCarSearch('', { params }),
      ])

    return {
      props: {
        dataMobileMenu: menuMobileRes.data,
        dataFooter: footerRes.data,
        dataCities: cityRes,
        dataSearchUsedCar: dataSearchRes.data,
      },
    }
  } catch (e: any) {
    return serverSideManualNavigateToErrorPage(e?.response?.status)
  }
}
