import { LanguageCode } from 'utils/models/models'
import React from 'react'
import { articleDateFormat } from 'utils/dateUtils'
import styles from 'styles/saas/components/molecules/card/primaryCard.module.scss'
import CommonLabel from '../../labelCard/common'

type TPrimaryCardProps = {
  title: string
  image: string
  date: Date
  url: string
  label: string
  handleClick: (url: string) => void
}

export default function PrimaryCard({
  title,
  date,
  image,
  url,
  label,
  handleClick,
}: TPrimaryCardProps) {
  return (
    <div onClick={() => handleClick(url)} className={styles.container}>
      <div className={styles.imageWrapper}>
        <img src={image} alt={title} className={styles.image} />

        {label && <CommonLabel title={label} />}
      </div>

      <div className={styles.content}>
        <p className={styles.date}>
          {articleDateFormat(date, LanguageCode.id)}
        </p>
        <h3 className={styles.title}>{title}</h3>
      </div>
    </div>
  )
}
