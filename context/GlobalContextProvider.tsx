import React, { HTMLAttributes } from 'react'
import { RecommendationsContextProvider } from './recommendationsContext/recommendationsContext'
import { FunnelQueryContextProvider } from './funnelQueryContext/funnelQueryContext'
import { FinancialQueryContextProvider } from './financialQueryContext/financialQueryContext'
import { MobileWebTopMenusContextProvider } from './mobileWebTopMenuContext/mobileWebTopMenuContext'
import { LastOtpSentTimeContextProviderRevamp } from './lastOtpSentTimeContext'
import { CarVariantDetailsContextProvider } from './carVariantDetailsContext/carVariantDetailsContext'
import { CarModelDetailsContextProvider } from './carModelDetailsContext/carModelDetailsContext'
import { ModalContextProvider } from './modalContext/modalContext'
import { SurveyFormProvider } from './surveyFormContext/surveyFormContext'
import { SpecialRateListResultsContextProvider } from './specialRateResultsContext/specialRateResultsContext'
import { FunnelFormContextProvider } from './funnelFormContext/funnelFormContext'
import { CurrentLanguageContextProvider } from './currentLanguageContext/currentLanguageContext'
import { CarModelContextProvider } from './carModelContext/carModelContext'
import { ContactFormProvider } from './contactFormContext/contactFormContext'
import { SideMenuContextProvider } from './sideMenuContext/sideMenuContext'
import { SideMenuListContextProvider } from './sideMenuListContext/sideMenuListContext'

const providers: Array<
  React.JSXElementConstructor<React.PropsWithChildren<any>>
> = [
  RecommendationsContextProvider,
  CarModelDetailsContextProvider,
  CarVariantDetailsContextProvider,
  FunnelQueryContextProvider,
  FunnelFormContextProvider,
  FinancialQueryContextProvider,
  MobileWebTopMenusContextProvider,
  LastOtpSentTimeContextProviderRevamp,
  ModalContextProvider,
  SurveyFormProvider,
  SpecialRateListResultsContextProvider,
  CurrentLanguageContextProvider,
  CarModelContextProvider,
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
