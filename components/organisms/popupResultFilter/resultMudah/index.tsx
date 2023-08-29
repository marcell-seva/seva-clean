import { Modal } from 'antd'
import React from 'react'
import type { ModalProps } from 'antd'
import { colors } from 'styles/colors'
import { IconClose } from 'components/atoms'
import styles from '../../../../styles/components/organisms/popupResultMudah.module.scss'
type PopupResultMudah = Omit<ModalProps, 'children'>

export const PopupResultMudah = (props: PopupResultMudah) => {
  return (
    <Modal
      title={
        <p className={styles.title}>
          Peluang disetujui lebih tinggi untuk mengajukan cicilan mobil ini.
        </p>
      }
      closeIcon={
        <IconClose width={24} height={22} color={colors.primaryBlack} />
      }
      footer={null}
      className="custom-modal-result-mudah"
      width={343}
      centered
      {...props}
    />
  )
}
