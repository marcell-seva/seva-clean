import React from 'react'

import { Col, Row } from 'antd'
import { IconInfo, Overlay } from 'components/atoms'
import clsx from 'clsx'
import styles from 'styles/components/atoms/tooltipSevaOTO.module.scss'

interface Props {
  content: string
  iconHeight?: number
  iconWidth?: number
  color?: string
  onClick?: () => void
  onOpenTooltip?: () => void
}

const TooltipSevaOTO = ({
  iconHeight = 18,
  iconWidth = 18,
  color = '#878D98',
  content,
  onClick,
  onOpenTooltip,
}: Props) => {
  const [isShowOverlay, setIsShowOverlay] = React.useState(false)

  const handleOpenTooltip = () => {
    setIsShowOverlay(true)
    onOpenTooltip && onOpenTooltip()
  }

  const handleCloseTooltip = () => setIsShowOverlay(false)

  return (
    <>
      <IconInfo
        width={iconWidth}
        height={iconHeight}
        color={color}
        onClick={handleOpenTooltip}
      />
      <>
        <div
          className={clsx({
            [styles.tooltipWrapper]: true,
            [styles.show]: isShowOverlay,
            [styles.close]: !isShowOverlay,
          })}
        >
          <Row>
            <Col span={3}>
              <IconInfo width={24} height={24} color="white" />
            </Col>
            <Col span={21}>
              <p
                style={{
                  fontSize: '12px',
                  fontFamily: 'var(--open-sans)',
                  color: 'white',
                  lineHeight: '16px',
                }}
              >
                {content}
              </p>
              <p
                style={{
                  fontSize: '12px',
                  fontWeight: '700',
                  fontFamily: 'var(--open-sans-bold)',
                  color: 'white',
                  marginTop: '12px',
                  lineHeight: '16px',
                }}
                onClick={handleCloseTooltip}
              >
                OK, Saya Mengerti
              </p>
            </Col>
          </Row>
        </div>
      </>
      <Overlay
        isShow={isShowOverlay}
        onClick={handleCloseTooltip}
        zIndex={98}
      />
    </>
  )
}

export default TooltipSevaOTO
