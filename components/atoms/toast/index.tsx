import React from 'react'
import styles from 'styles/components/atoms/toast.module.scss'
import { Modal } from 'antd'
import { IconChecked, IconWarningCircle } from '../icon'
import { colors } from 'utils/helpers/style/colors'
import { PropsToast } from 'utils/types/props'

export const Toast: React.FC<PropsToast> = ({
  text,
  closeOnToastClick = false,
  onCancel,
  width,
  typeToast,
  ...props
}): JSX.Element => {
  return (
    <Modal
      closable={false}
      centered
      className="toast-custom-modal"
      footer={null}
      width={width}
      maskStyle={{ background: 'rgba(19, 19, 27, 0.5)' }}
      {...props}
    >
      <div className={styles.bgModal} />
      <button
        onClick={(e) => closeOnToastClick && onCancel && onCancel(e)}
        className={styles.content}
      >
        {typeToast === 'error' ? (
          <IconWarningCircle
            width={32}
            height={32}
            color={colors.secondaryBrickRed}
          />
        ) : (
          <div className={styles.icon}>
            <IconChecked width={32} height={32} color="#1AA674" />
          </div>
        )}
        <p className={styles.textToast}>{text}</p>
      </button>
    </Modal>
  )
}
