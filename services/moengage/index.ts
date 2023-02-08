declare global {
  interface Window {
    Moengage: any
  }
}

export const setTrackEventMoEngageWithoutValue = (value: any): void => {
  const moengage = window.Moengage
  moengage.track_event(value)
}
