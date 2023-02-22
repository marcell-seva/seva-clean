import Image from 'next/image'
import React from 'react'
import styles from '../../../styles/Refinancing.module.css'
import circle from '../../../assets/images/refinancing/circle.webp'
import model from '../../../assets/images/refinancing/model.webp'
import Link from 'next/link'

const Refinancing: React.FC = (): JSX.Element => {
  const headerText: string = 'Butuh Dana Cepat?'
  const descText: string =
    'SEVA menyediakan fasilitas dana pinjaman dengan jaminan BPKB mobil'
  const buttonText: string = 'Ajukan Pinjaman'

  return (
    <div className={styles.wrapper}>
      <Link href="https://www.seva.id/fasilitas-dana">
        <div className={styles.fgLayer}>
          <div className={styles.info}>
            <p className={styles.headerText}>{headerText}</p>
            <p className={styles.descText}>{descText}</p>
            <button className={styles.button}>{buttonText}</button>
          </div>
          <div className={styles.wrapperBgImage}>
            <Image
              width={360}
              height={165}
              alt="seva-bg-fund-services"
              src={circle}
              unoptimized
              className={styles.circleImage}
            />
          </div>
          <div className={styles.wrapperImage}>
            <Image
              width={189}
              height={165}
              alt="seva-fund-services-model"
              src={model}
              className={styles.modelImage}
              unoptimized
            />
          </div>
        </div>
      </Link>
    </div>
  )
}

export default Refinancing
