import { IconSeat } from 'components/atoms'
import {
  IconDimension,
  IconEngine,
  IconFuel,
  IconFuelTank,
  IconTransmission,
} from 'components/atoms/icon'
import React from 'react'
import styles from 'styles/components/molecules/popupCarDetail/specificationCarDetail.module.scss'

interface SpecificationCarDetailProps {
  carSeats?: number
  engineCapacity?: number
  fuelType?: string
  transmission?: string
  rasioBahanBakar?: string
  dimenssion?: string
}

const ICON_SIZE = 23
const COLOR = '#246ED4'

const SpecificationCarDetail: React.FC<SpecificationCarDetailProps> = ({
  carSeats,
  engineCapacity,
  fuelType,
  transmission,
  rasioBahanBakar,
  dimenssion,
}) => {
  return (
    <div className={styles.container}>
      {carSeats && (
        <div className={styles.content}>
          <IconSeat color={COLOR} width={ICON_SIZE} height={ICON_SIZE} />
          <h2 className={styles.text}>{carSeats} Kursi</h2>
        </div>
      )}

      {rasioBahanBakar && (
        <div className={styles.content}>
          <IconFuelTank color={COLOR} width={ICON_SIZE} height={ICON_SIZE} />
          <h2 className={styles.text}>Rasio bahan bakar {rasioBahanBakar}</h2>
        </div>
      )}

      {fuelType && (
        <div className={styles.content}>
          <IconFuel color={COLOR} width={ICON_SIZE} height={ICON_SIZE} />
          <h2 className={styles.text}>Bahan bakar {fuelType.toLowerCase()}</h2>
        </div>
      )}

      {engineCapacity && (
        <div className={styles.content}>
          <IconEngine color={COLOR} width={ICON_SIZE} height={ICON_SIZE} />
          <h2 className={styles.text}>Kapasitas Mesin {engineCapacity} cc</h2>
        </div>
      )}

      {transmission && (
        <div className={styles.content}>
          <IconTransmission
            color={COLOR}
            width={ICON_SIZE}
            height={ICON_SIZE}
          />
          <h2 className={styles.text}>{transmission}</h2>
        </div>
      )}

      {dimenssion && (
        <div className={styles.content}>
          <IconDimension color={COLOR} width={ICON_SIZE} height={ICON_SIZE} />
          <h2 className={styles.text}>{dimenssion}</h2>
        </div>
      )}
    </div>
  )
}

export default SpecificationCarDetail
