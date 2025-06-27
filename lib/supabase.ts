import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://bozatntnzdoipypqbmkr.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvemF0bnRuemRvaXB5cHFibWtyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzODc4NTcsImV4cCI6MjA2NTk2Mzg1N30.iZBrqcT1Fd5IMiv3UW6vv2RKVDt5FXhWGM0vnSDvozg";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types
export interface Quiz {
  id: string;
  title: string;
  description: string;
  language: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  questions: any[];
  time_limit?: number;
  passing_score: number;
  xp_reward: number;
  is_published: boolean;
  created_at: string;
}

export interface QuizAttempt {
  id: string;
  user_id: string;
  quiz_id: string;
  score: number;
  answers: any[];
  time_taken?: number;
  completed_at: string;
}

export interface Profile {
  id: string;
  full_name?: string;
  avatar_url?: string;
  native_language?: string;
  learning_language?: string;
  xp_points: number;
  streak_count: number;
  last_activity?: string;
  created_at: string;
}

// Utility function to handle errors
export const fetchWithErrorHandling = async (query: any) => {
  try {
    const { data, error } = await query;
    if (error) {
      console.error("Supabase Error:", error.message);
      throw error;
    }
    return data;
  } catch (error) {
    console.error("Fetch Error:", error);
    return null;
  }
};
