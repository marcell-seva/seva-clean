import axios from 'axios'
import React from 'react'
import { TemanSevaDashboardUrl, TemanSevaOnboardingUrl } from 'routes/routes'
import { temanSevaUrlPath } from 'services/temanseva'
// import { trackBurgerMenuClick } from 'helpers/amplitude/seva20Tracking'
import { getToken } from 'utils/api'
import { MenuItem } from 'components/atoms'
import styles from '../../../styles/saas/components/molecules/menuList.module.scss'
import { saveLocalStorage } from 'utils/localstorageUtils'
import { useRouter } from 'next/router'
import { IconAccount, IconHistory, IconWishlist } from 'components/atoms/icon'
import { LocalStorageKey } from 'utils/enum'
import { MobileWebTopMenuType, CustomerInfoSeva } from 'utils/types/utils'
import { trackBurgerMenuClick } from 'helpers/amplitude/seva20Tracking'

type MenuListProps = {
  menuList?: MobileWebTopMenuType[]
  customerDetail?: CustomerInfoSeva
}

export const MenuList: React.FC<MenuListProps> = ({
  menuList,
  customerDetail,
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
      const temanSeva = await axios.post(temanSevaUrlPath.isTemanSeva, {
        phoneNumber: customerDetail.phoneNumber,
      })
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
      router.push(TemanSevaDashboardUrl)
    } else {
      router.push(TemanSevaOnboardingUrl)
    }
  }

  const handleClickMenu = (menuUrl: string, menuName: string) => {
    trackBurgerMenuClick({
      Page_Origination_URL: window.location.href,
      Menu: menuName,
    })

    if (menuName === 'Teman SEVA') {
      handleTemanSeva()
    } else {
      if (menuUrl === '/akun/profil') {
        saveLocalStorage(
          LocalStorageKey.PageBeforeProfile,
          window.location.pathname,
        )
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
                menuItem.subMenu.map((sub: any, idx: number) => {
                  if (sub.subMenu.length > 0) {
                    return <MenuItem key={idx} item={sub} />
                  } else {
                    const icon = renderIcon(sub.menuName)
                    return (
                      <div
                        key={idx}
                        className={styles.parentMenu}
                        onClick={() =>
                          handleClickMenu(sub.menuUrl as string, sub.menuName)
                        }
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
