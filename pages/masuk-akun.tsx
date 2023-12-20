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
        title="Masuk Akun - SEVA"
        description="Yuk, masuk dengan nomor HP kamu dan hitung simulasi kredit dengan loan calculator serta dapatkan promo cicilan menarik dari lainnya. SEVA member of ASTRA"
        image={defaultSeoImage}
      />

      <div className={styles.container}>
        <Login />
      </div>
    </>
  )
}

export default LoginPage
