import { createClient } from '@supabase/supabase-js';
import { env } from '$env/dynamic/public';
import type { Database } from './types/database';

// 重新导出类型，供其他文件使用
export type { Database } from './types/database';

// 从环境变量中获取 Supabase 配置，如果不存在则使用默认值
const PUBLIC_SUPABASE_URL = env.PUBLIC_SUPABASE_URL || '';
const PUBLIC_SUPABASE_ANON_KEY = env.PUBLIC_SUPABASE_ANON_KEY || '';

// 检查是否配置了有效的 Supabase 环境变量
const isSupabaseConfigured = PUBLIC_SUPABASE_URL &&
  PUBLIC_SUPABASE_ANON_KEY &&
  PUBLIC_SUPABASE_URL.includes('supabase.co') &&
  PUBLIC_SUPABASE_URL !== 'your-supabase-url' &&
  PUBLIC_SUPABASE_ANON_KEY !== 'your-anon-key';

// 客户端 Supabase 实例（仅在配置有效时创建）
export const supabase = isSupabaseConfigured ? createClient<Database>(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY) : null;

// 导出类型化的 Supabase 客户端（向后兼容）
export const typedSupabase = supabase;

