import { Modal } from 'antd'
import React from 'react'
import type { ModalProps } from 'antd'
import { colors } from 'styles/colors'
import { IconClose } from 'components/atoms'
import styles from '../../../../styles/components/organisms/popupResultInfo.module.scss'

import { Button } from 'components/atoms'
import { ButtonSize, ButtonVersion } from 'components/atoms/button'

const PLPEmpty = '/revamp/illustration/plp-empty.webp'

type PopupResultInfo = Omit<ModalProps, 'children'>
export const PopupResultInfo = (props: PopupResultInfo) => {
  return (
    <Modal
      closeIcon={
        <IconClose width={24} height={22} color={colors.primaryBlack} />
      }
      footer={null}
      className="custom-modal-result"
      width={343}
      centered
      {...props}
    >
      <>
        <div className={styles.container}>
          <img
            src={PLPEmpty}
            className={styles.imageStyle}
            alt={'image-result-info'}
          />
        </div>
        <p className={styles.titleStyle}>
          Lihat status persetujuan cicilan mobil kamu di SEVA!
        </p>
        <p className={styles.contentText}>
          <span className={styles.contentTextMudah}>Mudah Disetujui: </span>
          Peluang disetujui lebih tinggi untuk mengajukan cicilan mobil ini.
          <br />
          <br />
          <span className={styles.contentTextSulit}>Sulit Disetujui: </span>
          Naikkan nominal DP dan perpanjang tenormu atau pilih mobil lain yang
          lebih ideal dengan finansialmu.
        </p>
        <div className={styles.paddingButton}>
          <Button
            onClick={props.onOk}
            version={ButtonVersion.PrimaryDarkBlue}
            size={ButtonSize.Big}
          >
            OK
          </Button>
        </div>
      </>
    </Modal>
  )
}
