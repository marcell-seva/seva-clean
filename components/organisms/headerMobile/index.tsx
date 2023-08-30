import React, { useState } from 'react'
import styles from '../../../styles/components/organisms/headerMobile.module.scss'
import {
  IconHamburger,
  IconSearch,
  IconLocationLine,
  Overlay,
} from 'components/atoms'
import { SidebarMobile } from 'components/organisms'
// import { useSearchModal } from 'components/molecules/searchModal'
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
import { WebAnnouncementBox } from 'components/organisms'
import { CountlyEventNames } from 'helpers/countly/eventNames'
import {
  trackEventCountly,
  valueForUserTypeProperty,
  valueMenuTabCategory,
} from 'helpers/countly/countly'
import { getPageName } from 'utils/pageName'
import { SearchModal } from 'components/molecules/searchModal'

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
      trackEventCountly(CountlyEventNames.WEB_CITY_SELECTOR_OPEN_CLICK, {
        PAGE_ORIGINATION:
          getPageName() === 'PLP'
            ? getPageName()
            : 'PDP - ' + valueMenuTabCategory(),
        USER_TYPE: valueForUserTypeProperty(),
        SOURCE_BUTTON: 'Location Icon',
      })
      emitClickCityIcon()
    }
  }

  const handleSearch = () => {
    if (!isActive) {
      trackEventCountly(CountlyEventNames.WEB_CAR_SEARCH_ICON_CLICK, {
        PAGE_ORIGINATION: getPageName(),
      })
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
    trackEventCountly(CountlyEventNames.WEB_SEVA_LOGO_CLICK, {
      PAGE_ORIGINATION: getPageName(),
      USER_TYPE: valueForUserTypeProperty(),
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
          [styles.showAAnnouncementBox]: isShowAnnouncementBox,
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
              <img
                src={LogoPrimary}
                height={30}
                width="100%"
                alt="seva"
                className={styles.logoImg}
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
        <SearchModal
          isOpen={isOpenSearchModal}
          handleCloseModal={() => setIsOpenSearchModal(false)}
        />
      </header>
      <Overlay isShow={isActive} onClick={() => setIsActive(false)} />
    </>
  )
}
