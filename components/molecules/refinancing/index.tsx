import Image from 'next/image'
import React from 'react'
import styles from '../../../styles/Refinancing.module.css'
import circle from '../../../assets/images/refinancing/circle.webp'
import model from '../../../assets/images/refinancing/model.webp'
import Link from 'next/link'

export default function Refinancing() {
  return (
    <div className={styles.wrapper}>
      <Link href="https://www.seva.id/fasilitas-dana">
        <div className={styles.fgLayer}>
          <div className={styles.info}>
            <p className={styles.headerText}>Butuh Dana Cepat?</p>
            <p className={styles.descText}>
              SEVA menyediakan fasilitas dana pinjaman dengan jaminan BPKB mobil
            </p>
            <button className={styles.button}>Ajukan Pinjaman</button>
          </div>
          <div className={styles.wrapperBgImage}>
            <Image
              width={189}
              height={162}
              alt="seva-bg-fund-services"
              src={circle}
              unoptimized
              className={styles.circleImage}
            />
          </div>
          <div className={styles.wrapperImage}>
            <Image
              width={189}
              height={162}
              alt="seva-fund-services"
              src={model}
              unoptimized
            />
          </div>
        </div>
      </Link>
    </div>
  )
}