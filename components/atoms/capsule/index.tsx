import React from 'react'
import styles from 'styles/saas/components/atoms/Capsule.module.scss'
import { PropsCapsule } from 'utils/types'

const Capsule: React.FC<PropsCapsule> = ({ item, onClick }): JSX.Element => {
  return (
    <button className={styles.capsule} onClick={onClick}>
      <p className={styles.capsuleLabel}>{item.cityName}asdadsasd</p>
    </button>
  )
}

export default Capsule
