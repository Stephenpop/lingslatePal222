// LibreTranslate API integration
const LIBRETRANSLATE_URL = process.env.NEXT_PUBLIC_LIBRETRANSLATE_URL || "https://libretranslate.com"

export interface TranslationRequest {
  q: string
  source: string
  target: string
  format?: "text" | "html"
  api_key?: string
}

export interface TranslationResponse {
  translatedText: string
  detectedLanguage?: {
    confidence: number
    language: string
  }
}

export interface Language {
  code: string
  name: string
  targets: string[]
}

export class LibreTranslateAPI {
  private baseUrl: string
  private apiKey?: string

  constructor(baseUrl?: string, apiKey?: string) {
    this.baseUrl = baseUrl || LIBRETRANSLATE_URL
    this.apiKey = apiKey
  }

  async getLanguages(): Promise<Language[]> {
    try {
      const response = await fetch(`${this.baseUrl}/languages`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Error fetching languages:", error)
      // Return fallback languages
      return [
        { code: "en", name: "English", targets: ["es", "fr", "de", "it", "pt", "ru", "ja", "ko", "zh", "ar"] },
        { code: "es", name: "Spanish", targets: ["en", "fr", "de", "it", "pt"] },
        { code: "fr", name: "French", targets: ["en", "es", "de", "it", "pt"] },
        { code: "de", name: "German", targets: ["en", "es", "fr", "it", "pt"] },
        { code: "it", name: "Italian", targets: ["en", "es", "fr", "de", "pt"] },
        { code: "pt", name: "Portuguese", targets: ["en", "es", "fr", "de", "it"] },
        { code: "ru", name: "Russian", targets: ["en"] },
        { code: "ja", name: "Japanese", targets: ["en"] },
        { code: "ko", name: "Korean", targets: ["en"] },
        { code: "zh", name: "Chinese", targets: ["en"] },
        { code: "ar", name: "Arabic", targets: ["en"] },
      ]
    }
  }

  async translate(request: TranslationRequest): Promise<TranslationResponse> {
    try {
      const body: any = {
        q: request.q,
        source: request.source,
        target: request.target,
        format: request.format || "text",
      }

      if (this.apiKey) {
        body.api_key = this.apiKey
      }

      const response = await fetch(`${this.baseUrl}/translate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return {
        translatedText: data.translatedText,
        detectedLanguage: data.detectedLanguage,
      }
    } catch (error) {
      console.error("Translation error:", error)
      throw error
    }
  }

  async detectLanguage(text: string): Promise<{ language: string; confidence: number }[]> {
    try {
      const response = await fetch(`${this.baseUrl}/detect`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          q: text,
          api_key: this.apiKey,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Language detection error:", error)
      return [{ language: "en", confidence: 0.5 }]
    }
  }
}

export const translateAPI = new LibreTranslateAPI()
