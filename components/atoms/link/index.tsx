import React from 'react'
import styles from 'styles/components/atoms/link.module.scss'

interface LinkProps {
  message: string
  url?: string
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void
}

export const Link: React.FC<LinkProps> = ({
  message,
  url,
  onClick,
  ...props
}): JSX.Element => {
  return (
    <a href={url} className={styles.wrapper} onClick={onClick} {...props}>
      {message}
    </a>
  )
}
