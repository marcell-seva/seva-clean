import React, { ReactNode } from 'react'
import { Label, Tooltip } from 'components/atoms'
import styles from 'styles/components/molecules/labelTooltipSevaOTO.module.scss'
import TooltipSevaOTO from './Tooltip'

interface Props {
  label: string
  content: any
  name: string
  datatestid?: string
  onOpenTooltip?: () => void
}

export const LabelTooltipSevaOTO: React.FC<Props> = ({
  label,
  content,
  name,
  datatestid,
  onOpenTooltip,
}) => {
  return (
    <div className={styles.wrapper} data-testid={datatestid}>
      <Label name={name}>{label}</Label>
      <div className={styles.tooltipWrapper}>
        <TooltipSevaOTO content={content} />
      </div>
    </div>
  )
}
