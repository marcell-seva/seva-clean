import React from 'react'
import { FloatButton, FloatButtonProps } from 'antd'
// import 'styles/main.scss'
import { IconCSA } from 'components/atoms/icons'

type CSAButtonProps = Omit<FloatButtonProps, 'icon'>

const CSAButton = (props: CSAButtonProps) => {
  return (
    <FloatButton
      className="csa-button"
      icon={<IconCSA width={32} height={32} color={'#246ed4'} />}
      {...props}
    />
  )
}

export default CSAButton
