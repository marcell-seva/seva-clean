import clsx from 'clsx'
import React, { useContext } from 'react'
import { SearchWidgetContext, SearchWidgetContextType } from 'services/context'
import styles from 'styles/components/molecules/searchWidget/tenureOptionWidget.module.scss'
import elementId from 'utils/helpers/trackerId'

interface TenureOptionWidgetProps {
  onClose: () => void
}

const TenureOptionWidget = ({ onClose }: TenureOptionWidgetProps) => {
  const { funnelWidget, saveFunnelWidget } = useContext(
    SearchWidgetContext,
  ) as SearchWidgetContextType
  const onChoose = (value: number) => {
    saveFunnelWidget((prev: any) => ({ ...prev, tenure: String(value) }))
    onClose()
  }

  return (
    <div className={styles.container}>
      {[1, 2, 3, 4, 5].map((item, index) => (
        <div
          className={clsx({
            [styles.box]: true,
            [styles.active]: String(funnelWidget.tenure) === String(item),
          })}
          key={index}
          onClick={() => onChoose(item)}
          data-testid={elementId.Field.TenurePopup + item + '-th'}
        >
          <span>{item}</span>
        </div>
      ))}
    </div>
  )
}

export default TenureOptionWidget
