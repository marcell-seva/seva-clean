import React from 'react'
import styles from 'styles/components/organisms/popupResultRecommended.module.scss'
import Modal from 'antd/lib/modal'
import type { ModalProps } from 'antd/lib/modal'
import { Button, IconClose } from 'components/atoms'
import { colors } from 'styles/colors'
import Image from 'next/image'
import { IconThumbsUp } from 'components/atoms/icon'
import { ButtonSize, ButtonVersion } from 'components/atoms/button'

const MainImage = '/revamp/illustration/recommended.svg'

type PopupResultRecommendedType = Omit<ModalProps, 'children'>

export const PopupResultRecommended = (props: PopupResultRecommendedType) => {
  return (
    <Modal
      closeIcon={
        <IconClose width={24} height={24} color={colors.primaryBlack} />
      }
      footer={null}
      className="custom-modal-result-recommended"
      width={343}
      centered
      {...props}
    >
      <div className={styles.container}>
        <Image
          width={200}
          height={149.2}
          src={MainImage}
          alt="Recommended Result Popup Main Image"
        />
        <div className={styles.badgeAndDescriptionWrapper}>
          <div className={styles.badge}>
            <IconThumbsUp width={14} height={14} color="white" />
            <span className={styles.badgeText}>Rekomendasi</span>
          </div>
          <span className={styles.description}>
            Mobil bertanda khusus di atas direkomendasikan untukmu berdasarkan
            DP, pendapatan, tenor, dan kisaran usia.
          </span>
        </div>
        <Button
          version={ButtonVersion.PrimaryDarkBlue}
          size={ButtonSize.Big}
          onClick={props.onCancel}
        >
          OK, Saya Mengerti
        </Button>
      </div>
    </Modal>
  )
}
