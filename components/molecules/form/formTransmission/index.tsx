import React, { useEffect, useState } from 'react'
import styles from 'styles/components/molecules/form/formTransmission.module.scss'
import { Space } from 'antd'
import { useFunnelQueryUsedCarData } from 'services/context/funnelQueryUsedCarContext'
import elementId from 'helpers/elementIds'

export interface FilterMobileProps {
  setTransmissionFilter?: any
  isResetFilter?: boolean
  transmissionFilter: string[]
  transmission?: any
  isApplied?: boolean
  isButtonClick: boolean | undefined
}
interface TransmissionButtonProps {
  value: string
  no: number
  isChecked: boolean
}

export const FormTransmission = ({
  setTransmissionFilter,
  isResetFilter,
  isApplied,
  transmission,
  transmissionFilter,
  isButtonClick,
}: FilterMobileProps) => {
  const { funnelQuery, patchFunnelQuery } = useFunnelQueryUsedCarData()
  const [tenureQuery, setTenureQuery] = useState<string[]>([])
  setTransmissionFilter(tenureQuery)

  const paramQuery = funnelQuery

  const transmissionList: TransmissionButtonProps[] = [
    {
      value: 'Manual',
      no: 1,
      isChecked: tenureQuery.includes('Manual'),
    },
    {
      value: 'Otomatis',
      no: 2,
      isChecked: tenureQuery.includes('Otomatis'),
    },
  ]

  useEffect(() => {
    if (isResetFilter) {
      setTenureQuery([])
    }
    if (transmission?.length === 0 && transmission && !isApplied) {
      setTenureQuery([])
    } else if (funnelQuery.transmission && !isResetFilter && isApplied) {
      setTenureQuery(funnelQuery.transmission)
      paramQuery.transmission = funnelQuery.transmission
    }
    if (
      isButtonClick &&
      tenureQuery.length === 0 &&
      transmission &&
      transmission.length > 0 &&
      !isApplied
    ) {
      setTenureQuery(transmission.split(','))
      setTransmissionFilter(transmission.split(','))
    }
    if (isApplied) {
      setTransmissionFilter(tenureQuery)
    }
    if (
      !isButtonClick &&
      tenureQuery.length > 0 &&
      funnelQuery.transmission?.length === 0 &&
      !isApplied
    ) {
      setTenureQuery([])
    }
  }, [isResetFilter, isApplied, isButtonClick])

  const onClick = (value: string) => {
    if (tenureQuery.includes(value)) {
      setTenureQuery(tenureQuery.filter((item) => item !== value))
    } else {
      setTenureQuery([...tenureQuery, value])
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.childContainer}>
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
      </div>
    </div>
  )
}
