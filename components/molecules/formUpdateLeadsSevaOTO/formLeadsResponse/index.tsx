import React, { useEffect, useState } from 'react'
import styles from 'styles/components/molecules/formUpdateLeadsSevaOTO/formLeadsResponse.module.scss'
import { Space } from 'antd'
import { useFunnelQueryData } from 'services/context/funnelQueryContext'
import elementId from 'helpers/elementIds'

interface FilterMobileProps extends React.ComponentProps<'div'> {
  setTenureFilter?: any
  isResetFilter?: boolean
  isApplied?: boolean
}
interface LeadsButtonProps {
  value: string
}

export const FormLeadsResponse = ({
  setTenureFilter,
  isResetFilter,
  isApplied,
  ...divProps
}: FilterMobileProps) => {
  const [leadsResponse, setLeadsResponse] = useState('Answered')
  const leadsList: LeadsButtonProps[] = [
    {
      value: 'Answered',
    },
    {
      value: 'Unanswered',
    },
  ]

  //   useEffect(() => {
  //     if (isResetFilter) {
  //       setTenureFilter(5)
  //     }
  //     if (tenureQuery === 5 && !isApplied) {
  //       setTenureQuery(funnelQuery.tenure)
  //     }
  //   }, [isResetFilter, isApplied])

  return (
    <div {...divProps}>
      <div className={styles.wrapperHeader}>
        <div className={styles.textTitle}>
          Leads Response <span className={styles.red}>*</span>
        </div>
      </div>
      <Space size={[16, 16]} wrap>
        {leadsList.map(({ value }) => {
          return (
            <>
              <div
                onClick={() => {
                  setLeadsResponse(value)
                }}
                key={value}
                className={
                  leadsResponse === value ? styles.boxOnclick : styles.box
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
