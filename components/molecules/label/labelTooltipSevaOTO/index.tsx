import React, { ReactNode, useState } from 'react'
import { IconInfo, Label } from 'components/atoms'
import styles from 'styles/components/molecules/labelTooltipSevaOTO.module.scss'
import TooltipSevaOTO from './Tooltip'
import { Tooltip } from 'antd'
import TooltipContentQualifacation from 'components/molecules/tooltipContent'

interface Props {
  label: string
  content: any
  name: string
  iconHeight?: number
  iconWidth?: number
  color?: string
  datatestid?: string
  onOpenTooltip?: () => void
  onClick?: () => void
}

export const LabelTooltipSevaOTO: React.FC<Props> = ({
  label,
  content,
  name,
  datatestid,
  onOpenTooltip,
  iconHeight = 18,
  iconWidth = 18,
  color = '#878D98',
  onClick,
}) => {
  const [isToolTipOpen, setIsToolTipOpen] = useState(false)

  const handleOpenToolTip = () => {
    setIsToolTipOpen(true)
  }

  const handleCloseToolTip = () => {
    setIsToolTipOpen(false)
  }

  return (
    <div className={styles.wrapper} data-testid={datatestid}>
      <Label name={name}>{label}</Label>

      {!isToolTipOpen && (
        <div className={styles.tooltipWrapper}>
          <IconInfo
            width={iconWidth}
            height={iconHeight}
            color={color}
            onClick={handleOpenToolTip}
          />
        </div>
      )}

      {isToolTipOpen && (
        <div>
          <Tooltip
            title={
              <TooltipSevaOTO content={content} onClick={handleCloseToolTip} />
            }
            color="#246ED4"
            placement="top"
            className="calculation-result"
            overlayClassName="calculation-result"
            overlayInnerStyle={{ marginLeft: 20 }}
          >
            <div className={styles.tooltipWrapper}>
              <IconInfo
                width={iconWidth}
                height={iconHeight}
                color={color}
                onClick={handleOpenToolTip}
              />
            </div>
          </Tooltip>
        </div>
      )}
    </div>
  )
}
