import amplitude from 'amplitude-js'

const apiKey = '86bd0da4661aa24a7d2c9f658197b49a'

export const initAmplitude = () => {
  amplitude.getInstance().init(apiKey)
}

export const setAmplitudeUserDevice = (installationToken: any) => {
  amplitude.getInstance().setDeviceId(installationToken)
}

export const sendAmplitudeData = (eventType: any, eventProperties: any) => {
  amplitude.getInstance().logEvent(eventType, eventProperties)
}

// ;[
//   {
//     device_id: 'eaLGoitDucbVRAIYDgc-xL',
//     user_id: '417985',
//     timestamp: 1675390932451,
//     event_id: 202,
//     session_id: 1675390932447,
//     event_type: '$identify',
//     version_name: null,
//     platform: 'Web',
//     os_name: 'Chrome',
//     os_version: '109',
//     device_model: 'Windows',
//     device_manufacturer: null,
//     language: 'en-GB',
//     api_properties: {},
//     event_properties: {},
//     user_properties: { $set: { screen_resolution: '1416x929' } },
//     uuid: '7b197db3-1da4-4505-b607-303e1197af12',
//     library: { name: 'amplitude-js', version: '8.17.0' },
//     sequence_number: 505,
//     groups: {},
//     group_properties: {},
//     user_agent:
//       'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
//   },
// ]
