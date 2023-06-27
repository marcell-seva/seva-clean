import React from 'react'
import styles from '../../../../styles/saas/components/molecules/LoginModal.module.scss'
import modal from '/assets/svg/modal.svg'
import Image from 'next/image'
import { IconCross } from 'components/atoms'

interface PropsLoginModal {
  onCloseModal: (e: React.MouseEvent<HTMLDivElement>) => void
}
const LoginModal: React.FC<PropsLoginModal> = ({
  onCloseModal,
}): JSX.Element => {
  const loginUrl: string = 'https://www.seva.id/masuk-akun'
  const infoText: string =
    'Masuk dengan akunmu untuk lanjut ke tahap berikutnya'
  const redirectLoginText: string = 'Masuk'

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
            <p className={styles.text}>{infoText}</p>
            <a href={loginUrl} className={styles.link}>
              {redirectLoginText}
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
export default LoginModal
