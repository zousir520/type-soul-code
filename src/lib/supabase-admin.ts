import { createClient } from '@supabase/supabase-js';
import { env } from '$env/dynamic/private';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import type { Database } from './types/database';

// 重新导出类型，供其他文件使用
export type { Database } from './types/database';

// 从环境变量中获取 Supabase 配置
const SUPABASE_SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY || '';

// 检查是否配置了有效的 Supabase 环境变量
const isSupabaseConfigured = PUBLIC_SUPABASE_URL &&
  PUBLIC_SUPABASE_ANON_KEY &&
  PUBLIC_SUPABASE_URL.includes('supabase.co') &&
  PUBLIC_SUPABASE_URL !== 'your-supabase-url' &&
  PUBLIC_SUPABASE_ANON_KEY !== 'your-anon-key';

// 服务端 Admin 客户端（仅在服务端代码中使用）
export const supabaseAdmin = (isSupabaseConfigured && SUPABASE_SERVICE_ROLE_KEY) ? createClient<Database>(
  PUBLIC_SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
) : null;

// 导出类型化的 Supabase Admin 客户端（向后兼容）
export const typedSupabaseAdmin = supabaseAdmin;