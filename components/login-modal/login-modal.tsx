import { Dialog, DialogTitle } from '@radix-ui/react-dialog'
import { DialogContent, DialogDescription, DialogHeader } from '../ui/dialog'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>로그인</DialogTitle>
        </DialogHeader>
        <DialogDescription>로그인하여 서비스를 이용하세요.</DialogDescription>
      </DialogContent>
    </Dialog>
  )
}
