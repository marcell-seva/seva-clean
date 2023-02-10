import Image from 'next/image'
import React from 'react'
import styles from '../../../styles/AnnouncementBox.module.css'
import { IconCross } from '../../atoms'
import CustomDesktopLeft from '../../../assets/images/annoucementBox/custom/custom-desktop-left.webp'
import CustomDesktopRight from '../../../assets/images/annoucementBox/custom/custom-desktop-right.webp'
import CustomMobileRight from '../../../assets/images/annoucementBox/custom/custom-mobile-right.webp'

export default function AnnouncementBox({ data, onCloseButton }: any) {
  return (
    <div className={styles.wrapper}>
      <Image
        src={CustomDesktopLeft}
        width={125}
        height={64}
        className={styles.iconCustomLeft}
        alt="annoucement-box-dekstop-left"
      />
      <div className={styles.content}>
        <div className={styles.contentDetail}>
          <div className={styles.wrapperMainIcon}>
            <Image
              src={data.data.icon}
              width={19}
              height={19}
              alt="annoucement-box-icon"
              className={styles.mainIcon}
            />
          </div>
          <div className={styles.wrapperContent}>
            <p className={styles.contentText}>
              {data.description.replace('<p>', '').replace('</p>', '')}
            </p>
            <a href={data.url} className={styles.redirectText}>
              {data.textDisplay}
            </a>
          </div>
        </div>
        <div className={styles.wrapperCloseButton} onClick={onCloseButton}>
          <IconCross width={17} height={17} color="#FFFFFF" />
        </div>
      </div>
      <Image
        width={150}
        height={64}
        src={CustomDesktopRight}
        className={styles.iconCustomRight}
        alt="annoucement-box-dekstop-right"
      />
      <Image
        width={60}
        height={64}
        src={CustomMobileRight}
        className={styles.iconCustomMobileRight}
        alt="annoucement-box-dekstop-right"
      />
    </div>
  )
}
