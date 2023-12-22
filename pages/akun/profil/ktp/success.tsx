import React, { useEffect } from 'react'
import styles from 'styles/pages/account-profile.module.scss'

import elementId from 'helpers/elementIds'
import { useRouter } from 'next/router'
import { PageLayout } from 'components/templates'
import { Button } from 'components/atoms'
import { ButtonSize, ButtonVersion } from 'components/atoms/button'
import { carResultsUrl } from 'utils/helpers/routes'
import { PreviousButton, navigateToPLP } from 'utils/navigate'
import Image from 'next/image'

const SuccessVerif = '/revamp/illustration/success-verification.webp'
const LogoAppStore = '/revamp/images/profile/app-store.webp'
const LogoPlayStore = '/revamp/images/profile/google-play.webp'

const SuccessPage = () => {
  const router = useRouter()

  useEffect(() => {
    return () => {
      // TODO robby
      // if (router.action === 'POP') {
      //   router.push('/akun/profil')
      // }
    }
  }, [router])

  return (
    <>
      <PageLayout>
        {() => (
          <main className={styles.wrapper}>
            <div className={styles.container}>
              <Image
                src={SuccessVerif}
                className={styles.banner__illustration}
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  margin: '0 auto',
                }}
                alt="Success Illustatrion"
                onClick={() => router.back()}
              />
              <h1 className={styles.titleText}>
                Selamat, Kamu Mendapatkan Promo untuk Mobil Impianmu!
              </h1>
              <span className={styles.light__text} style={{ color: '#878D98' }}>
                Yuk, lihat promo yang tersedia di SEVA untuk mobil impianmu.
              </span>
              <div
                className=""
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: '10px',
                  marginTop: '32px',
                }}
              >
                <Button
                  version={ButtonVersion.Outline}
                  size={ButtonSize.Big}
                  onClick={() => navigateToPLP(PreviousButton.undefined)}
                  data-testid={elementId.Profil.Button.CariMobilLain}
                >
                  Cari Mobil Lain
                </Button>
                <Button
                  version={ButtonVersion.SecondaryDark}
                  size={ButtonSize.Big}
                  onClick={() =>
                    window.open('https://www.seva.id/info/', '_blank')
                  }
                  data-testid={elementId.Profil.Button.LihatPromo}
                >
                  Lihat Promo
                </Button>
              </div>
              <div style={{ margin: '24px auto 8px' }}>
                <p className={styles.downloadText}>
                  Download Aplikasi SEVA untuk proses pengajuan mobil:
                </p>
              </div>
              <div
                className=""
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  gap: '10px',
                  margin: '0 auto',
                }}
              >
                <Image
                  src={LogoPlayStore}
                  alt="back"
                  onClick={() =>
                    window.open(
                      'https://play.google.com/store/apps/details?id=id.seva',
                    )
                  }
                  style={{
                    width: '152px',
                    height: '46px',
                    objectFit: 'contain',
                  }}
                  data-testid={elementId.Profil.Button.PlayStore}
                />
                <Image
                  src={LogoAppStore}
                  alt="back"
                  onClick={() =>
                    window.open(
                      'https://apps.apple.com/id/app/seva/id1589727482?l=id',
                    )
                  }
                  style={{
                    width: '152px',
                    height: '46px',
                    objectFit: 'contain',
                  }}
                  data-testid={elementId.Profil.Button.AppStore}
                />
              </div>
            </div>
          </main>
        )}
      </PageLayout>
    </>
  )
}

export default SuccessPage
