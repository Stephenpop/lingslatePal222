"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  ArrowRight,
  Volume2,
  Mic,
  Copy,
  RotateCcw,
  Loader2,
  Languages,
  History,
  BookOpen,
  Star,
  Sparkles,
} from "lucide-react"
import Link from "next/link"
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
  { code: "tr", name: "Turkish", flag: "🇹🇷" },
  { code: "pl", name: "Polish", flag: "🇵🇱" },
  { code: "nl", name: "Dutch", flag: "🇳🇱" },
  { code: "yo", name: "Yoruba", flag: "🇳🇬" },
  { code: "ig", name: "Igbo", flag: "🇳🇬" },
  { code: "ha", name: "Hausa", flag: "🇳🇬" },
  { code: "sw", name: "Swahili", flag: "🇹🇿" },
  { code: "am", name: "Amharic", flag: "🇪🇹" },
  { code: "zu", name: "Zulu", flag: "🇿🇦" },
]

const recentTranslations = [
  { source: "Hello world", target: "Hola mundo", from: "en", to: "es" },
  { source: "Good morning", target: "Bonjour", from: "en", to: "fr" },
  { source: "Thank you", target: "Danke", from: "en", to: "de" },
  { source: "How are you?", target: "¿Cómo estás?", from: "en", to: "es" },
  { source: "Goodbye", target: "Au revoir", from: "en", to: "fr" },
]

