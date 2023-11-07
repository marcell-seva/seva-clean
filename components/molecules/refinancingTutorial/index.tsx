import Image from 'next/image'
import React from 'react'
import styles from 'styles/components/molecules/refinancingTutorial.module.scss'
import TutorIcon1 from 'public/revamp/images/refinancing/Tutorialicon1.webp'
import TutorIcon2 from 'public/revamp/images/refinancing/Tutorialicon2.webp'
import TutorIcon3 from 'public/revamp/images/refinancing/Tutorialicon3.webp'
import TutorIcon4 from 'public/revamp/images/refinancing/Tutorialicon4.webp'

export const RefinancingTutorial = () => {
  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        <h2 className={styles.title}>Cara Pengajuan Pinjaman</h2>
        <div className={styles.stepWrapper}>
          <div className={styles.itemWrapper}>
            <div className={styles.styledImgWrapper}>
              <Image
                width={70}
                height={61}
                className={styles.styledImg}
                src={TutorIcon1}
                alt="Fasilitas Dana Tutorial Image 1"
              />
            </div>
            <div className={styles.itemInfo}>
              <span className={styles.itemTitle}>
                <span className={styles.itemTitleGrey}>1</span> Isi Form{' '}
                <span className={styles.itemTitleGreyItalic}>Online</span>
              </span>
              <span className={styles.itemDesc}>
                Isi form secara{' '}
                <span className={styles.itemDescItalic}>online</span> dan
                lengkapi data dirimu.
              </span>
            </div>
          </div>
          <div className={styles.itemWrapper}>
            <div className={styles.styledImgWrapper}>
              <Image
                width={70}
                height={61}
                className={styles.styledImg}
                src={TutorIcon2}
                alt="Fasilitas Dana Tutorial Image 2"
              />
            </div>
            <div className={styles.itemInfo}>
              <span className={styles.itemTitle}>
                <span className={styles.itemTitleGrey}>2</span> Konfirmasi
                dengan Tim SEVA
              </span>
              <span className={styles.itemDesc}>
                Tim SEVA akan segera menghubungi kamu dalam kurun waktu 1x24
                jam.
              </span>
            </div>
          </div>
          <div className={styles.itemWrapper}>
            <div className={styles.styledImgWrapper}>
              <Image
                width={70}
                height={61}
                className={styles.styledImg}
                src={TutorIcon3}
                alt="Fasilitas Dana Tutorial Image 3"
              />
            </div>
            <div className={styles.itemInfo}>
              <span className={styles.itemTitle}>
                <span className={styles.itemTitleGrey}>3</span> Survei
              </span>
              <span className={styles.itemDesc}>
                Survei akan dilakukan setelah kamu melengkapi persyaratan yang
                diperlukan.
              </span>
            </div>
          </div>
          <div className={styles.itemWrapper}>
            <div className={styles.styledImgWrapper}>
              <Image
                width={70}
                height={61}
                className={styles.styledImg}
                src={TutorIcon4}
                alt="Fasilitas Dana Tutorial Image 4"
              />
            </div>
            <div className={styles.itemInfo}>
              <span className={styles.itemTitle}>
                <span className={styles.itemTitleGrey}>4</span> Pencairan Dana
              </span>
              <span className={styles.itemDesc}>
                Dana pinjaman akan segera cair ke rekening kamu.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
