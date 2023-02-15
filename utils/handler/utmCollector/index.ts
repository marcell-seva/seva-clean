export const utmCollector = () => {
  const queryString = window.location.search
  const urlParams = new URLSearchParams(queryString)

  const utm_id = urlParams.get('utm_id')
  const utm_source = urlParams.get('utm_source')
  const utm_medium = urlParams.get('utm_medium')
  const utm_campaign = urlParams.get('utm_campaign')
  const utm_content = urlParams.get('utm_content')
  const utm_term = urlParams.get('utm_term')
  const adset = urlParams.get('adset')
  const dataUTM = {
    utm_id,
    utm_source,
    utm_medium,
    utm_campaign,
    utm_content,
    utm_term,
    adset,
  }
  localStorage.setItem('utmTags', JSON.stringify(dataUTM))
}
