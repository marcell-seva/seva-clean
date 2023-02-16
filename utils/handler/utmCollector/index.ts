export const utmCollector = () => {
  const queryString = window.location.search
  const urlParams = new URLSearchParams(queryString)

  const utm_id: string | null = urlParams.get('utm_id')
  const utm_source: string | null = urlParams.get('utm_source')
  const utm_medium: string | null = urlParams.get('utm_medium')
  const utm_campaign: string | null = urlParams.get('utm_campaign')
  const utm_content: string | null = urlParams.get('utm_content')
  const utm_term: string | null = urlParams.get('utm_term')
  const adset: string | null = urlParams.get('adset')

  const dataUTM = {
    utm_id,
    utm_source,
    utm_medium,
    utm_campaign,
    utm_content,
    utm_term,
    adset,
  }

  return dataUTM
}
