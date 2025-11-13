import { supabase } from '../lib/supabase'
import type { User } from '@supabase/supabase-js'
import { normalizeEmail } from '../lib/utils/email-validation'

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

/**
 * Supabase 에러 코드를 사용자 친화적인 메시지로 변환
 */
function getErrorMessage(error: { code?: string; message?: string }): string {
  if (!error) {
    return '알 수 없는 오류가 발생했습니다.'
  }

  const errorCode = error.code
  const errorMessage = error.message || ''

  switch (errorCode) {
    case 'email_address_invalid':
      // 개발 환경에서는 더 명확한 안내 제공
      if (process.env.NODE_ENV === 'development') {
        return '이메일 형식이 올바르지 않습니다. 개발 환경에서는 실제 이메일 주소(예: Gmail, 네이버)를 사용하거나, Supabase 대시보드에서 이메일 검증 설정을 확인해주세요.'
      }
      return '올바른 이메일 형식을 입력해주세요. 실제 사용 가능한 이메일 주소를 사용해주세요.'
    case 'signup_disabled':
      return '회원가입이 현재 비활성화되어 있습니다.'
    case 'user_already_registered':
      return '이미 등록된 이메일입니다. 로그인해주세요.'
    case 'email_not_confirmed':
      return '이메일 인증이 완료되지 않았습니다. 이메일을 확인해주세요.'
    case 'invalid_credentials':
      return '이메일 또는 비밀번호가 올바르지 않습니다.'
    case 'invalid_password':
      return '비밀번호가 올바르지 않습니다.'
    case 'password_too_short':
      return '비밀번호는 최소 6자 이상이어야 합니다.'
    case 'weak_password':
      return '비밀번호가 너무 약합니다. 더 강한 비밀번호를 사용해주세요.'
    default:
      // Supabase 에러 메시지가 있으면 그대로 사용
      if (errorMessage) {
        return errorMessage
      }
      return '알 수 없는 오류가 발생했습니다.'
  }
}

/**
 * @deprecated 이 클래스는 더 이상 사용되지 않습니다.
 * Server Actions를 사용하세요: app/actions/auth-actions.ts
 *
 * 마이그레이션 가이드:
 * - signUp: app/actions/auth-actions.ts의 signUp 사용
 * - signIn: app/actions/auth-actions.ts의 signIn 사용
 * - signOut: app/actions/auth-actions.ts의 signOut 사용
 * - getCurrentUser: app/actions/auth-actions.ts의 getCurrentUser 사용
 */
export class AuthService {
  /**
   * @deprecated Server Actions의 signUp을 사용하세요.
   * 회원가입
   */
  static async signUp(email: string, password: string): Promise<AuthResponse> {
    try {
      // 이메일 정규화 (소문자 변환 및 공백 제거)
      const normalizedEmail = normalizeEmail(email)

      const { data, error } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
        options: {
          // 이메일 확인을 건너뛰고 즉시 로그인 (개발 환경용)
          // 프로덕션에서는 이 옵션을 제거하고 이메일 확인을 활성화해야 합니다
          emailRedirectTo: typeof window !== 'undefined' ? window.location.origin : undefined,
          // 이메일 확인 비활성화 (Supabase 대시보드에서도 설정해야 함)
          // 개발 환경에서만 사용하고, 프로덕션에서는 제거해야 합니다
        },
      })

      if (error) {
        // Supabase 에러를 사용자 친화적인 메시지로 변환
        const friendlyMessage = getErrorMessage(error)
        throw new Error(friendlyMessage)
      }

      // 이메일 확인이 필요한 경우, user는 있지만 session이 없을 수 있습니다
      // 이 경우에도 성공으로 처리 (이메일 확인 후 로그인 가능)
      if (!data.user) {
        throw new Error('회원가입에 실패했습니다.')
      }

      // 세션이 없으면 이메일 확인이 필요한 상태
      if (!data.session) {
        // 개발 환경에서는 에러를 던지지 않고 사용자 정보만 반환
        // 실제로는 이메일 확인 후 로그인해야 합니다
        throw new Error('이메일 확인이 필요합니다. 이메일을 확인해주세요.')
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
   * @deprecated Server Actions의 signIn을 사용하세요.
   * 로그인
   */
  static async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      // 이메일 정규화 (소문자 변환 및 공백 제거)
      const normalizedEmail = normalizeEmail(email)

      const { data, error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      })

      if (error) {
        // Supabase 에러를 사용자 친화적인 메시지로 변환
        const friendlyMessage = getErrorMessage(error)
        throw new Error(friendlyMessage)
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
   * @deprecated Server Actions의 signOut을 사용하세요.
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
   * @deprecated Server Actions의 getCurrentUser를 사용하세요.
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
