import Seo from 'components/atoms/seo'
import { InformationSection } from 'components/organisms'
import { InferGetServerSidePropsType } from 'next'
import { defaultSeoImage } from 'utils/helpers/const'
import styles from 'styles/pages/updateleadsformCM.module.scss'
import FormDBLeads from 'components/molecules/formUpdateLeadsSevaOTO/formDBLeads'
import { useRouter } from 'next/router'
import { CityOtrOption } from 'utils/types'
import { InstallmentTypeOptions } from 'utils/types/models'
import { useEffect, useState } from 'react'
import FormDealerSales from 'components/molecules/formUpdateLeadsSevaOTO/formDealerSales'
import { Button, Input } from 'components/atoms'
import { DatePickerCM } from 'components/atoms/inputDate'
import { LabelWithTooltip } from 'components/molecules'
import { ButtonSize, ButtonVersion } from 'components/atoms/button'
import { LabelTooltipSevaOTO } from 'components/molecules/label/labelTooltipSevaOTO'
import dayjs from 'dayjs'
import { InferType, number, object, string } from 'yup'
import { useFormik } from 'formik'
import { updateLeadFormCMSEVA } from 'services/leadsCM'
import { api } from 'services/api'
import { useUtils } from 'services/context/utilsContext'
import FormSelectCitySevaOTO from 'components/molecules/formUpdateLeadsSevaOTO/formSelectCitySevaOTO'
import { getLeadsDetail } from 'services/leadsSeva'
import dynamic from 'next/dynamic'

const Toast = dynamic(() => import('components/atoms').then((mod) => mod.Toast))

const getSlug = (query: any, index: number) => {
  return (
    query.slug && query.slug.length > index && (query.slug[index] as string)
  )
}

interface CsaInput {
  salesId: number
  spkDate: string
  spkNo: string
  bstkDate: string
  bstkNo: string
}

interface DataResponse {
  leadId: string
  csaInput: CsaInput
}

