import { supabase } from "./supabase"
import type { User } from "@supabase/supabase-js"

export interface UserProfile {
  id: string
  full_name?: string
  email?: string
  avatar_url?: string
  native_language?: string
  learning_language?: string
  xp_points: number
  streak_count: number
  last_activity?: string
  role: "user" | "admin"
  created_at: string
}

export interface AuthUser extends User {
  profile?: UserProfile
}

class AuthService {
  async signUp(email: string, password: string, fullName?: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })

    if (error) throw error

    // Create profile
    if (data.user) {
      const { error: profileError } = await supabase.from("profiles").insert({
        id: data.user.id,
        full_name: fullName,
        email: email,
        xp_points: 0,
        streak_count: 0,
        role: "user",
      })

      if (profileError) {
        console.error("Profile creation error:", profileError)
      }
    }

    return data
  }

 async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error

    let profile = null
    if (data.user) {
      profile = await this.getUserProfile(data.user.id)
    }

    // Just return user and profile, no redirect
    return { user: data.user, profile }
  }

  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    window.location.href = "/"
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return null

    const profile = await this.getUserProfile(user.id)

    return {
      ...user,
      profile,
    }
  }

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

    if (error) {
      console.error("Error fetching profile:", error)
      return null
    }

    return data
  }

  async updateProfile(userId: string, updates: Partial<UserProfile>) {
    const { data, error } = await supabase.from("profiles").update(updates).eq("id", userId).select().single()

    if (error) throw error
    return data
  }

  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })

    if (error) throw error
  }

  async updatePassword(newPassword: string) {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (error) throw error
  }
}

export const authService = new AuthService()
