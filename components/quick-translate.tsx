"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Volume2, Mic, Copy, RotateCcw, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useToast } from "@/hooks/use-toast"


const languages = [
  { code: "auto", name: "Auto Detect" },
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "pt", name: "Portuguese" },
  { code: "ru", name: "Russian" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "zh", name: "Chinese" },
  { code: "ar", name: "Arabic" },
  { code: "hi", name: "Hindi" },
  { code: "tr", name: "Turkish" },
  { code: "pl", name: "Polish" },
  { code: "nl", name: "Dutch" },
  { code: "yo", name: "Yoruba" },
  { code: "ig", name: "Igbo" },
  { code: "ha", name: "Hausa" },
  { code: "sw", name: "Swahili" },
  { code: "am", name: "Amharic" },
  { code: "zu", name: "Zulu" },
]

export function QuickTranslate() {
  const [sourceText, setSourceText] = useState("")
  const [translatedText, setTranslatedText] = useState("")
  const [sourceLang, setSourceLang] = useState("auto")
  const [targetLang, setTargetLang] = useState("es")
  const [isTranslating, setIsTranslating] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const { toast } = useToast()
  const [detectedLang, setDetectedLang] = useState<string | null>(null)

  // Replace the translateText function with:
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

    setTranslatedText(data.translatedText || '');

    if (data.detectedLanguage && from === "auto") {
      setDetectedLang(data.detectedLanguage.language);
    }
  } catch (error) {
    console.error("Translation failed:", error);
    // Fallback to mock translation for demo
    const mockTranslations: Record<string, string> = {
      hello: "hola",
      goodbye: "adiós",
      "thank you": "gracias",
      "how are you": "cómo estás",
      "good morning": "buenos días",
      "good night": "buenas noches",
    };

    const result = mockTranslations[text.toLowerCase()] || `[Translation: ${text}]`;
    setTranslatedText(result);
  } finally {
    setIsTranslating(false);
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
    <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Source */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Select value={sourceLang} onValueChange={setSourceLang}>
                <SelectTrigger className="w-40 border-white/20 bg-white/5 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

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
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleSpeak(sourceText, sourceLang)}
                    className="text-white hover:bg-white/10"
                  >
                    <Volume2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            <Textarea
              placeholder="Enter text to translate..."
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              className="min-h-32 border-white/20 bg-white/5 text-white placeholder:text-slate-400"
            />

            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="bg-white/10 text-white">
                {sourceText.length}/500
              </Badge>
              {sourceText && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleCopy(sourceText)}
                  className="text-white hover:bg-white/10"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center lg:flex-col lg:gap-4">
            <div className="flex gap-2">
              <Button
                onClick={handleTranslate}
                disabled={!sourceText.trim() || isTranslating}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                {isTranslating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Translate
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>

              <Button
                size="sm"
                variant="ghost"
                onClick={handleSwapLanguages}
                disabled={sourceLang === "auto"}
                className="text-white hover:bg-white/10"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Target */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Select value={targetLang} onValueChange={setTargetLang}>
                <SelectTrigger className="w-40 border-white/20 bg-white/5 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages
                    .filter((lang) => lang.code !== "auto")
                    .map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>

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
                </div>
              )}
            </div>

            <div className="min-h-32 rounded-md border border-white/20 bg-white/5 p-3">
              <AnimatePresence>
                {translatedText && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-white"
                  >
                    {translatedText}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
