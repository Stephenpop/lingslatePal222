"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Trophy,
  Clock,
  Star,
  CheckCircle,
  XCircle,
  ArrowRight,
  ArrowLeft,
  Languages,
  Play,
  RotateCcw,
  SkipForward,
  Volume2,
} from "lucide-react";
import Link from "next/link";
import { supabase, type Quiz, type QuizAttempt } from "@/lib/supabase";
import { authService } from "@/lib/auth";
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

interface Category {
  id: string;
  name: string;
  quizzes: Quiz[];
}

export default function QuizPage() {
  const [user, setUser] = useState<any>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [skippedQuestions, setSkippedQuestions] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [recentAttempts, setRecentAttempts] = useState<QuizAttempt[]>([]);
  const [completedQuizIds, setCompletedQuizIds] = useState<string[]>([]);
  const [learningLanguage, setLearningLanguage] = useState<string>("multilingual");
  const [isSpeaking, setIsSpeaking] = useState(false);

  const availableLanguages = [
    { code: "multilingual", name: "Multilingual" },
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "yo", name: "Yoruba" },
    { code: "de", name: "German" },
    { code: "it", name: "Italian" },
    { code: "pt", name: "Portuguese" },
    { code: "ru", name: "Russian" },
    { code: "ja", name: "Japanese" },
    { code: "zh", name: "Chinese" },
    { code: "ar", name: "Arabic" },
  ];

  useEffect(() => {
    loadQuizData();
  }, [learningLanguage]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (timeLeft !== null && timeLeft > 0 && quizStarted && !showResults) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0) {
      finishQuiz();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, quizStarted, showResults]);

  const loadQuizData = async () => {
    try {
      setLoading(true);
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);

      const userLearningLanguage = currentUser?.profile?.learning_language || learningLanguage;
      setLearningLanguage(userLearningLanguage);

      const { data: quizzesData, error } = await supabase
        .from("quizzes")
        .select(`
          *,
          category:categories(name)
        `)
        .eq("is_published", true)
        .eq("language", userLearningLanguage)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const groupedByCategory = quizzesData?.reduce((acc, quiz) => {
        const categoryName = quiz.category?.name || "Uncategorized";
        const categoryId = quiz.category_id || "uncategorized";
        const existingCategory = acc.find((cat) => cat.id === categoryId);
        if (existingCategory) {
          existingCategory.quizzes.push(quiz);
        } else {
          acc.push({
            id: categoryId,
            name: categoryName,
            quizzes: [quiz],
          });
        }
        return acc;
      }, [] as Category[]) || [];

      setCategories(groupedByCategory);

      if (currentUser) {
        const { data: attemptsData } = await supabase
          .from("quiz_attempts")
          .select(`
            *,
            quizzes (title, difficulty, xp_reward, category:categories(name))
          `)
          .eq("user_id", currentUser.id)
          .order("completed_at", { ascending: false })
          .limit(5);

        setRecentAttempts(attemptsData || []);
        setCompletedQuizIds(attemptsData?.map((attempt) => attempt.quiz_id) || []);
      }
    } catch (error) {
      console.error("Error loading quiz data:", error);
      toast.error("Failed to load quizzes");
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
        toast.success(`Quiz language set to ${availableLanguages.find((lang) => lang.code === languageCode)?.name}`);
      }
    } catch (error) {
      console.error("Error updating learning language:", error);
      toast.error("Failed to update quiz language");
    }
  };

  const startQuiz = (quiz: Quiz) => {
    if (quiz.questions.length < 20) {
      toast.error("This quiz does not have enough questions (minimum 20 required).");
      return;
    }
    setSelectedQuiz(quiz);
    setCurrentQuestion(0);
    setAnswers({});
    setSkippedQuestions([]);
    setShowResults(false);
    setScore(0);
    setQuizStarted(true);

    if (quiz.time_limit) {
      setTimeLeft(quiz.time_limit * 60);
    }
    speakText(quiz.questions[0].question);
  };

  const handleAnswer = (questionId: number, answer: any) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
    setSkippedQuestions((prev) => prev.filter((id) => id !== questionId));
  };

  const skipQuestion = () => {
    if (selectedQuiz) {
      setSkippedQuestions((prev) => [...prev, selectedQuiz.questions[currentQuestion].id]);
      nextQuestion();
    }
  };

  const nextQuestion = () => {
    if (selectedQuiz && currentQuestion < selectedQuiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      const nextQuestion = selectedQuiz.questions[currentQuestion + 1];
      speakText(nextQuestion.question);
      if (nextQuestion.type === "multiple_choice" && nextQuestion.options) {
        nextQuestion.options.forEach((option, index) => {
          speakText(`${index + 1}. ${option}`);
        });
      }
    } else {
      finishQuiz();
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      const prevQuestion = selectedQuiz!.questions[currentQuestion - 1];
      speakText(prevQuestion.question);
      if (prevQuestion.type === "multiple_choice" && prevQuestion.options) {
        prevQuestion.options.forEach((option, index) => {
          speakText(`${index + 1}. ${option}`);
        });
      }
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = learningLanguage === "multilingual" ? "en-US" : learningLanguage;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    } else {
      toast.error("Text-to-speech is not supported in this browser");
    }
  };

  const finishQuiz = async () => {
    if (!selectedQuiz) return;

    let correctAnswers = 0;
    const totalQuestions = selectedQuiz.questions.length;

    selectedQuiz.questions.forEach((question: Question) => {
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
    setQuizStarted(false);

    if (user) {
      try {
        const { error } = await supabase.from("quiz_attempts").insert({
          user_id: user.id,
          quiz_id: selectedQuiz.id,
          score: finalScore,
          answers: Object.entries(answers).map(([questionId, answer]) => ({
            question_id: Number.parseInt(questionId),
            answer,
          })),
          time_taken: selectedQuiz.time_limit ? selectedQuiz.time_limit * 60 - (timeLeft || 0) : null,
        });

        if (error) throw error;

        if (finalScore >= selectedQuiz.passing_score) {
          toast.success(`Quiz completed! You earned ${selectedQuiz.xp_reward} XP!`);

          if (user.profile) {
            const { error: updateError } = await supabase
              .from("profiles")
              .update({
                xp_points: (user.profile.xp_points || 0) + selectedQuiz.xp_reward,
              })
              .eq("id", user.id);

            if (updateError) console.error("Error updating XP:", updateError);
          }
        }

        await loadQuizData();
      } catch (error) {
        console.error("Error saving quiz attempt:", error);
        toast.error("Failed to save quiz attempt");
      }
    }

    // Speak results
    speakText(`Quiz completed. You scored ${finalScore} percent.`);
    selectedQuiz.questions.forEach((question: Question) => {
      const userAnswer = answers[question.id];
      const wasSkipped = skippedQuestions.includes(question.id);
      let isCorrect = false;

      if (!wasSkipped) {
        if (question.type === "multiple_choice") {
          isCorrect = userAnswer === question.correct_answer;
        } else if (question.type === "text_input") {
          const correctAnswer = question.correct_answer as string;
          const alternatives = question.alternatives || [];
          const allCorrectAnswers = [correctAnswer, ...alternatives].map((a) => a.toLowerCase().trim());
          isCorrect = userAnswer && allCorrectAnswers.includes(userAnswer.toLowerCase().trim());
        }
      }

      const correctAnswerText = question.type === "multiple_choice" 
        ? question.options![question.correct_answer as number]
        : question.correct_answer as string;
      const userAnswerText = wasSkipped ? "Skipped" : (question.type === Imped "multiple_choice" ? question.options![userAnswer] : userAnswer) || "No answer";
      speakText(`Question: ${question.question}. Your answer: ${userAnswerText}. Correct answer: ${correctAnswerText}.`);
    });
  };

  const resetQuiz = () => {
    setSelectedQuiz(null);
    setCurrentQuestion(0);
    setAnswers({});
    setSkippedQuestions([]);
    setShowResults(false);
    setScore(0);
    setTimeLeft(null);
    setQuizStarted(false);
    window.speechSynthesis.cancel();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getDifficultyColor = (difficulty?: string) => {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-slate-600">Loading quizzes...</div>
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
        {!selectedQuiz ? (
          <div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
              <h1 className="text-3xl font-bold text-slate-800 mb-2">Language Quizzes</h1>
              <p className="text-slate-600 mb-4">Test your knowledge and earn XP points</p>
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
            </motion.div>

            <div className="grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2">
                {categories.length === 0 ? (
                  <Card className="border-slate-200 bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-8 text-center">
                      <Trophy className="h-12 w-12 mx-auto mb-3 text-slate-400" />
                      <p className="text-slate-500">No quizzes available for this language</p>
                    </CardContent>
                  </Card>
                ) : (
                  categories.map((category) => (
                    <div key={category.id} className="mb-8">
                      <h2 className="text-xl font-semibold text-slate-800 mb-4">{category.name}</h2>
                      <div className="grid gap-4 md:grid-cols-2">
                        {category.quizzes.map((quiz) => (
                          <Card
                            key={quiz.id}
                            className="border-slate-200 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow"
                          >
                            <CardHeader>
                              <div className="flex items-center justify-between">
                                <CardTitle className="text-slate-800">{quiz.title}</CardTitle>
                                <div className="flex items-center gap-2">
                                  {completedQuizIds.includes(quiz.id) && (
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                  )}
                                  <Badge className={getDifficultyColor(quiz.difficulty)}>
                                    {quiz.difficulty || "beginner"}
                                  </Badge>
                                </div>
                              </div>
                              <CardDescription className="text-slate-600">{quiz.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-3">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-slate-600">Questions:</span>
                                  <span className="font-medium text-slate-800">{quiz.questions.length}</span>
                                </div>
                                {quiz.time_limit && (
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-600">Time Limit:</span>
                                    <span className="font-medium text-slate-800 flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      {quiz.time_limit} min
                                    </span>
                                  </div>
                                )}
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-slate-600">Passing Score:</span>
                                  <span className="font-medium text-slate-800">{quiz.passing_score}%</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-slate-600">XP Reward:</span>
                                  <Badge className="bg-yellow-100 text-yellow-700">
                                    <Star className="h-3 w-3 mr-1" />
                                    {quiz.xp_reward} XP
                                  </Badge>
                                </div>
                              </div>
                              <Button
                                onClick={() => startQuiz(quiz)}
                                className="w-full mt-4"
                                disabled={quiz.questions.length < 20}
                              >
                                <Play className="mr-2 h-4 w-4" />
                                {completedQuizIds.includes(quiz.id) ? "Retake Quiz" : "Start Quiz"}
                              </Button>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div>
                <h2 className="text-xl font-semibold text-slate-800 mb-4">Recent Attempts</h2>
                {user ? (
                  <div className="space-y-3">
                    {recentAttempts.map((attempt) => (
                      <Card key={attempt.id} className="border-slate-200 bg-white/80 backdrop-blur-sm">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-slate-800 text-sm">{(attempt as any).quizzes.title}</h4>
                            <Badge
                              className={
                                attempt.score >= 70 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                              }
                            >
                              {attempt.score}%
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between text-xs text-slate-600">
                            <span>{new Date(attempt.completed_at).toLocaleDateString()}</span>
                            <span className="flex items-center gap-1">
                              <Star className="h-3 w-3" />+{(attempt as any).quizzes.xp_reward} XP
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {recentAttempts.length === 0 && (
                      <Card className="border-slate-200 bg-white/80 backdrop-blur-sm">
                        <CardContent className="p-8 text-center">
                          <Trophy className="h-12 w-12 mx-auto mb-3 text-slate-400" />
                          <p className="text-slate-500">No quiz attempts yet</p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                ) : (
                  <Card className="border-slate-200 bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-6 text-center">
                      <Trophy className="h-8 w-8 mx-auto mb-3 text-slate-400" />
                      <p className="text-slate-600 mb-3">Login to track your progress</p>
                      <Link href="/auth/login">
                        <Button size="sm">Login</Button>
                      </Link>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        ) : showResults ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
            <Card className="border-slate-200 bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4">
                  {score >= selectedQuiz.passing_score ? (
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
                  {score >= selectedQuiz.passing_score ? "Congratulations!" : "Keep Practicing!"}
                </CardTitle>
                <CardDescription className="text-slate-600">
                  You scored {score}% on {selectedQuiz.title}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-slate-800 mb-2">{score}%</div>
                  <Progress value={score} className="w-full" />
                  <p className="text-sm text-slate-600 mt-2">
                    {score >= selectedQuiz.passing_score
                      ? `You passed! Minimum required: ${selectedQuiz.passing_score}%`
                      : `You need ${selectedQuiz.passing_score}% to pass`}
                  </p>
                </div>

                {score >= selectedQuiz.passing_score && (
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <Star className="h-6 w-6 mx-auto mb-2 text-yellow-600" />
                    <p className="text-sm font-medium text-yellow-800">
                      You earned {selectedQuiz.xp_reward} XP points!
                    </p>
                  </div>
                )}

                <div className="space-y-4">
                  <h3 className="font-semibold text-slate-800">Review Your Answers</h3>
                  {selectedQuiz.questions.map((question: Question) => {
                    const userAnswer = answers[question.id];
                    const wasSkipped = skippedQuestions.includes(question.id);
                    let isCorrect = false;

                    if (!wasSkipped) {
                      if (question.type === "multiple_choice") {
                        isCorrect = userAnswer === question.correct_answer;
                      } else if (question.type === "text_input") {
                        const correctAnswer = question.correct_answer as string;
                        const alternatives = question.alternatives || [];
                        const allCorrectAnswers = [correctAnswer, ...alternatives].map((a) => a.toLowerCase().trim());
                        isCorrect = userAnswer && allCorrectAnswers.includes(userAnswer.toLowerCase().trim());
                      }
                    }

                    return (
                      <div key={question.id} className="p-4 border rounded-lg">
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                              wasSkipped ? "bg-gray-100" : isCorrect ? "bg-green-100" : "bg-red-100"
                            }`}
                          >
                            {wasSkipped ? (
                              <SkipForward className="h-4 w-4 text-gray-600" />
                            ) : isCorrect ? (
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
                                onClick={() => speakText(
                                  `Question: ${question.question}. Your answer: ${
                                    wasSkipped ? "Skipped" : 
                                    question.type === "multiple_choice" ? question.options![userAnswer] : userAnswer || "No answer"
                                  }. Correct answer: ${
                                    question.type === "multiple_choice" 
                                      ? question.options![question.correct_answer as number]
                                      : question.correct_answer as string
                                  }.`
                                )}
                                disabled={isSpeaking}
                              >
                                <Volume2 className="h-4 w-4" />
                              </Button>
                            </div>

                            {question.type === "multiple_choice" && question.options && (
                              <div className="space-y-1 mb-2">
                                {question.options.map((option, optionIndex) => (
                                  <div
                                    key={optionIndex}
                                    className={`text-sm p-2 rounded flex items-center ${
                                      optionIndex === question.correct_answer
                                        ? "bg-green-100 text-green-800"
                                        : optionIndex === userAnswer && !wasSkipped
                                        ? "bg-red-100 text-red-800"
                                        : answers[question.id] === optionIndex
                                        ? "bg-blue-100 text-blue-800"
                                        : "text-slate-800 bg-gray-50"
                                    }`}
                                  >
                                    {option}
                                    {optionIndex === question.correct_answer && " ✓"}
                                    {optionIndex === userAnswer && !wasSkipped && optionIndex !== question.correct_answer && " ✗"}
                                  </div>
                                ))}
                              </div>
                            )}

                            {question.type === "text_input" && (
                              <div className="space-y-1 mb-2">
                                <div className="text-sm">
                                  <span className="text-slate-600">Your answer: </span>
                                  <span className={wasSkipped ? "text-gray-700" : isCorrect ? "text-green-700" : "text-red-700"}>
                                    {wasSkipped ? "Skipped" : userAnswer || "No answer"}
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
                  <Button onClick={resetQuiz} variant="outline" className="flex-1">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Quizzes
                  </Button>
                  <Button onClick={() => startQuiz(selectedQuiz)} className="flex-1">
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Retake Quiz
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <Card className="border-slate-200 bg-white/80 backdrop-blur-sm mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-slate-800">{selectedQuiz.title}</CardTitle>
                    <CardDescription className="text-slate-600">
                      Question {currentQuestion + 1} of {selectedQuiz.questions.length}
                    </CardDescription>
                  </div>
                  {timeLeft !== null && (
                    <div className="text-right">
                      <div className="text-2xl font-bold text-slate-800">{formatTime(timeLeft)}</div>
                      <div className="text-sm text-slate-600">Time Remaining</div>
                    </div>
                  )}
                </div>
                <Progress value={((currentQuestion + 1) / selectedQuiz.questions.length) * 100} />
              </CardHeader>
            </Card>

            <Card className="border-slate-200 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-slate-800">{selectedQuiz.questions[currentQuestion].question}</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const question = selectedQuiz.questions[currentQuestion];
                      speakText(question.question);
                      if (question.type === "multiple_choice" && question.options) {
                        question.options.forEach((option, index) => {
                          speakText(`${index + 1}. ${option}`);
                        });
                      }
                    }}
                    disabled={isSpeaking}
                  >
                    <Volume2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {selectedQuiz.questions[currentQuestion].type === "multiple_choice" ? (
                  <RadioGroup
                    value={answers[selectedQuiz.questions[currentQuestion].id]?.toString()}
                    onValueChange={(value) =>
                      handleAnswer(selectedQuiz.questions[currentQuestion].id, Number.parseInt(value))
                    }
                  >
                    {selectedQuiz.questions[currentQuestion].options?.slice(0, 5).map((option, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                        <Label
                          htmlFor={`option-${index}`}
                          className={`flex-1 cursor-pointer p-2 rounded ${
                            answers[selectedQuiz.questions[currentQuestion].id] === index
                              ? "bg-blue-100 text-blue-800"
                              : "text-slate-800 bg-gray-50"
                          }`}
                        >
                          {option}
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
                      value={answers[selectedQuiz.questions[currentQuestion].id] || ""}
                      onChange={(e) => handleAnswer(selectedQuiz.questions[currentQuestion].id, e.target.value)}
                      className="mt-2"
                    />
                  </div>
                )}

                <div className="flex justify-between gap-2">
                  <Button onClick={previousQuestion} disabled={currentQuestion === 0} variant="outline">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Previous
                  </Button>
                  <Button onClick={skipQuestion} variant="outline">
                    <SkipForward className="mr-2 h-4 w-4" />
                    Skip
                  </Button>
                  <Button onClick={nextQuestion}>
                    {currentQuestion === selectedQuiz.questions.length - 1 ? (
                      <>
                        <Trophy className="mr-2 h-4 w-4" />
                        Finish Quiz
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
        )}
      </div>
    </div>
  );
}
