import { useFunnelQueryData } from 'services/context/funnelQueryContext'
import React from 'react'
import { BottomSheetProps } from 'react-spring-bottom-sheet'
import { BottomSheet } from 'components/atoms'
import { BottomSheetList } from 'components/molecules'
import { trackPLPSortClick } from 'helpers/amplitude/seva20Tracking'
import elementId from 'helpers/elementIds'
import { FormControlValue } from 'utils/types'
import { sortOptions } from 'utils/config/funnel.config'
import { trackEventCountly } from 'helpers/countly/countly'
import { CountlyEventNames } from 'helpers/countly/eventNames'
import styles from 'styles/components/organisms/sortingMobile.module.scss'

interface SortingMobileProps extends Omit<BottomSheetProps, 'children'> {
  onClose: () => void
  onPickClose: (value: any, label: string) => any
  sortOptionMultiKK?: boolean
  selectedSortMultiKK?: string
}

const SortingMobile = ({
  onClose,
  onPickClose,
  sortOptionMultiKK = false,
  selectedSortMultiKK = 'highToLow',
  ...props
}: SortingMobileProps) => {
  const { funnelQuery, patchFunnelQuery } = useFunnelQueryData()

  const onChooseOption = (value: FormControlValue, label: FormControlValue) => {
    patchFunnelQuery({ sortBy: value as string })
    trackPLPSortClick(label as string)
    onPickClose(value, label as string)
  }
  return (
    <BottomSheet
      title="Urutkan"
      onDismiss={onClose}
      closeDatatestid={elementId.PLP.Close.Button.PopupSorting}
      className={styles.bottomSheet}
      {...props}
    >
      <BottomSheetList
        options={sortOptions}
        onChooseOption={onChooseOption}
        activeState={
          sortOptionMultiKK ? selectedSortMultiKK : funnelQuery.sortBy
        }
        datatestid={elementId.Field.TenurePopup}
      />
    </BottomSheet>
  )
}

export default SortingMobile
