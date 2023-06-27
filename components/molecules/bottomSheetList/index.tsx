import React from 'react'
import { FormControlValue, Option } from 'utils/types'
import styles from '../../../styles/saas/components/molecules/bottomSheetList.module.scss'

interface BottomSheetListProps<T extends FormControlValue> {
  options: Option<T>[]
  onChooseOption: (value: FormControlValue, label: FormControlValue) => void
  activeState: FormControlValue
  datatestid?: string
}

export const BottomSheetList = <T extends FormControlValue>({
  options,
  onChooseOption,
  activeState,
  datatestid,
}: BottomSheetListProps<T>) => {
  const lastIndex = options.length - 1
  return (
    <div className={styles.listWrapper}>
      {options.map((item, index) => (
        <>
          <div
            key={index}
            className={`${styles.listOption} ${
              item.value === activeState ? styles.activeOption : ''
            }`}
            role="button"
            onClick={() => onChooseOption(item.value, item.label)}
            data-testid={datatestid ? datatestid + item.testid : undefined}
          >
            {item.label}
          </div>
          {index !== lastIndex && <div className={styles.line} />}
        </>
      ))}
    </div>
  )
}
