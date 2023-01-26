import React from 'react'
import styles from '../../../styles/ContactUs.module.css'
import FlagIndonesia from '../../../assets/images/flagIndonesia.png'
import Image from 'next/image'

export default function ContactUs() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <h2 className={styles.titleText}>Ngobrol langsung dengan agen kami</h2>
        <p className={styles.descText}>
          Tulis rincian kontakmu supaya agen kami bisa segera menghubungi kamu.
        </p>
        <div className={styles.form}>
          <div className={styles.wrapperInput}>
            <input
              type="text"
              className={styles.input}
              placeholder="Nama Lengkap"
            ></input>
          </div>
          <div className={styles.wrapperInputPhone}>
            <div className={styles.phoneDetail}>
              <Image
                src={FlagIndonesia}
                width={16}
                height={16}
                alt="indonesia-flag"
              />
              <p className={styles.labelRegion}>+62</p>
              <p className={styles.separator}>|</p>
            </div>
            <input
              type="text"
              className={styles.input}
              placeholder="Contoh : 0895401011469"
            ></input>
          </div>
          <label className={styles.agreementMobile}>
            <input type="checkbox" name="checkbox" />
            <p className={styles.agreementText}>
              Saya memilih untuk dihubungi via WhatsApp
            </p>
          </label>
          <button className={styles.button}>Kirim Rincian</button>
        </div>
        <label className={styles.agreementDesktop}>
          <input type="checkbox" name="checkbox" />
          <p className={styles.agreementText}>
            Saya memilih untuk dihubungi via WhatsApp
          </p>
        </label>
      </div>
    </div>
  )
}
