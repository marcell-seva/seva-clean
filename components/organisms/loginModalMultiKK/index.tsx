import React from 'react'
import styles from 'styles/components/organisms/loginModalMultiKK.module.scss'
import { Button, Gap, Modal } from 'components/atoms'
import { ButtonSize, ButtonVersion } from 'utils/enum'
import { LoginSevaUrl } from 'utils/helpers/routes'
import { useRouter } from 'next/router'

const IlustrationLoginModal =
  '/revamp/illustration/ilustration-login-modal.webp'

interface PropsLoginModalMultiKK {
  onCancel: () => void
}

export interface CityOtrOption {
  cityName: string
  cityCode: string
  province: string
  id?: string
}

export const LoginModalMultiKK: React.FC<PropsLoginModalMultiKK> = ({
  onCancel,
}: PropsLoginModalMultiKK) => {
  const router = useRouter()
  const onClickCta = () => {
    router.push(LoginSevaUrl)
  }
  const onClose = () => {
    onCancel && onCancel()
  }

  return (
    <Modal open onCancel={onClose} isFull>
      <div className={styles.wrapper}>
        <div className={styles.wrapperImage}>
          <img
            src={IlustrationLoginModal}
            width={135}
            height={135}
            className={styles.supergraphicSmall}
          />
        </div>
        <h2 className={styles.textHeading}>
          Masuk dengan akunmu <br /> untuk lanjut ke tahap berikutnya
        </h2>
        <Gap height={24} />
        <Button
          size={ButtonSize.Big}
          version={ButtonVersion.PrimaryDarkBlue}
          onClick={onClickCta}
        >
          Masuk
        </Button>
      </div>
    </Modal>
  )
}
