import { useFunnelQueryUsedCarData } from 'services/context/funnelQueryUsedCarContext'
import React from 'react'
import { BottomSheetProps } from 'react-spring-bottom-sheet'
import { BottomSheet } from 'components/atoms'
import { BottomSheetList } from 'components/molecules'
import elementId from 'helpers/elementIds'
import { FormControlValue } from 'utils/types'
import { sortOptionsUsedCar } from 'utils/config/funnel.config'
import { trackEventCountly } from 'helpers/countly/countly'
import { CountlyEventNames } from 'helpers/countly/eventNames'
import styles from 'styles/components/organisms/sortingMobile.module.scss'

interface SortingMobileUsedCarProps extends Omit<BottomSheetProps, 'children'> {
  onClose: () => void
  onPickClose: (value: any, label: string) => any
  sortOptionMultiKK?: boolean
  selectedSortMultiKK?: string
}

const SortingMobileUsedCar = ({
  onClose,
  onPickClose,
  sortOptionMultiKK = false,
  selectedSortMultiKK = 'highToLow',
  ...props
}: SortingMobileUsedCarProps) => {
  const { funnelQuery, patchFunnelQuery } = useFunnelQueryUsedCarData()

  const onChooseOption = (value: FormControlValue, label: FormControlValue) => {
    patchFunnelQuery({ sortBy: value as string })
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
        options={sortOptionsUsedCar}
        onChooseOption={onChooseOption}
        activeState={
          sortOptionMultiKK ? selectedSortMultiKK : funnelQuery.sortBy
        }
        datatestid={elementId.Field.TenurePopup}
      />
    </BottomSheet>
  )
}

export default SortingMobileUsedCar
