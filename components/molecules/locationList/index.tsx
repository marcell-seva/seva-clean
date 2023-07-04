import React, { useContext } from 'react'
import styles from 'styles/components/molecules/LocationList.module.scss'
import { LocationContext, LocationContextType } from 'services/context'
import { IconLocation } from 'components/atoms'
interface PropsLocation {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void
}
const LocationList: React.FC<PropsLocation> = ({ onClick }): JSX.Element => {
  const { location, isInit } = useContext(
    LocationContext,
  ) as LocationContextType
  const infoText: string = 'Beli mobil di '
  const labelText: string = 'Ganti Lokasi'
  const defaultLocationText: string = 'Jakarta Pusat'

  return (
    <div className={styles.wrapper}>
      <IconLocation width={16} height={16} color="#D83130" />
      <p className={styles.descText}>
        {infoText}
        <span className={styles.locText}>
          {isInit ? defaultLocationText : location.cityName}
        </span>
        <button onClick={onClick} className={styles.button}>
          {labelText}
        </button>
      </p>
    </div>
  )
}

export default LocationList
