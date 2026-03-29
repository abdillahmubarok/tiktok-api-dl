import { _getUserLikedParams, _userSearchParams } from "../constants/params"
// @ts-ignore
import xbogus from "../../helper/xbogus"
import { userAgent } from "../constants/headers"
import CryptoJS from "crypto-js"

export class TiktokService {
  /**
   * Generate Signature parameter for TikTok API requests
   * Note: Original implementation used JSDOM which is not supported in Cloudflare Workers.
   * Returning empty string as X-Bogus is often sufficient.
   * @param {URL} url - URL to sign
   * @returns {string} Empty string
   */
  public generateSignature(url: URL): string {
    return ""
  }

  /**
   * Generate X-Bogus parameter for TikTok API requests
   * @param {URL} url - URL to generate X-Bogus for
   * @param {string} signature - Optional signature (unused in this implementation)
   * @returns {string} X-Bogus string
   */
  public generateXBogus(url: URL, signature?: string): string {
    if (signature) {
      url.searchParams.append("_signature", signature)
    }
    // xbogus helper expects the full URL
    const params = xbogus(url.toString(), userAgent)
    return params
  }

  /**
   * Generate XTTPParams
   * @param {any} params - The params you want to encrypt
   * @returns {string}
   */
  public generateXTTParams(params: any): string {
    const key = CryptoJS.enc.Utf8.parse(TiktokService.AES_KEY)
    const iv = CryptoJS.enc.Utf8.parse(TiktokService.AES_IV)

    const encrypted = CryptoJS.AES.encrypt(params, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    })

    return encrypted.toString()
  }

  /**
   * Generate URL with X-Bogus
   * Special thanks to https://github.com/iamatef/xbogus
   * @param {string} username - The username you want to search
   * @param {number} page - The page you want to search
   * @returns {string}
   */
  public generateURLXbogus(username: string, page: number): string {
    const baseUrl = `${TiktokService.BASE_URL}api/search/user/full/?`
    const queryParams = _userSearchParams(username, page)
    const xbogusParams = xbogus(`${baseUrl}${queryParams}`, userAgent)

    return `${baseUrl}${_userSearchParams(username, page, xbogusParams)}`
  }

  private static readonly BASE_URL = "https://www.tiktok.com/"
  private static readonly AES_KEY = "webapp1.0+202106"
  private static readonly AES_IV = "webapp1.0+202106"
}
