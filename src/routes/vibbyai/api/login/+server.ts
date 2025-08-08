import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { login, isSimpleAuthEnabled } from '$lib/auth/simple-auth';
import { dev } from '$app/environment';

export const POST: RequestHandler = async ({ request, cookies }) => {
  try {
    // 检查是否启用了简单认证
    if (!isSimpleAuthEnabled()) {
      return json({ 
        success: false, 
        error: '认证系统未配置。请设置 ADMIN_PASSWORD 环境变量。' 
      }, { status: 400 });
    }

    const { username, password } = await request.json();

    // 基本验证
    if (!username || !password) {
      return json({ 
        success: false, 
        error: '用户名和密码不能为空' 
      }, { status: 400 });
    }

    // 尝试登录
    const result = await login(username, password);

    if (result.success && result.token) {
      // 设置安全的 HTTP-only cookie
      cookies.set('admin_token', result.token, {
        httpOnly: true,
        secure: !dev, // 生产环境使用 HTTPS
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, // 24小时
        path: '/vibbyai'
      });

      return json({ success: true });
    } else {
      // 登录失败，添加延迟防止暴力破解
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return json({ 
        success: false, 
        error: result.error || '登录失败' 
      }, { status: 401 });
    }
  } catch (error) {
    console.error('Login error:', error);
    return json({ 
      success: false, 
      error: '服务器错误' 
    }, { status: 500 });
  }
};
