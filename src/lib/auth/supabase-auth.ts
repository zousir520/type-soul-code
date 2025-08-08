import { createServerClient } from '@supabase/ssr';
import { type Handle, redirect } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import type { Database } from '$lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

// 将 Supabase 用户转换为我们的自定义用户类型
function convertSupabaseUserToAppUser(user: SupabaseUser): {
  id: string;
  username: string;
  role: string;
  email?: string;
} {
  return {
    id: user.id,
    username: user.user_metadata?.username || user.email?.split('@')[0] || 'user',
    role: user.user_metadata?.role || 'user',
    email: user.email,
  };
}

export const supabaseHandle: Handle = async ({ event, resolve }) => {
  // 检查环境变量是否配置
  if (!PUBLIC_SUPABASE_URL || !PUBLIC_SUPABASE_ANON_KEY ||
      PUBLIC_SUPABASE_URL === 'your-supabase-url' ||
      PUBLIC_SUPABASE_ANON_KEY === 'your-supabase-anon-key') {
    // 如果 Supabase 未配置，跳过认证处理
    return resolve(event);
  }

  /**
   * Creates a Supabase client specific to this server request.
   *
   * The Supabase client gets the Auth token from the request cookies.
   */
  event.locals.supabase = createServerClient<Database>(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      get: (key) => event.cookies.get(key),
      /**
       * SvelteKit's cookies.set defaults to httpOnly: true, secure: true, and sameSite: 'lax'.
       * If you need to customize any of these options, you can do so here.
       */
      set: (key, value, options) => {
        event.cookies.set(key, value, { ...options, path: '/' });
      },
      remove: (key, options) => {
        event.cookies.delete(key, { ...options, path: '/' });
      },
    },
  });

  /**
   * Unlike `supabase.auth.getSession()`, which returns the session _without_
   * validating the JWT, this function also calls `getUser()` to validate the
   * JWT before returning the session.
   */
  event.locals.safeGetSession = async () => {
    const {
      data: { session },
    } = await event.locals.supabase.auth.getSession();
    if (!session) {
      return { session: null, user: null };
    }

    const {
      data: { user },
      error,
    } = await event.locals.supabase.auth.getUser();
    if (error) {
      // JWT validation has failed
      return { session: null, user: null };
    }

    return { session, user };
  };

  return resolve(event, {
    filterSerializedResponseHeaders(name) {
      /**
       * Supabase libraries use the `content-range` and `x-supabase-api-version`
       * headers, so we need to tell SvelteKit to pass it through.
       */
      return name === 'content-range' || name === 'x-supabase-api-version';
    },
  });
};

// 认证保护中间件
export const authGuard: Handle = async ({ event, resolve }) => {
  const { session, user } = await event.locals.safeGetSession();
  event.locals.session = session;
  event.locals.user = user ? convertSupabaseUserToAppUser(user) : null;

  // 保护管理后台路由
  if (event.url.pathname.startsWith('/vibbyai')) {
    if (!session) {
      throw redirect(303, '/auth/signin?callbackUrl=' + encodeURIComponent(event.url.pathname));
    }
  }

  return resolve(event);
};

// 组合所有处理器
export const handle = sequence(supabaseHandle, authGuard);
