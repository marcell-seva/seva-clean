import React from 'react'
import { FloatButton, FloatButtonProps } from 'antd'
import { IconWhatsapp } from 'components/atoms/icon'

type Props = Omit<FloatButtonProps, 'icon'> & {
  additionalStyle?: string
}

const WhatsappButton = ({ additionalStyle, ...props }: Props) => {
  return (
    <FloatButton
      className={`whatsapp-floating-button ${additionalStyle}`}
      icon={<IconWhatsapp width={32} height={32} />}
      {...props}
    />
  )
}

export default WhatsappButton
