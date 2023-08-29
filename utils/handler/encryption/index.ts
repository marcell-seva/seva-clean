import { AES, enc } from 'crypto-js'

const encryptionKey =
  process.env.NEXT_PUBLIC_LOCAL_STORAGE_ENCRYPTION_KEY ??
  'encryption-key-for-localhost'

// use prefix to differentiate between encrypted or not
export const encryptedPrefix = 'encrypted-'

export const encryptValue = (input: string) => {
  return encryptedPrefix + AES.encrypt(input, encryptionKey).toString()
}

// decryption failed will return empty string => ''
export const decryptValue = (input: string) => {
  return AES.decrypt(
    input.toString().replace(encryptedPrefix, ''),
    encryptionKey,
  ).toString(enc.Utf8)
}
