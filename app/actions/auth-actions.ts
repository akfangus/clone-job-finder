'use server'

import { createServerClient } from '@/shared/lib/supabase/server'
import { normalizeEmail } from '@/shared/lib/utils/email-validation'
import type { User } from '@supabase/supabase-js'
import type { ActionResultUnion } from '@/shared/lib/types/action-result'

/**
 * 인증 응답 타입
 */
interface AuthResponse {
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
      if (errorMessage) {
        return errorMessage
      }
      return '알 수 없는 오류가 발생했습니다.'
  }
}

/**
 * 회원가입 Server Action
 */
export async function signUp(email: string, password: string): Promise<ActionResultUnion<AuthResponse>> {
  try {
    // 서버 사이드 검증
    if (!email || !password) {
      return {
        success: false,
        error: '이메일과 비밀번호를 입력해주세요.',
      }
    }

    // 이메일 정규화
    const normalizedEmail = normalizeEmail(email)

    // 비밀번호 길이 검증
    if (password.length < 6) {
      return {
        success: false,
        error: '비밀번호는 최소 6자 이상이어야 합니다.',
      }
    }

    // 서버 사이드 Supabase 클라이언트 사용
    const supabase = createServerClient()

    // 회원가입 처리
    const { data, error } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: {
        emailRedirectTo: process.env.NEXT_PUBLIC_SITE_URL
          ? `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
          : undefined,
      },
    })

    if (error) {
      const friendlyMessage = getErrorMessage(error)
      return {
        success: false,
        error: friendlyMessage,
      }
    }

    if (!data.user) {
      return {
        success: false,
        error: '회원가입에 실패했습니다.',
      }
    }

    // 세션이 없으면 이메일 확인이 필요한 상태
    if (!data.session) {
      return {
        success: false,
        error: '이메일 확인이 필요합니다. 이메일을 확인해주세요.',
      }
    }

    return {
      success: true,
      data: {
        user: data.user,
        session: {
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        },
      },
    }
  } catch (error) {
    console.error('SignUp Server Action error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '회원가입 중 오류가 발생했습니다.',
    }
  }
}

/**
 * 로그인 Server Action
 */
export async function signIn(email: string, password: string): Promise<ActionResultUnion<AuthResponse>> {
  try {
    // 서버 사이드 검증
    if (!email || !password) {
      return {
        success: false,
        error: '이메일과 비밀번호를 입력해주세요.',
      }
    }

    // 이메일 정규화
    const normalizedEmail = normalizeEmail(email)

    // 서버 사이드 Supabase 클라이언트 사용
    const supabase = createServerClient()

    // 로그인 처리
    const { data, error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    })

    if (error) {
      const friendlyMessage = getErrorMessage(error)
      return {
        success: false,
        error: friendlyMessage,
      }
    }

    if (!data.user || !data.session) {
      return {
        success: false,
        error: '로그인에 실패했습니다.',
      }
    }

    return {
      success: true,
      data: {
        user: data.user,
        session: {
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        },
      },
    }
  } catch (error) {
    console.error('SignIn Server Action error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '로그인 중 오류가 발생했습니다.',
    }
  }
}

/**
 * 로그아웃 Server Action
 */
export async function signOut(): Promise<ActionResultUnion<void>> {
  try {
    // 서버 사이드 Supabase 클라이언트 사용
    const supabase = createServerClient()

    // 로그아웃 처리
    const { error } = await supabase.auth.signOut()

    if (error) {
      return {
        success: false,
        error: error.message || '로그아웃에 실패했습니다.',
      }
    }

    return {
      success: true,
      data: undefined,
    }
  } catch (error) {
    console.error('SignOut Server Action error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '로그아웃 중 오류가 발생했습니다.',
    }
  }
}

/**
 * 현재 사용자 정보 가져오기 Server Action
 */
export async function getCurrentUser(): Promise<ActionResultUnion<User | null>> {
  try {
    // 서버 사이드 Supabase 클라이언트 사용
    const supabase = createServerClient()

    // 현재 사용자 정보 가져오기
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error) {
      // 에러가 발생해도 null을 반환 (세션이 없을 수 있음)
      return {
        success: true,
        data: null,
      }
    }

    return {
      success: true,
      data: user,
    }
  } catch (error) {
    console.error('GetCurrentUser Server Action error:', error)
    return {
      success: true,
      data: null,
    }
  }
}
