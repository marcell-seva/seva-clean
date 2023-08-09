import React, { HTMLAttributes } from 'react'
import { FunnelQueryContextProvider } from './funnelQueryContext/funnelQueryContext'
import { FinancialQueryContextProvider } from './financialQueryContext/financialQueryContext'
import { MobileWebTopMenusContextProvider } from './mobileWebTopMenuContext/mobileWebTopMenuContext'
import { LastOtpSentTimeContextProviderRevamp } from './lastOtpSentTimeContext'
import { ModalContextProvider } from './modalContext/modalContext'
import { SurveyFormProvider } from './surveyFormContext/surveyFormContext'
import { SpecialRateListResultsContextProvider } from './specialRateResultsContext/specialRateResultsContext'
import { FunnelFormContextProvider } from './funnelFormContext/funnelFormContext'
import { CurrentLanguageContextProvider } from './currentLanguageContext/currentLanguageContext'
import { ContactFormProvider } from './contactFormContext/contactFormContext'
import { SideMenuContextProvider } from './sideMenuContext/sideMenuContext'
import { SideMenuListContextProvider } from './sideMenuListContext/sideMenuListContext'

const providers: Array<
  React.JSXElementConstructor<React.PropsWithChildren<any>>
> = [
  FunnelQueryContextProvider,
  FunnelFormContextProvider,
  FinancialQueryContextProvider,
  MobileWebTopMenusContextProvider,
  LastOtpSentTimeContextProviderRevamp,
  ModalContextProvider,
  SurveyFormProvider,
  SpecialRateListResultsContextProvider,
  CurrentLanguageContextProvider,
  ContactFormProvider,
  SideMenuContextProvider,
  SideMenuListContextProvider,
]

export const GlobalContextProvider = (props: HTMLAttributes<HTMLElement>) => {
  return (
    <>
      {providers.reduceRight((accumulator, Component) => {
        return <Component>{accumulator}</Component>
      }, props.children)}
    </>
  )
}
