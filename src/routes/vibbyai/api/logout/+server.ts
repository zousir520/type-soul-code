import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { logout } from '$lib/auth/simple-auth';

export const POST: RequestHandler = async ({ cookies }) => {
  try {
    // 获取当前的会话令牌
    const token = cookies.get('admin_token');

    if (token) {
      // 从会话存储中删除令牌
      logout(token);
    }

    // 清除认证 cookie
    cookies.delete('admin_token', {
      path: '/vibbyai'
    });

    return json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    return json({
      success: false,
      error: '登出失败'
    }, { status: 500 });
  }
};
