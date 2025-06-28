"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { BookOpen, Clock, Trophy, Filter, ArrowLeft, ArrowRight, CheckCircle, XCircle, Languages, Volume2 } from "lucide-react";
import Link from "next/link";
import { authService } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Question {
  id: number;
  question: string;
  type: "multiple_choice" | "text_input";
  options?: string[];
  correct_answer: number | string;
  alternatives?: string[];
  explanation?: string;
}

interface Lesson {
  id: string;
  title: string;
  description: string | null;
  language: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  content: {
    main_content: string;
    questions: Question[];
  };
  order_index: number;
  is_published: boolean;
  content_type: "text" | "video" | "audio" | "interactive";
  estimated_duration: number | null;
  xp_reward: number;
}

export default function LearnPage() {
  const [user, setUser] = useState<any>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [learningLanguage, setLearningLanguage] = useState<string>("es");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const router = useRouter();

  const availableLanguages = [
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "yo", name: "Yoruba" },
    { code: "ig", name: "Igbo" },
    { code: "ha", name: "Hausa" },
    { code: "de", name: "German" },
    { code: "it", name: "Italian" },
    { code: "pt", name: "Portuguese" },
    { code: "ru", name: "Russian" },
    { code: "ja", name: "Japanese" },
    { code: "zh", name: "Chinese" },
    { code: "ar", name: "Arabic" },
  ];

  useEffect(() => {
    loadUserAndLessons();
  }, [learningLanguage]);

  const loadUserAndLessons = async () => {
    try {
      setLoading(true);
      const currentUser = await authService.getCurrentUser();
      if (!currentUser) {
        router.push("/auth/login");
        toast.error("Please log in to access lessons");
        return;
      }
      setUser(currentUser);

      const userLearningLanguage = currentUser.profile?.learning_language || learningLanguage;
      setLearningLanguage(userLearningLanguage);

      const { data: lessonsData, error } = await supabase
        .from("lessons")
        .select("*")
        .eq("language", userLearningLanguage)
        .eq("is_published", true)
        .order("order_index", { ascending: true });

      if (error) throw error;
      setLessons(lessonsData || []);

      const { data: completionsData } = await supabase
        .from("lesson_completions")
        .select("lesson_id")
        .eq("user_id", currentUser.id);
      setCompletedLessonIds(completionsData?.map((c) => c.lesson_id) || []);
    } catch (error) {
      console.error("Error loading user and lessons:", error);
      toast.error("Failed to load lessons");
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = async (languageCode: string) => {
    try {
      setLearningLanguage(languageCode);
      if (user) {
        const { error } = await supabase
          .from("profiles")
          .update({ learning_language: languageCode })
          .eq("id", user.id);
        if (error) throw error;
        toast.success(`Learning language set to ${availableLanguages.find((lang) => lang.code === languageCode)?.name}`);
      }
    } catch (error) {
      console.error("Error updating learning language:", error);
      toast.error("Failed to update learning language");
    }
  };

  const startLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setCurrentQuestion(null);
    setAnswers({});
    setShowResults(false);
    setScore(0);
    // Speak all lesson content
    speakText(`${lesson.title}. ${lesson.description || ""}. ${lesson.content.main_content}`);
  };

  const startQuestions = () => {
    if (selectedLesson && selectedLesson.content.questions.length > 0) {
      setCurrentQuestion(0);
      const firstQuestion = selectedLesson.content.questions[0];
      speakQuestion(firstQuestion);
    } else {
      completeLesson();
    }
  };

  const speakQuestion = (question: Question) => {
    let textToSpeak = question.question;
    if (question.type === "multiple_choice" && question.options) {
      question.options.forEach((option, index) => {
        textToSpeak += ` Option ${String.fromCharCode(65 + index)}: ${option}.`;
      });
    }
    speakText(textToSpeak);
  };

  const handleAnswer = (questionId: number, answer: any) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const nextQuestion = () => {
    if (selectedLesson && currentQuestion !== null && currentQuestion < selectedLesson.content.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      const nextQuestion = selectedLesson.content.questions[currentQuestion + 1];
      speakQuestion(nextQuestion);
    } else {
      finishQuestions();
    }
  };

  const previousQuestion = () => {
    if (currentQuestion !== null && currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      const prevQuestion = selectedLesson.content.questions[currentQuestion - 1];
      speakQuestion(prevQuestion);
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = learningLanguage;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    } else {
      toast.error("Text-to-speech is not supported in this browser");
    }
  };

  const finishQuestions = async () => {
    if (!selectedLesson) return;

    let correctAnswers = 0;
    const totalQuestions = selectedLesson.content.questions.length;

    selectedLesson.content.questions.forEach((question: Question) => {
      const userAnswer = answers[question.id];

      if (question.type === "multiple_choice") {
        if (userAnswer === question.correct_answer) {
          correctAnswers++;
        }
      } else if (question.type === "text_input") {
        const correctAnswer = question.correct_answer as string;
        const alternatives = question.alternatives || [];
        const allCorrectAnswers = [correctAnswer, ...alternatives].map((a) => a.toLowerCase().trim());

        if (userAnswer && allCorrectAnswers.includes(userAnswer.toLowerCase().trim())) {
          correctAnswers++;
        }
      }
    });

    const finalScore = Math.round((correctAnswers / totalQuestions) * 100);
    setScore(finalScore);
    setShowResults(true);

    // Speak results and review
    let reviewText = `Lesson completed. You scored ${finalScore} percent.`;
    selectedLesson.content.questions.forEach((question: Question) => {
      const userAnswer = answers[question.id];
      let isCorrect = false;

      if (question.type === "multiple_choice") {
        isCorrect = userAnswer === question.correct_answer;
      } else if (question.type === "text_input") {
        const correctAnswer = question.correct_answer as string;
        const alternatives = question.alternatives || [];
        const allCorrectAnswers = [correctAnswer, ...alternatives].map((a) => a.toLowerCase().trim());
        isCorrect = userAnswer && allCorrectAnswers.includes(userAnswer.toLowerCase().trim());
      }

      const correctAnswerText = question.type === "multiple_choice" 
        ? question.options![question.correct_answer as number]
        : question.correct_answer as string;
      const userAnswerText = question.type === "multiple_choice" 
        ? (userAnswer !== undefined ? question.options![userAnswer] : "No answer")
        : userAnswer || "No answer";
      reviewText += ` Question: ${question.question}. Your answer: ${userAnswerText}. Correct answer: ${correctAnswerText}.`;
      if (question.explanation) {
        reviewText += ` Explanation: ${question.explanation}.`;
      }
    });
    speakText(reviewText);

    if (finalScore >= 70) {
      await completeLesson();
    }
  };

  const completeLesson = async () => {
    if (!selectedLesson || !user) return;

    try {
      if (completedLessonIds.includes(selectedLesson.id)) {
        toast.info("Lesson already completed!");
        setSelectedLesson(null);
        return;
      }

      const { error: completionError } = await supabase.from("lesson_completions").insert({
        user_id: user.id,
        lesson_id: selectedLesson.id,
        score,
        completed_at: new Date().toISOString(),
      });

      if (completionError) throw completionError;

      const currentXp = user.profile?.xp_points || 0;
      const { error: xpError } = await supabase
        .from("profiles")
        .update({ xp_points: currentXp + selectedLesson.xp_reward })
        .eq("id", user.id);

      if (xpError) throw xpError;

      toast.success(`Lesson completed! +${selectedLesson.xp_reward} XP`);
      setCompletedLessonIds((prev) => [...prev, selectedLesson.id]);
      setSelectedLesson(null);
      await loadUserAndLessons();
    } catch (error) {
      console.error("Error completing lesson:", error);
      toast.error("Failed to complete lesson");
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-700";
      case "intermediate":
        return "bg-yellow-100 text-yellow-700";
      case "advanced":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const filteredLessons = difficultyFilter === "all"
    ? lessons
    : lessons.filter((lesson) => lesson.difficulty === difficultyFilter);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading lessons...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 sm:h-10 sm:w-10">
                <Languages className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-800 hidden sm:inline">LingslatePal</span>
            </Link>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-600">
                {user?.profile?.xp_points || 0} XP
              </span>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="text-slate-700 hover:bg-slate-100">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                  <span className="sm:hidden">Back</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {!selectedLesson ? (
          <div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
              <h1 className="text-3xl font-bold text-slate-800 mb-4">Learn a Language</h1>
              <div className="flex items-center gap-4">
                <Select value={learningLanguage} onValueChange={handleLanguageChange}>
                  <SelectTrigger className="w-48 border-slate-200 bg-white/80 text-slate-800">
                    <Languages className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableLanguages.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                  <SelectTrigger className="w-48 border-slate-200 bg-white/80 text-slate-800">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Filter by difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Difficulties</SelectItem>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {filteredLessons.length === 0 ? (
                <div className="col-span-full text-center py-8 text-slate-600">
                  <BookOpen className="h-12 w-12 mx-auto mb-3 text-slate-400" />
                  <p>No lessons available for this language or difficulty</p>
                </div>
              ) : (
                filteredLessons.map((lesson) => (
                  <motion.div key={lesson.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Card className="border-slate-200 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-slate-800">{lesson.title}</CardTitle>
                          {completedLessonIds.includes(lesson.id) && (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          )}
                        </div>
                        <CardDescription className="text-slate-600">{lesson.description || "No description"}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge className={getDifficultyColor(lesson.difficulty)}>
                            {lesson.difficulty}
                          </Badge>
                          <Badge className="bg-blue-100 text-blue-700">{lesson.content_type}</Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Clock className="h-4 w-4" />
                          {lesson.estimated_duration ? `${lesson.estimated_duration} min` : "N/A"}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Trophy className="h-4 w-4" />
                          {lesson.xp_reward} XP
                        </div>
                        <Button
                          onClick={() => startLesson(lesson)}
                          className="w-full mt-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                        >
                          {completedLessonIds.includes(lesson.id) ? "Review Lesson" : "Start Lesson"}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </motion.div>
          </div>
        ) : showResults ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
            <Card className="border-slate-200 bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4">
                  {score >= 70 ? (
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                      <XCircle className="h-8 w-8 text-red-600" />
                    </div>
                  )}
                </div>
                <CardTitle className="text-2xl text-slate-800">
                  {score >= 70 ? "Lesson Completed!" : "Keep Practicing!"}
                </CardTitle>
                <CardDescription className="text-slate-600">
                  You scored {score}% on {selectedLesson.title}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-slate-800 mb-2">{score}%</div>
                  <div className="w-full bg-slate-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-500 h-2.5 rounded-full"
                      style={{ width: `${score}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-slate-600 mt-2">
                    {score >= 70
                      ? "You passed! Minimum required: 70%"
                      : "You need 70% to complete the lesson"}
                  </p>
                </div>

                {score >= 70 && (
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <Trophy className="h-6 w-6 mx-auto mb-2 text-yellow-600" />
                    <p className="text-sm font-medium text-yellow-800">
                      You earned {selectedLesson.xp_reward} XP points!
                    </p>
                  </div>
                )}

                <div className="space-y-4">
                  <h3 className="font-semibold text-slate-800">Review Your Answers</h3>
                  {selectedLesson.content.questions.map((question: Question) => {
                    const userAnswer = answers[question.id];
                    let isCorrect = false;

                    if (question.type === "multiple_choice") {
                      isCorrect = userAnswer === question.correct_answer;
                    } else if (question.type === "text_input") {
                      const correctAnswer = question.correct_answer as string;
                      const alternatives = question.alternatives || [];
                      const allCorrectAnswers = [correctAnswer, ...alternatives].map((a) => a.toLowerCase().trim());
                      isCorrect = userAnswer && allCorrectAnswers.includes(userAnswer.toLowerCase().trim());
                    }

                    return (
                      <div key={question.id} className="p-4 border rounded-lg">
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                              isCorrect ? "bg-green-100" : "bg-red-100"
                            }`}
                          >
                            {isCorrect ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-600" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="font-medium text-slate-800 mb-2">{question.question}</p>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  let text = `Question: ${question.question}. Your answer: ${
                                    question.type === "multiple_choice" 
                                      ? (userAnswer !== undefined ? question.options![userAnswer] : "No answer")
                                      : userAnswer || "No answer"
                                  }. Correct answer: ${
                                    question.type === "multiple_choice" 
                                      ? question.options![question.correct_answer as number]
                                      : question.correct_answer as string
                                  }.`;
                                  if (question.explanation) {
                                    text += ` Explanation: ${question.explanation}.`;
                                  }
                                  speakText(text);
                                }}
                                disabled={isSpeaking}
                              >
                                <Volume2 className="h-4 w-4 text-black" />
                              </Button>
                            </div>

                            {question.type === "multiple_choice" && question.options && (
                              <div className="space-y-1 mb-2">
                                {question.options.map((option, optionIndex) => (
                                  <div
                                    key={optionIndex}
                                    className={`text-sm p-2 rounded flex items-center cursor-pointer ${
                                      optionIndex === question.correct_answer
                                        ? "bg-green-100 text-green-800"
                                        : userAnswer === optionIndex
                                        ? "bg-blue-100 text-blue-800"
                                        : "text-slate-800 bg-gray-50 hover:bg-gray-100"
                                    }`}
                                    onClick={() => handleAnswer(question.id, optionIndex)}
                                  >
                                    {String.fromCharCode(65 + optionIndex)}. {option}
                                    {optionIndex === question.correct_answer && " ✓"}
                                    {optionIndex === userAnswer && optionIndex !== question.correct_answer && " ✗"}
                                  </div>
                                ))}
                              </div>
                            )}

                            {question.type === "text_input" && (
                              <div className="space-y-1 mb-2">
                                <div className="text-sm">
                                  <span className="text-slate-600">Your answer: </span>
                                  <span className={isCorrect ? "text-green-700" : "text-red-700"}>
                                    {userAnswer || "No answer"}
                                  </span>
                                </div>
                                <div className="text-sm">
                                  <span className="text-slate-600">Correct answer: </span>
                                  <span className="text-green-700">{question.correct_answer as string}</span>
                                </div>
                              </div>
                            )}

                            {question.explanation && (
                              <p className="text-sm text-slate-600 italic">{question.explanation}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex gap-3">
                  <Button onClick={() => setSelectedLesson(null)} variant="outline" className="flex-1">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Lessons
                  </Button>
                  {score < 70 && (
                    <Button onClick={() => { setCurrentQuestion(0); setAnswers({}); setShowResults(false); }} className="flex-1">
                      Retake Questions
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : currentQuestion !== null ? (
          <div className="max-w-2xl mx-auto">
            <Card className="border-slate-200 bg-white/80 backdrop-blur-sm mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-slate-800">{selectedLesson.title}</CardTitle>
                    <CardDescription className="text-slate-600">
                      Question {currentQuestion + 1} of {selectedLesson.content.questions.length}
                    </CardDescription>
                  </div>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-500 h-2.5 rounded-full"
                    style={{ width: `${((currentQuestion + 1) / selectedLesson.content.questions.length) * 100}%` }}
                  ></div>
                </div>
              </CardHeader>
            </Card>

            <Card className="border-slate-200 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-slate-800">{selectedLesson.content.questions[currentQuestion].question}</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => speakQuestion(selectedLesson.content.questions[currentQuestion])}
                    disabled={isSpeaking}
                  >
                    <Volume2 className="h-4 w-4 text-black" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {selectedLesson.content.questions[currentQuestion].type === "multiple_choice" ? (
                  <RadioGroup
                    value={answers[selectedLesson.content.questions[currentQuestion].id]?.toString()}
                    onValueChange={(value) =>
                      handleAnswer(selectedLesson.content.questions[currentQuestion].id, Number.parseInt(value))
                    }
                  >
                    {selectedLesson.content.questions[currentQuestion].options?.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                        <Label
                          htmlFor={`option-${index}`}
                          className={`flex-1 cursor-pointer p-2 rounded ${
                            answers[selectedLesson.content.questions[currentQuestion].id] === index
                              ? "bg-blue-100 text-blue-800"
                              : "text-slate-800 bg-gray-50 hover:bg-gray-100"
                          }`}
                        >
                          {String.fromCharCode(65 + index)}. {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                ) : (
                  <div>
                    <Label htmlFor="text-answer" className="text-sm font-medium text-slate-700">
                      Your Answer
                    </Label>
                    <Input
                      id="text-answer"
                      placeholder="Type your answer here..."
                      value={answers[selectedLesson.content.questions[currentQuestion].id] || ""}
                      onChange={(e) => handleAnswer(selectedLesson.content.questions[currentQuestion].id, e.target.value)}
                      className="mt-2"
                    />
                  </div>
                )}

                <div className="flex justify-between">
                  <Button onClick={previousQuestion} disabled={currentQuestion === 0} variant="outline">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Previous
                  </Button>
                  <Button onClick={nextQuestion}>
                    {currentQuestion === selectedLesson.content.questions.length - 1 ? (
                      <>
                        <Trophy className="mr-2 h-4 w-4" />
                        Finish Questions
                      </>
                    ) : (
                      <>
                        Next
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <Card className="border-slate-200 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-slate-800">{selectedLesson.title}</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => speakText(`${selectedLesson.title}. ${selectedLesson.description || ""}. ${selectedLesson.content.main_content}`)}
                    disabled={isSpeaking}
                  >
                    <Volume2 className="h-4 w-4 text-black" />
                  </Button>
                </div>
                <CardDescription className="text-slate-600">{selectedLesson.description || "No description"}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {selectedLesson.content_type === "text" && (
                  <div className="prose text-slate-800">
                    {selectedLesson.content.main_content}
                  </div>
                )}
                {selectedLesson.content_type === "video" && (
                  <div className="aspect-video">
                    <iframe
                      src={selectedLesson.content.main_content}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full rounded-lg"
                    ></iframe>
                  </div>
                )}
                {selectedLesson.content_type === "audio" && (
                  <audio controls className="w-full">
                    <source src={selectedLesson.content.main_content} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                )}
                {selectedLesson.content_type === "interactive" && (
                  <div className="text-slate-800">
                    <p>{selectedLesson.content.main_content}</p>
                  </div>
                )}
                <div className="flex gap-3">
                  <Button onClick={() => setSelectedLesson(null)} variant="outline" className="flex-1">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Lessons
                  </Button>
                  {selectedLesson.content.questions.length > 0 ? (
                    <Button onClick={startQuestions} className="flex-1">
                      Start Questions
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button onClick={completeLesson} className="flex-1">
                      Complete Lesson
                      <Trophy className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
