import type React from 'react'
import type { RefHandles } from 'react-spring-bottom-sheet/dist/types'
import { BottomSheet, BottomSheetProps } from 'react-spring-bottom-sheet'
import { forwardRef } from 'react'
import { colors } from 'utils/helpers/style/colors'
import styles from 'styles/components/atoms/bottomSheet.module.scss'
import { IconClose } from '../icon'

type ForwardedRef = React.ForwardedRef<RefHandles>
interface GeneralBottomSheetProps extends BottomSheetProps {
  title: string
  closeDatatestid?: string
  additionalHeaderClassname?: string
}

const forwardBottomSheet = (
  {
    title,
    closeDatatestid,
    additionalHeaderClassname,
    children,
    ...props
  }: GeneralBottomSheetProps,
  ref: ForwardedRef,
) => {
  return (
    <BottomSheet ref={ref} {...props}>
      <div className={` ${additionalHeaderClassname || styles.header} `}>
        <div className={styles.subHeader}>
          <p>{title}</p>
          <div onClick={props.onDismiss} data-testid={closeDatatestid}>
            <IconClose width={24} height={24} color={colors.primaryBlack} />
          </div>
        </div>
      </div>
      {children}
    </BottomSheet>
  )
}

export default forwardRef(forwardBottomSheet)
