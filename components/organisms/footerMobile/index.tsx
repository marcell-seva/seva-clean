import React, { useEffect, useState } from 'react'
import { colors } from 'styles/colors'
import { IconInstagram, IconTwitterOutlined } from 'components/atoms/icon'
import styles from '../../../styles/components/organisms/footerMobile.module.scss'
import urls from 'helpers/urls'
import elementId from 'helpers/elementIds'
import Image from 'next/image'
import { trackFooterClick } from 'helpers/amplitude/seva20Tracking'
import { getLocalStorage } from 'utils/localstorageUtils'
import { UTMTagsData } from 'utils/types/utils'
import { LocalStorageKey } from 'utils/enum'
import { api } from 'services/api'

const SevaLogo = '/revamp/icon/logo-on-dark.webp'
const ISOIcon = '/revamp/icon/iso.webp'
const FacebookLogo = '/revamp/icon/facebook-outline.png'

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

export const FooterMobile = () => {
  const UTMTags = getLocalStorage<UTMTagsData>(LocalStorageKey.UtmTags)
  const [menu, setMenu] = useState<FooterMenu[]>([])

  useEffect(() => {
    api
      .getMobileFooterMenu()
      .then(
        (result: { data: { data: React.SetStateAction<FooterMenu[]> } }) => {
          setMenu(result.data.data)
        },
      )
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
    trackFooterClick({
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
          {menu?.length > 0 &&
            menu?.map((item, index) => (
              <a
                href={formatMenuUrl(item.menuUrl)}
                key={index}
                rel="noreferrer noopener"
                target="_blank"
                onClick={() => handleClickMenu(item.menuName)}
                data-testid={dataTestId(item.menuCode)}
              >
                {item.menuName}
              </a>
            ))}
        </div>
        <div className={styles.socialWrapper}>
          <a
            href={urls.instagram}
            onClick={() => handleClickMenu('Instagram')}
            rel="noreferrer noopener"
            target="_blank"
            datatest-id={elementId.Footer.LogoInstagram}
          >
            <IconInstagram width={32} height={32} color={colors.white} />
          </a>
          <a
            href={urls.twitter}
            onClick={() => handleClickMenu('Twitter')}
            rel="noreferrer noopener"
            target="_blank"
            datatest-id={elementId.Footer.LogoTwitter}
          >
            <IconTwitterOutlined width={32} height={32} color={colors.white} />
          </a>
          <a
            href={urls.facebook}
            onClick={() => handleClickMenu('Facebook')}
            rel="noreferrer noopener"
            target="_blank"
            datatest-id={elementId.Footer.LogoFacebook}
          >
            <img src={FacebookLogo} width={25} alt="facebook outline" />
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
            Kami mengambil langkah-langkah untuk membantu
            <br />
            memastikan data kamu tetap aman dengan ISO 27001.
          </span>
        </div>
        <div className={styles.divider} />
        <span className={styles.copyrightText}>© 2023 Copyright SEVA</span>
        {UTMTags?.utm_source && (
          <span className={styles.utmText}>Source: {UTMTags?.utm_source}</span>
        )}
      </div>
    </footer>
  )
}
