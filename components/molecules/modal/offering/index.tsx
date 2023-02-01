import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import styles from '../../../../styles/Offering.module.css'
import { IconCross } from '../../../atoms'
import FlagIndonesia from '../../../../assets/images/flagIndonesia.png'
interface Form {
  name: string
  phone: any
  whatsapp: boolean
}
interface Props {
  openThankyouModal: any
  closeOfferingModal: any
}
export default function Offering({
  openThankyouModal,
  closeOfferingModal,
}: Props) {
  const [active, setActive] = useState<boolean>(false)
  const [form, setForm] = useState<Form>({
    name: '',
    phone: 0,
    whatsapp: false,
  })

  const handleChange = (indexKey: string, payload: string | boolean) => {
    setForm((prevState: any) => ({ ...prevState, [indexKey]: payload }))
  }

  const sendForm = () => {
    console.log(form)
    openThankyouModal()
  }

  useEffect(() => {
    setActive(form.name !== '' && form.phone.length > 3)
  }, [form])
  return (
    <div className={styles.modal}>
      <div className={styles.wrapper}>
        <div className={styles.content}>
          <div className={styles.bundleIcon} onClick={closeOfferingModal}>
            <IconCross width={24} height={24} />
          </div>
          <h1 className={styles.headerText}>Punya Pertanyaan ?</h1>
          <p className={styles.descText}>
            Tulis rincian kontakmu supaya agen kami bisa segera menghubungi
            kamu.
          </p>
          <input
            type="text"
            className={styles.inputName}
            placeholder="Nama Lengkap"
            onChange={(e) => handleChange('name', e.target.value)}
          />
          <div className={styles.wrapperInputPhone}>
            <div className={styles.phoneDetail}>
              <Image
                src={FlagIndonesia}
                width={16}
                height={16}
                alt="indonesia-flag"
              />
              <p className={styles.labelRegion}>+62</p>
              <p className={styles.separator}>|</p>
            </div>
            <input
              type="number"
              className={styles.inputPhone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="Contoh : 0895401011469"
            />
          </div>
          <label className={styles.agreement}>
            <input
              type="checkbox"
              name="checkbox"
              onChange={() => handleChange('whatsapp', !form.whatsapp)}
            />
            <p className={styles.agreementText}>
              Saya memilih untuk dihubungi via WhatsApp
            </p>
          </label>
          <button
            onClick={() => {
              active && sendForm()
            }}
            className={active ? styles.buttonActive : styles.buttonInActive}
          >
            Kirim Rincian
          </button>
        </div>
      </div>
    </div>
  )
}
