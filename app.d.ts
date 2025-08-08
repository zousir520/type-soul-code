// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { SupabaseClient, Session as SupabaseSession, User as SupabaseUser } from '@supabase/supabase-js';
import type { Database } from '$lib/supabase';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			// Supabase (保持兼容性)
			supabase: SupabaseClient<Database, 'public', any>;
			safeGetSession(): Promise<{ session: SupabaseSession | null; user: SupabaseUser | null }>;
			
			// Session 数据 (兼容现有代码)
			session: SupabaseSession | null;
			
			// 用户数据 (扩展类型以包含所需属性)
			user: {
				id: string;
				username: string;
				role: string;
				email?: string;
			} | null;
			isAuthenticated: boolean;
		}
		interface PageData {
			// Session 数据
			session?: SupabaseSession | null;
			
			// 简单认证用户数据
			user?: {
				name: string;
				email: string;
				avatar: string;
				role: string;
			} | null;
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
