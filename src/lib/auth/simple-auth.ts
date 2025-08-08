import { dev } from '$app/environment';
import { redirect, type Handle } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

// 从环境变量获取配置
const ADMIN_PASSWORD = env.ADMIN_PASSWORD || '';
const ADMIN_USERNAME = env.ADMIN_USERNAME || 'admin';

// 简单的会话存储（生产环境应该使用数据库）
const activeSessions = new Map<string, { username: string; role: string; expires: number }>();

// 检查是否启用了简单认证
export const isSimpleAuthEnabled = () => {
  return ADMIN_PASSWORD && ADMIN_PASSWORD.length >= 6;
};

// 简单的哈希函数
function simpleHash(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString();
}

// 验证管理员凭据
export async function verifyAdminCredentials(username: string, password: string): Promise<boolean> {
  if (!isSimpleAuthEnabled()) {
    return false;
  }

  // 检查用户名
  if (username !== ADMIN_USERNAME) {
    return false;
  }

  // 简单的密码验证
  return password === ADMIN_PASSWORD;
}

// 生成简单的会话令牌
export function generateAuthToken(username: string): string {
  const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
  const expires = Date.now() + (24 * 60 * 60 * 1000); // 24小时后过期

  activeSessions.set(token, {
    username,
    role: 'admin',
    expires
  });

  return token;
}

// 验证会话令牌
export function verifyAuthToken(token: string): { id: string; username: string; role: string; email?: string } | null {
  const session = activeSessions.get(token);

  if (!session) {
    return null;
  }

  // 检查是否过期
  if (Date.now() > session.expires) {
    activeSessions.delete(token);
    return null;
  }

  return {
    id: `admin-${session.username}`, // 生成一个简单的ID
    username: session.username,
    role: session.role,
    email: `${session.username}@admin.local` // 可选的邮箱字段
  };
}

// 清理过期的会话
function cleanupExpiredSessions() {
  const now = Date.now();
  for (const [token, session] of activeSessions.entries()) {
    if (now > session.expires) {
      activeSessions.delete(token);
    }
  }
}

// 定期清理过期会话
setInterval(cleanupExpiredSessions, 60 * 60 * 1000); // 每小时清理一次

// 认证中间件
export const simpleAuthHandle: Handle = async ({ event, resolve }) => {
  // 如果未启用简单认证，跳过
  if (!isSimpleAuthEnabled()) {
    return resolve(event);
  }

  // 从 cookie 获取 token
  const token = event.cookies.get('admin_token');
  
  // 验证 token
  const user = token ? verifyAuthToken(token) : null;
  
  // 将用户信息添加到 locals
  event.locals.user = user;
  event.locals.isAuthenticated = !!user;

  // 保护 /vibbyai 路由
  if (event.url.pathname.startsWith('/vibbyai')) {
    // 登录页面和 API 端点不需要认证
    const publicPaths = ['/vibbyai/login', '/vibbyai/api/login', '/vibbyai/api/logout'];
    const isPublicPath = publicPaths.some(path => event.url.pathname.startsWith(path));

    if (!isPublicPath && !user) {
      // 如果是 API 请求，返回 401
      if (event.url.pathname.startsWith('/vibbyai/api/')) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // 重定向到登录页面
      throw redirect(303, `/vibbyai/login?redirect=${encodeURIComponent(event.url.pathname)}`);
    }
  }

  // 保护 /admin 路由 - CMS 有自己的 GitHub 认证
  if (event.url.pathname.startsWith('/admin')) {
    // Sveltia CMS 自己处理 GitHub OAuth 认证，不需要额外的认证层
    return resolve(event);
  }

  return resolve(event);
};

// 登录函数
export async function login(username: string, password: string): Promise<{ success: boolean; token?: string; error?: string }> {
  if (!isSimpleAuthEnabled()) {
    return { success: false, error: '认证未启用' };
  }

  const isValid = await verifyAdminCredentials(username, password);
  
  if (!isValid) {
    return { success: false, error: '用户名或密码错误' };
  }

  const token = generateAuthToken(username);
  return { success: true, token };
}

// 登出函数
export function logout(token: string): void {
  activeSessions.delete(token);
}

// 哈希密码函数
export async function hashPassword(password: string): Promise<string> {
  // 在生产环境中，应该使用更安全的哈希算法如 bcrypt
  // 这里使用简单的哈希作为示例
  const salt = 'vibby-ai-salt'; // 在生产环境中应该使用随机盐
  const combined = password + salt;

  // 使用 Web Crypto API 进行哈希
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(combined);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // 回退到简单哈希
  return simpleHash(combined);
}

// 检查密码强度
export function validatePasswordStrength(password: string): { valid: boolean; message?: string } {
  if (password.length < 6) {
    return { valid: false, message: '密码至少需要6个字符' };
  }

  if (password.length > 128) {
    return { valid: false, message: '密码不能超过128个字符' };
  }

  // 检查是否包含至少一个字母和一个数字
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /\d/.test(password);

  if (!hasLetter || !hasNumber) {
    return { valid: false, message: '密码必须包含至少一个字母和一个数字' };
  }

  return { valid: true };
}
