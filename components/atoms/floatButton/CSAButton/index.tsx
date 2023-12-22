import React from 'react'
import { IconCSA } from 'components/atoms/icon'
import dynamic from 'next/dynamic'

const FloatButton = dynamic(() => import('antd/lib/float-button'), {
  ssr: false,
})

export interface FloatButtonProps {
  prefixCls?: string
  className?: string
  rootClassName?: string
  style?: React.CSSProperties
  icon?: React.ReactNode
  description?: React.ReactNode
  href?: string
  target?: React.HTMLAttributeAnchorTarget
  onClick?: React.MouseEventHandler<HTMLElement>
  ['aria-label']?: React.HtmlHTMLAttributes<HTMLButtonElement>['aria-label']
}

type CSAButtonProps = Omit<FloatButtonProps, 'icon'> & {
  additionalstyle?: string
}

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
