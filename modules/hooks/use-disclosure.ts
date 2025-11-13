import { useCallback, useState } from 'react'

/**
 * 모달, 드롭다운 등 열림/닫힘 상태를 관리하는 커스텀 훅
 *
 * @description
 * - 제어/비제어 컴포넌트 패턴 모두 지원
 * - 토글 기능 포함
 * - 외부 콜백 함수 지원
 *
 * @param props - 설정 옵션
 * @returns 상태 및 제어 함수들
 *
 * @example
 * ```tsx
 * // 기본 사용법
 * const { isOpen, onOpen, onClose, onToggle } = useDisclosure();
 *
 * // 초기값 설정
 * const modal = useDisclosure({ defaultIsOpen: true });
 *
 * // 외부 제어
 * const [open, setOpen] = useState(false);
 * const disclosure = useDisclosure({
 *   isOpen: open,
 *   onOpen: () => setOpen(true),
 *   onClose: () => setOpen(false)
 * });
 * ```
 */

export interface UseDisclosureProps {
  /** 초기 열림 상태 */
  defaultIsOpen?: boolean
  /** 외부에서 제어되는 열림 상태 */
  isOpen?: boolean
  /** 닫힐 때 호출되는 콜백 */
  onClose?: () => void
  /** 열릴 때 호출되는 콜백 */
  onOpen?: () => void
  /** 상태 변경 시 호출되는 콜백 (선택적) */
  onChange?: (isOpen: boolean) => void
}

export interface UseDisclosureReturn {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
  onToggle: () => void
}

export function useDisclosure(props: UseDisclosureProps = {}): UseDisclosureReturn {
  const {
    defaultIsOpen = false,
    isOpen: controlledIsOpen,
    onClose: onCloseProp,
    onOpen: onOpenProp,
    onChange: onChangeProp,
  } = props

  const [internalIsOpen, setInternalIsOpen] = useState(defaultIsOpen)

  // 외부에서 제어되는 경우 해당 값을 사용, 아니면 내부 상태 사용
  const isControlled = controlledIsOpen !== undefined
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen

  const onOpen = useCallback(() => {
    if (!isControlled) {
      setInternalIsOpen(true)
    }
    onOpenProp?.()
    onChangeProp?.(true)
  }, [isControlled, onChangeProp, onOpenProp])

  const onClose = useCallback(() => {
    if (!isControlled) {
      setInternalIsOpen(false)
    }
    onCloseProp?.()
    onChangeProp?.(false)
  }, [isControlled, onChangeProp, onCloseProp])

  const onToggle = useCallback(() => {
    if (isOpen) {
      onClose()
    } else {
      onOpen()
    }
  }, [isOpen, onClose, onOpen])

  return {
    isOpen,
    onOpen,
    onClose,
    onToggle,
  }
}
