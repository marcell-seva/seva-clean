import React from 'react'

import { Col, Row } from 'antd'
import { IconInfo, Overlay } from 'components/atoms'
import clsx from 'clsx'
import styles from 'styles/components/atoms/tooltipSevaOTO.module.scss'

interface Props {
  content: string

  onClick?: () => void
  onOpenTooltip?: () => void
}

const TooltipSevaOTO = ({ content, onClick, onOpenTooltip }: Props) => {
  return (
    <>
      <div>
        <Row>
          <Col span={3}>
            <IconInfo width={18} height={18} color="white" />
          </Col>
          <Col span={21}>
            <p
              style={{
                fontSize: '11px',
                fontFamily: 'var(--open-sans)',
                color: 'white',
                lineHeight: '16px',
              }}
            >
              {content}
            </p>
            <p
              style={{
                fontSize: '11px',
                fontWeight: '700',
                fontFamily: 'var(--open-sans-bold)',
                color: 'white',
                marginTop: '12px',
                lineHeight: '16px',
              }}
              onClick={onClick}
            >
              OK, Saya Mengerti
            </p>
          </Col>
        </Row>
      </div>
    </>
  )
}

export default TooltipSevaOTO
