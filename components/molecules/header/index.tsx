import React, { useContext, useState } from 'react'
import styles from 'styles/Header.module.css'
import { useIsMobile } from 'utils'
import { Menu } from 'utils/types'
import TopBarDesktop from './components/topBarDekstop'
import TopBarMobile from './components/topBarMobile'
import NavBarDesktop from './components/navBarDesktop'

type TypeHeader = {
  dataMenu: Array<Menu>
  onOpenModalOTR: (e: React.MouseEvent<HTMLDivElement>) => void
  onSearchClick: () => void
}

const Header: React.FC<TypeHeader> = ({
  dataMenu,
  onOpenModalOTR,
  onSearchClick,
}): JSX.Element => {
  const isMobile = useIsMobile()

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {isMobile ? (
          <TopBarMobile data={dataMenu} onSearchClick={onSearchClick} />
        ) : (
          <TopBarDesktop />
        )}
      </div>
      <NavBarDesktop data={dataMenu} onOpenModalOTR={onOpenModalOTR} />
    </div>
  )
}

export default Header
