import React from 'react'
import { IconInfo } from '../../atoms/icon'
import { Col, Row } from 'antd'

interface Props {
  onClick?: () => void
}

const TooltipDaihatsu = ({ onClick }: Props) => {
  return (
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
            Harga OTR Daihatsu menggunakan OTR{' '}
            <span
              style={{
                fontWeight: '700',
                color: 'white',
                fontSize: '11px',
                fontFamily: 'var(--open-sans-bold)',
                lineHeight: '16px',
              }}
            >
              Jakarta Pusat.
            </span>{' '}
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
  )
}

export default TooltipDaihatsu
