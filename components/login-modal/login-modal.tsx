'use client'

import { useState, useCallback } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { LoginForm } from './login-form'
import { SignupForm } from './signup-form'
import { cn } from '@/shared/lib/utils'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

type TabType = 'login' | 'signup'

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('login')

  const handleSuccess = useCallback(() => {
    onClose()
  }, [onClose])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>계정</DialogTitle>
          <DialogDescription>로그인하거나 새 계정을 만드세요.</DialogDescription>
        </DialogHeader>

        <div className="flex gap-2 border-b">
          <button
            type="button"
            onClick={() => setActiveTab('login')}
            className={cn(
              'flex-1 py-2 px-4 text-sm font-medium transition-colors',
              activeTab === 'login'
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            로그인
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('signup')}
            className={cn(
              'flex-1 py-2 px-4 text-sm font-medium transition-colors',
              activeTab === 'signup'
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            회원가입
          </button>
        </div>

        <div className="mt-4">
          {activeTab === 'login' ? <LoginForm onSuccess={handleSuccess} /> : <SignupForm onSuccess={handleSuccess} />}
        </div>
      </DialogContent>
    </Dialog>
  )
}
