import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { createServerClient as createSupabaseServerClient } from '@supabase/ssr'

/**
 * 서버 사이드 Supabase Admin 클라이언트 생성
 * - API Routes에서 사용
 * - 서비스 키 사용 (관리자 권한)
 * - 클라이언트에 노출 금지
 *
 * 주의: 이 함수는 서버 사이드에서만 사용해야 합니다.
 * 클라이언트 컴포넌트에서는 사용할 수 없습니다.
 */
export function createServerAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
  }

  if (!supabaseServiceKey) {
    // 서비스 키가 없으면 Anon Key를 사용 (개발 환경)
    // 프로덕션에서는 반드시 서비스 키를 설정해야 합니다
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!supabaseAnonKey) {
      throw new Error('Missing Supabase environment variables')
    }

    console.warn('⚠️  서비스 키가 설정되지 않았습니다. Anon Key를 사용합니다. (개발 환경용)')

    return createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

/**
 * 서버 컴포넌트 / RSC 전용 Supabase 클라이언트
 * - 쿠키 읽기만 수행 (set/remove NO-OP)
 * - Next 규칙상 RSC에서는 쿠키를 수정할 수 없음
 * - Next 15 이후 cookies()는 async 이므로 반드시 await 해야 함
 */
export async function createServerComponentClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
  }

  const cookieStore = await cookies()

  return createSupabaseServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string): string | undefined {
        return cookieStore.get(name)?.value
      },
      set() {
        // NO-OP: RSC에서는 쿠키 수정 불가
      },
      remove() {
        // NO-OP: RSC에서는 쿠키 수정 불가
      },
    },
  })
}

/**
 * Server Action / Route Handler 전용 Supabase 클라이언트
 * - 쿠키 읽기/쓰기 모두 허용
 * - 인증 토큰/세션 쿠키를 이 레이어에서만 수정
 */
export async function createServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
  }

  const cookieStore = await cookies()

  return createSupabaseServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string): string | undefined {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options?: any) {
        ;(cookieStore as any).set(name, value, options)
      },
      remove(name: string, options?: any) {
        ;(cookieStore as any).set(name, '', {
          ...(options || {}),
          maxAge: 0,
        })
      },
    },
  })
}
