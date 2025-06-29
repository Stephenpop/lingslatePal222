"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Volume2, Mic, Copy, RotateCcw, Loader2, Sparkles } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const languages = [
  { code: "auto", name: "Auto Detect", flag: "🌐" },
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Spanish", flag: "🇪🇸" },
  { code: "fr", name: "French", flag: "🇫🇷" },
  { code: "de", name: "German", flag: "🇩🇪" },
  { code: "it", name: "Italian", flag: "🇮🇹" },
  { code: "pt", name: "Portuguese", flag: "🇵🇹" },
  { code: "ru", name: "Russian", flag: "🇷🇺" },
  { code: "ja", name: "Japanese", flag: "🇯🇵" },
  { code: "ko", name: "Korean", flag: "🇰🇷" },
  { code: "zh", name: "Chinese", flag: "🇨🇳" },
  { code: "ar", name: "Arabic", flag: "🇸🇦" },
  { code: "hi", name: "Hindi", flag: "🇮🇳" },
  { code: "yo", name: "Yoruba", flag: "🇳🇬" },
  { code: "ig", name: "Igbo", flag: "🇳🇬" },
  { code: "ha", name: "Hausa", flag: "🇳🇬" },
]

export function QuickTranslate() {
  const [sourceText, setSourceText] = useState("")
  const [translatedText, setTranslatedText] = useState("")
  const [sourceLang, setSourceLang] = useState("auto")
  const [targetLang, setTargetLang] = useState("es")
  const [isTranslating, setIsTranslating] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const { toast } = useToast()

  const translateText = async (text: string, from: string, to: string) => {
    setIsTranslating(true)
    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, source: from, target: to }),
      })
      if (!response.ok) throw new Error("Translation failed")
      const data = await response.json()
      setTranslatedText(data.translatedText || data)
    } catch (error) {
      console.error("Translation error:", error)
      const mockTranslations: Record<string, Record<string, string>> = {
        hello: { es: "hola", fr: "bonjour", de: "hallo", it: "ciao" },
        goodbye: { es: "adiós", fr: "au revoir", de: "auf wiedersehen", it: "ciao" },
        "thank you": { es: "gracias", fr: "merci", de: "danke", it: "grazie" },
        "how are you": { es: "cómo estás", fr: "comment allez-vous", de: "wie geht es dir", it: "come stai" },
        "good morning": { es: "buenos días", fr: "bonjour", de: "guten morgen", it: "buongiorno" },
      }
      const result =
        mockTranslations[text.toLowerCase()]?.[to] ||
        `[Translated to ${languages.find((l) => l.code === to)?.name}: ${text}]`
      setTranslatedText(result)
      toast({
        title: "Demo Mode",
        description: "Using demo translation. Connect to LibreTranslate for full functionality.",
      })
    } finally {
      setIsTranslating(false)
    }
  }

  const handleTranslate = () => {
    if (!sourceText.trim()) return
    translateText(sourceText, sourceLang, targetLang)
  }

  const handleSwapLanguages = () => {
    if (sourceLang === "auto") return
    setSourceLang(targetLang)
    setTargetLang(sourceLang)
    setSourceText(translatedText)
    setTranslatedText(sourceText)
  }

  const handleSpeak = (text: string, lang: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = lang === "auto" ? "en" : lang
      speechSynthesis.speak(utterance)
    }
  }

  const handleListen = () => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      const recognition = new SpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = sourceLang === "auto" ? "en" : sourceLang
      recognition.onstart = () => setIsListening(true)
      recognition.onend = () => setIsListening(false)
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setSourceText(transcript)
      }
      recognition.start()
    } else {
      toast({
        title: "Speech Recognition Not Supported",
        description: "Your browser doesn't support speech recognition.",
        variant: "destructive",
      })
    }
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: "Text copied to clipboard.",
    })
  }

  return (
    <div className="bg-[--translate-bg]">
      <Card className="border border-border bg-card shadow-xl">
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col space-y-6 lg:flex-row lg:space-y-0 lg:space-x-6">
            {/* Source */}
            <div className="flex-1 space-y-4">
              <div className="flex items-center justify-between">
                <Select value={sourceLang} onValueChange={setSourceLang}>
                  <SelectTrigger className="w-48 border-border bg-card text-foreground focus:ring-primary font-medium text-base rounded-lg shadow-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border shadow-md">
                    {languages.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code} className="text-foreground hover:bg-muted">
                        <div className="flex items-center gap-2">
                          <span>{lang.flag}</span>
                          <span className="font-medium">{lang.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Badge className="bg-blue-100 text-blue-900 border-blue-200 font-semibold shadow-inner">
                  <Sparkles className="mr-1 h-4 w-4" />
                  Source
                </Badge>
              </div>

              <Textarea
                placeholder="Enter text to translate..."
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
                className="min-h-40 border-border bg-card text-foreground placeholder:text-muted-foreground focus:ring-primary text-lg font-medium rounded-lg shadow-sm p-4"
                maxLength={5000}
              />

              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleListen}
                    disabled={isListening}
                    className="text-primary hover:bg-muted hover:text-primary-foreground rounded-lg shadow-sm"
                  >
                    {isListening ? <Loader2 className="h-5 w-5 animate-spin" /> : <Mic className="h-5 w-5" />}
                  </Button>
                  {sourceText && (
                    <>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleSpeak(sourceText, sourceLang)}
                        className="text-primary hover:bg-muted hover:text-primary-foreground rounded-lg shadow-sm"
                      >
                        <Volume2 className="h-5 w-5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleCopy(sourceText)}
                        className="text-primary hover:bg-muted hover:text-primary-foreground rounded-lg shadow-sm"
                      >
                        <Copy className="h-5 w-5" />
                      </Button>
                    </>
                  )}
                </div>
                <Badge variant="secondary" className="bg-muted text-muted-foreground font-medium shadow-inner">
                  {sourceText.length}/5000
                </Badge>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center lg:flex-col lg:gap-6">
              <div className="flex gap-3">
                <Button
                  onClick={handleTranslate}
                  disabled={!sourceText.trim() || isTranslating}
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-blue-900 shadow-lg hover:shadow-xl transition-all duration-200 rounded-lg px-6 py-3"
                >
                  {isTranslating ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    <>
                      Translate
                      <ArrowRight className="ml-2 h-6 w-6" />
                    </>
                  )}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleSwapLanguages}
                  disabled={sourceLang === "auto"}
                  className="border-border text-foreground hover:bg-muted bg-card rounded-lg px-4 py-3 shadow-sm"
                >
                  <RotateCcw className="h-6 w-6" />
                </Button>
              </div>
            </div>

            {/* Target */}
            <div className="flex-1 space-y-4">
              <div className="flex items-center justify-between">
                <Select value={targetLang} onValueChange={setTargetLang}>
                  <SelectTrigger className="w-48 border-border bg-card text-foreground focus:ring-primary font-medium text-base rounded-lg shadow-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border shadow-md">
                    {languages
                      .filter((lang) => lang.code !== "auto")
                      .map((lang) => (
                        <SelectItem key={lang.code} value={lang.code} className="text-foreground hover:bg-muted">
                          <div className="flex items-center gap-2">
                            <span>{lang.flag}</span>
                            <span className="font-medium">{lang.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <Badge className="bg-emerald-100 text-emerald-900 border-emerald-200 font-semibold shadow-inner">
                  <Sparkles className="mr-1 h-4 w-4" />
                  Translation
                </Badge>
              </div>

              <div className="min-h-40 rounded-lg border border-border bg-card p-4 shadow-md">
                {translatedText ? (
                  <p className="text-foreground text-xl font-semibold leading-relaxed">
                    {translatedText}
                  </p>
                ) : (
                  <p className="text-muted-foreground text-xl font-medium">Translation will appear here...</p>
                )}
              </div>

              {translatedText && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleSpeak(translatedText, targetLang)}
                    className="text-primary hover:bg-muted hover:text-primary-foreground rounded-lg shadow-sm"
                  >
                    <Volume2 className="h-5 w-5" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleCopy(translatedText)}
                    className="text-primary hover:bg-muted hover:text-primary-foreground rounded-lg shadow-sm"
                  >
                    <Copy className="h-5 w-5" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
