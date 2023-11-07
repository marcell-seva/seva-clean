import clsx from 'clsx'
import React, { useLayoutEffect, useRef, useState } from 'react'
import styles from 'styles/components/molecules/descriptionRefinancing.module.scss'
import { ExpandAction } from '../expandAction'

export const DescriptionRefinancing = () => {
  const [open, setOpen] = useState(false)
  const [expandable, setExpandable] = useState(true)
  const descRef = useRef() as React.MutableRefObject<HTMLDivElement>
  const checkTextOverflow = () => {
    const curHeight = descRef.current.clientHeight
    const curScrollHeight = descRef.current.scrollHeight

    if (curHeight >= curScrollHeight) {
      return setExpandable(false)
    }

    setExpandable(true)
  }

  useLayoutEffect(() => {
    checkTextOverflow()
  }, [])

  return (
    <div className={styles.descriptionSection}>
      <div className={styles.titleAndSubtitleSection}>
        <span className={styles.descriptionTitle}>
          Apa itu Fasilitas Dana?{' '}
        </span>
        <div
          className={clsx({
            [styles.descriptionContent]: true,
            [styles.descriptionContentOpened]: open,
          })}
          ref={descRef}
        >
          Fasilitas pinjaman dana cepat hingga ratusan juta rupiah dengan
          jaminan BPKB mobil, yang dapat menjadi solusi untuk semua kebutuhanmu.
          Butuh dana cepat? SEVA bisa bantu!
          <br />
          <br /> Melalui proses yang mudah, aman, dan nyaman, SEVA hadir untuk
          membantu kebutuhan modal usaha, pendidikan, pernikahan, renovasi
          rumah, dan lainnya. Ayo, ajukan sekarang untuk cairkan dananya!
        </div>
      </div>
      {expandable && (
        <ExpandAction
          open={open}
          lineHeight={'18px'}
          onClick={() => setOpen(!open)}
        />
      )}
    </div>
  )
}
