import React, { useContext, useEffect, useState, MouseEvent } from 'react'
import styles from 'styles/components/molecules/form/formSearchTransmission.module.scss'
import stylec from '/styles/components/molecules/searchWidget/gridOptionWidget.module.scss'
import Space from 'antd/lib/space'
import elementId from 'utils/helpers/trackerId'
import { Button } from 'components/atoms'
import {
  SearchUsedCarWidgetContext,
  SearchUsedCarWidgetContextType,
} from 'services/context'
import { ButtonSize, ButtonVersion } from 'components/atoms/button'

interface TransmissionButtonProps {
  value: string
  no: number
  isChecked: boolean
}

interface FilterMobileProps {
  onClose: () => void
}

const TransmissionUsedCarWidget = ({ onClose }: FilterMobileProps) => {
  const { funnelWidget, saveFunnelWidget } = useContext(
    SearchUsedCarWidgetContext,
  ) as SearchUsedCarWidgetContextType
  const [isCheckedTransmissionQuery, setIsCheckedTransmissionQuery] = useState<
    string[]
  >(funnelWidget.transmission ? funnelWidget.transmission : [])

  const transmissionList: TransmissionButtonProps[] = [
    {
      value: 'Manual',
      no: 1,
      isChecked: isCheckedTransmissionQuery.includes('Manual'),
    },
    {
      value: 'Otomatis',
      no: 2,
      isChecked: isCheckedTransmissionQuery.includes('Otomatis'),
    },
  ]

  const onClick = (key: string) => {
    if (isCheckedTransmissionQuery.includes(key)) {
      setIsCheckedTransmissionQuery(
        isCheckedTransmissionQuery.filter((item) => item !== key),
      )
      // paramQuery.brand = isCheckedTransmissionQuery.filter((item) => item !== key)
    } else {
      setIsCheckedTransmissionQuery(isCheckedTransmissionQuery.concat(key))
      // paramQuery.brand = isCheckedTransmissionQuery.concat(key)
    }
  }

  const [disableActionButton, setDisableActionButton] = useState(false)
  const [showToast, setShowToast] = useState<'error' | ''>('')

  const onChooseOption = (value: string) => {
    if (isCheckedTransmissionQuery.includes(value)) {
      setIsCheckedTransmissionQuery(
        isCheckedTransmissionQuery.filter((x) => x !== value),
      )
    } else {
      setIsCheckedTransmissionQuery((prev) => [...prev, value])
    }
  }

  const clear = () => {
    setIsCheckedTransmissionQuery([])
    setDisableActionButton(true)
  }

  const submit = () => {
    saveFunnelWidget({
      ...funnelWidget,
      transmission: isCheckedTransmissionQuery,
    })
    onClose()
  }

  useEffect(() => {
    if (showToast === 'error') {
      setTimeout(() => {
        setShowToast('')
      }, 1200)
    }
  }, [showToast])

  useEffect(() => {
    if (isCheckedTransmissionQuery.length === 0) {
      setDisableActionButton(true)
    } else {
      setDisableActionButton(false)
    }
  }, [isCheckedTransmissionQuery])

  return (
    <>
      <div className={styles.container}>
        <Space size={[24, 24]} wrap className={styles.childContainer}>
          {transmissionList.map(({ value, isChecked }) => {
            return (
              <>
                <div
                  onClick={() => onClick(value)}
                  key={value}
                  className={isChecked ? styles.boxOnclick : styles.box}
                  data-testid={elementId.Field.TenurePopup + value + '-th'}
                >
                  <div className={styles.content}>{value}</div>
                </div>
              </>
            )
          })}
        </Space>
        <div className={stylec.actionButtonWrapper}>
          <Button
            version={ButtonVersion.Secondary}
            size={ButtonSize.Big}
            disabled={disableActionButton}
            onClick={clear}
            data-testid={elementId.FilterButton.Reset}
          >
            Atur Ulang
          </Button>
          <Button
            version={ButtonVersion.PrimaryDarkBlue}
            size={ButtonSize.Big}
            disabled={disableActionButton}
            onClick={submit}
            data-testid={elementId.FilterButton.Submit}
          >
            Terapkan
          </Button>
        </div>
        {/* <Toast
          typeToast="error"
          text={errorToastMessage}
          visible={showToast === 'error'}
          onCancel={(e: MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation()
            setShowToast('')
          }}
        /> */}
      </div>
    </>
  )
}

export default TransmissionUsedCarWidget
