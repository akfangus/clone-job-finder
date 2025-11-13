import { supabase } from '../lib/supabase'
import type { User } from '@supabase/supabase-js'

export interface SignUpRequest {
  email: string
  password: string
}

export interface SignInRequest {
  email: string
  password: string
}

export interface AuthResponse {
  user: User
  session: {
    access_token: string
    refresh_token: string
  }
}

export class AuthService {
  /**
   * 회원가입
   */
  static async signUp(email: string, password: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        throw new Error(error.message)
      }

      if (!data.user || !data.session) {
        throw new Error('회원가입에 실패했습니다.')
      }

      return {
        user: data.user,
        session: {
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        },
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('회원가입 중 오류가 발생했습니다.')
    }
  }

  /**
   * 로그인
   */
  static async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw new Error(error.message)
      }

      if (!data.user || !data.session) {
        throw new Error('로그인에 실패했습니다.')
      }

      return {
        user: data.user,
        session: {
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        },
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('로그인 중 오류가 발생했습니다.')
    }
  }

  /**
   * 로그아웃
   */
  static async signOut(): Promise<void> {
    try {
      const { error } = await supabase.auth.signOut()

      if (error) {
        throw new Error(error.message)
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('로그아웃 중 오류가 발생했습니다.')
    }
  }

  /**
   * 현재 사용자 정보 가져오기
   */
  static async getCurrentUser(): Promise<User | null> {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()

      if (error) {
        throw new Error(error.message)
      }

      return user
    } catch {
      // 세션이 없거나 만료된 경우 null 반환
      return null
    }
  }

  /**
   * 현재 세션 가져오기
   */
  static async getSession(): Promise<{ access_token: string; refresh_token: string } | null> {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession()

      if (error) {
        throw new Error(error.message)
      }

      if (!session) {
        return null
      }

      return {
        access_token: session.access_token,
        refresh_token: session.refresh_token,
      }
    } catch {
      return null
    }
  }
}
