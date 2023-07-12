import React, { HTMLAttributes } from 'react'
import { FinancialQueryContextProvider } from './finnancialQueryContext'
import { FunnelQueryContextProvider } from './funnelQueryContext'
import { SearchWidgetProvider } from './searchWidgetContext'
import { UtilsContextProvider } from './utilsContext'
import { ConfigProvider } from './configContext'
import { CarProvider } from './carContext'
import { AuthProvider } from './authContext'
import { CarModelDetailsContextProvider } from 'context/carModelDetailsContext/carModelDetailsContext'
import { CarVariantDetailsContextProvider } from 'context/carVariantDetailsContext/carVariantDetailsContext'
import { CarModelContextProvider } from 'context/carModelContext/carModelContext'
import { ContactFormProvider } from 'context/contactFormContext/contactFormContext'
import { CurrentLanguageContextProvider } from 'context/currentLanguageContext/currentLanguageContext'
import { FunnelFormContextProvider } from 'context/funnelFormContext/funnelFormContext'
import { LastOtpSentTimeContextProviderRevamp } from 'context/lastOtpSentTimeContext'
import { MobileWebTopMenusContextProvider } from 'context/mobileWebTopMenuContext/mobileWebTopMenuContext'
import { ModalContextProvider } from 'context/modalContext/modalContext'
import { SpecialRateListResultsContextProvider } from 'context/specialRateResultsContext/specialRateResultsContext'
import { SurveyFormProvider } from 'context/surveyFormContext/surveyFormContext'
import { RecommendationsContextProvider } from 'context/recommendationsContext/recommendationsContext'

const providers: Array<
  React.JSXElementConstructor<React.PropsWithChildren<any>>
> = [
  FinancialQueryContextProvider,
  SearchWidgetProvider,
  UtilsContextProvider,
  ConfigProvider,
  AuthProvider,
  CarProvider,
  RecommendationsContextProvider,
  CarModelDetailsContextProvider,
  CarVariantDetailsContextProvider,
  FunnelQueryContextProvider,
  FunnelFormContextProvider,
  MobileWebTopMenusContextProvider,
  LastOtpSentTimeContextProviderRevamp,
  ModalContextProvider,
  SurveyFormProvider,
  SpecialRateListResultsContextProvider,
  CurrentLanguageContextProvider,
  CarModelContextProvider,
  ContactFormProvider,
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
