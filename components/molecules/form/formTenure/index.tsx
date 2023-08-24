import React, { useEffect, useState } from 'react'
import styles from '../../../../styles/components/molecules/form/formTenure.module.scss'
import { Space } from 'antd'
import { useFunnelQueryData } from 'services/context/funnelQueryContext'
import elementId from 'helpers/elementIds'

export interface FilterMobileProps {
  setTenureFilter?: any
  isResetFilter?: boolean
  isApplied?: boolean
}
interface TenureButtonProps {
  value: number
}

export const FormTenure = ({
  setTenureFilter,
  isResetFilter,
  isApplied,
}: FilterMobileProps) => {
  const { funnelQuery, patchFunnelQuery } = useFunnelQueryData()
  const [tenureQuery, setTenureQuery] = useState(funnelQuery.tenure)
  setTenureFilter(tenureQuery)
  const tenureList: TenureButtonProps[] = [
    {
      value: 1,
    },
    {
      value: 2,
    },
    {
      value: 3,
    },
    {
      value: 4,
    },
    {
      value: 5,
    },
  ]

  useEffect(() => {
    if (isResetFilter) {
      setTenureFilter(5)
      setTenureQuery(5)
      patchFunnelQuery({ isDefaultTenureChanged: false })
    }
    if (tenureQuery === 5 && !isApplied) {
      setTenureQuery(funnelQuery.tenure)
    }
  }, [isResetFilter, isApplied])

  return (
    <div className={styles.container}>
      <div className={styles.wrapperHeader}>
        <div className={styles.textTitle}>Tenor (Tahun)</div>
      </div>
      <Space size={[16, 16]} wrap>
        {tenureList.map(({ value }) => {
          return (
            <>
              <div
                onClick={() => {
                  setTenureFilter(value)
                  setTenureQuery(value)
                  patchFunnelQuery({ isDefaultTenureChanged: true })
                }}
                key={value}
                className={
                  tenureQuery === value ? styles.boxOnclick : styles.box
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
