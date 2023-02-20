import React from 'react'
import styles from '../../../styles/atoms/Capsule.module.css'
import { PropsCapsule } from '../../../utils/types'

const Capsule: React.FC<PropsCapsule> = ({ item, onClick }): JSX.Element => {
  return (
    <button className={styles.location} onClick={onClick}>
      <p className={styles.locationText}>{item.cityName}</p>
    </button>
  )
}

export default Capsule
