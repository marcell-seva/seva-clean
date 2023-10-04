import axios from 'axios'
import React from 'react'
import styles from 'styles/components/molecules/menuList.module.scss'
import { sendAmplitudeData } from 'services/amplitude'
import { AmplitudeEventName } from 'services/amplitude/types'
import { saveLocalStorage } from 'utils/handler/localStorage'
import urls from 'utils/helpers/url'
import { MenuItem } from 'components/atoms'
import { useRouter } from 'next/router'
import { getToken } from 'utils/handler/auth'
import { IconAccount, IconHistory, IconWishlist } from 'components/atoms/icon'
import { MobileWebTopMenuType, CustomerInfoSeva } from 'utils/types/utils'
import { trackBurgerMenuClick } from 'helpers/amplitude/seva20Tracking'
import { LocalStorageKey, SessionStorageKey } from 'utils/enum'
import { trackEventCountly } from 'helpers/countly/countly'
import { CountlyEventNames } from 'helpers/countly/eventNames'
import { PreviousButton, navigateToPLP } from 'utils/navigate'
import { getPageName } from 'utils/pageName'
import { saveSessionStorage } from 'utils/handler/sessionStorage'

type MenuListProps = {
  menuList?: MobileWebTopMenuType[]
  customerDetail?: CustomerInfoSeva
  isOTO?: boolean
  pageOrigination?: string
}

export const MenuList: React.FC<MenuListProps> = ({
  menuList,
  customerDetail,
  isOTO = false,
  pageOrigination,
}): JSX.Element => {
  const [isLogin] = React.useState(!!getToken())
  const [isTemanSeva, setIsTemanSeva] = React.useState(false)
  const router = useRouter()

  const renderIcon = (menuName: string) => {
    if (menuName === 'Akun Saya') {
      return <IconAccount height={20} width={20} color="#246ED4" />
    } else if (menuName === 'Wishlist') {
      return <IconHistory height={20} width={20} color="#246ED4" />
    } else if (menuName === 'Riwayat Pengajuan') {
      return <IconWishlist height={20} width={20} color="#246ED4" />
    }

    return null
  }

  const checkTemanSeva = async () => {
    if (customerDetail) {
      const temanSeva = await axios.post(
        `https://teman.prod.seva.id/auth/is-teman-seva`,
        {
          phoneNumber: customerDetail.phoneNumber,
        },
      )
      setIsTemanSeva(temanSeva.data.isTemanSeva)
    }
  }

  React.useEffect(() => {
    if (customerDetail) {
      checkTemanSeva()
    }
  }, [customerDetail])

  const handleTemanSeva = () => {
    if (isTemanSeva) {
      router.push(urls.internalUrls.TemanSevaDashboardUrl)
    } else {
      router.push(urls.internalUrls.TemanSevaOnboardingUrl)
    }
  }

  const handleClickMenu = (menuUrl: string, menuName: string) => {
    sendAmplitudeData(AmplitudeEventName.WEB_BURGER_MENU_CLICK, {
      Page_Origination_URL: window.location.href,
      Menu: menuName,
    })

    if (menuName === 'Teman SEVA') {
      handleTemanSeva()
    } else {
      if (menuUrl === '/akun/profil') {
        //@ts-ignore
        saveLocalStorage(
          LocalStorageKey.PageBeforeProfile,
          String(window.location.pathname),
        )
        trackEventCountly(CountlyEventNames.WEB_HAMBURGER_ACCOUNT_CLICK, {
          PAGE_ORIGINATION: pageOrigination,
          SOURCE_SECTION: 'Bottom',
        })
        if (pageOrigination) {
          saveSessionStorage(
            SessionStorageKey.PageReferrerProfilePage,
            pageOrigination,
          )
        }
      }
      window.location.href = menuUrl
    }
  }

  return (
    <div className={styles.container}>
      {menuList?.map((menuItem) => {
        if (menuItem.menuName === 'Akun' && !isLogin) {
          return null
        } else {
          return (
            <div className={styles.menuContainer} key={menuItem.menuName}>
              {menuItem.menuLevel === 1 && (
                <div className={styles.menuWrapper}>
                  <h2 className={styles.mainMenu}>{menuItem.menuName}</h2>
                </div>
              )}

              {menuItem.subMenu.length > 0 &&
                menuItem.subMenu.map((sub: any, key: any) => {
                  if (sub.subMenu.length > 0) {
                    return <MenuItem key={key} item={sub} isOTO={isOTO} />
                  } else {
                    const icon = renderIcon(sub.menuName)
                    return (
                      <div
                        key={key}
                        className={styles.parentMenu}
                        onClick={() => {
                          if (sub.menuName === 'Akun Saya') {
                            trackEventCountly(
                              CountlyEventNames.WEB_HAMBURGER_ACCOUNT_CLICK,
                              {
                                PAGE_ORIGINATION: getPageName(),
                                SOURCE_SECTION: 'Bottom',
                              },
                            )
                          }
                          handleClickMenu(sub.menuUrl as string, sub.menuName)
                        }}
                      >
                        {icon && (
                          <div className={styles.iconContainer}>{icon}</div>
                        )}
                        <div className={styles.menu}>{sub.menuName}</div>
                      </div>
                    )
                  }
                })}
            </div>
          )
        }
      })}
    </div>
  )
}
