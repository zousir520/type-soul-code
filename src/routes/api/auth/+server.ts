import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';

// 安全地获取环境变量，使用 process.env 作为后备
const GITHUB_CLIENT_ID = env.GITHUB_CLIENT_ID || process.env.GITHUB_CLIENT_ID || '';
// 使用环境变量中的回调 URI，如果没有则使用默认值
const GITHUB_REDIRECT_URI = env.GITHUB_REDIRECT_URI || process.env.GITHUB_REDIRECT_URI ||
    (process.env.NODE_ENV === 'development'
        ? 'http://localhost:5174/api/auth/callback/github'
        : 'https://tenniszero.org/api/auth/callback/github');

export const GET: RequestHandler = async ({ url, cookies }) => {
    try {
        // 获取 provider 参数
        const provider = url.searchParams.get('provider');
        
        // 检查是否支持的 provider
        if (!provider) {
            return json(
                { error: 'Provider parameter is required' },
                { status: 400 }
            );
        }
        
        if (provider !== 'github') {
            return json(
                { error: `Unsupported provider: ${provider}` },
                { status: 400 }
            );
        }

        // 生成随机 state 用于防止 CSRF 攻击
        const state = crypto.randomUUID();
        
        // 将 state 存储在 cookie 中
        cookies.set('oauth_state', state, {
            path: '/',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // 只在生产环境要求 HTTPS
            sameSite: 'none', // 允许跨站点请求（GitHub OAuth 需要）
            maxAge: 60 * 20 // 20 分钟过期，给用户更多时间
        });

        console.log('🍪 设置 OAuth state cookie:', {
            state: state.substring(0, 8) + '...',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 20
        });

        // 构建 GitHub OAuth 授权 URL
        const githubAuthUrl = new URL('https://github.com/login/oauth/authorize');
        githubAuthUrl.searchParams.set('client_id', GITHUB_CLIENT_ID);
        githubAuthUrl.searchParams.set('redirect_uri', GITHUB_REDIRECT_URI);
        githubAuthUrl.searchParams.set('scope', 'repo,user');
        githubAuthUrl.searchParams.set('state', state);

        // 如果是 JSON 请求（来自 CMS），返回 JSON
        const acceptHeader = url.searchParams.get('format') || 'redirect';
        if (acceptHeader === 'json') {
            return json({
                url: githubAuthUrl.toString()
            });
        }
        
        // 默认直接重定向到 GitHub（适合浏览器访问）
        return new Response(null, {
            status: 302,
            headers: {
                Location: githubAuthUrl.toString()
            }
        });

    } catch (error) {
        console.error('GitHub OAuth 初始化错误:', error);
        return json(
            { error: '认证服务初始化失败' },
            { status: 500 }
        );
    }
};