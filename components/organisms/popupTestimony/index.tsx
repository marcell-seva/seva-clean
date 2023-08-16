import { Modal } from 'antd'
import React, { TextareaHTMLAttributes } from 'react'
import type { ModalProps } from 'antd'
import styles from 'styles/components/organisms/popupTestimony.module.scss'
import { colors } from 'utils/helpers/style/colors'
import { TestimonialData } from 'utils/types/props'
import { IconClose } from 'components/atoms/icon'
import { differentDateStatus } from 'utils/handler/date'

type PopupTestimonyProps = Omit<ModalProps, 'children'> & {
  testimony: TestimonialData | null
}

const PopupTestimony = ({ testimony, ...props }: PopupTestimonyProps) => {
  return (
    <Modal
      title={<Title>Ulasan</Title>}
      closeIcon={
        <IconClose width={24} height={22} color={colors.primaryBlack} />
      }
      footer={null}
      className="custom-modal"
      width={343}
      centered
      {...props}
    >
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <h3 className={styles.nameAge}>
            {testimony?.name}
            {testimony?.age ? `, ${testimony?.age}  Th` : ''}
          </h3>
          <span className={styles.timeCityCar}>
            {differentDateStatus(new Date(testimony?.purchaseDate || ''))},{' '}
            {testimony?.cityName}
          </span>
          <span className={styles.description}>{`"${testimony?.detail}"`}</span>
        </div>
      </div>
    </Modal>
  )
}

const Title = ({ children }: TextareaHTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={styles.title}>{children}</h3>
)

export default PopupTestimony
