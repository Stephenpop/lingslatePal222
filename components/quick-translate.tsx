"use client"

import { useState } from "react"
import { motion } from "framer-motion"
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
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
      <Card className="border-slate-200 bg-white shadow-xl">
        <CardContent className="p-8">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Source */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Select value={sourceLang} onValueChange={setSourceLang}>
                  <SelectTrigger className="w-48 border-slate-300 bg-white text-slate-900 focus:ring-blue-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        <div className="flex items-center gap-2">
                          <span>{lang.flag}</span>
                          <span>{lang.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                  <Sparkles className="mr-1 h-3 w-3" />
                  Source
                </Badge>
              </div>

              <Textarea
                placeholder="Enter text to translate..."
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
                className="min-h-40 border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:ring-blue-500 text-lg"
                maxLength={5000}
              />

              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleListen}
                    disabled={isListening}
                    className="text-slate-700 hover:bg-slate-100"
                  >
                    {isListening ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mic className="h-4 w-4" />}
                  </Button>
                  {sourceText && (
                    <>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleSpeak(sourceText, sourceLang)}
                        className="text-slate-700 hover:bg-slate-100"
                      >
                        <Volume2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleCopy(sourceText)}
                        className="text-slate-700 hover:bg-slate-100"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
                <Badge variant="secondary" className="bg-slate-100 text-slate-700">
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
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {isTranslating ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      Translate
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleSwapLanguages}
                  disabled={sourceLang === "auto"}
                  className="border-slate-300 text-slate-700 hover:bg-slate-50 bg-transparent"
                >
                  <RotateCcw className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Target */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Select value={targetLang} onValueChange={setTargetLang}>
                  <SelectTrigger className="w-48 border-slate-300 bg-white text-slate-900 focus:ring-blue-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages
                      .filter((lang) => lang.code !== "auto")
                      .map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          <div className="flex items-center gap-2">
                            <span>{lang.flag}</span>
                            <span>{lang.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                  <Sparkles className="mr-1 h-3 w-3" />
                  Translation
                </Badge>
              </div>

              <div className="min-h-40 rounded-lg border border-slate-300 bg-slate-50 p-4">
                {translatedText ? (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-slate-900 text-lg leading-relaxed"
                  >
                    {translatedText}
                  </motion.p>
                ) : (
                  <p className="text-slate-400 text-lg">Translation will appear here...</p>
                )}
              </div>

              {translatedText && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleSpeak(translatedText, targetLang)}
                    className="text-slate-700 hover:bg-slate-100"
                  >
                    <Volume2 className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleCopy(translatedText)}
                    className="text-slate-700 hover:bg-slate-100"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
