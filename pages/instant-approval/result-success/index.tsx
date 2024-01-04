/* eslint-disable react/no-children-prop */
import Seo from 'components/atoms/seo'
import { CreditQualificationSuccess } from 'components/organisms/resultPages/success'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useEffect } from 'react'
import {
  getCities,
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
import { useProtectPage } from 'utils/hooks/useProtectPage/useProtectPage'
import { CityOtrOption } from 'utils/types'
import { MobileWebFooterMenuType } from 'utils/types/props'
import { MobileWebTopMenuType, SearchUsedCar } from 'utils/types/utils'

export interface Params {
  brand: string
  model: string
  tab: string
}

const CreditQualificationPageSuccess = ({
  dataMobileMenu,
  dataFooter,
  dataCities,
  dataSearchUsedCar,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  useProtectPage()
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
      <Seo
        title="SEVA - Beli Mobil Terbaru Dengan Cicilan Kredit Terbaik"
        description="Beli mobil terbaru dari Toyota, Daihatsu, BMW dengan Instant Approval*. Proses Aman & Mudah✅ Terintegrasi dengan ACC & TAF✅ SEVA member of ASTRA"
        image={defaultSeoImage}
      />
      <div className={styles.container}>
        <CreditQualificationSuccess />
      </div>
    </>
  )
}

export default CreditQualificationPageSuccess

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
  params.append('query', '' as string)

  try {
    const [menuMobileRes, footerRes, cityRes, dataSearchRes]: any =
      await Promise.all([
        getMobileHeaderMenu(),
        getMobileFooterMenu(),
        getCities(),
        getUsedCarSearch(''),
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
