import { createClient } from '@supabase/supabase-js';
import { env } from '$env/dynamic/public';
import { env as privateEnv } from '$env/dynamic/private';
import type { Database } from './types/database';

// 从环境变量中获取 Supabase 配置，如果不存在则使用默认值
const PUBLIC_SUPABASE_URL = env.PUBLIC_SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = privateEnv.SUPABASE_SERVICE_ROLE_KEY || '';

// 检查是否配置了有效的 Supabase 环境变量
const isSupabaseConfigured = PUBLIC_SUPABASE_URL &&
  SUPABASE_SERVICE_ROLE_KEY &&
  PUBLIC_SUPABASE_URL.includes('supabase.co') &&
  PUBLIC_SUPABASE_URL !== 'your-supabase-url' &&
  SUPABASE_SERVICE_ROLE_KEY !== 'your-service-role-key';

// 服务器端 Supabase 实例（使用 service_role 密钥，可绕过 RLS）
export const supabaseAdmin = isSupabaseConfigured ?
  createClient<Database>(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }) : null;