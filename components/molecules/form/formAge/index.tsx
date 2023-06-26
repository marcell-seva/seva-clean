import React, { useEffect, useState } from 'react'
import styles from '../../../../styles/saas/components/molecules/form/formAge.module.scss'
import { Space } from 'antd'
import elementId from 'helpers/elementIds'
import { useFunnelQueryData } from 'context/funnelQueryContext/funnelQueryContext'

export interface FilterMobileProps {
  setModalTmp?: (value: boolean) => void
  setAgeFilter?: any
  isErrorAge?: boolean
  isResetFilter?: boolean
  setIsErrorAge?: any
  isApplied?: boolean
}
interface AgeButtonProps {
  value: string
}

export const FormAge = ({
  setAgeFilter,
  isErrorAge,
  isResetFilter,
  setIsErrorAge,
  isApplied,
}: FilterMobileProps) => {
  const { funnelQuery } = useFunnelQueryData()
  const [ageQuery, setAgeQuery] = useState(funnelQuery.age)
  setAgeFilter(ageQuery)
  const ageList: AgeButtonProps[] = [
    {
      value: '18-27',
    },
    {
      value: '28-34',
    },
    {
      value: '35-50',
    },
    {
      value: '>51',
    },
  ]
  useEffect(() => {
    if (isResetFilter) {
      setAgeFilter('')
      setAgeQuery('')
    }
    if (ageQuery?.toString().length === 0 && !isApplied) {
      setAgeQuery(funnelQuery.age)
    }
  }, [isResetFilter, isApplied])

  const onClick = (value: any) => {
    if (value === ageQuery) {
      setAgeFilter('')
      setAgeQuery('')
    } else {
      setAgeFilter(value)
      setAgeQuery(value)
      setIsErrorAge(false)
    }
  }
  return (
    <>
      <div className={styles.container}>
        <div className={styles.wrapperHeader}>
          <div className={styles.textTitle}>Kategori Umur</div>
        </div>
        <Space size={[16, 16]} wrap>
          {ageList.map(({ value }) => {
            return (
              <>
                <div
                  onClick={() => onClick(value)}
                  key={value}
                  className={
                    ageQuery === value ? styles.boxOnclick : styles.box
                  }
                  data-testid={elementId.Field.Age + value}
                >
                  <div className={styles.content}>{value}</div>
                </div>
              </>
            )
          })}
        </Space>
      </div>
      {isErrorAge && (
        <span className={styles.errorText}>Wajib pilih kategori umur</span>
      )}
    </>
  )
}
