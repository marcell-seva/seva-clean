import React from 'react'
import styles from 'styles/components/atoms/menuItem.module.scss'
import { sendAmplitudeData } from 'services/amplitude'
import { AmplitudeEventName } from 'services/amplitude/types'
import { MobileWebTopMenuType } from 'utils/types/props'
import { IconChevronDown } from '../icon'
import { trackEventCountly } from 'helpers/countly/countly'
import { CountlyEventNames } from 'helpers/countly/eventNames'
import { navigateToPLP, PreviousButton } from 'utils/navigate'
import { OTONewCarUrl } from 'utils/helpers/routes'

type MenuItemProps = {
  item?: MobileWebTopMenuType
  isOTO?: boolean
  pageOrigination?: string
}

const MenuItem: React.FC<MenuItemProps> = ({
  item,
  isOTO = false,
  pageOrigination,
}): JSX.Element => {
  const [state, setState] = React.useState(false)

  const handleClickMenu = (menuUrl: string, menuName: string) => {
    if (menuName === 'Mobil Baru') {
      return navigateToPLP(
        PreviousButton.HamburgerMenu,
        {},
        true,
        false,
        isOTO ? OTONewCarUrl : menuUrl,
      )
    }

    sendAmplitudeData(AmplitudeEventName.WEB_BURGER_MENU_CLICK, {
      Page_Origination_URL: window.location.href,
      Menu: menuName,
    })
    window.location.href = menuUrl
  }

  return (
    <>
      <div
        className={styles.parentMenu}
        onClick={() => {
          setState(() => !state)
          if (state) {
            trackEventCountly(CountlyEventNames.WEB_HAMBURGER_MENU_EXPAND, {
              MENU: item?.menuName,
            })
          }
        }}
      >
        <h3 className={`${styles.menu} ${state ? styles.isActive : ''}`}>
          {item?.menuName}
        </h3>
        <IconChevronDown
          height={25}
          width={25}
          color="#13131B"
          className={state ? styles.rotateUp : styles.rotateDown}
        />
      </div>

      <div
        className={`${styles.submenuContainer} ${
          state ? styles.slideDown : styles.slideUp
        }`}
      >
        {item?.subMenu.map((child) => (
          <div
            onClick={() => {
              trackEventCountly(CountlyEventNames.WEB_HAMBURGER_MENU_CLICK, {
                PAGE_ORIGINATION: pageOrigination,
                PAGE_DIRECTION_URL: item?.subMenu[0].menuUrl?.includes('www')
                  ? item?.subMenu[0].menuUrl
                  : window.location.hostname + item?.subMenu[0].menuUrl,
              })
              handleClickMenu(child.menuUrl as string, child.menuName)
            }}
            className={styles.submenu}
            key={child.menuCode}
          >
            {child.menuName}
          </div>
        ))}
      </div>
    </>
  )
}
export default MenuItem
