import type React from 'react'
import type { RefHandles } from 'react-spring-bottom-sheet/dist/types'

import 'react-spring-bottom-sheet/dist/style.css'
import 'styles/saas/components/atoms/bottomSheet.scss'
import styles from '../../../styles/saas/components/atoms/bottomSheet.module.scss'

export type ForwardedRef = React.ForwardedRef<RefHandles>
import {
  BottomSheet as SpringSheet,
  BottomSheetProps,
} from 'react-spring-bottom-sheet'
import { IconClose } from '../icon'
import { colors } from 'styles/colors'
import { forwardRef } from 'react'

interface GeneralBottomSheetProps extends BottomSheetProps {
  title: string
  closeDatatestid?: string
}

const forwardBottomSheet = (
  { title, closeDatatestid, children, ...props }: GeneralBottomSheetProps,
  ref: ForwardedRef,
) => {
  return (
    <SpringSheet ref={ref} {...props}>
      <div className={styles.header}>
        <div className={styles.subHeader}>
          <p>{title}</p>
          <div onClick={props.onDismiss} data-testid={closeDatatestid}>
            <IconClose width={24} height={24} color={colors.primaryBlack} />
          </div>
        </div>
      </div>
      {children}
    </SpringSheet>
  )
}

export const BottomSheet = forwardRef(forwardBottomSheet)
