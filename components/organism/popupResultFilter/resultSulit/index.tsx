import { Modal } from 'antd'
import React from 'react'
import type { ModalProps } from 'antd'
import { colors } from 'styles/colors'
import { IconClose } from 'components/atoms'
import styles from '../../../../styles/saas/components/organism/popupResultSulit.module.scss'
type PopupResultSulit = Omit<ModalProps, 'children'>

export const PopupResultSulit = (props: PopupResultSulit) => {
  return (
    <Modal
      title={
        <p className={styles.title}>
          Naikkan nominal DP dan perpanjang tenormu atau pilih mobil lain yang
          lebih ideal dengan finansialmu.
        </p>
      }
      closeIcon={
        <IconClose width={24} height={22} color={colors.primaryBlack} />
      }
      footer={null}
      className="custom-modal-result-sulit"
      width={343}
      centered
      {...props}
    />
  )
}
