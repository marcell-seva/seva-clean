import React from 'react'
import { Label, Tooltip } from 'components/atoms'
import styles from '../../../styles/components/molecules/labelWithTooltip.module.scss'

interface Props {
  label: string
  content: string
  name: string
  datatestid?: string
  onOpenTooltip?: () => void
}

export const LabelWithTooltip: React.FC<Props> = ({
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
        <Tooltip
          content={content}
          onOpenTooltip={onOpenTooltip}
          additionalStyle={styles.tooltipAdditionalStyle}
        />
      </div>
    </div>
  )
}
