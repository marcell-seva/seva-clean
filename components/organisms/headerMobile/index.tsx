import React, { useState } from 'react'
import styles from '../../../styles/components/organisms/headerMobile.module.scss'
import { IconHamburger, IconSearch, IconLocationLine } from 'components/atoms'
import { rootUrl } from 'utils/helpers/routes'
import clsx from 'clsx'
import {
  trackCitySelectorOpen,
  trackOpenBurgerMenu,
  trackSearchbarOpen,
  trackSevaLogoClick,
} from 'helpers/amplitude/seva20Tracking'
import getCurrentEnvironment from 'helpers/environments'
import elementId from 'helpers/elementIds'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'next/image'
import dynamic from 'next/dynamic'

const Overlay = dynamic(() =>
  import('components/atoms').then((mod) => mod.Overlay),
)
const SearchModal = dynamic(() =>
  import('components/molecules/searchModal').then((mod) => mod.SearchModal),
)
const WebAnnouncementBox = dynamic(() =>
  import('components/organisms').then((mod) => mod.WebAnnouncementBox),
)
const SidebarMobile = dynamic(() =>
  import('components/organisms').then((mod) => mod.SidebarMobile),
)
const LogoPrimary = '/revamp/icon/logo-primary.webp'

type HeaderMobileProps = {
  startScroll?: boolean
  isActive: boolean
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>
  emitClickCityIcon: () => void
  setShowAnnouncementBox?: (value: boolean) => void
  isShowAnnouncementBox?: boolean | null
  style?: {
    withBoxShadow?: boolean
    position?: 'fixed' | 'sticky'
  }
}

export const HeaderMobile = ({
  startScroll,
  isActive = false,
  setIsActive,
  emitClickCityIcon,
  setShowAnnouncementBox,
  isShowAnnouncementBox = false,
  style,
}: HeaderMobileProps): JSX.Element => {
  const enableAnnouncementBoxAleph =
    getCurrentEnvironment.featureToggles.enableAnnouncementBoxAleph
  const [isOpenSearchModal, setIsOpenSearchModal] = useState(false)

  const router = useRouter()

  const handleClickCityIcon = () => {
    if (!isActive) {
      trackCitySelectorOpen({
        Page_Origination_URL: window.location.href,
      })
      emitClickCityIcon()
    }
  }

  const handleSearch = () => {
    if (!isActive) {
      setIsOpenSearchModal(true)
      trackSearchbarOpen({
        Page_Origination_URL: window.location.href,
      })
    }
  }

  const handleToggleBurgerMenu = () => {
    if (!isActive) {
      trackOpenBurgerMenu({
        Page_Origination_URL: window.location.href,
      })
    }
    setIsActive(() => !isActive)
  }

  const handleLogoClick = () => {
    trackSevaLogoClick({
      Page_Origination_URL: window.location.href,
    })
  }

  return (
    <>
      <header
        style={style?.position ? { position: style.position } : {}}
        className={clsx({
          [styles.wrapper]: true,
          [styles.stickyWrapper]: style?.position ? true : false,
          [styles.hideHeader]: startScroll && !isActive,
          [styles.showHeader]: !startScroll,
          [styles.isActive]: isActive,
          [styles.showAAnnouncementBox]:
            isShowAnnouncementBox && enableAnnouncementBoxAleph,
          [styles.shadow]: style?.withBoxShadow,
          [styles.homepage]: router.pathname === '/' && !isActive,
        })}
      >
        <div className={styles.wrapperAnnouncementBox}>
          {router.pathname !== '/' && enableAnnouncementBoxAleph && (
            <WebAnnouncementBox
              onCloseAnnouncementBox={setShowAnnouncementBox}
            />
          )}
          <div className={styles.container}>
            <div data-testid={elementId.Homepage.GlobalHeader.HamburgerMenu}>
              <IconHamburger
                width={24}
                height={24}
                onClick={handleToggleBurgerMenu}
              />
            </div>
            <Link href={rootUrl} onClick={handleLogoClick}>
              <Image
                src={LogoPrimary}
                height={30}
                width={50}
                alt="seva"
                className={styles.logoImg}
                data-testid={elementId.Homepage.GlobalHeader.IconLogoSeva}
                priority={true}
              />
            </Link>
            <SidebarMobile
              showSidebar={isActive}
              isShowAnnouncementBox={isShowAnnouncementBox}
            />
            <div
              className={styles.right}
              data-testid={elementId.Homepage.GlobalHeader.IconSearch}
            >
              <IconSearch width={24} height={24} onClick={handleSearch} />
              <div
                onClick={handleClickCityIcon}
                data-testid={elementId.Homepage.GlobalHeader.IconCitySelector}
              >
                <IconLocationLine width={24} height={24} />
              </div>
            </div>
          </div>
        </div>
        <SearchModal
          isOpen={isOpenSearchModal}
          handleCloseModal={() => setIsOpenSearchModal(false)}
        />
      </header>
      <Overlay isShow={isActive} onClick={() => setIsActive(false)} />
    </>
  )
}
