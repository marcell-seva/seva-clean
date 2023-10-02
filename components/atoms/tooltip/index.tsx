import clsx from 'clsx'
import React from 'react'
import styles from '../../../styles/components/atoms/tooltip.module.scss'

import { IconClose, IconInfo } from '../icon'
import Overlay from '../overlay'

interface Props {
  content: string
  iconHeight?: number
  iconWidth?: number
  color?: string
  onOpenTooltip?: () => void
}

export const Tooltip: React.FC<Props> = ({
  iconHeight = 18,
  iconWidth = 18,
  color = '#878D98',
  content,
  onOpenTooltip,
}) => {
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
        alt="SEVA Orientation Icon"
      />

      <>
        <div
          className={clsx({
            [styles.tooltipWrapper]: true,
            [styles.show]: isShowOverlay,
            [styles.close]: !isShowOverlay,
          })}
        >
          <p className={styles.tooltipContent}>{content}</p>

          <IconClose
            width={40}
            height={25}
            color="#13131B"
            onClick={handleCloseTooltip}
          />
        </div>{' '}
      </>

      <Overlay
        isShow={isShowOverlay}
        onClick={handleCloseTooltip}
        zIndex={98}
        additionalStyle={styles.overlayAdditionalStyle}
      />
    </>
  )
}
