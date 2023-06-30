import React, { HTMLAttributes } from 'react'
import { RecommendationsContextProvider } from './recommendationsContext/recommendationsContext'
import { FunnelQueryContextProvider } from './funnelQueryContext/funnelQueryContext'
import { FinancialQueryContextProvider } from './financialQueryContext/financialQueryContext'
import { MobileWebTopMenusContextProvider } from './mobileWebTopMenuContext/mobileWebTopMenuContext'
import { LastOtpSentTimeContextProviderRevamp } from './lastOtpSentTimeContext'

const providers: Array<
  React.JSXElementConstructor<React.PropsWithChildren<any>>
> = [
  RecommendationsContextProvider,
  FunnelQueryContextProvider,
  FinancialQueryContextProvider,
  MobileWebTopMenusContextProvider,
  LastOtpSentTimeContextProviderRevamp,
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
