import { _getUserLikedParams, _userSearchParams } from "../constants/params"
import xbogus from "./xbogus"
import { userAgent, webUserAgent } from "../constants/headers"
import qs from "qs"
import CryptoJS from "crypto-js"
import { initSignature } from "./signature"
import { initWebmssdk } from "./webmssdk"

export class TiktokService {
  /**
   * Generate Signature parameter for TikTok API requests
   */
  public generateSignature(url: URL): string {
    const stringUrl = url.toString()
    const window = this.getMockWindow();

    initSignature(window);

    if (typeof window.byted_acrawler === 'undefined') {
        window.byted_acrawler = {};
    }

    if (window.byted_acrawler.init) {
        window.byted_acrawler.init({
            aid: 24,
            dfp: true
        });
    }

    initWebmssdk(window);

    if (!window.byted_acrawler || !window.byted_acrawler.sign) {
        return "";
    }

    const signature = window.byted_acrawler.sign({ url: stringUrl })
    return signature
  }

  /**
   * Generate X-Bogus parameter for TikTok API requests
   */
  public generateXBogus(url: URL, signature?: string): string {
    const window = this.getMockWindow();

    initSignature(window);

    if (typeof window.byted_acrawler === 'undefined') {
        window.byted_acrawler = {};
    }

    if (window.byted_acrawler.init) {
        window.byted_acrawler.init({
            aid: 24,
            dfp: true
        });
    }

    initWebmssdk(window);

    if (signature) {
      url.searchParams.append("_signature", signature)
    }

    const xbogusFn = (window as any)._0x32d649;
    if (typeof xbogusFn === 'function') {
        return xbogusFn(url.searchParams.toString());
    }

    return "";
  }

  public generateXTTParams(params: any): string {
    const key = CryptoJS.enc.Utf8.parse(TiktokService.AES_KEY);
    const iv = CryptoJS.enc.Utf8.parse(TiktokService.AES_IV);
    const encrypted = CryptoJS.AES.encrypt(params, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
  }

  public generateURLXbogus(username: string, page: number): string {
    const baseUrl = `${TiktokService.BASE_URL}api/search/user/full/?`
    const queryParams = _userSearchParams(username, page)
    const xbogusParams = xbogus(`${baseUrl}${queryParams}`, userAgent)

    return `${baseUrl}${_userSearchParams(username, page, xbogusParams)}`
  }

  private getMockWindow() {
    const mockWindow: any = {
      navigator: {
        userAgent: webUserAgent,
        appCodeName: "Mozilla",
        appName: "Netscape",
        appVersion: "5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 Edg/107.0.1418.35",
        platform: "Win32",
        product: "Gecko"
      },
      document: {
        cookie: "",
        referrer: TiktokService.BASE_URL,
        createElement: (tag: string) => ({
            getContext: () => ({}),
            toDataURL: () => ""
        }),
      },
      screen: {
        width: 1920,
        height: 1080
      },
      location: {
        href: TiktokService.BASE_URL,
        protocol: "https:",
        hostname: "www.tiktok.com"
      },
      localStorage: {
        getItem: () => null,
        setItem: () => {}
      },
      sessionStorage: {
        getItem: () => null,
        setItem: () => {}
      },
      Image: class {},
      Date: Date,
      console: console,
      setTimeout: setTimeout,
      clearTimeout: clearTimeout,
      setInterval: setInterval,
      clearInterval: clearInterval,
    };
    mockWindow.window = mockWindow;
    mockWindow.self = mockWindow;
    return mockWindow;
  }

  private static readonly BASE_URL = "https://www.tiktok.com/"
  private static readonly AES_KEY = "webapp1.0+202106"
  private static readonly AES_IV = "webapp1.0+202106"
}
