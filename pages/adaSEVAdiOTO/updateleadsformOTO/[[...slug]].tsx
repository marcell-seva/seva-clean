import Seo from 'components/atoms/seo'
import { InformationSection } from 'components/organisms'
import { InferGetServerSidePropsType } from 'next'
import { defaultSeoImage } from 'utils/helpers/const'
import styles from 'styles/pages/updateLeadsformOTO.module.scss'
import styles2 from 'styles/components/molecules/formUpdateLeadsSevaOTO/formLeadsResponse.module.scss'
import { FormLeadsResponse } from 'components/molecules/formUpdateLeadsSevaOTO/formLeadsResponse'
import FormDBLeads from 'components/molecules/formUpdateLeadsSevaOTO/formDBLeads'
import { FormLeadsQualified } from 'components/molecules/formUpdateLeadsSevaOTO/formLeadsQualified'
import FormSelectCitySevaOTO from 'components/molecules/formUpdateLeadsSevaOTO/formSelectCitySevaOTO'
import { useFunnelQueryData } from 'services/context/funnelQueryContext'
import { useState } from 'react'
import { variantEmptyValue } from 'components/molecules/form/formSelectCarVariant'
import { ModelVariant } from 'utils/types/carVariant'
import { getCarModelDetailsById } from 'services/recommendations'
import { CityOtrOption } from 'utils/types'
import { useLocalStorage } from 'utils/hooks/useLocalStorage'
import { LanguageCode, LocalStorageKey, SessionStorageKey } from 'utils/enum'
import { CarModel } from 'utils/types/carModel'
import { Button } from 'components/atoms'
import { ButtonSize, ButtonVersion } from 'components/atoms/button'
import { FormSelectModelCarSevaOTO } from 'components/molecules/formUpdateLeadsSevaOTO/formSelectModelCarSevaOTO'
import { FormSelectCarVariantSevaOTO } from 'components/molecules/formUpdateLeadsSevaOTO/formSelectCarVariant'
import { Tooltip } from 'antd'
import { getLeadsDetail } from 'services/leadsSeva'
import { FormSelectBrandCarSevaOTO } from 'components/molecules/formUpdateLeadsSevaOTO/formSelectBrandCarSevaOTO'
const CarSillhouete = '/revamp/illustration/car-sillhouete.webp'

interface FormDataState {
  city: CityOtrOption
  model:
    | {
        modelId: string
        modelName: string
        modelImage: string
        brandName: string
      }
    | undefined
  variant:
    | { variantId: string; variantName: string; otr: string; discount: number }
    | undefined
}

const UpdateLeadsFormOTO = ({
  message,
  isValid,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { funnelQuery, patchFunnelQuery } = useFunnelQueryData()
  const [modelError, setModelError] = useState<boolean>(false)
  const [isCheckedBrand, setIsCheckedBrand] = useState<string[]>(
    funnelQuery.brand ? funnelQuery.brand : [],
  )
  const [carVariantList, setCarVariantList] = useState<ModelVariant[]>([])
  const [allModelCarList, setAllModalCarList] = useState<CarModel[]>([])
  const [cityOtr] = useLocalStorage<CityOtrOption | null>(
    LocalStorageKey.CityOtr,
    null,
  )

  const getAutofilledCityData = () => {
    // related to logic inside component "FormSelectCity"
    if (cityOtr) {
      return cityOtr
    } else {
      return null
    }
  }

  const [forms, setForms] = useState<FormDataState>({
    city: getAutofilledCityData(),
    model: {
      brandName: '',
      modelName: '',
      modelId: '',
      modelImage: '',
    },
    variant: {
      variantId: '',
      variantName: '',
      otr: '',
      discount: 0,
    },
  })

  if (!isValid) {
    return <div className="blank"></div>
  }

  const fetchCarVariant = async () => {
    const response = await getCarModelDetailsById(forms.model?.modelId ?? '')
    setCarVariantList(response.variants)
  }

  const handleChange = () => {}
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
          <h2 className={styles.title}>Update Form SEVA X OTO</h2>
          <FormDBLeads className={styles.containerInput} />
          <FormLeadsResponse className={styles.containerInput} />
          <FormLeadsQualified className={styles.containerInput} />
          <div className={styles.containerInput}>
            <div className={styles2.textTitle}>
              City Name <span className={styles2.red}>*</span>
            </div>
            <FormSelectCitySevaOTO
              isHasCarParameter={false}
              handleChange={handleChange}
              name="city"
              className={styles.containerInput}
            />
          </div>
          <div className={styles.containerInput}>
            <div className={styles2.textTitle}>
              Car Brand <span className={styles2.red}>*</span>
            </div>
            <FormSelectBrandCarSevaOTO
              setIsCheckedBrand={setIsCheckedBrand}
              isButtonClick={false}
              setResetTmp={false}
            />
          </div>
          <div className={styles.containerInput}>
            <div className={styles2.textTitle}>
              Car Model <span className={styles2.red}>*</span>
            </div>
            <FormSelectModelCarSevaOTO
              selectedCity={forms?.city?.cityCode || ''}
              handleChange={handleChange}
              name="model"
              value={forms?.model?.modelName || ''}
              valueImage={
                forms.model?.modelImage || (CarSillhouete as unknown as string)
              }
              valueId={forms?.model?.modelId || ''}
              allModelCarList={allModelCarList}
              setModelError={setModelError}
            />
          </div>
          <div className={styles.containerInput}>
            <div className={styles2.textTitle}>
              Car Variant <span className={styles2.red}>*</span>
            </div>
            <FormSelectCarVariantSevaOTO
              carVariantList={carVariantList}
              handleChange={handleChange}
              name="variant"
              modelError={false}
              value={forms.variant || variantEmptyValue}
              selectedModel={forms?.model?.modelId || ''}
            />
          </div>
          <div className={styles.buttonSubmit}>
            <Button
              version={ButtonVersion.PrimaryDarkBlue}
              size={ButtonSize.Big}
            >
              Submit
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

export default UpdateLeadsFormOTO

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
    const response = await getLeadsDetail(detailId)
    const data = response.data
    console.log({ data })

    return {
      props: {
        message: 'hello',
        isValid: valid,
      },
    }
  } catch (error) {
    throw error
  }
}
