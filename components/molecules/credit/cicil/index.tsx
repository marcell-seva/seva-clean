import React from 'react'
import styles from 'styles/components/molecules/dp/cicilform.module.scss'
import { Row, Button } from 'antd'
import elementId from 'helpers/elementIds'
import { InstallmentTypeOptions } from 'utils/types/models'
import clsx from 'clsx'

interface CicilOptionFormProps {
  isClicked?: boolean
  onClick: (isClicked: boolean) => void
  name: string
  handleChange: (name: string, value: any) => void
  value?: string
}

export function CicilOptionForm({
  onClick,
  name,
  handleChange,
  value,
}: CicilOptionFormProps) {
  return (
    <div>
      <p className={styles.titleText}>Pembayaran cicilan pertama</p>
      <div className={styles.cicilOptionForm}>
        <Row>
          <Button
            className={clsx({
              [styles.buttonOption]: true,
              [styles.selectedStyle]: value === InstallmentTypeOptions.ADDM,
            })}
            onClick={() => {
              onClick(true)
              handleChange(name, InstallmentTypeOptions.ADDM)
            }}
            style={{
              background:
                value === InstallmentTypeOptions.ADDM ? '#F3F9FD' : '#fff',
            }}
            data-testid={elementId.Field.ADDM}
          >
            <p className={styles.buttonOptionText}>Bayar di Muka</p>
            <p className={styles.titleTextDP}>Dibayar bersama dengan DP</p>
          </Button>
        </Row>
        <Row>
          <Button
            className={clsx({
              [styles.buttonOption]: true,
              [styles.selectedStyle]: value === InstallmentTypeOptions.ADDB,
            })}
            onClick={() => {
              onClick(false)
              handleChange(name, InstallmentTypeOptions.ADDB)
            }}
            style={{
              background:
                value === InstallmentTypeOptions.ADDB ? '#F3F9FD' : '#fff',
            }}
            data-testid={elementId.Field.ADDB}
          >
            <p className={styles.buttonOptionText}>Bayar di Belakang</p>
            <p className={styles.titleTextDP}>Dibayar sebulan setelah DP</p>
          </Button>
        </Row>
      </div>
    </div>
  )
}
