import React, { useEffect, useState } from 'react'
import styles from '../../../../styles/components/molecules/form/formTransmission.module.scss'
import { Space } from 'antd'
import { useFunnelQueryUsedCarData } from 'services/context/funnelQueryUsedCarContext'
import elementId from 'helpers/elementIds'

export interface FilterMobileProps {
  setTransmissionFilter?: any
  isResetFilter?: boolean
  isApplied?: boolean
}
interface TransmissionButtonProps {
  value: string
  no: number
}

export const FormTransmission = ({
  setTransmissionFilter,
  isResetFilter,
  isApplied,
}: FilterMobileProps) => {
  const { funnelQuery, patchFunnelQuery } = useFunnelQueryUsedCarData()
  const [tenureQuery, setTenureQuery] = useState(funnelQuery?.transmission)
  setTransmissionFilter(tenureQuery)

  const transmissionList: TransmissionButtonProps[] = [
    {
      value: 'Manual',
      no: 1,
    },
    {
      value: 'Otomatis',
      no: 2,
    },
  ]

  useEffect(() => {
    if (isResetFilter) {
      setTransmissionFilter('')
      setTenureQuery('')
    }
    if (tenureQuery === '' && !isApplied) {
      setTenureQuery(funnelQuery.transmission)
    }
  }, [isResetFilter, isApplied])

  return (
    <div className={styles.container}>
      <Space size={[24, 24]} wrap className={styles.childContainer}>
        {transmissionList.map(({ value }) => {
          return (
            <>
              <div
                onClick={() => {
                  setTransmissionFilter(value.toLowerCase())
                  setTenureQuery(value.toLowerCase())
                  patchFunnelQuery({ isDefaultTenureChanged: true })
                }}
                key={value}
                className={
                  tenureQuery === value.toLowerCase()
                    ? styles.boxOnclick
                    : styles.box
                }
                data-testid={elementId.Field.TenurePopup + value + '-th'}
              >
                <div className={styles.content}>{value}</div>
              </div>
            </>
          )
        })}
      </Space>
    </div>
  )
}
