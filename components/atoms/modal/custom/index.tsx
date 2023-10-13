import React, { TextareaHTMLAttributes } from 'react'
import styles from 'styles/components/atoms/modal.module.scss'
import { Modal } from 'antd'
import clsx from 'clsx'
import { PropsModal } from 'utils/types/props'
import { colors } from 'utils/helpers/style/colors'
import { IconClose } from 'components/atoms/icon'

const CustomModal = ({
  children,
  title,
  isFull,
  width = 343,
  className,
  ...props
}: PropsModal) => {
  return (
    <Modal
      title={<Title>{title}</Title>}
      closeIcon={
        <IconClose width={24} height={22} color={colors.primaryBlack} />
      }
      footer={null}
      className={clsx(isFull ? 'full' : 'default', className)}
      width={width}
      centered
      {...props}
    >
      {children}
    </Modal>
  )
}

const Title = ({ children }: TextareaHTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={styles.title}>{children}</h3>
)

export default CustomModal
