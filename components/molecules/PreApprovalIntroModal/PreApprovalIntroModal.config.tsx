import { CheckedCircleOutlined } from 'components/atoms/icon/CheckedCircleOutlined'
import { PreApprovalForm } from 'components/atoms/icon/PreApprovalForm'
import { PreApprovalIncome } from 'components/atoms/icon/PreApprovalIncome'
import { PreApprovalKTP } from 'components/atoms/icon/PreApprovalKTP'
import { PreApprovalOTP } from 'components/atoms/icon/PreApprovalOTP'
import React from 'react'
import styled from 'styled-components'
import { colors } from 'styles/colors'

const StyledStepCheckIcon = styled(CheckedCircleOutlined)`
  position: absolute;
  right: 0;
  bottom: 0;
  transform: translateY(-50%);
`

export interface PreApprovalStepConfig {
  text: string
  icon: JSX.Element
  checkmark?: JSX.Element
}
interface PreApprovalIntroModalConfigType {
  title: string
  subtitle: string
  steps: PreApprovalStepConfig[]
  positiveButton: string
  secureInfoTitle: string
  secureInfoDesc: string
}

export const PreApprovalIntroModalConfig: PreApprovalIntroModalConfigType = {
  title: 'Dapatkan Instant Approval',
  subtitle: 'Cukup dengan 4 cara mudah dan aman ',
  steps: [
    {
      text: 'Verifikasi nomor ponsel',
      icon: <PreApprovalOTP width={60} height={80} />,
      checkmark: <StyledStepCheckIcon color={colors.secondary} />,
    },
    {
      text: 'Lengkapi informasimu',
      icon: <PreApprovalForm width={76} height={84} />,
    },
    {
      text: 'Foto KTP',
      icon: <PreApprovalKTP width={86} height={68} />,
    },
    {
      text: 'Verifikasi pendapatan kamu',
      icon: <PreApprovalIncome width={64} height={80} />,
      checkmark: <StyledStepCheckIcon color={colors.secondary} />,
    },
  ],
  positiveButton: 'Yuk Mulai!',
  secureInfoTitle: 'Aman',
  secureInfoDesc:
    'Semua informasi yang kamu bagikan dienkripsi dan dijaga kerahasiaannya.',
}
