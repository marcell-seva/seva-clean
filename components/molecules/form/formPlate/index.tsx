import React, { useEffect, useState } from 'react'
import styles from 'styles/components/molecules/form/formTransmission.module.scss'
import { Space } from 'antd'
import { useFunnelQueryUsedCarData } from 'services/context/funnelQueryUsedCarContext'
import elementId from 'helpers/elementIds'

export interface FilterMobileProps {
  setPlateFilter?: any
  isResetFilter?: boolean
  plate?: any
  isApplied?: boolean
  isButtonClick: boolean | undefined
}
interface PlateButtonProps {
  value: string
  no: number
  isChecked: boolean
}

export const FormPlate = ({
  setPlateFilter,
  isResetFilter,
  isApplied,
  plate,
  isButtonClick,
}: FilterMobileProps) => {
  const { funnelQuery, patchFunnelQuery } = useFunnelQueryUsedCarData()
  const [plateQuery, setPlateQuery] = useState<string[]>([])
  setPlateFilter(plateQuery)

  const paramQuery = funnelQuery

  const plateList: PlateButtonProps[] = [
    {
      value: 'Ganjil',
      no: 1,
      isChecked: plateQuery.includes('Ganjil'),
    },
    {
      value: 'Genap',
      no: 2,
      isChecked: plateQuery.includes('Genap'),
    },
  ]

  useEffect(() => {
    if (isResetFilter) {
      setPlateQuery([])
    }
    if (plate?.length === 0 && plate && !isApplied) {
      setPlateQuery([])
    } else if (funnelQuery.plate && !isResetFilter && isApplied) {
      setPlateQuery(funnelQuery.plate)
      paramQuery.plate = funnelQuery.plate
    }
    if (
      isButtonClick &&
      plateQuery.length === 0 &&
      plate &&
      plate.length > 0 &&
      !isApplied
    ) {
      setPlateQuery(plate.split(','))
      setPlateFilter(plate.split(','))
    }
    if (isApplied) {
      setPlateFilter(plateQuery)
    }
    if (
      !isButtonClick &&
      plateQuery.length > 0 &&
      funnelQuery.plate?.length === 0 &&
      !isApplied
    ) {
      setPlateQuery([])
    }
  }, [isResetFilter, isApplied, isButtonClick])

  const onClick = (value: string) => {
    if (plateQuery.includes(value)) {
      setPlateQuery(plateQuery.filter((item) => item !== value))
    } else {
      setPlateQuery([...plateQuery, value])
    }
  }

  return (
    <div className={styles.container}>
      <Space size={[18, 18]} wrap className={styles.childContainer}>
        {plateList.map(({ value, isChecked }) => {
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
    </div>
  )
}
