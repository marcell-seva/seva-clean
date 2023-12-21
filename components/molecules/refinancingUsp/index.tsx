import React from 'react'
import styles from 'styles/components/molecules/refinancingUsp.module.scss'
import Image from 'next/image'
import UspIcon1 from 'public/revamp/images/refinancing/UspIcon1.webp'
import UspIcon2 from 'public/revamp/images/refinancing/UspIcon2.webp'
import UspIcon3 from 'public/revamp/images/refinancing/UspIcon3.webp'

export const RefinancingUsp = () => {
  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        <h2 className={styles.title}>
          Jaminkan BPKB mobilmu di SEVA dengan mudah, aman, dan nyaman!
        </h2>
        <div className={styles.stepWrapper}>
          <div className={styles.itemWrapper}>
            <div className={styles.styledImgWrapper}>
              <Image
                width={70}
                height={48}
                className={styles.styledImg}
                src={UspIcon1}
                alt="Fasilitas Dana USP Image 1"
              />
            </div>
            <div className={styles.itemInfo}>
              <span className={styles.itemTitle}>
                Cukup 30 Detik untuk Isi Form
              </span>
              <span className={styles.itemDesc}>
                Lakukan pengajuan pinjaman secara online dengan mengisi form dan
                lengkapi data diri.
              </span>
            </div>
          </div>
          <div className={styles.itemWrapper}>
            <div className={styles.styledImgWrapper}>
              <Image
                width={70}
                height={48}
                className={styles.styledImg}
                src={UspIcon2}
                alt="Fasilitas Dana USP Image 2"
              />
            </div>
            <div className={styles.itemInfo}>
              <span className={styles.itemTitle}>
                Solusi untuk Kebutuhan Dana-mu
              </span>
              <span className={styles.itemDesc}>
                Butuh dana untuk tambahan modal usaha, pendidikan, pernikahan,
                renovasi rumah, atau yang lainnya? SEVA bisa bantu kamu cairkan
                dana cepat dengan bunga mulai dari 6%.
              </span>
            </div>
          </div>
          <div className={styles.itemWrapper}>
            <div className={styles.styledImgWrapper}>
              <Image
                width={70}
                height={48}
                className={styles.styledImg}
                src={UspIcon3}
                alt="Fasilitas Dana USP Image 3"
              />
            </div>
            <div className={styles.itemInfo}>
              <span className={styles.itemTitle}>
                Bagian dari Astra Financial
              </span>
              <span className={styles.itemDesc}>
                Sebagai bagian dari ekosistem Astra, kami menjunjung tinggi
                kepuasan pelanggan dengan menyediakan layanan yang aman dan
                terpercaya untuk kamu.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
