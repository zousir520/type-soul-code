import { createClient } from '@supabase/supabase-js';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import type { Database } from '$lib/supabase'; // 导入 Database 类型

// 检查是否配置了有效的 Supabase 环境变量
const isSupabaseConfigured = PUBLIC_SUPABASE_URL &&
  SUPABASE_SERVICE_ROLE_KEY &&
  PUBLIC_SUPABASE_URL.includes('supabase.co') &&
  PUBLIC_SUPABASE_URL !== 'your-supabase-url' &&
  SUPABASE_SERVICE_ROLE_KEY !== 'your-service-key';

// 服务端 Supabase 实例（仅在配置有效时创建）
export const supabaseAdmin = isSupabaseConfigured ? createClient<Database>(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY) : null;