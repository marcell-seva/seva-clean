import React, { HTMLAttributes } from 'react'
import { RecommendationsContextProvider } from './recommendationsContext/recommendationsContext'
import { FunnelQueryContextProvider } from './funnelQueryContext/funnelQueryContext'
import { FinancialQueryContextProvider } from './financialQueryContext/financialQueryContext'

const providers: Array<
  React.JSXElementConstructor<React.PropsWithChildren<any>>
> = [
  RecommendationsContextProvider,
  FunnelQueryContextProvider,
  FinancialQueryContextProvider,
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