const UpdateLeadsFormCM = ({
  message,
  isValidz,
  dataAgent,
  csaInput,
  leadId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { saveAgent } = useUtils()
  const [isRequiredSPK, setIsRequiredSPK] = useState(false)
  const [isRequiredBSTK, setIsRequiredBSTK] = useState(false)
  const [isOpenToast, setIsOpenToast] = useState(false)
  const [toastMessage, setToastMessage] = useState(
    'Lead berhasil diassign ke dealer & sales agent',
  )
  const cmSchema = object().shape({
    dbLeadsId: string(),
    salesId: number(),
    noSPK: string(),
    spkDate: string(),
    noBSTK: string(),
    bstkDate: string(),
  })

  type CMForm = InferType<typeof cmSchema>

  const {
    values,
    handleChange,
    handleBlur,
    setFieldValue,
    isValid,
    handleSubmit,
  } = useFormik<CMForm>({
    initialValues: {
      dbLeadsId: leadId || '',
      salesId: csaInput?.salesId || 0,
      noSPK: csaInput?.spkNo || '',
      spkDate: csaInput?.spkDate || '',
      noBSTK: csaInput?.bstkNo || '',
      bstkDate: csaInput?.bstkDate || '',
    },
    onSubmit: (value) => {
      updateLeadFormCMSEVA({
        leadId: value.dbLeadsId || '',
        salesId: value.salesId || 0,
        spkNo: value.noSPK || '',
        spkDate: dayjs(value.spkDate).format('YYYY-MM-DD'),
        bstkNo: value.noBSTK || '',
        bstkDate: dayjs(value.bstkDate).format('YYYY-MM-DD'),
      }).then(() => {})
    },
    validateOnBlur: true,
    validationSchema: cmSchema,
    enableReinitialize: true,
  })

  useEffect(() => {
    saveAgent(dataAgent)
  })

  if (!isValidz) {
    return <div className="blank"></div>
  }

  const handleAgentPick = (value: any) => {
    setFieldValue('salesId', value)
  }

  const scrollToElement = (elementId: string) => {
    const target = document.getElementById(elementId)
    if (target) {
      target.scrollIntoView({ block: 'center' })
    }
  }

  return (
    <>
      <Seo
        title="SEVA - Beli Mobil Terbaru Dengan Cicilan Kredit Terbaik"
        description="Beli mobil terbaru dari Toyota, Daihatsu, BMW dengan Instant Approval*. Proses Aman & Mudah✅ Terintegrasi dengan ACC & TAF✅ SEVA member of ASTRA"
        image={defaultSeoImage}
      />
      <div className={styles.container}>
        <InformationSection />
        <div className={styles.titleWrapper}>
          <h2 className={styles.title}>Update Form CM</h2>
        </div>
        <div className={styles.formWrapper}>
          <div id="update-leads-form-db-leads">
            <FormDBLeads value={values.dbLeadsId} title="DB Leads ID" />
          </div>
          <div id="update-leads-form-dealer-sales-agent">
            <FormDealerSales handleChange={handleAgentPick} name="salesId" />
          </div>
          <div id="update-leads-form-spk" className={styles.inputName}>
            <Input
              placeholder="Contoh: 1234567"
              title="No SPK"
              value={values.noSPK}
              name="noSPK"
              id="noSPK"
              onChange={(e) => {
                handleChange(e)
              }}
              onBlur={handleBlur}
            />
          </div>
          <div id="update-leads-form-spk-date" className={styles.inputName}>
            <LabelTooltipSevaOTO
              label="SPK Date"
              content="Sebelum mengisi SPK date wajib mengisi Nomor SPK terlebih dahulu"
              name="spkDate"
            />
            <DatePickerCM
              forceRender={!!values.spkDate}
              placeholder="28/07/2023"
              value={new Date(values.spkDate || '')}
              name="spkDate"
              onBlurInput={(e) => handleBlur(e)}
              onConfirm={(val: Date) => {
                setFieldValue('spkDate', dayjs(val).format('YYYY-MM-DD'))
              }}
              visible={values.noSPK ? true : false}
              isOTO={true}
              isError={isRequiredSPK}
              errorMessage="SPK Date wajib diisi"
            />
          </div>
          <div id="update-leads-form-bstk" className={styles.inputName}>
            <Input
              placeholder="Contoh: 1234567"
              title="No BSTK"
              value={values.noBSTK}
              name="noBSTK"
              id="noBSTK"
              onChange={(e) => {
                handleChange(e)
              }}
              onBlur={handleBlur}
            />
          </div>
          <div
            id="update-leads-form-bstk-date"
            className={styles.inputBSTKDate}
          >
            <LabelTooltipSevaOTO
              label="BSTK Date"
              content="Sebelum mengisi BSTK date wajib mengisi Nomor BSTK terlebih dahulu"
              name="bstkDate"
            />
            <DatePickerCM
              forceRender={!!values.bstkDate}
              placeholder="28/07/2023"
              value={new Date(values.bstkDate || '')}
              name="bstkDate"
              onBlurInput={(e) => handleBlur(e)}
              onConfirm={(val: Date) => {
                setFieldValue('bstkDate', dayjs(val).format('YYYY-MM-DD'))
              }}
              visible={values.noBSTK ? true : false}
              isOTO={true}
              isError={isRequiredBSTK}
              errorMessage="BSTK Date wajib diisi"
            />
          </div>
        </div>
        <div className={styles.buttonSubmit}>
          <Button
            version={
              values.salesId !== 0
                ? ButtonVersion.PrimaryDarkBlue
                : ButtonVersion.Disable
            }
            size={ButtonSize.Big}
            disabled={values.salesId === 0}
            onClick={() => {
              if (values.noSPK !== '') {
                if (values.spkDate === '') {
                  setIsRequiredSPK(true)
                  scrollToElement('update-leads-form-spk-date')
                  return
                } else {
                  setToastMessage('SPK berhasil diperbaharui')
                }
              }
              if (values.noBSTK !== '') {
                if (values.bstkDate === '') {
                  setIsRequiredBSTK(true)
                  scrollToElement('update-leads-form-bstk-date')
                  return
                } else {
                  setToastMessage('BSTK berhasil diperbaharui')
                }
              }
              setIsRequiredBSTK(false)
              setIsRequiredSPK(false)
              setIsOpenToast(true)
              handleSubmit()
            }}
          >
            Submit
          </Button>
        </div>
        <Toast
          width={339}
          open={isOpenToast}
          text={toastMessage}
          typeToast={'success'}
          onCancel={() => setIsOpenToast(false)}
          closeOnToastClick
        />
      </div>
    </>
  )
}

export default UpdateLeadsFormCM

export async function getServerSideProps(context: any) {
  const detailId = context.query.slug[0]
  const TokenStatic = context.query.slug[1]
  let valid = true

  // TODO: Check Token
  if (TokenStatic !== 'SEv4Uh4Y') {
    valid = false
  }
  // TODO: getDetail ID

  try {
    const salesRes: any = await Promise.all([api.getAgent()])
    const response = await getLeadsDetail(detailId)
    const data: DataResponse = response.data
    const csaInput = data.csaInput
    const leadId = data.leadId

    return {
      props: {
        message: 'hello',
        isValidz: valid,
        dataAgent: salesRes,
        csaInput,
        leadId,
      },
    }
  } catch (error) {
    return {
      props: {
        dataAgent: [],
      },
    }
  }
}
