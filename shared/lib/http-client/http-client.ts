import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios'
import { setupRequestInterceptor, setupResponseInterceptor } from './interceptors'

let httpClientInstance: AxiosInstance | null = null

export function getHttpClient(): AxiosInstance {
  if (httpClientInstance) {
    return httpClientInstance
  }

  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api'

  httpClientInstance = axios.create({
    baseURL,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  // Request Interceptor 설정
  httpClientInstance.interceptors.request.use(setupRequestInterceptor())

  // Response Interceptor 설정
  const responseInterceptor = setupResponseInterceptor(() => {
    // 401 에러 시 로그아웃 처리
    // Zustand 스토어의 logout 액션 호출
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('auth:unauthorized'))
    }
  })

  httpClientInstance.interceptors.response.use(responseInterceptor.onFulfilled, responseInterceptor.onRejected)

  return httpClientInstance
}

export function createHttpClient(config?: AxiosRequestConfig): AxiosInstance {
  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api',
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
    ...config,
  })
}
