import React from 'react'
import { FloatButton, FloatButtonProps } from 'antd'
import { IconWhatsapp } from 'components/atoms'

type Props = Omit<FloatButtonProps, 'icon'>

export const WhatsappButton = (props: Props) => {
  return (
    <FloatButton
      className="whatsapp-floating-button"
      icon={<IconWhatsapp width={32} height={32} />}
      {...props}
    />
  )
}
