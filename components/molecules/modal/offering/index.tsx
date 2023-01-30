import Image from 'next/image'
import React, { useState } from 'react'
import styles from '../../../../styles/Offering.module.css'
import { IconCross } from '../../../atoms'
import FlagIndonesia from '../../../../assets/images/flagIndonesia.png'
export default function Offering() {
  const [name, setName] = useState<string>('')
  const handleChange = (value: string) => {
    setName(value)
  }
  return (
    <div className={styles.modal}>
      <div className={styles.wrapper}>
        <div className={styles.content}>
          <div className={styles.bundleIcon}>
            <IconCross width={24} height={24} />
          </div>
          <h1 className={styles.headerText}>Punya Pertanyaan ?</h1>
          <p className={styles.descText}>
            Tulis rincian kontakmu supaya agen kami bisa segera menghubungi
            kamu.
          </p>
          <input
            type="text"
            value={name}
            className={styles.inputName}
            placeholder="Nama Lengkap"
            onChange={(e) => handleChange(e.target.value)}
          />
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
            />
          </div>
          <label className={styles.agreement}>
            <input type="checkbox" name="checkbox" />
            <p className={styles.agreementText}>
              Saya memilih untuk dihubungi via WhatsApp
            </p>
          </label>
          <button className={styles.button}>Kirim Rincian</button>
        </div>
      </div>
    </div>
  )
}
