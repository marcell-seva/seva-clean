/* eslint-disable react-hooks/rules-of-hooks */
import clsx from 'clsx'
import React, {
  ForwardedRef,
  forwardRef,
  use,
  useContext,
  useEffect,
  useState,
} from 'react'
import styles from 'styles/components/molecules/searchWidget/selectWidget.module.scss'
import { colors } from 'utils/helpers/style/colors'
import { BottomSheet, IconChevronDown } from 'components/atoms'
import { BottomSheetList } from 'components/molecules'
import { SearchWidgetContext, SearchWidgetContextType } from 'services/context'
import { FormControlValue, Option } from 'utils/types'
import { trackEventCountly } from 'helpers/countly/countly'
import { CountlyEventNames } from 'helpers/countly/eventNames'

type ContentSheetProps = {
  onClose: () => void
}

interface SelectWidgetProps {
  title: string
  placeholder: string
  name?: string
  value?: string | number
  icon: JSX.Element
  sheetOption?: (contentProps: ContentSheetProps) => JSX.Element
  sheetList?: Option<FormControlValue>[]
  errorText?: string | JSX.Element
  datatestid?: string
  optionDatatestId?: string
}

const forwardSelectWidget = (
  {
    title,
    placeholder,
    value,
    name,
    icon,
    sheetOption,
    sheetList,
    errorText,
    datatestid,
    optionDatatestId,
  }: SelectWidgetProps,
  ref?: ForwardedRef<HTMLDivElement>,
) => {
  const [openOption, setOpenOption] = useState(false)
  const { funnelWidget, saveFunnelWidget } = useContext(
    SearchWidgetContext,
  ) as SearchWidgetContextType
  const onClose = () => {
    setOpenOption(false)
  }
  const [currentValue, setCurrentValue] = useState('')

  const returnProps = {
    onClose,
  }

  const onChooseOption = (value: FormControlValue, label: FormControlValue) => {
    name && saveFunnelWidget({ ...funnelWidget, [name]: value })
    setCurrentValue(label as string)
    onClose()
  }

  const getFilterType = () => {
    if (title === 'Merek') {
      return 'Car Brand'
    } else if (title === 'Tipe') {
      return 'Car Type'
    } else if (title === 'Estimasi Harga') {
      return 'Price Range'
    } else if (title === 'Tenor (tahun)') {
      return 'Tenure'
    } else if (title === 'Kategori Umur') {
      return 'Age'
    }
  }

  return (
    <>
      <div
        ref={ref}
        className={clsx({
          [styles.container]: true,
          ['shake-animation-X']: errorText,
        })}
        onClick={() => {
          trackEventCountly(
            CountlyEventNames.WEB_HOMEPAGE_SMART_SEARCH_FIELD_CLICK,
            {
              FILTER_TYPE: getFilterType(),
            },
          )
          setOpenOption(true)
        }}
        data-testid={datatestid}
      >
        <div className={styles.fieldContainer}>
          <div className={styles.icon}>{icon}</div>
          <div className={styles.fieldWrapper}>
            <span className={styles.title}>{title}</span>
            <div className={styles.textArrowWrapper}>
              <div className={styles.placeholder}>
                {currentValue || placeholder}
              </div>
              <div className={styles.arrowIcon}>
                <IconChevronDown
                  width={24}
                  height={24}
                  color={colors.primaryBlack}
                />
              </div>
            </div>
          </div>
        </div>
        <div
          className={clsx({
            [styles.line]: true,
            [styles.error]: errorText,
          })}
        />
        {errorText && <span className={styles.errorText}>{errorText}</span>}
      </div>
      <BottomSheet
        title={title}
        open={openOption}
        onDismiss={() => setOpenOption(false)}
      >
        {sheetOption ? (
          sheetOption(returnProps)
        ) : sheetList ? (
          <BottomSheetList
            options={sheetList}
            onChooseOption={onChooseOption}
            activeState={value}
            datatestid={optionDatatestId}
          />
        ) : (
          <></>
        )}
      </BottomSheet>
    </>
  )
}

export const SelectWidget = forwardRef(forwardSelectWidget)
