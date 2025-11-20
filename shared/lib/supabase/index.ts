export { supabase } from './client'
export { createServerClient, createServerAdminClient, createServerComponentClient } from './server'

// 서버 사이드 클라이언트는 서버 사이드에서만 사용 가능
// 클라이언트 컴포넌트에서는 사용할 수 없습니다
