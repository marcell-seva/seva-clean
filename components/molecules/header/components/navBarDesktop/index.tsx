import React, { useContext } from 'react'
import styles from 'styles/saas/components/molecules/Header.module.scss'
import { PropsListNavBarMenu, Menu } from 'utils/types'
import {
  IconChevrongRight,
  IconLocation,
  IconTriangleDown,
} from 'components/atoms'
import {
  LocationContext,
  LocationContextType,
  AuthContext,
  AuthContextType,
} from 'services/context'

type TypeMenu = {
  item: Menu
}

const NavBarDesktop = ({ data, onOpenModalOTR }: any): JSX.Element => {
  const redirectRootPath: string = 'https://seva.id'
  const { location, isInit } = useContext(
    LocationContext,
  ) as LocationContextType
  const { saveFilterData } = useContext(AuthContext) as AuthContextType
  const removeUnnecessaryDataFilter = (payload: string): void => {
    const brand = payload === 'Semua Merek' ? [] : [payload]
    const newDataFilter = {
      bodyType: [],
      brand: brand,
      carModel: '',
      tenure: 5,
      downPaymentAmount: '',
      monthlyIncome: '',
      age: '',
      sortBy: 'highToLow',
    }

    saveFilterData(newDataFilter)
  }

  const ListNavBarMenuSingle: React.FC<PropsListNavBarMenu> = ({
    menuName,
    url,
  }): JSX.Element => (
    <li className={styles.navBar}>
      <a href={url} className={styles.headerText}>
        {menuName}
      </a>
    </li>
  )

  const ListNavBarMenu: React.FC<TypeMenu> = ({ item }): JSX.Element => (
    <li className={styles.navBar}>
      <p className={styles.headerText}>{item.menuName}</p>
      <IconTriangleDown width={8} height={4} />
      <ul className={styles.mainDropDown}>
        {item.subMenu.map((listMain: any, key: number) => {
          if (listMain.menuName === 'Tipe Bodi') return
          if (listMain.subMenu.length > 0) {
            return <DropDownWithChild item={listMain} key={key} />
          } else return <DropDownWithOutChild item={listMain} key={key} />
        })}
      </ul>
    </li>
  )

  const DropDownWithChild: React.FC<TypeMenu> = ({ item }): JSX.Element => {
    return (
      <li className={styles.listMain}>
        <div className={styles.wrapperListMenu}>
          <p className={styles.listMainText}>{item.menuName}</p>
          <div className={styles.bundleIconRight}>
            <IconChevrongRight width={16} height={16} />
          </div>
        </div>
        <ul className={styles.subDropDown}>
          {item.subMenu.map((listSubMenu: any, key: number) => (
            <li key={key} className={styles.listSubMain}>
              <a
                onClick={() =>
                  removeUnnecessaryDataFilter(listSubMenu.menuName)
                }
                href={redirectRootPath + listSubMenu.menuUrl}
                className={styles.listSubMainText}
              >
                {listSubMenu.menuName}
              </a>
            </li>
          ))}
        </ul>
      </li>
    )
  }

  const DropDownWithOutChild: React.FC<TypeMenu> = ({ item }): JSX.Element => {
    return (
      <li className={styles.listMain}>
        <a href={`https://${item.menuUrl}`} className={styles.wrapperListMenu}>
          <p className={styles.listMainText}>{item.menuName}</p>
        </a>
      </li>
    )
  }

  return (
    <div className={styles.wrapperSubMain}>
      <div className={styles.subMain}>
        <ul className={styles.wrapperMain}>
          {data.map((item: any, key: number) => {
            if (key === 1) {
              return (
                <ListNavBarMenuSingle
                  key={key}
                  menuName="Promo"
                  url="https://www.seva.id/info/promo/"
                />
              )
            }
            if (item.menuName === 'Tentang SEVA')
              return (
                <ListNavBarMenuSingle
                  key={key}
                  menuName="Tentang SEVA"
                  url={`https://${item.menuUrl}`}
                />
              )
            if (
              item.menuName !== 'Fasilitas Dana' &&
              item.menuName !== 'Teman SEVA' &&
              item.menuName !== 'Tentang SEVA'
            ) {
              return <ListNavBarMenu key={key} item={item} />
            }
          })}
        </ul>
        <div onClick={onOpenModalOTR} className={styles.modalOTR}>
          <IconLocation width={16} height={16} color="#002373" />
          <div className={styles.selectLocation}>
            <p className={styles.labelText}>
              Beli Mobil di
              <span className={styles.iconTriangleDown}>
                <IconTriangleDown width={8} height={8} />
              </span>
            </p>
            <p className={styles.cityText}>
              {isInit ? 'Pilih Kota ' : location.cityName}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NavBarDesktop
