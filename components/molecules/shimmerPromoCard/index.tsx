import React from 'react'
import styles from 'styles/components/molecules/shimmerPromoCard.module.scss'
import clsx from 'clsx'
import { IconSquareCheckBox } from 'components/atoms/icon'

interface Props {
  type: 'selectable' | 'unavailable'
}

export const ShimmerPromoCard = ({ type }: Props) => {
  return (
    <div className={styles.container}>
      <div
        className={clsx({
          [styles.header]: true,
          [styles.whiteShade10]: type === 'unavailable',
        })}
      ></div>

      <div
        className={clsx({
          [styles.uppperSection]: true,
          [styles.whiteShade5]: type === 'unavailable',
        })}
      >
        <div className={styles.infoSection}>
          <div
            className={clsx({
              [styles.text]: true,
              [styles.whiteShade10]: type === 'unavailable',
            })}
            style={{ width: '199px' }}
          ></div>
          <div
            className={clsx({
              [styles.text]: true,
              [styles.whiteShade10]: type === 'unavailable',
            })}
            style={{ width: '138px', marginTop: '18px' }}
          ></div>
          <div
            className={clsx({
              [styles.text]: true,
              [styles.whiteShade10]: type === 'unavailable',
            })}
            style={{ width: '185px', marginTop: '4px' }}
          ></div>
        </div>

        <div className={styles.iconWrapper}>
          <IconSquareCheckBox width={16} height={16} />
        </div>
      </div>

      <div
        className={clsx({
          [styles.separator]: true,
          [styles.hideComponent]: type === 'unavailable',
        })}
      ></div>

      <div
        className={clsx({
          [styles.bottomSection]: true,
          [styles.hideComponent]: type === 'unavailable',
        })}
      >
        <div className={styles.circle}></div>
        <div className={styles.text} style={{ width: '160px' }}></div>
      </div>
    </div>
  )
}
