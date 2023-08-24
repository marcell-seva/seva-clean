import React from 'react'
import { FloatButton, FloatButtonProps } from 'antd'
import { IconCSA } from 'components/atoms/icon'
// import 'styles/main.scss'

type CSAButtonProps = Omit<FloatButtonProps, 'icon'> & {
  additionalStyle?: string
}
const CSAButton = (props: CSAButtonProps) => {
  return (
    <FloatButton
      className={`csa-button ${props.additionalStyle}`}
      icon={<IconCSA width={32} height={32} color={'#246ed4'} />}
      {...props}
    />
  )
}

export default CSAButton
