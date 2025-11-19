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
 * 서버 사이드 Supabase 클라이언트 생성 (Anon Key 사용)
 * - API Routes, Server Components, Server Actions에서 사용
 * - 쿠키 기반 세션을 사용하여 인증
 *
 * 주의: 이 함수는 서버 사이드에서만 사용해야 합니다.
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
      // set/remove는 Server Actions나 Route Handlers에서만 사용 가능
      // 타입 차이로 인한 경고를 피하기 위해 any 캐스팅 사용
      set(name: string, value: string, options?: any) {
        ;(cookieStore as any).set?.(name, value, options)
      },
      remove(name: string, options?: any) {
        ;(cookieStore as any).set?.(name, '', {
          ...(options || {}),
          maxAge: 0,
        })
      },
    },
  })
}
