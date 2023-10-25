import { AxiosError } from 'axios'
import { useRouter } from 'next/router'
import {
  useLocalStorage,
  useLocalStorageWithEncryption,
} from '../useLocalStorage'
import { LocalStorageKey, SessionStorageKey } from 'utils/enum'
import { CityOtrOption } from 'utils/types'
import { SimpleCarVariantDetail } from 'utils/types/utils'
import {
  LoanRank,
  PAAInfoStorageProps,
  PreApprovalFlowType,
} from 'utils/types/models'
import {
  AlreadyPreApprovedSevaUrl,
  preApprovalQuestionFlowUrlWithType,
} from 'utils/helpers/routes'
import { getPAAIAInfo } from 'utils/httpUtils/customerUtils'
import { saveSessionStorage } from 'utils/handler/sessionStorage'

export const usePaAmbassadorData = (orderId?: string) => {
  const router = useRouter()

  const [, setValue] =
    useLocalStorageWithEncryption<PAAInfoStorageProps | null>(
      LocalStorageKey.PAAmbassadorInfo,
      null,
    )
  const [, setCity] = useLocalStorage<CityOtrOption | null>(
    LocalStorageKey.CityOtr,
    null,
  )
  const [, setSimpleCarVariantDetails] =
    useLocalStorage<SimpleCarVariantDetail | null>(
      LocalStorageKey.SimpleCarVariantDetails,
      null,
    )

  const successAction = () => {
    router.push(
      preApprovalQuestionFlowUrlWithType.replace(
        ':paFlowType',
        PreApprovalFlowType.PAAmbassador,
      ),
    )
    setTimeout(() => {
      window.location.reload()
    }, 1000)
  }

  function getDataPAAmbassador() {
    if (!orderId) {
      saveSessionStorage(
        SessionStorageKey.PAAmbassadorError,
        'Cannot find url id. Please use the link provided for PA Ambassador',
      )
      router.push('/')
      return
    }
    getPAAIAInfo(orderId)
      .then((res) => {
        const paaInfo = res.data.data
        setValue({
          ...paaInfo,
          orderId,
        })
        setCity({
          cityName: paaInfo.customer.city.cityName,
          cityCode: paaInfo.customer.city.cityCode,
          province: paaInfo.customer.city.province,
          id: paaInfo.customer.city.id,
        })
        setSimpleCarVariantDetails({
          modelId: paaInfo.car.model,
          variantId: paaInfo.car.variant,
          loanTenure: paaInfo.financial.loanTenure,
          loanDownPayment: paaInfo.financial.dpAmount,
          loanMonthlyInstallment: paaInfo.financial.loanMonthlyInstallment,
          loanRank: LoanRank.Green,
          totalFirstPayment: paaInfo.financial.tpp,
          angsuranType: paaInfo.financial.angsuranType,
          rateType: 'REGULAR',
          flatRate: paaInfo.financial.flatRate,
        })
        localStorage.removeItem(LocalStorageKey.LeadId)

        successAction()
      })
      .catch((err: AxiosError) => {
        switch (err?.response?.status) {
          case 400:
            if (err?.response?.data?.code === 'IA_FINISHED_WITH_OTHER_SALES') {
              router.push(AlreadyPreApprovedSevaUrl)
            } else if (err?.response?.data?.code === 'EXPIRED_LINK') {
              saveSessionStorage(
                SessionStorageKey.PAAmbassadorError,
                'Link Instant Approval sudah kadaluarsa. Hubungi agen Anda untuk mendapatkan link baru.',
              )
              router.push('/')
            } else {
              saveSessionStorage(
                SessionStorageKey.PAAmbassadorError,
                'Something went wrong. Please try again later.',
              )
              router.push('/')
            }
            break
          case 404:
            router.push(AlreadyPreApprovedSevaUrl)
            break
          case 403:
            saveSessionStorage(
              SessionStorageKey.PAAmbassadorError,
              'Nomor HP yang anda gunakan tidak sesuai, mohon periksa kembali nomor HP yang didaftarkan.',
            )
            router.push('/')
            break
          case 401:
            break
          default:
            saveSessionStorage(
              SessionStorageKey.PAAmbassadorError,
              'Something went wrong. Please try again later.',
            )
            router.push('/')
            break
        }
      })
  }

  return {
    getDataPAAmbassador,
  }
}
