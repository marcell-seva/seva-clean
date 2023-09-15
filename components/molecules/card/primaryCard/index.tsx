import { LanguageCode } from 'utils/enum'
import React from 'react'
import styles from 'styles/components/molecules/card/primaryCard.module.scss'
import CommonLabel from '../../labelCard/common'
import { articleDateFormat } from 'utils/handler/date'
import Image from 'next/image'

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
        <Image src={image} alt={title} className={styles.image} />

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
