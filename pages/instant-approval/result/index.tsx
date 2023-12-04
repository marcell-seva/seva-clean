/* eslint-disable react/no-children-prop */
import Seo from 'components/atoms/seo'
import { CreditQualificationRejected } from 'components/organisms/resultPages/rejected'
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

export interface Params {
  brand: string
  model: string
  tab: string
}

const CreditQualificationPageRejected = ({
  dataMobileMenu,
  dataFooter,
  dataCities,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <>
      <div className={styles.container}>
        <CreditQualificationRejected />
      </div>
    </>
  )
}

export default CreditQualificationPageRejected

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