export default function TranslatePage() {
  const [sourceText, setSourceText] = useState("")
  const [translatedText, setTranslatedText] = useState("")
  const [sourceLang, setSourceLang] = useState("auto")
  const [targetLang, setTargetLang] = useState("es")
  const [isTranslating, setIsTranslating] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [detectedLang, setDetectedLang] = useState("")
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
        "good night": { es: "buenas noches", fr: "bonne nuit", de: "gute nacht", it: "buonanotte" },
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
    setDetectedLang("")
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

  const handleRecentTranslation = (translation: (typeof recentTranslations)[0]) => {
    setSourceText(translation.source)
    setTranslatedText(translation.target)
    setSourceLang(translation.from)
    setTargetLang(translation.to)
  }

  return (
    <div className="min-h-screen bg-[--translate-bg]">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 sm:space-x-3">
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-card shadow-lg">
                <Languages className="h-4 w-4 sm:h-6 sm:w-6 text-muted-foreground" />
              </div>
              <span className="text-lg sm:text-2xl font-bold text-foreground">LingslatePal</span>
            </Link>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link href="/dashboard">
                <Button className="bg-primary text-primary-foreground hover:bg-blue-900 shadow-lg text-sm sm:text-base px-3 sm:px-4">
                  <BookOpen className="mr-1 sm:mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                  <span className="sm:hidden">Learn</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-4">
          {/* Main Translation Area */}
          <div className="lg:col-span-3">
            <div className="mb-6 sm:mb-8">
              <h1 className="mb-2 text-2xl sm:text-3xl font-bold text-foreground">Free Language Translation</h1>
              <p className="text-muted-foreground text-sm sm:text-base">
                Translate between 100+ languages instantly with our free translation service
              </p>
            </div>

            <div>
              <Card className="border-border bg-card shadow-xl">
                <CardContent className="p-4 sm:p-6">
                  <div className="grid gap-6 lg:grid-cols-2">
                    {/* Source */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Select value={sourceLang} onValueChange={setSourceLang}>
                          <SelectTrigger className="w-36 sm:w-48 border-border bg-card text-foreground focus:ring-primary text-base font-medium shadow-sm">
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
                        {detectedLang && (
                          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 font-medium shadow-inner">
                            Detected: {detectedLang}
                          </Badge>
                        )}
                      </div>

                      <Textarea
                        placeholder="Enter text to translate..."
                        value={sourceText}
                        onChange={(e) => setSourceText(e.target.value)}
                        className="min-h-32 sm:min-h-40 border-border bg-card text-foreground placeholder:text-muted-foreground focus:ring-primary text-base font-medium resize-none p-4 shadow-sm"
                        maxLength={5000}
                      />

                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={handleListen}
                            disabled={isListening}
                            className="text-primary hover:bg-muted hover:text-primary-foreground p-2 shadow-sm"
                          >
                            {isListening ? <Loader2 className="h-5 w-5 animate-spin" /> : <Mic className="h-5 w-5" />}
                          </Button>
                          {sourceText && (
                            <>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleSpeak(sourceText, sourceLang)}
                                className="text-primary hover:bg-muted hover:text-primary-foreground p-2 shadow-sm"
                              >
                                <Volume2 className="h-5 w-5" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleCopy(sourceText)}
                                className="text-primary hover:bg-muted hover:text-primary-foreground p-2 shadow-sm"
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
                    <div className="flex items-center justify-center lg:flex-col lg:gap-4 order-last lg:order-none">
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Button
                          onClick={handleTranslate}
                          disabled={!sourceText.trim() || isTranslating}
                          size="lg"
                          className="bg-primary text-primary-foreground hover:bg-blue-900 shadow-lg hover:shadow-xl transition-all duration-200 px-6 py-3 text-base font-semibold"
                        >
                          {isTranslating ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                          ) : (
                            <>
                              <span className="hidden sm:inline">Translate</span>
                              <span className="sm:hidden">Go</span>
                              <ArrowRight className="ml-2 h-5 w-5" />
                            </>
                          )}
                        </Button>
                        <Button
                          size="lg"
                          variant="outline"
                          onClick={handleSwapLanguages}
                          disabled={sourceLang === "auto"}
                          className="border-border text-foreground hover:bg-muted bg-card px-4 py-3 shadow-sm"
                        >
                          <RotateCcw className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>

                    {/* Target */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Select value={targetLang} onValueChange={setTargetLang}>
                          <SelectTrigger className="w-36 sm:w-48 border-border bg-card text-foreground focus:ring-primary text-base font-medium shadow-sm">
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
                      </div>

                      <div className="min-h-32 sm:min-h-40 rounded-lg border border-border bg-card p-4 shadow-md">
                        {translatedText ? (
                          <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-foreground text-lg font-semibold leading-relaxed"
                          >
                            {translatedText}
                          </motion.p>
                        ) : (
                          <p className="text-muted-foreground text-lg font-medium">Translation will appear here...</p>
                        )}
                      </div>

                      {translatedText && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleSpeak(translatedText, targetLang)}
                            className="text-primary hover:bg-muted hover:text-primary-foreground p-2 shadow-sm"
                          >
                            <Volume2 className="h-5 w-5" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleCopy(translatedText)}
                            className="text-primary hover:bg-muted hover:text-primary-foreground p-2 shadow-sm"
                          >
                            <Copy className="h-5 w-5" />
                          </Button>
                          <Button size="sm" variant="ghost" className="text-primary hover:bg-muted p-2 shadow-sm">
                            <Star className="h-5 w-5" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Translations */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <Card className="border-border bg-card shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground text-lg font-bold">
                    <History className="h-5 w-5" />
                    Recent Translations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {recentTranslations.map((translation, index) => (
                    <div
                      key={index}
                      className="cursor-pointer rounded-lg border border-border bg-card p-3 transition-colors hover:bg-muted hover:border-muted-foreground shadow-sm"
                      onClick={() => handleRecentTranslation(translation)}
                    >
                      <div className="text-base text-foreground font-medium">{translation.source}</div>
                      <div className="text-muted-foreground text-base">{translation.target}</div>
                      <div className="mt-2 flex gap-1">
                        <Badge variant="secondary" className="text-sm bg-blue-100 text-blue-800 border-blue-200">
                          {languages.find((l) => l.code === translation.from)?.flag}{" "}
                          {languages.find((l) => l.code === translation.from)?.name}
                        </Badge>
                        <Badge variant="secondary" className="text-sm bg-emerald-100 text-emerald-800 border-emerald-200">
                          {languages.find((l) => l.code === translation.to)?.flag}{" "}
                          {languages.find((l) => l.code === translation.to)?.name}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Upgrade CTA */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <Card className="border-border bg-card shadow-lg">
                <CardHeader>
                  <CardTitle className="text-foreground text-lg font-bold">Want to Learn More?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-base text-muted-foreground">
                    Join LingslatePal to access interactive lessons, quizzes, and track your progress!
                  </p>
                  <div className="space-y-3">
                    <Link href="/auth/register">
                      <Button className="w-full bg-primary text-primary-foreground hover:bg-blue-900 shadow-lg">
                        <BookOpen className="mr-2 h-5 w-5" />
                        Start Learning Free
                      </Button>
                    </Link>
                    <Link href="/learn">
                      <Button
                        variant="outline"
                        className="w-full border-border text-foreground hover:bg-muted bg-card"
                      >
                        <Sparkles className="mr-2 h-5 w-5" />
                        Browse Lessons
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
