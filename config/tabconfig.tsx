import { TabItemData } from '_revamp/utils/types/props'
import LogoToyota from '_revamp/assets/icon/logo-toyota.webp'
import LogoDaihatsu from '_revamp/assets/icon/logo-daihatsu.webp'
import Isuzu from '_revamp/assets/icon/logo-isuzu.webp'
import LogoBmw from '_revamp/assets/icon/logo-bmw.webp'
import Peugeot from '_revamp/assets/icon/logo-peugeot.webp'
import React from 'react'
import styles from '_revamp/styles/organism/lpCarRecommendations.module.scss'

export const brandList: TabItemData[] = [
  {
    label: 'Semua',
    value: '',
  },
  {
    label: (
      <div className={styles.tabBrand}>
        <img src={LogoToyota} alt="Toyota" style={{ width: 21, height: 18 }} />
        Toyota
      </div>
    ),
    value: 'Toyota',
  },
  {
    label: (
      <div className={styles.tabBrand}>
        <img
          src={LogoDaihatsu}
          alt="Daihatsu"
          style={{ width: 21.6, height: 15 }}
        />
        Daihatsu
      </div>
    ),
    value: 'Daihatsu',
  },
  {
    label: (
      <div className={styles.tabBrand}>
        <img src={Isuzu} alt="Isuzu" style={{ width: 21.6, height: 7.2 }} />
        Isuzu
      </div>
    ),
    value: 'Isuzu',
  },
  {
    label: (
      <div className={styles.tabBrand}>
        <img src={LogoBmw} alt="BMW" style={{ width: 19.2, height: 19.2 }} />
        BMW
      </div>
    ),
    value: 'BMW',
  },
  {
    label: (
      <div className={styles.tabBrand}>
        <img
          src={Peugeot}
          alt="Peugeot"
          style={{ width: 17.49, height: 19.2 }}
        />
        Peugeot
      </div>
    ),
    value: 'Peugeot',
  },
]
