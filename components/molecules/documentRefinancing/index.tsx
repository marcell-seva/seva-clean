import React, { useState } from 'react'
import clsx from 'clsx'
import { DownOutlined } from 'components/atoms'
import elementId from 'helpers/elementIds'
import styles from 'styles/components/molecules/documentRefinancing.module.scss'
import { colors } from 'utils/helpers/style/colors'
import Checkbox from 'public/revamp/images/refinancing/Checkbox.svg'
import Image from 'next/image'

export const DocumentRefinancing = () => {
  const [isExpand, setIsExpand] = useState(false)
  const listDocument = [
    {
      document: ' KTP Pemohon & Pasangan (jika sudah menikah)',
    },
    {
      document: ' Kartu Keluarga',
    },
    {
      document: ' NPWP',
    },
    {
      document: ' BPKB Mobil',
    },
    {
      document: ' STNK Mobil',
    },
    {
      document: ' Cover Buku Tabungan',
    },
  ]

  const onChooseItem = () => {
    if (isExpand) setIsExpand(false)
    else setIsExpand(true)
  }

  return (
    <>
      <div className={styles.wrapper}>
        <div
          className={clsx({
            [styles.boxDocument]: true,
            [styles.boxDocumentOpened]: isExpand,
          })}
          data-testid={elementId.Refinancing.RequiredDocument}
          onClick={() => onChooseItem()}
        >
          <div className={styles.questionDocument}>
            <h3
              className={styles.titleDocument}
              style={{
                margin: '0 16px',
                color: colors.primaryDarkBlue,
                fontSize: 14,
              }}
            >
              Dokumen yang Dibutuhkan
            </h3>
            <div
              className={clsx({
                [styles.styledIcon]: true,
                [styles.styledIconOpened]: isExpand,
              })}
            >
              <DownOutlined
                color={colors.primaryBlue}
                width={10.64}
                height={9.28}
              />
            </div>
          </div>
          <h3
            className={styles.subtitleDocument}
            style={{
              color: colors.label,
            }}
          >
            Untuk mengajukan pinjaman, berikut ini dokumen-dokumen yang perlu
            kamu siapkan.
          </h3>
          {listDocument.map((item) => (
            // eslint-disable-next-line react/jsx-key
            <div className={styles.itemWrapper}>
              <Image
                width={16}
                height={16}
                src={Checkbox}
                alt="refinancing-checklist"
              />
              <div className={styles.itemInfo}>{item.document}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
