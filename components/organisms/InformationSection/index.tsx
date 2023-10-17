import Image from 'next/image'
import styles from 'styles/components/organisms/homepageAdaOTOdiSEVA.module.scss'
import { Button, IconCross } from 'components/atoms'
import supergraphic from '/public/revamp/illustration/supergraphic-crop.webp'
import logoOTO from '/public/revamp/images/logo/logo-oto.webp'
import logoSEVA from '/public/revamp/images/logo/seva-header.png'

const InformationSection: React.FC<any> = (): JSX.Element => {
  const label =
    'Kerjasama kami untuk lorem ipsum dolor sit amet sit amet dolor sit amet blabla lorem ipsum'
  return (
    <div className={styles.information}>
      <Image
        src={supergraphic}
        alt="seva x oto supergraphic "
        className={styles.supergraphicInformation}
      />
      <div className={styles.informationFront}>
        <div className={styles.bundleLogoInformation}>
          <Image
            src={logoSEVA}
            alt="seva main logo"
            className={styles.logoSeva}
          />
          <IconCross width={12} height={12} color="#05256E" />
          <Image src={logoOTO} alt="seva x oto" className={styles.logoOto} />
        </div>
        <h3 className={styles.informationText}>{label}</h3>
      </div>
    </div>
  )
}

export default InformationSection
