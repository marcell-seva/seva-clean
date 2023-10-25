import React from 'react'
import styles from 'styles/pages/login.module.scss'
import Seo from 'components/atoms/seo'
import { defaultSeoImage } from 'utils/helpers/const'
import { Login } from 'components/organisms'

export interface Params {
  brand: string
  model: string
  tab: string
}

const LoginPage = () => {
  return (
    <>
      <Seo
        title="SEVA - Beli Mobil Terbaru Dengan Cicilan Kredit Terbaik"
        description="Beli mobil terbaru dari Toyota, Daihatsu, BMW dengan Instant Approval*. Proses Aman & Mudah✅ Terintegrasi dengan ACC & TAF✅ SEVA member of ASTRA"
        image={defaultSeoImage}
      />

      <div className={styles.container}>
        <Login />
      </div>
    </>
  )
}

export default LoginPage
