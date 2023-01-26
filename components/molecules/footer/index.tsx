import React from 'react'
import styles from '../../../styles/Footer.module.css'

export default function Footer() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <div className={styles.wrapperDesc}>
          <p className={styles.desc}>
            SEVA - Platform yang berada di bawah Astra Financial yang
            menyediakan layanan pembiayaan mobil baru dengan didukung oleh
            perusahaan pembiayaan dan dealer resmi dari Astra Group
          </p>
        </div>
        <div className={styles.wrapperInfo}>
          <a className={styles.redirectText} href="#" target="_self">
            <p>Tentang kami</p>
          </a>
          <a className={styles.redirectText} href="#" target="_self">
            <p>Syarat & ketentuan</p>
          </a>
          <a className={styles.redirectText} href="#" target="_self">
            <p>Kebijakan privasi</p>
          </a>
          <a className={styles.redirectText} href="#" target="_self">
            <p>Hubungi kami</p>
          </a>
        </div>
      </div>
    </div>
  )
}
