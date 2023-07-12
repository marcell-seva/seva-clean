import React, { useEffect, useState } from 'react'
import styles from 'styles/components/organisms/footerMobile.module.scss'
import SevaLogo from 'assets/icon/logo-on-dark.webp'
import ISOIcon from '/assets/icon/iso.webp'
import FacebookLogo from '/assets/icon/facebook-outline.png'
import { IconInstagram, IconTwitterOutlined } from 'components/atoms/icons'
import urls from 'utils/helpers/url'
import elementId from 'utils/helpers/trackerId'
import { sendAmplitudeData } from 'services/amplitude'
import { AmplitudeEventName } from 'services/amplitude/types'
import Image from 'next/image'
import { api } from 'services/api'

export interface FooterMenu {
  menuName: string
  menuDesc: string
  menuCode: string
  menuUrl: string
  menuLevel: number
  status: boolean
  menuOrder: number
  toggleNew: boolean
  menuType: string
}

const FooterMobile = () => {
  const [menu, setMenu] = useState<FooterMenu[]>([])

  useEffect(() => {
    api.getMobileFooterMenu().then((result: any) => {
      setMenu(result.data)
    })
  }, [])

  const dataTestId = (code: string) => {
    switch (code) {
      case 'tentang-seva':
        return elementId.Footer.TentangKami
      case 'syarat-ketentuan':
        return elementId.Footer.SyaratKetentuan
      case 'kebijakan-privasi':
        return elementId.Footer.KebijakanPrivasi
      case 'hubungi-kami':
        return elementId.Footer.HubungiKami
    }
  }

  const formatMenuUrl = (url: string) => {
    if (!url.startsWith('https://')) {
      return 'https://' + url
    }

    return url
  }

  const handleClickMenu = (menuName: string) => {
    sendAmplitudeData(AmplitudeEventName.WEB_FOOTER_CLICK, {
      Page_Origination_URL: window.location.href,
      Menu: menuName,
    })
  }

  return (
    <footer className={styles.container}>
      <div className={styles.contentContainer}>
        <Image
          src={SevaLogo}
          width={61}
          height={31}
          alt="seva"
          className={styles.sevaLogo}
        />
        <span className={styles.footerText}>
          SEVA - Platform yang berada di bawah Astra Financial yang menyediakan
          layanan pembiayaan mobil baru dengan didukung oleh perusahaan
          pembiayaan dan dealer resmi dari Astra Group
        </span>
        <div className={styles.linkedTextWrapper}>
          {menu.length > 0 &&
            menu.map((item, index) => (
              <a
                href={formatMenuUrl(item.menuUrl)}
                key={index}
                rel="noreferrer noopener"
                target="_blank"
                onClick={() => handleClickMenu(item.menuName)}
                data-testid={dataTestId(item.menuCode)}
                className={styles.link}
              >
                {item.menuName}
              </a>
            ))}
        </div>
        <div className={styles.socialWrapper}>
          <a
            href={urls.externalUrls.instagram}
            onClick={() => handleClickMenu('Instagram')}
            rel="noreferrer noopener"
            target="_blank"
            datatest-id={elementId.Footer.LogoInstagram}
          >
            <IconInstagram width={32} height={32} color="#FFFFFF" />
          </a>
          <a
            href={urls.externalUrls.twitter}
            onClick={() => handleClickMenu('Twitter')}
            rel="noreferrer noopener"
            target="_blank"
            datatest-id={elementId.Footer.LogoTwitter}
          >
            <IconTwitterOutlined width={32} height={32} color="#FFFFFF" />
          </a>
          <a
            href={urls.externalUrls.facebook}
            onClick={() => handleClickMenu('Facebook')}
            rel="noreferrer noopener"
            target="_blank"
            datatest-id={elementId.Footer.LogoFacebook}
          >
            <Image src={FacebookLogo} width={25} alt="facebook outline" />
          </a>
        </div>
        <div className={styles.isoWrapper}>
          <Image
            src={ISOIcon}
            width={29}
            height={29}
            alt="CBQA ISO 27001"
            datatest-id={elementId.Footer.LogoISO}
          />
          <span className={styles.footerText}>
            Kami mengambil langkah-langkah untuk membantu memastikan data kamu
            tetap aman dengan ISO 27001.
          </span>
        </div>
        <div className={styles.divider} />
        <span className={styles.copyrightText}>© 2023 Copyright SEVA</span>
      </div>
    </footer>
  )
}

export default FooterMobile
