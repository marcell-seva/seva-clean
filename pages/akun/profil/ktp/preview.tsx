import React, { useState, useEffect } from 'react'
import styles from 'styles/pages/account-profile.module.scss'
import { fetchCustomerKtp } from 'utils/httpUtils/customerUtils'
import elementId from 'helpers/elementIds'
import { useRouter } from 'next/router'
import { GetCustomerKtpSeva } from 'utils/types/utils'
import { cameraKtpUrl, rootUrl } from 'utils/helpers/routes'
import { PageLayout } from 'components/templates'
import { Button, Skeleton, Toast } from 'components/atoms'
import { ButtonSize, ButtonVersion } from 'components/atoms/button'

const Ktp = () => {
  const router = useRouter()
  const [toast, setToast] = useState('')
  const [customerDetail, setCustomerDetail] =
    React.useState<GetCustomerKtpSeva>()

  const [isLoadingCustomer, setIsLoadingCustomer] = useState(false)
  const navigateToCamera = () => {
    router.push(cameraKtpUrl)
  }
  const getCustomerInfoData = async () => {
    setIsLoadingCustomer(true)
    try {
      const response = await fetchCustomerKtp()
      const customerDetails: GetCustomerKtpSeva = response.data[0]
      setCustomerDetail({
        name: customerDetails.name,
        nik: customerDetails.nik,
        birthdate: customerDetails.birthdate,
        address: customerDetails.address,
        rtrw: customerDetails.rtrw,
        keldesa: customerDetails.keldesa,
        kecamatan: customerDetails.kecamatan,
        city: customerDetails.city,
        province: customerDetails.province,
        gender: customerDetails.gender,
        marriage: customerDetails.marriage,
        created: customerDetails.created,
      })
    } catch (error) {
      router.push(rootUrl)
    } finally {
      setIsLoadingCustomer(false)
    }
  }
  useEffect(() => {
    getCustomerInfoData()
  }, [])
  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) {
      return ''
    }

    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      timeZone: 'Asia/Jakarta',
    }

    const [datePart, timePart] = dateString.split(' ')
    const [year, month, day] = datePart.split('-')
    const [hour, minute, second] = timePart?.split(':') || ['', '', '']

    const date = new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      parseInt(hour),
      parseInt(minute),
      parseInt(second),
    )

    return new Intl.DateTimeFormat('id-ID', options).format(date)
  }
  return (
    <>
      <PageLayout footer={false}>
        {() => (
          <main className={styles.wrapper}>
            {isLoadingCustomer ? (
              <section className={styles.preview__wrapper__form}>
                <section className={styles.info}>
                  <h2 className={`medium ${styles.info} ${styles.titleText}`}>
                    Data dari KTP-mu
                  </h2>
                </section>
                <section className={styles.info}>
                  <Skeleton height={40} width={200} />
                </section>
                <Skeleton height={40} width={200} />
                <Skeleton height={40} width={200} />
                <Skeleton height={40} width={200} />
                <Skeleton height={40} width={200} />
                <Skeleton height={40} width={200} />
                <Skeleton height={40} width={200} />
                <Skeleton height={40} width={200} />
              </section>
            ) : (
              <section className={styles.preview__wrapper__form}>
                <div className={styles.ktp__page__title}>
                  <h2 className={`medium ${styles.info} ${styles.titleText}`}>
                    Data dari KTP-mu
                  </h2>
                  <h5 className={styles.light__text}>
                    Ditambahkan pada {formatDate(customerDetail?.created)} WIB
                  </h5>
                </div>
                <table>
                  <tr>
                    <td className={styles.row_table_text}>NIK</td>
                    <td className={styles.row_table_text}>
                      {customerDetail?.nik}
                    </td>
                  </tr>
                  <tr>
                    <td className={styles.row_table_text}>Nama</td>
                    <td className={styles.row_table_text}>
                      {customerDetail?.name}
                    </td>
                  </tr>
                  <tr>
                    <td className={styles.row_table_text}>Alamat</td>
                    <td className={styles.row_table_text}>
                      {customerDetail?.address}
                    </td>
                  </tr>
                  <tr>
                    <td className={styles.row_table_text_end}>RT/RW</td>
                    <td className={styles.row_table_text}>
                      {customerDetail?.rtrw ?? '-'}
                    </td>
                  </tr>
                  <tr>
                    <td className={styles.row_table_text_end}>Kel/Desa</td>
                    <td className={styles.row_table_text}>
                      {customerDetail?.keldesa ?? '-'}
                    </td>
                  </tr>
                  <tr>
                    <td className={styles.row_table_text_end}>Kecamatan</td>
                    <td className={styles.row_table_text}>
                      {customerDetail?.kecamatan ?? '-'}
                    </td>
                  </tr>
                  <tr>
                    <td className={styles.row_table_text}>Status Perkawinan</td>
                    <td className={styles.row_table_text}>
                      {customerDetail?.marriage}
                    </td>
                  </tr>
                </table>
                <div className={styles.sticky__button}>
                  <Button
                    onClick={() => {
                      navigateToCamera()
                      localStorage.setItem('change_ktp', 'true')
                    }}
                    version={ButtonVersion.PrimaryDarkBlue}
                    size={ButtonSize.Big}
                    data-testid={elementId.Profil.Button.GantiKTP}
                  >
                    Ganti KTP
                  </Button>
                </div>
              </section>
            )}
          </main>
        )}
      </PageLayout>
      {toast ? (
        <Toast
          text={toast}
          maskClosable
          closeOnToastClick
          onCancel={() => {
            setToast('')
          }}
        />
      ) : null}
    </>
  )
}

export default Ktp
