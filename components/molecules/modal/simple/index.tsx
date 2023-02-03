import React from 'react'
import styles from '../../../../styles/Simple.module.css'

interface Props {
  onCloseModal: React.ButtonHTMLAttributes<HTMLButtonElement>['onClick']
}

export default function Simple({ onCloseModal }: Props) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <p className={styles.titleText}>Terima kasih 🙌</p>
        <div>
          <p className={styles.descText}>
            Agen kami akan segera menghubungi kamu di nomor telpon yang kamu
            sediakan
          </p>
          <button onClick={onCloseModal} className={styles.button}>
            Ok
          </button>
        </div>
      </div>
    </div>
  )
}
