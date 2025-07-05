"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";
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
  Download,
} from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

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
  { code: "el", name: "Greek", flag: "🇬🇷" },
  { code: "he", name: "Hebrew", flag: "🇮🇱" },
  { code: "th", name: "Thai", flag: "🇹🇭" },
  { code: "fa", name: "Persian", flag: "🇮🇷" },
  { code: "vi", name: "Vietnamese", flag: "🇻🇳" },
  { code: "ms", name: "Malay", flag: "🇲🇾" },
  { code: "ur", name: "Urdu", flag: "🇵🇰" },
  { code: "ta", name: "Tamil", flag: "🇮🇳" },
  { code: "te", name: "Telugu", flag: "🇮🇳" },
  { code: "kn", name: "Kannada", flag: "🇮🇳" },
  { code: "ml", name: "Malayalam", flag: "🇮🇳" },
  { code: "mr", name: "Marathi", flag: "🇮🇳" },
  { code: "gu", name: "Gujarati", flag: "🇮🇳" },
  { code: "bn", name: "Bengali", flag: "🇧🇩" },
  { code: "pa", name: "Punjabi", flag: "🇮🇳" },
  { code: "or", name: "Odia", flag: "🇮🇳" },
  { code: "as", name: "Assamese", flag: "🇮🇳" },
  { code: "si", name: "Sinhala", flag: "🇱🇰" },
  { code: "km", name: "Khmer", flag: "🇰🇭" },
  { code: "lo", name: "Lao", flag: "🇱🇦" },
  { code: "my", name: "Burmese", flag: "🇲🇲" },
  { code: "yo", name: "Yoruba", flag: "🇳🇬" },
  { code: "ig", name: "Igbo", flag: "🇳🇬" },
  { code: "ha", name: "Hausa", flag: "🇳🇬" },
  { code: "zu", name: "Zulu", flag: "🇿🇦" },
  { code: "sw", name: "Swahili", flag: "🇹🇿" },
  { code: "am", name: "Amharic", flag: "🇪🇹" },
  { code: "ti", name: "Tigrinya", flag: "🇪🇷" },
  { code: "so", name: "Somali", flag: "🇸🇴" },
  { code: "ne", name: "Nepali", flag: "🇳🇵" },
];

const recentTranslations = [
  { source: "Hello world", target: "Hola mundo", from: "en", to: "es" },
  { source: "Good morning", target: "Bonjour", from: "en", to: "fr" },
  { source: "Thank you", target: "Danke", from: "en", to: "de" },
  { source: "How are you?", target: "¿Cómo estás?", from: "en", to: "es" },
  { code: "Goodbye", target: "Au revoir", from: "en", to: "fr" },
];

