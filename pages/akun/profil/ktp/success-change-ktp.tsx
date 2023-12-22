import React, { useEffect } from 'react'
import styles from 'styles/pages/account-profile.module.scss'

import elementId from 'helpers/elementIds'
import { useRouter } from 'next/router'
import { PageLayout } from 'components/templates'
import { Button } from 'components/atoms'
import { ButtonSize, ButtonVersion } from 'components/atoms/button'
import { AccountSevaUrl, carResultsUrl } from 'utils/helpers/routes'
import Image from 'next/image'

const SuccessVerif = '/revamp/illustration/success-verification.webp'

const SuccessChangeKtpPage = () => {
  const router = useRouter()

  useEffect(() => {
    return () => {
      localStorage.getItem('ktp_change') ??
        localStorage.removeItem('ktp_change')
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
                Kamu telah berhasil memperbarui KTP Kamu
              </h1>
              <span className={styles.light__text} style={{ color: '#878D98' }}>
                Yuk cari mobil impianmu sekarang!
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
                  onClick={() => router.push(AccountSevaUrl)}
                  data-testid={elementId.Profil.Button.KembaliAkun}
                >
                  Kembali ke Akun
                </Button>
                <Button
                  version={ButtonVersion.SecondaryDark}
                  size={ButtonSize.Big}
                  onClick={() => router.push(carResultsUrl)}
                  data-testid={elementId.Profil.Button.CariMobil}
                >
                  Cari Mobil
                </Button>
              </div>
            </div>
          </main>
        )}
      </PageLayout>
    </>
  )
}

export default SuccessChangeKtpPage
