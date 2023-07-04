import React from 'react'
import styles from 'styles/saas/components/molecules/card/infoCard.module.scss'

type TInfoCardProps = {
  title: React.ReactNode
  description: string
}

export default function InfoCard({ title, description }: TInfoCardProps) {
  return (
    <div className={styles.container}>
      {title}

      <h4 className={styles.description}>{description}</h4>
    </div>
  )
}
