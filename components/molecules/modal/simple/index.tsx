import React from 'react'
import styles from '../../../../styles/saas/components/molecules/Simple.module.scss'

interface PropsModalSimple {
  onCloseModal: (e: React.MouseEvent<HTMLButtonElement>) => void
}

const Simple: React.FC<PropsModalSimple> = ({ onCloseModal }): JSX.Element => {
  const tilteText: string = 'Terima kasih 🙌'
  const infoText: string =
    'Agen kami akan segera menghubungi kamu di nomor telpon yang kamu sediakan'
  const buttonText: string = 'Ok'
  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <p className={styles.titleText}>{tilteText}</p>
        <div>
          <p className={styles.descText}>{infoText}</p>
          <button onClick={onCloseModal} className={styles.button}>
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Simple
