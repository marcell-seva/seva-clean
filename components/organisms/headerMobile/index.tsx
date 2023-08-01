/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react'
import styles from 'styles/components/organisms/headerMobile.module.scss'
import LogoPrimary from '/public/revamp/icon/logo-primary.webp'
import clsx from 'clsx'
import {
  IconHamburger,
  IconLocationLine,
  IconSearch,
} from 'components/atoms/icons'
import Image from 'next/image'
import { Overlay } from 'components/atoms'
import elementId from 'utils/helpers/trackerId'
import getCurrentEnvironment from 'utils/handler/getCurrentEnvironment'
import { sendAmplitudeData } from 'services/amplitude'
import { AmplitudeEventName } from 'services/amplitude/types'
import SidebarMobile from '../sidebarMobile'
import { useSearchModal } from 'components/molecules'
import { useRouter } from 'next/router'
import { WebAnnouncementBox } from '../webAnnouncementBox'
import Link from 'next/link'

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

const headerMobile = ({
  startScroll,
  isActive = false,
  setIsActive,
  emitClickCityIcon,
  setShowAnnouncementBox,
  isShowAnnouncementBox = false,
  style,
}: HeaderMobileProps): JSX.Element => {
  const { showModal: showSearchModal, SearchModal } = useSearchModal()
  const enableAnnouncementBoxAleph =
    getCurrentEnvironment.featureToggles.enableAnnouncementBoxAleph

  const location = useRouter()

  const handleClickCityIcon = () => {
    if (!isActive) {
      sendAmplitudeData(AmplitudeEventName.WEB_CITYSELECTOR_OPEN, {
        Page_Origination_URL: window.location.href,
      })
      emitClickCityIcon()
    }
  }

  const handleSearch = () => {
    if (!isActive) {
      showSearchModal()
      sendAmplitudeData(AmplitudeEventName.WEB_SEARCHBAR_OPEN, {
        Page_Origination_URL: window.location.href,
      })
    }
  }

  const handleToggleBurgerMenu = () => {
    if (!isActive) {
      sendAmplitudeData(AmplitudeEventName.WEB_BURGER_MENU_OPEN, {
        Page_Origination_URL: window.location.href,
      })
    }
    setIsActive(() => !isActive)
  }

  const handleLogoClick = () => {
    sendAmplitudeData(AmplitudeEventName.WEB_SEVALOGO_CLICK, {
      Page_Origination_URL: window.location.href,
    })
  }

  const { asPath } = useRouter()
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
            enableAnnouncementBoxAleph && isShowAnnouncementBox,
          [styles.shadow]: style?.withBoxShadow,
          [styles.homepage]: location.pathname === '/' && !isActive,
        })}
      >
        <div className={styles.wrapperAnnouncementBox}>
          {asPath !== '/' && enableAnnouncementBoxAleph && (
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
            <Link href={'/'} onClick={handleLogoClick}>
              <Image
                src={LogoPrimary}
                height={30}
                alt="seva"
                data-testid={elementId.Homepage.GlobalHeader.IconLogoSeva}
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
        <SearchModal />
      </header>
      <Overlay isShow={isActive} onClick={() => setIsActive(false)} />
    </>
  )
}

export default headerMobile
