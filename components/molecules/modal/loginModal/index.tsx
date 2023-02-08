import React from 'react'
import styles from '../../../../styles/LoginModal.module.css'
import modal from '../../../../assets/svg/modal.svg'
import Image from 'next/image'
import { IconCross } from '../../../atoms'

export default function LoginModal({ onCloseModal }: any) {
  const loginUrl = 'https://www.seva.id/masuk-akun'
  return (
    <div className={styles.bgWrapper}>
      <div className={styles.wrapper}>
        <Image
          src={modal}
          width={320}
          height={388}
          priority
          alt="seva-modal-mobile"
          className={styles.bgImage}
        />
        <div className={styles.content}>
          <div className={styles.closeModal}>
            <div onClick={onCloseModal}>
              <IconCross width={24} height={24} color="#FFFFFF" />
            </div>
          </div>
          <div className={styles.detail}>
            <p className={styles.text}>
              Masuk dengan akunmu untuk lanjut ke tahap berikutnya
            </p>
            <a href={loginUrl} className={styles.link}>
              Masuk
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
