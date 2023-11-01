import React, { useEffect, useState } from 'react'
import styles from 'styles/components/molecules/formUpdateLeadsSevaOTO/formLeadsResponse.module.scss'
import dynamic from 'next/dynamic'
import { useFunnelQueryData } from 'services/context/funnelQueryContext'
import elementId from 'helpers/elementIds'

const Space = dynamic(() => import('antd').then((mod) => mod.Space))

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

  return (
    <div {...divProps}>
      <div className={styles.wrapperHeader}>
        <div className={styles.textTitle}>
          Leads Qualified <span className={styles.red}>*</span>
        </div>
      </div>
      <div className={styles.wrapperBox}>
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
      </div>
    </div>
  )
}
