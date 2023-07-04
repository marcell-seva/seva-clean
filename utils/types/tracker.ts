export enum PageOriginationName {
  PLPFloatingIcon = 'PLP Floating Icon',
  PDPLeadsForm = 'PDP Leads Form',
  LPFloatingIcon = 'LP Floating Icon',
  COTMLeadsForm = 'Car Of The Month',
  LPLeadsForm = 'LP Leads Form',
}

type CarResultPageFilterParam = {
  Sort?: string
  Car_Brand?: string | null
  Car_Body_Type?: string | null
  DP?: string | null
  Tenure?: string
  Income?: string | null
  Age?: string | null
  Min_Price?: string
  Max_Price?: string
}

export type LeadsActionParam = CarResultPageFilterParam & {
  Page_Origination?: PageOriginationName
  Car_Model?: string
  City?: string
  Peluang_Kredit?: string
}
