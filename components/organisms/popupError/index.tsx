import React from 'react'
import styles from 'styles/components/organisms/popupError.module.scss'
import type { ModalProps } from 'antd'
import elementId from 'helpers/elementIds'
import { Button, Modal } from 'components/atoms'
import { ButtonSize, ButtonVersion } from 'components/atoms/button'
import Image from 'next/image'

const ErrorIllustration = '/revamp/illustration/error.webp'

interface PopupErrorProps extends ModalProps {
  title: string
  subTitle: string
  cancelText: string
  discardButton?: {
    text: string
    action: () => void
  }
  onCancelText?: (e: React.MouseEvent<HTMLButtonElement>) => void
}

const PopupError = ({
  title,
  subTitle,
  discardButton,
  cancelText,
  width = 343,
  onCancel,
  onCancelText,
  open,
  ...props
}: PopupErrorProps) => {
  return (
    <Modal
      width={width}
      open={open}
      onCancel={onCancel}
      modalRender={(modal) => <div className={styles.content}>{modal}</div>}
      {...props}
    >
      <div className={styles.modal__wrapper}>
        <Image src={ErrorIllustration} alt="Error Modal Illustration" />
        <div className={styles.modal__wording}>
          <div className={styles.title_section}>
            <div>{title}</div>
            <span>{subTitle} </span>
          </div>
          <div className={styles.btn_section}>
            {onCancelText ? (
              <Button
                onClick={onCancelText}
                version={ButtonVersion.PrimaryDarkBlue}
                size={ButtonSize.Big}
                data-testid={
                  elementId.Button + cancelText.replace(' ', '-').toLowerCase()
                }
              >
                {cancelText}
              </Button>
            ) : (
              <Button
                onClick={onCancel}
                version={ButtonVersion.PrimaryDarkBlue}
                size={ButtonSize.Big}
                data-testid={
                  elementId.Button + cancelText.replace(' ', '-').toLowerCase()
                }
              >
                {cancelText}
              </Button>
            )}
            {discardButton ? (
              <button
                onClick={discardButton.action}
                className={styles.button__link}
                data-testid={elementId.Profil.Button.BatalkanPerubahan}
              >
                {discardButton.text}
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default PopupError
