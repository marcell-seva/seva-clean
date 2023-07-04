import React from 'react'
import styles from 'styles/components/organisms/Footer.module.scss'

const Footer: React.FC = (): JSX.Element => {
  const aboutUsUrl: string = 'https://ext.seva.id/tentang-kami'
  const termUrl: string = 'https://ext.seva.id/syarat-ketentuan'
  const privacyUrl: string = 'https://ext.seva.id/kebijakan-privasi'
  const contactUsUrl: string = 'https://ext.seva.id/hubungi-kami'
  const aboutUsText: string = 'Tentang kami'
  const termText: string = 'Syarat & ketentuan'
  const legalText: string = 'Kebijakan privasi'
  const contactUsText: string = 'Hubungi kami'
  const infoText: string =
    'SEVA - Platform yang berada di bawah Astra Financial yang menyediakan layanan pembiayaan mobil baru dengan didukung oleh perusahaan pembiayaan dan dealer resmi dari Astra Group '
  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <div className={styles.wrapperDesc}>
          <p className={styles.desc}>{infoText}</p>
        </div>
        <div className={styles.wrapperInfo}>
          <a className={styles.redirectText} href={aboutUsUrl}>
            {aboutUsText}
          </a>
          <a className={styles.redirectText} href={termUrl}>
            {termText}
          </a>
          <a className={styles.redirectText} href={privacyUrl}>
            {legalText}
          </a>
          <a className={styles.redirectText} href={contactUsUrl}>
            {contactUsText}
          </a>
        </div>
      </div>
    </div>
  )
}

export default Footer
