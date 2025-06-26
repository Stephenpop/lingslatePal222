
"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Volume2, Mic, Copy, RotateCcw, Loader2, Languages, History, BookOpen, Star } from "lucide-react"
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
  { code: "yo", name: "Yoruba" },
  { code: "ig", name: "Igbo" },
  { code: "ha", name: "Hausa" },
  { code: "sw", name: "Swahili" },
  { code: "am", name: "Amharic" },
  { code: "zu", name: "Zulu" },
]

const recentTranslations = [
  { source: "Hello world", target: "Hola mundo", from: "en", to: "es" },
  { source: "Good morning", target: "Bonjour", from: "en", to: "fr" },
  { source: "Thank you", target: "Danke", from: "en", to: "de" },
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
  setIsTranslating(true);
  try {
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, source: from, target: to }),
    });
    if (!response.ok) throw new Error('Translation failed');
    const data = await response.json();
    setTranslatedText(data.translatedText || data); // Adjust based on LibreTranslate response
  } catch (error) {
    console.error('Translation error:', error);

    // Fallback to mock translations if API fails
    const mockTranslations: Record<string, Record<string, string>> = {
      hello: { es: "hola", fr: "bonjour", de: "hallo", it: "ciao" },
      goodbye: { es: "adiós", fr: "au revoir", de: "auf wiedersehen", it: "ciao" },
      "thank you": { es: "gracias", fr: "merci", de: "danke", it: "grazie" },
      "how are you": { es: "cómo estás", fr: "comment allez-vous", de: "wie geht es dir", it: "come stai" },
      "good morning": { es: "buenos días", fr: "bonjour", de: "guten morgen", it: "buongiorno" },
      "good night": { es: "buenas noches", fr: "bonne nuit", de: "gute nacht", it: "buonanotte" },
    };

    const result =
      mockTranslations[text.toLowerCase()]?.[to] ||
      `[Translated to ${languages.find((l) => l.code === to)?.name}: ${text}]`;
    setTranslatedText(result);

    toast({
      title: 'Error',
      description: 'Failed to translate. Using fallback.',
      variant: 'destructive',
    });
  } finally {
    setIsTranslating(false);
  }

  }

 const handleTranslate = () => {
  if (!sourceText.trim()) return;
  translateText(sourceText, sourceLang, targetLang);
};

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
                <Languages className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">PolyglotPal</span>
            </Link>

            <div className="flex items-center space-x-4">
              <Link href="/auth/login">
                <Button variant="ghost" className="text-white hover:bg-white/10">
                  Login
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Start Learning
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-4">
          {/* Main Translation Area */}
          <div className="lg:col-span-3">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
              <h1 className="mb-2 text-3xl font-bold text-white">Free Language Translation</h1>
              <p className="text-slate-300">
                Translate between 100+ languages instantly with our free translation service
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="grid gap-6 lg:grid-cols-2">
                    {/* Source */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Select value={sourceLang} onValueChange={setSourceLang}>
                          <SelectTrigger className="w-48 border-white/20 bg-white/5 text-white">
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

                        {detectedLang && (
                          <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                            Detected: {detectedLang}
                          </Badge>
                        )}
                      </div>

                      <Textarea
                        placeholder="Enter text to translate..."
                        value={sourceText}
                        onChange={(e) => setSourceText(e.target.value)}
                        className="min-h-40 border-white/20 bg-white/5 text-white placeholder:text-slate-400"
                        maxLength={5000}
                      />

                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={handleListen}
                            disabled={isListening}
                            className="text-white hover:bg-white/10"
                          >
                            {isListening ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mic className="h-4 w-4" />}
                          </Button>
                          {sourceText && (
                            <>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleSpeak(sourceText, sourceLang)}
                                className="text-white hover:bg-white/10"
                              >
                                <Volume2 className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleCopy(sourceText)}
                                className="text-white hover:bg-white/10"
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>

                        <Badge variant="secondary" className="bg-white/10 text-white">
                          {sourceText.length}/5000
                        </Badge>
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center justify-center lg:flex-col lg:gap-4">
                      <div className="flex gap-2">
                        <Button
                          onClick={handleTranslate}
                          disabled={!sourceText.trim() || isTranslating}
                          size="lg"
                          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
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
                          variant="ghost"
                          onClick={handleSwapLanguages}
                          disabled={sourceLang === "auto"}
                          className="text-white hover:bg-white/10"
                        >
                          <RotateCcw className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>

                    {/* Target */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Select value={targetLang} onValueChange={setTargetLang}>
                          <SelectTrigger className="w-48 border-white/20 bg-white/5 text-white">
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
                      </div>

                      <div className="min-h-40 rounded-md border border-white/20 bg-white/5 p-3">
                        {translatedText ? (
                          <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-white"
                          >
                            {translatedText}
                          </motion.p>
                        ) : (
                          <p className="text-slate-400">Translation will appear here...</p>
                        )}
                      </div>

                      {translatedText && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleSpeak(translatedText, targetLang)}
                            className="text-white hover:bg-white/10"
                          >
                            <Volume2 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleCopy(translatedText)}
                            className="text-white hover:bg-white/10"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="text-white hover:bg-white/10">
                            <Star className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Translations */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <History className="h-5 w-5" />
                    Recent Translations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {recentTranslations.map((translation, index) => (
                    <div
                      key={index}
                      className="cursor-pointer rounded-lg border border-white/10 bg-white/5 p-3 transition-colors hover:bg-white/10"
                      onClick={() => handleRecentTranslation(translation)}
                    >
                      <div className="text-sm text-white">{translation.source}</div>
                      <div className="text-sm text-slate-400">{translation.target}</div>
                      <div className="mt-1 flex gap-1">
                        <Badge variant="secondary" className="text-xs bg-white/10 text-white">
                          {languages.find((l) => l.code === translation.from)?.flag}{" "}
                          {languages.find((l) => l.code === translation.from)?.name}
                        </Badge>
                        <Badge variant="secondary" className="text-xs bg-white/10 text-white">
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
              <Card className="border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Want to Learn More?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-sm text-slate-300">
                    Join PolyglotPal to access interactive lessons, quizzes, and track your progress!
                  </p>
                  <Link href="/auth/register">
                    <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Start Learning Free
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
