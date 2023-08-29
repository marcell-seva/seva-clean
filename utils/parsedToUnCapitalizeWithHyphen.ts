export const parsedToUnCapitalizeWithHyphen = (payload: string) => {
  const result: string = payload.toLowerCase().replace(/ /g, '-')
  return result
}
