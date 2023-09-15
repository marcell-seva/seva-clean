import React from 'react'
import styles from 'styles/components/organisms/loginModalMultiKK.module.scss'
import { Button, Gap, Modal } from 'components/atoms'
import { LoginSevaUrl } from 'utils/helpers/routes'
import { useRouter } from 'next/router'
import { ButtonSize, ButtonVersion } from 'components/atoms/button'
import Image from 'next/image'

const IlustrationLoginModal =
  '/revamp/illustration/ilustration-login-modal.webp'

interface PropsLoginModalMultiKK {
  onCancel: () => void
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
          <Image
            src={IlustrationLoginModal}
            width={135}
            height={135}
            className={styles.supergraphicSmall}
            alt="illustration login modal"
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
