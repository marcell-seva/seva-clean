import React from 'react'
import styles from '../../../styles/Footer.module.css'

export default function Footer() {
  const aboutUsUrl = 'https://ext.seva.id/tentang-kami'
  const termUrl = 'https://ext.seva.id/syarat-ketentuan'
  const privacyUrl = 'https://ext.seva.id/kebijakan-privasi'
  const contactUsUrl = 'https://ext.seva.id/hubungi-kami'
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
          <a className={styles.redirectText} href={aboutUsUrl}>
            <p>Tentang kami</p>
          </a>
          <a className={styles.redirectText} href={termUrl}>
            <p>Syarat & ketentuan</p>
          </a>
          <a className={styles.redirectText} href={privacyUrl}>
            <p>Kebijakan privasi</p>
          </a>
          <a className={styles.redirectText} href={contactUsUrl}>
            <p>Hubungi kami</p>
          </a>
        </div>
      </div>
    </div>
  )
}
