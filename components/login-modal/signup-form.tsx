'use client'

import { useState, useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useSignupMutation } from '@/modules/queries/auth'
import { validateAndNormalizeEmail } from '@/shared/lib/utils/email-validation'

interface SignupFormProps {
  onSuccess?: () => void
}

export function SignupForm({ onSuccess }: SignupFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [emailError, setEmailError] = useState<string | null>(null)

  const signupMutation = useSignupMutation()

  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)
    setEmailError(null)

    // 실시간 이메일 검증 (입력 중일 때는 에러 표시하지 않음)
    if (value && value.length > 0) {
      const validation = validateAndNormalizeEmail(value)
      if (!validation.isValid && validation.error) {
        // 이메일 형식이 명확히 잘못된 경우에만 에러 표시
        if (value.includes('@') && !value.includes('.')) {
          setEmailError(validation.error)
        }
      }
    }
  }, [])

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      setError(null)
      setEmailError(null)

      // 필수 필드 검증
      if (!email || !password || !confirmPassword) {
        setError('모든 필드를 입력해주세요.')
        return
      }

      // 이메일 검증
      const emailValidation = validateAndNormalizeEmail(email)
      if (!emailValidation.isValid) {
        setEmailError(emailValidation.error || '올바른 이메일을 입력해주세요.')
        return
      }

      // 비밀번호 일치 검증
      if (password !== confirmPassword) {
        setError('비밀번호가 일치하지 않습니다.')
        return
      }

      // 비밀번호 길이 검증
      if (password.length < 6) {
        setError('비밀번호는 최소 6자 이상이어야 합니다.')
        return
      }

      try {
        // 정규화된 이메일로 회원가입 시도
        await signupMutation.mutateAsync({ email: emailValidation.normalizedEmail, password })
        onSuccess?.()
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '회원가입에 실패했습니다.'
        setError(errorMessage)
        // 이메일 관련 에러인 경우 이메일 필드에도 표시
        if (errorMessage.includes('이메일') || errorMessage.includes('email')) {
          setEmailError(errorMessage)
        }
      }
    },
    [email, password, confirmPassword, signupMutation, onSuccess]
  )

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="signup-email" className="text-sm font-medium">
          이메일
        </label>
        <Input
          id="signup-email"
          type="email"
          placeholder="이메일을 입력하세요 (예: user@example.com)"
          value={email}
          onChange={handleEmailChange}
          error={!!emailError || !!error}
          disabled={signupMutation.isPending}
          required
        />
        {emailError && <p className="text-sm text-destructive">{emailError}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="signup-password" className="text-sm font-medium">
          비밀번호
        </label>
        <Input
          id="signup-password"
          type="password"
          placeholder="비밀번호를 입력하세요 (최소 6자)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={!!error}
          disabled={signupMutation.isPending}
          required
          minLength={6}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="confirm-password" className="text-sm font-medium">
          비밀번호 확인
        </label>
        <Input
          id="confirm-password"
          type="password"
          placeholder="비밀번호를 다시 입력하세요"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={!!error}
          disabled={signupMutation.isPending}
          required
          minLength={6}
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" disabled={signupMutation.isPending} className="w-full">
        {signupMutation.isPending ? '회원가입 중...' : '회원가입'}
      </Button>
    </form>
  )
}
