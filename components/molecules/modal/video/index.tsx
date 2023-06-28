import React from 'react'
import styles from '../../../../styles/saas/components/molecules/Video.module.scss'
import { IconCross } from 'components/atoms'

interface PropsVideo {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void
}
const Video: React.FC<PropsVideo> = ({ onClick }): JSX.Element => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.position}>
        <div className={styles.content}>
          <button className={styles.buttonClose} onClick={onClick}>
            <IconCross width={24} height={24} color="#000000" />
          </button>
          <iframe
            src="https://www.youtube.com/embed/W9UromSp85E"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Embedded youtube"
            className={styles.video}
          />
        </div>
      </div>
    </div>
  )
}
export default Video