export default function TranslatePage() {
  const [sourceText, setSourceText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [sourceLang, setSourceLang] = useState("auto");
  const [targetLang, setTargetLang] = useState("es");
  const [isTranslating, setIsTranslating] = useState(false);
  [isListening, setIsListening] = useState(false);
  const [searchSourceQuery, setSearchSourceQuery] = useState("");
  const [searchTargetQuery, setSearchTargetQuery] = useState("");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const { toast } = useToast();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const translateText = async (text: string, from: string, to: string) => {
    setIsTranslating(true);
    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, source: from, target: to }),
      });
      if (!response.ok) throw new Error("Translation failed");
      const data = await response.json();
      setTranslatedText(data.translatedText || data);
      setAudioUrl(null); // Reset audio on new translation
    } catch (error) {
      console.error("Translation error:", error);
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
        title: "Demo Mode",
        description: "Using demo translation. Connect to Lingva Translate for full functionality.",
      });
    } finally {
      setIsTranslating(false);
    }
  };

  const handleTranslate = () => {
    if (!sourceText.trim()) return;
    translateText(sourceText, sourceLang, targetLang);
  };

  const handleSwapLanguages = () => {
    if (sourceLang === "auto") return;
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
  };

  const handleSpeak = (text: string, lang: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === "auto" ? "en" : lang;
      const voices = window.speechSynthesis.getVoices();
      const targetVoice = voices.find((v) => v.lang.startsWith(lang.split("-")[0])) || voices[0];
      utterance.voice = targetVoice;
      utterance.pitch = 1.0; // Mimic user tone (limited control)
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);

      // Record synthesized audio
      const audioContext = new AudioContext();
      const destination = audioContext.createMediaStreamDestination();
      const source = audioContext.createBufferSource();
      const chunks: BlobPart[] = [];
      const recorder = new MediaRecorder(destination.stream);
      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/wav" });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url); // Set URL for playback/download
      };
      recorder.start();
      utterance.onend = () => recorder.stop();
    }
  };

  const handleListen = () => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = sourceLang === "auto" ? "en" : sourceLang;
      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSourceText(transcript);
      };
      recognition.start();
    } else {
      toast({
        title: "Speech Recognition Not Supported",
        description: "Your browser doesn't support speech recognition.",
        variant: "destructive",
      });
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Text copied to clipboard.",
    });
  };

  const handleRecentTranslation = (translation: (typeof recentTranslations)[0]) => {
    setSourceText(translation.source);
    setTranslatedText(translation.target);
    setSourceLang(translation.from);
    setTargetLang(translation.to);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 sm:space-x-3">
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg">
                <Languages className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
              </div>
              <span className="text-lg sm:text-2xl font-bold text-slate-800">LingslatePal</span>
            </Link>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link href="/dashboard">
                <Button
                  className="bg-blue-600 text-white hover:bg-blue-700 shadow-lg text-sm sm:text-base px-3 sm:px-4 py-2 max-w-[120px] sm:max-w-[150px]"
                >
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
              <h1 className="mb-2 text-2xl sm:text-3xl font-bold text-slate-800">Free Language Translation</h1>
              <p className="text-slate-600 text-sm sm:text-base">
                Translate between 60+ languages instantly with our free service
              </p>
            </div>

            <Card className="border-slate-200 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl">
              <CardHeader>
                <CardTitle className="text-slate-800 flex items-center gap-2">
                  <Languages className="h-5 w-5" />
                  Translation
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="grid gap-6 lg:grid-cols-2">
                  {/* Source */}
                  <div className="space-y-4">
                    <Select value={sourceLang} onValueChange={setSourceLang}>
                      <SelectTrigger className="w-full sm:w-48 border-slate-200 bg-white/80 text-slate-800 focus:ring-blue-500 text-base font-medium shadow-sm">
                        <SelectValue placeholder="Select Source Language" />
                      </SelectTrigger>
                      <SelectContent className="bg-black border-slate-200 shadow-md max-h-60 overflow-auto text-white">
                        <div className="p-2">
                          <input
                            type="text"
                            placeholder="Search language..."
                            value={searchSourceQuery}
                            onChange={(e) => setSearchSourceQuery(e.target.value)}
                            className="w-full p-2 border border-slate-200 rounded-md bg-gray-900 text-white focus:ring-blue-500 text-sm shadow-sm"
                          />
                        </div>
                        {languages
                          .filter((lang) =>
                            lang.name.toLowerCase().includes(searchSourceQuery.toLowerCase()) ||
                            lang.code.toLowerCase().includes(searchSourceQuery.toLowerCase())
                          )
                          .map((lang) => (
                            <SelectItem
                              key={lang.code}
                              value={lang.code}
                              className="text-white hover:bg-gray-800"
                            >
                              <div className="flex items-center gap-2">
                                <span>{lang.flag}</span>
                                <span className="font-medium">{lang.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>

                    <Textarea
                      placeholder="Enter text to translate..."
                      value={sourceText}
                      onChange={(e) => setSourceText(e.target.value)}
                      className="min-h-32 sm:min-h-40 border-slate-200 bg-white/80 text-slate-800 placeholder:text-slate-400 focus:ring-blue-500 text-base font-medium resize-none p-4 shadow-sm"
                      maxLength={5000}
                    />

                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={handleListen}
                          disabled={isListening}
                          className="text-blue-600 hover:bg-slate-100 p-2 shadow-sm"
                        >
                          {isListening ? <Loader2 className="h-5 w-5 animate-spin" /> : <Mic className="h-5 w-5" />}
                        </Button>
                        {sourceText && (
                          <>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleSpeak(sourceText, sourceLang)}
                              className="text-blue-600 hover:bg-slate-100 p-2 shadow-sm"
                            >
                              <Volume2 className="h-5 w-5" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleCopy(sourceText)}
                              className="text-blue-600 hover:bg-slate-100 p-2 shadow-sm"
                            >
                              <Copy className="h-5 w-5" />
                            </Button>
                          </>
                        )}
                      </div>
                      <Badge variant="secondary" className="bg-slate-100 text-slate-600 font-medium shadow-inner">
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
                        className="bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-200 px-6 py-3 text-base font-semibold"
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
                        className="border-slate-200 text-slate-800 hover:bg-slate-100 bg-white/80 px-4 py-3 shadow-sm"
                      >
                        <RotateCcw className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>

                  {/* Target */}
                  <div className="space-y-4">
                    <Select value={targetLang} onValueChange={setTargetLang}>
                      <SelectTrigger className="w-full sm:w-48 border-slate-200 bg-white/80 text-slate-800 focus:ring-blue-500 text-base font-medium shadow-sm">
                        <SelectValue placeholder="Select Target Language" />
                      </SelectTrigger>
                      <SelectContent className="bg-black border-slate-200 shadow-md max-h-60 overflow-auto text-white">
                        <div className="p-2">
                          <input
                            type="text"
                            placeholder="Search language..."
                            value={searchTargetQuery}
                            onChange={(e) => setSearchTargetQuery(e.target.value)}
                            className="w-full p-2 border border-slate-200 rounded-md bg-gray-900 text-white focus:ring-blue-500 text-sm shadow-sm"
                          />
                        </div>
                        {languages
                          .filter((lang) => lang.code !== "auto")
                          .filter((lang) =>
                            lang.name.toLowerCase().includes(searchTargetQuery.toLowerCase()) ||
                            lang.code.toLowerCase().includes(searchTargetQuery.toLowerCase())
                          )
                          .map((lang) => (
                            <SelectItem
                              key={lang.code}
                              value={lang.code}
                              className="text-white hover:bg-gray-800"
                            >
                              <div className="flex items-center gap-2">
                                <span>{lang.flag}</span>
                                <span className="font-medium">{lang.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>

                    <div className="min-h-32 sm:min-h-40 rounded-lg border border-slate-200 bg-white/80 p-4 shadow-md">
                      {translatedText ? (
                        <motion.p
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-slate-800 text-lg font-semibold leading-relaxed"
                        >
                          {translatedText}
                        </motion.p>
                      ) : (
                        <p className="text-slate-400 text-lg font-medium">Translation will appear here...</p>
                      )}
                    </div>

                    {translatedText && audioUrl && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => audioRef.current?.play()}
                          className="text-blue-600 hover:bg-slate-100 p-2 shadow-sm"
                        >
                          <Volume2 className="h-5 w-5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleCopy(translatedText)}
                          className="text-blue-600 hover:bg-slate-100 p-2 shadow-sm"
                        >
                          <Copy className="h-5 w-5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            const link = document.createElement("a");
                            link.href = audioUrl;
                            link.download = `translation_${targetLang}_${Date.now()}.wav`;
                            link.click();
                          }}
                          className="text-blue-600 hover:bg-slate-100 p-2 shadow-sm"
                        >
                          <Download className="h-5 w-5" />
                        </Button>
                        <audio ref={audioRef} src={audioUrl} className="hidden" />
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Translations */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <Card className="border-slate-200 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-800 text-lg font-bold">
                    <History className="h-5 w-5" />
                    Recent Translations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {recentTranslations.map((translation, index) => (
                    <div
                      key={index}
                      className="cursor-pointer rounded-lg border border-slate-200 bg-white/80 p-3 transition-colors hover:bg-slate-100 hover:border-slate-300 shadow-sm"
                      onClick={() => handleRecentTranslation(translation)}
                    >
                      <div className="text-base text-slate-800 font-medium">{translation.source}</div>
                      <div className="text-slate-600 text-base">{translation.target}</div>
                      <div className="mt-2 flex gap-1">
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
                          {languages.find((l) => l.code === translation.from)?.flag}{" "}
                          {languages.find((l) => l.code === translation.from)?.name}
                        </Badge>
                        <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 border-emerald-200">
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
              <Card className="border-slate-200 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl">
                <CardHeader>
                  <CardTitle className="text-slate-800 text-lg font-bold">Want to Learn More?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-base text-slate-600">
                    Join LingslatePal to access interactive lessons, quizzes, and track your progress!
                  </p>
                  <div className="space-y-3">
                    <Link href="/auth/register">
                      <Button className="w-full bg-blue-600 text-white hover:bg-blue-700 shadow-lg">
                        <BookOpen className="mr-2 h-5 w-5" />
                        Start Learning Free
                      </Button>
                    </Link>
                    <Link href="/learn">
                      <Button
                        variant="outline"
                        className="w-full border-slate-200 text-slate-800 hover:bg-slate-100 bg-white/80"
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
  );
}
