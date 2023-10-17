import React, { useEffect, useState } from 'react'
import styles from 'styles/components/molecules/formUpdateLeadsSevaOTO/formLeadsResponse.module.scss'
import { Space } from 'antd'
import { useFunnelQueryData } from 'services/context/funnelQueryContext'
import elementId from 'helpers/elementIds'

interface FilterMobileProps extends React.ComponentProps<'div'> {
  setLeadQualified?: any
  leadQualified?: any
  isResetFilter?: boolean
  isApplied?: boolean
}
interface LeadsButtonProps {
  value: string
}

export const FormLeadsQualified = ({
  setLeadQualified,
  leadQualified,
  isResetFilter,
  isApplied,
  ...divProps
}: FilterMobileProps) => {
  const [isQualified, setIsQualified] = useState(
    leadQualified === true ? 'Yes' : 'No',
  )
  const leadsList: LeadsButtonProps[] = [
    {
      value: 'Yes',
    },
    {
      value: 'No',
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
          Leads Qualified <span className={styles.red}>*</span>
        </div>
      </div>
      <Space size={[16, 16]} wrap>
        {leadsList.map(({ value }) => {
          return (
            <>
              <div
                onClick={() => {
                  setIsQualified(value)
                  setLeadQualified(value === 'Yes' ? true : false)
                }}
                key={value}
                className={
                  isQualified === value ? styles.boxOnclick : styles.box
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
