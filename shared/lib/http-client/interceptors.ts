import type { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { supabase } from '../supabase'
import type { ApiError } from './types'

export function setupRequestInterceptor() {
  return (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig> => {
    // Supabase 세션에서 access_token 가져오기
    // 비동기로 세션을 가져와서 헤더에 추가
    const sessionPromise = supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.access_token && config.headers) {
        config.headers.Authorization = `Bearer ${session.access_token}`
      }
      return config
    })

    // 개발 환경에서 요청 로깅
    if (process.env.NODE_ENV === 'development') {
      console.log(`[HTTP Request] ${config.method?.toUpperCase()} ${config.url}`, {
        baseURL: config.baseURL,
        params: config.params,
      })
    }

    // 세션이 있으면 Promise를 반환하고, 없으면 동기적으로 config 반환
    return sessionPromise.catch(() => config)
  }
}

export function setupResponseInterceptor(onUnauthorized?: () => void): {
  onFulfilled: (response: AxiosResponse) => AxiosResponse
  onRejected: (error: AxiosError<ApiError>) => Promise<never>
} {
  return {
    onFulfilled: (response: AxiosResponse) => {
      // 개발 환경에서 응답 로깅
      if (process.env.NODE_ENV === 'development') {
        console.log('[HTTP Response]', response)
      }
      return response
    },
    onRejected: async (error: AxiosError<ApiError>) => {
      // 개발 환경에서 에러 로깅
      if (process.env.NODE_ENV === 'development') {
        console.error('[HTTP Error]', error)
      }

      // 401 에러 처리 (인증 만료)
      if (error.response?.status === 401) {
        // Supabase 세션 제거
        await supabase.auth.signOut()
        // 콜백 실행 (로그아웃 처리)
        onUnauthorized?.()
      }

      // 에러 메시지 변환
      const apiError: ApiError = {
        message: error.response?.data?.message || error.message || '알 수 없는 오류가 발생했습니다.',
        statusCode: error.response?.status,
        errors: error.response?.data?.errors,
      }

      return Promise.reject(apiError)
    },
  }
}
