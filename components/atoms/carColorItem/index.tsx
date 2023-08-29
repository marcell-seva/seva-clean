import React from 'react'
import styles from 'styles/components/atoms/carColorItem.module.scss'

interface Props {
  color: string | string[]
}

export const CarColorItem = ({ color }: Props) => {
  return (
    <div className={styles.outer}>
      {Array.isArray(color) ? (
        <div className={styles.inner} style={{ background: 'none' }}>
          <div
            className={styles.innerTop}
            style={{ background: color[0] }}
          ></div>
          <div
            className={styles.innerBottom}
            style={{ background: color[1] }}
          ></div>
        </div>
      ) : (
        <div className={styles.inner} style={{ background: color }}></div>
      )}
    </div>
  )
}
