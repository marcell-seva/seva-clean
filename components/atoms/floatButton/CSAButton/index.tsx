import React from 'react'
import { FloatButton, FloatButtonProps } from 'antd'
import { IconCSA } from '../../icon'
import { colors } from 'styles/colors'

type CSAButtonProps = Omit<FloatButtonProps, 'icon'>

export const CSAButton = (props: CSAButtonProps) => {
  return (
    <FloatButton
      className="csa-button"
      icon={<IconCSA width={32} height={32} color={colors.primaryBlue} />}
      {...props}
    />
  )
}
