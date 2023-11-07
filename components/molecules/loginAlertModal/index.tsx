import React from 'react'
import styles from 'styles/components/molecules/loginAlertModal.module.scss'
import Modal from 'antd/lib/modal'
import { IconClose } from 'components/atoms'
import { colors } from 'utils/helpers/style/colors'
import elementId from 'utils/helpers/trackerId'
import { LoginSevaUrl } from 'utils/helpers/routes'

type LoginAlertModalType = {
  isOpen: boolean
  onClose: () => void
}

export const LoginAlertModal = ({ isOpen, onClose }: LoginAlertModalType) => {
  return (
    <Modal
      open={isOpen}
      closable={false}
      footer={null}
      className="custom-modal-login-alert"
      width={320}
      centered
    >
      <div className={styles.mobileHeaderWrapper}>
        <div className={styles.header}>
          <div className={styles.closeIconWrapper} onClick={() => onClose()}>
            <IconClose color={colors.white} width={24} height={24} />
          </div>
        </div>
        <div className={styles.content}>
          <span className={styles.title}>
            Masuk dengan akunmu untuk lanjut ke tahap berikutnya
          </span>
          <a
            className={styles.styledButton}
            href={LoginSevaUrl}
            data-testId={elementId.Modal.login}
          >
            Masuk
          </a>
        </div>
      </div>
    </Modal>
  )
}
