import LogoToyota from '/assets/icon/logo-toyota.webp'
import LogoDaihatsu from '/assets/icon/logo-daihatsu.webp'
import Isuzu from '/assets/icon/logo-isuzu.webp'
import LogoBmw from '/assets/icon/logo-bmw.webp'
import Peugeot from '/assets/icon/logo-peugeot.webp'
import Image from 'next/image'
import styles from '/styles/components/organisms/lpCarRecommendations.module.scss'

interface TabItemData {
  label: string | JSX.Element
  value: string
  testid?: string
}
const brandList: TabItemData[] = [
  {
    label: 'Semua',
    value: '',
  },
  {
    label: (
      <div className={styles.tabBrand}>
        <Image
          src={LogoToyota}
          alt="Toyota"
          style={{ width: 21, height: 18 }}
        />
        Toyota
      </div>
    ),
    value: 'Toyota',
  },
  {
    label: (
      <div className={styles.tabBrand}>
        <Image
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
        <Image src={Isuzu} alt="Isuzu" style={{ width: 21.6, height: 7.2 }} />
        Isuzu
      </div>
    ),
    value: 'Isuzu',
  },
  {
    label: (
      <div className={styles.tabBrand}>
        <Image src={LogoBmw} alt="BMW" style={{ width: 19.2, height: 19.2 }} />
        BMW
      </div>
    ),
    value: 'BMW',
  },
  {
    label: (
      <div className={styles.tabBrand}>
        <Image
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

export default brandList
