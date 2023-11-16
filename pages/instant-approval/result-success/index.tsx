/* eslint-disable react/no-children-prop */
import Seo from 'components/atoms/seo'
import { CreditQualificationSuccess } from 'components/organisms/resultPages/success'
import { InferGetServerSidePropsType } from 'next'
import { useMemo } from 'react'
import {
  getCities,
  getMetaTagData,
  getMobileFooterMenu,
  getMobileHeaderMenu,
} from 'services/api'

import styles from 'styles/pages/kualifikasi-kredit-result.module.scss'
import { getToken } from 'utils/handler/auth'
import { serverSideManualNavigateToErrorPage } from 'utils/handler/navigateErrorPage'
import { defaultSeoImage } from 'utils/helpers/const'
import { useProtectPage } from 'utils/hooks/useProtectPage/useProtectPage'

export interface Params {
  brand: string
  model: string
  tab: string
}

const CreditQualificationPageSuccess = ({}: InferGetServerSidePropsType<
  typeof getServerSideProps
>) => {
  useProtectPage()

  return (
    <>
      <div className={styles.container}>
        <CreditQualificationSuccess />
      </div>
    </>
  )
}

export default CreditQualificationPageSuccess

export const getServerSideProps = async (ctx: any) => {
  const model = (ctx.query.model as string)?.replaceAll('-', '')

  try {
    const [menuMobileRes, footerRes, cityRes]: any = await Promise.all([
      getMobileHeaderMenu(),
      getMobileFooterMenu(),
      getCities(),
    ])

    return {
      props: {
        dataMobileMenu: menuMobileRes.data,
        dataFooter: footerRes.data,
        dataCities: cityRes,
      },
    }
  } catch (e: any) {
    return serverSideManualNavigateToErrorPage(e?.response?.status)
  }
}
