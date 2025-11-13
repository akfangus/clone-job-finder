'use client'

import { useState, useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useSignupMutation } from '@/modules/queries/auth'

interface SignupFormProps {
  onSuccess?: () => void
}

export function SignupForm({ onSuccess }: SignupFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const signupMutation = useSignupMutation()

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      setError(null)

      if (!email || !password || !confirmPassword) {
        setError('모든 필드를 입력해주세요.')
        return
      }

      if (password !== confirmPassword) {
        setError('비밀번호가 일치하지 않습니다.')
        return
      }

      if (password.length < 6) {
        setError('비밀번호는 최소 6자 이상이어야 합니다.')
        return
      }

      try {
        await signupMutation.mutateAsync({ email, password })
        onSuccess?.()
      } catch (err) {
        setError(err instanceof Error ? err.message : '회원가입에 실패했습니다.')
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
          placeholder="이메일을 입력하세요"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={!!error}
          disabled={signupMutation.isPending}
          required
        />
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
