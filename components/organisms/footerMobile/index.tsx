import React, { useEffect, useState } from 'react'
import { colors } from 'styles/colors'
import { IconInstagram, IconTwitterOutlined } from 'components/atoms/icon'
import styles from '../../../styles/components/organisms/footerMobile.module.scss'
import urls from 'helpers/urls'
import elementId from 'helpers/elementIds'
import Image from 'next/image'
import { trackFooterClick } from 'helpers/amplitude/seva20Tracking'
import { getLocalStorage } from 'utils/handler/localStorage'
import { UTMTagsData } from 'utils/types/utils'
import { LocalStorageKey } from 'utils/enum'
import { api } from 'services/api'
import { useUtils } from 'services/context/utilsContext'
import Link from 'next/link'
import {
  trackEventCountly,
  valueMenuTabCategory,
} from 'helpers/countly/countly'
import { CountlyEventNames } from 'helpers/countly/eventNames'

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

export interface FooterProps {
  pageOrigination?: string
}
export const FooterMobile = ({ pageOrigination }: FooterProps) => {
  const UTMTags = getLocalStorage<UTMTagsData>(LocalStorageKey.UtmTags)
  const { mobileWebFooterMenus } = useUtils()

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
  const trackCountlyFooter = (menuUrl: string) => {
    if (pageOrigination && pageOrigination.length !== 0) {
      trackEventCountly(CountlyEventNames.WEB_FOOTER_CLICK, {
        PAGE_ORIGINATION: pageOrigination.includes('PDP')
          ? pageOrigination + valueMenuTabCategory()
          : pageOrigination,
        PAGE_DIRECTION_URL: formatMenuUrl(menuUrl),
      })
    }
  }
  const handleClickMenu = (menuName: string, menuUrl: string) => {
    trackFooterClick({
      Page_Origination_URL: window.location.href,
      Menu: menuName,
    })
    trackCountlyFooter(menuUrl)
  }

  return (
    <footer className={styles.container}>
      <div className={styles.contentContainer}>
        <Image
          src={SevaLogo}
          width={61}
          height={31}
          alt="Logo SEVA Footer"
          className={styles.sevaLogo}
          loading="lazy"
        />
        <span className={styles.footerText}>
          SEVA - Platform yang berada di bawah Astra Financial yang menyediakan
          layanan pembiayaan mobil baru dengan didukung oleh perusahaan
          pembiayaan dan dealer resmi dari Astra Group
        </span>
        <div className={styles.linkedTextWrapper}>
          <span className={styles.gap}>
            <Link
              href={urls.about}
              onClick={() => {
                trackCountlyFooter(urls.about)
              }}
            >
              Tentang Kami
            </Link>
            <Link
              href={urls.termsAndConditionsSeva}
              onClick={() => trackCountlyFooter(urls.termsAndConditionsSeva)}
            >
              Syarat & Ketentuan
            </Link>
          </span>
          <span className={styles.gap}>
            <Link
              href={urls.privacyPolicySeva}
              onClick={() => trackCountlyFooter(urls.privacyPolicySeva)}
            >
              Kebijakan Privasi
            </Link>
            <Link
              href={urls.contactUs}
              onClick={() => trackCountlyFooter(urls.contactUs)}
            >
              Hubungi Kami
            </Link>
          </span>
        </div>
        <div className={styles.socialWrapper}>
          <a
            href={urls.instagram}
            onClick={() => handleClickMenu('Instagram', urls.instagram)}
            rel="noreferrer noopener"
            target="_blank"
            datatest-id={elementId.Footer.LogoInstagram}
          >
            <IconInstagram
              width={32}
              height={32}
              color={colors.white}
              alt="SEVA Instagram Icon"
            />
          </a>
          <a
            href={urls.twitter}
            onClick={() => handleClickMenu('Twitter', urls.twitter)}
            rel="noreferrer noopener"
            target="_blank"
            datatest-id={elementId.Footer.LogoTwitter}
          >
            <IconTwitterOutlined
              width={32}
              height={32}
              color={colors.white}
              alt="SEVA Twitter Icon"
            />
          </a>
          <a
            href={urls.facebook}
            onClick={() => handleClickMenu('Facebook', urls.facebook)}
            rel="noreferrer noopener"
            target="_blank"
            datatest-id={elementId.Footer.LogoFacebook}
          >
            <Image
              src={FacebookLogo}
              width={25}
              height={25}
              alt="SEVA Facebook Icon"
            />
          </a>
        </div>
        <div className={styles.isoWrapper}>
          <Image
            src={ISOIcon}
            width={29}
            height={29}
            alt="CBQA ISO 27001"
            datatest-id={elementId.Footer.LogoISO}
            loading="lazy"
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
