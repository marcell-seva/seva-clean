import React from 'react'
import { FloatButtonProps } from 'antd'
import { IconCSA } from 'components/atoms/icon'
import dynamic from 'next/dynamic'

type CSAButtonProps = Omit<FloatButtonProps, 'icon'> & {
  additionalstyle?: string
}

const FloatButton = dynamic(
  () => import('antd').then((mod) => mod.FloatButton),
  {
    ssr: false,
  },
)
const CSAButton = (props: CSAButtonProps) => {
  return (
    <FloatButton
      className={`csa-button ${props.additionalstyle}`}
      icon={<IconCSA width={32} height={32} color={'#246ed4'} />}
      {...props}
    />
  )
}

export default CSAButton
