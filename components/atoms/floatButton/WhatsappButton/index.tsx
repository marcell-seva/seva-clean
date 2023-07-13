import React from 'react'
import { FloatButton, FloatButtonProps } from 'antd'
import { IconWhatsapp } from 'components/atoms/icons'

type Props = Omit<FloatButtonProps, 'icon'>

const WhatsappButton = (props: Props) => {
  return (
    <FloatButton
      className="whatsapp-floating-button"
      icon={<IconWhatsapp width={32} height={32} />}
      {...props}
    />
  )
}

export default WhatsappButton
