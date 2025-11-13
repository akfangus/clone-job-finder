/**
 * 이메일 검증 유틸리티
 */

/**
 * 이메일 형식 검증 (RFC 5322 기본 검증)
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') {
    return false
  }

  // 기본 이메일 형식 검증
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return false
  }

  // 도메인 부분에 최소 하나의 점이 있어야 함
  const parts = email.split('@')
  if (parts.length !== 2) {
    return false
  }

  const [localPart, domain] = parts

  // 로컬 부분 검증
  if (localPart.length === 0 || localPart.length > 64) {
    return false
  }

  // 도메인 부분 검증
  if (domain.length === 0 || domain.length > 255) {
    return false
  }

  // 도메인에 점이 있어야 함
  if (!domain.includes('.')) {
    return false
  }

  // 도메인의 마지막 부분(TLD)이 최소 2자 이상이어야 함
  const domainParts = domain.split('.')
  const tld = domainParts[domainParts.length - 1]
  if (tld.length < 2) {
    return false
  }

  return true
}

/**
 * 이메일 정규화 (소문자 변환 및 공백 제거)
 */
export function normalizeEmail(email: string): string {
  if (!email || typeof email !== 'string') {
    return ''
  }

  return email.toLowerCase().trim()
}

/**
 * 이메일 검증 및 정규화
 */
export function validateAndNormalizeEmail(email: string): {
  isValid: boolean
  normalizedEmail: string
  error?: string
} {
  const normalizedEmail = normalizeEmail(email)

  if (!normalizedEmail) {
    return {
      isValid: false,
      normalizedEmail: '',
      error: '이메일을 입력해주세요.',
    }
  }

  if (!isValidEmail(normalizedEmail)) {
    return {
      isValid: false,
      normalizedEmail: normalizedEmail,
      error: '올바른 이메일 형식을 입력해주세요. (예: user@example.com)',
    }
  }

  return {
    isValid: true,
    normalizedEmail: normalizedEmail,
  }
}
