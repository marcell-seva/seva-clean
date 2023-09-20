export const isEmptyObject = (object: Record<string, unknown>) => {
  const entries = Object.entries(object)
  return !entries.find((entry) => {
    return !!entry[1]
  })
}
