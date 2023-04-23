import { floor, rand } from '@/utils'

export const generatePKCECodeVerifier = (length: number) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  let codeVerifier = ''

  for (let i = 0; i < length; i++) {
    codeVerifier += chars[floor(rand(chars.length))]
  }

  return codeVerifier
}

export const generatePKCEChallenge = async (codeVerifier: string) => {
  function base64encode(digest: ArrayBuffer) {
    return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '')
  }

  const encoder = new TextEncoder()
  const data = encoder.encode(codeVerifier)
  const digest = await window.crypto.subtle.digest('SHA-256', data)

  return base64encode(digest)
}
