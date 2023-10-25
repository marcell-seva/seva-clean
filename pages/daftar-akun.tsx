import React, { useMemo } from 'react'
import styles from 'styles/pages/register.module.scss'
import Seo from 'components/atoms/seo'
import { defaultSeoImage } from 'utils/helpers/const'
import { Register } from 'components/organisms'

export interface Params {
  brand: string
  model: string
  tab: string
}

const RegisterPage = () => {
  return (
    <>
      <Seo
        title="SEVA - Beli Mobil Terbaru Dengan Cicilan Kredit Terbaik"
        description="Beli mobil terbaru dari Toyota, Daihatsu, BMW dengan Instant Approval*. Proses Aman & Mudah✅ Terintegrasi dengan ACC & TAF✅ SEVA member of ASTRA"
        image={defaultSeoImage}
      />
      <div className={styles.container}>
        <Register />
      </div>
    </>
  )
}

export default RegisterPage
