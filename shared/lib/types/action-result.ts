/**
 * Server Actions 결과 타입
 * 성공/실패 상태를 명확히 구분할 수 있도록 하는 타입
 */
export interface ActionResult<T> {
  success: true
  data: T
  error?: never
}

export interface ActionError {
  success: false
  data?: never
  error: string
}

export type ActionResultUnion<T> = ActionResult<T> | ActionError

/**
 * Server Action 결과를 확인하고 데이터를 반환하는 헬퍼 함수
 * @param result Server Action 결과
 * @returns 성공 시 데이터, 실패 시 Error throw
 */
export function unwrapActionResult<T>(result: ActionResultUnion<T>): T {
  if (!result.success) {
    throw new Error(result.error)
  }
  return result.data
}
