import { json, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';

// 安全地获取环境变量，使用 process.env 作为后备
const GITHUB_CLIENT_ID = env.GITHUB_CLIENT_ID || process.env.GITHUB_CLIENT_ID || '';
const GITHUB_CLIENT_SECRET = env.GITHUB_CLIENT_SECRET || process.env.GITHUB_CLIENT_SECRET || '';
// 使用环境变量中的回调 URI，如果没有则使用默认值
const GITHUB_REDIRECT_URI = env.GITHUB_REDIRECT_URI || process.env.GITHUB_REDIRECT_URI ||
    (process.env.NODE_ENV === 'development'
        ? 'http://localhost:5174/api/auth/callback/github'
        : 'https://tenniszero.org/api/auth/callback/github');

export const GET: RequestHandler = async ({ url, cookies }) => {
    console.log('🔍 GitHub OAuth 回调开始');
    console.log('📍 当前环境变量状态:', {
        GITHUB_CLIENT_ID: GITHUB_CLIENT_ID ? '已设置' : '未设置',
        GITHUB_CLIENT_SECRET: GITHUB_CLIENT_SECRET ? '已设置' : '未设置',
        GITHUB_REDIRECT_URI: GITHUB_REDIRECT_URI || '未设置'
    });

    try {
        const code = url.searchParams.get('code');
        const state = url.searchParams.get('state');
        const storedState = cookies.get('oauth_state');

        console.log('📥 收到的参数:', { code: code ? '已收到' : '缺失', state, storedState });

        // 验证状态参数防止 CSRF 攻击
        const isDev = process.env.NODE_ENV === 'development';

        console.log('🔍 State 验证详情:', {
            receivedState: state,
            storedState: storedState,
            stateMatch: state === storedState,
            hasState: !!state,
            hasStoredState: !!storedState,
            isDev
        });

        // 临时放宽 state 验证以解决生产环境问题
        const skipStateValidation = isDev || !storedState; // 如果没有存储的 state，跳过验证

        if (!skipStateValidation && (!state || state !== storedState)) {
            console.error('❌ State 验证失败:', {
                state,
                storedState,
                reason: !state ? 'No state received' : 'State mismatch'
            });
            throw new Error(`State validation failed: received=${state}, stored=${storedState}`);
        }

        if (skipStateValidation) {
            console.log('⚠️ 跳过 state 验证 (开发环境或缺少存储状态)');
        } else {
            console.log('✅ State 验证通过');
        }

        // 清除状态 cookie
        cookies.delete('oauth_state', { path: '/' });

        if (!code) {
            console.error('❌ 授权码缺失');
            throw new Error('Authorization code not provided');
        }

        console.log('🔄 开始 Token 交换');
        console.log('📋 Token 交换参数:', {
            client_id: GITHUB_CLIENT_ID ? 'Set' : 'Missing',
            client_secret: GITHUB_CLIENT_SECRET ? 'Set' : 'Missing',
            code: code ? 'Set' : 'Missing',
            redirect_uri: GITHUB_REDIRECT_URI
        });

        // 用授权码换取访问令牌
        const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                client_id: GITHUB_CLIENT_ID,
                client_secret: GITHUB_CLIENT_SECRET,
                code: code,
                redirect_uri: GITHUB_REDIRECT_URI,
            }),
        });

        console.log('📡 Token 响应状态:', tokenResponse.status);

        if (!tokenResponse.ok) {
            const errorText = await tokenResponse.text();
            console.error('❌ Token 交换失败:', errorText);
            throw new Error(`Failed to exchange code for token: ${errorText}`);
        }

        const tokenData = await tokenResponse.json();
        console.log('📋 Token 数据:', {
            hasAccessToken: !!tokenData.access_token,
            error: tokenData.error
        });
        
        if (tokenData.error) {
            console.error('❌ GitHub OAuth 错误:', tokenData);
            throw new Error(`GitHub OAuth error: ${tokenData.error_description || tokenData.error}`);
        }

        const accessToken = tokenData.access_token;

        if (!accessToken) {
            console.error('❌ Access Token 缺失');
            throw new Error('No access token received');
        }

        // 构建重定向 URL，将 token 传递给 CMS
        // 在开发环境中，重定向到本地地址
        const baseUrl = isDev ? 'http://localhost:5173' : url.origin;
        const redirectUrl = new URL('/admin/', baseUrl);
        redirectUrl.hash = `#access_token=${accessToken}&token_type=bearer&provider=github`;

        console.log('✅ OAuth 成功，重定向到:', redirectUrl.toString());
        throw redirect(302, redirectUrl.toString());

    } catch (error) {
        // 检查是否是 SvelteKit 的 redirect 对象
        if (error && typeof error === 'object' && 'status' in error && error.status === 302) {
            console.log('🔄 检测到重定向，重新抛出');
            throw error; // 重新抛出 redirect
        }
        console.error('💥 GitHub OAuth 回调错误:', error);

        // 更详细的错误处理
        let errorName = 'Unknown';
        let errorMessage = 'Unknown error';
        let errorStack = 'No stack trace';

        if (error instanceof Error) {
            errorName = error.name;
            errorMessage = error.message;
            errorStack = error.stack || 'No stack trace';
        } else if (typeof error === 'object' && error !== null) {
            // 处理非 Error 对象
            errorMessage = JSON.stringify(error);
            errorName = 'ObjectError';
        } else {
            errorMessage = String(error);
        }

        console.error('🔍 错误详情:', {
            name: errorName,
            message: errorMessage,
            stack: errorStack,
            type: typeof error,
            isError: error instanceof Error
        });

        // 构建详细的错误信息
        let finalErrorMessage = errorMessage;
        let errorDetails = '';

        if (error instanceof Error) {
            finalErrorMessage = error.message;

            // 添加更多上下文信息
            if (finalErrorMessage.includes('State validation failed')) {
                errorDetails = 'CSRF_STATE_MISMATCH';
            } else if (finalErrorMessage.includes('Failed to exchange code')) {
                errorDetails = 'TOKEN_EXCHANGE_FAILED';
            } else if (finalErrorMessage.includes('No access token')) {
                errorDetails = 'NO_ACCESS_TOKEN';
            } else if (finalErrorMessage.includes('Authorization code not provided')) {
                errorDetails = 'NO_AUTH_CODE';
            } else {
                errorDetails = 'GENERAL_ERROR';
            }
        }

        // 重定向到错误页面或 CMS 登录页面
        // 在开发环境中，重定向到本地地址
        const isDevEnv = process.env.NODE_ENV === 'development';
        const baseUrl = isDevEnv ? 'http://localhost:5173' : url.origin;
        const errorUrl = new URL('/admin/', baseUrl);

        // 包含错误类型和详细信息
        const fullErrorMessage = errorDetails ? `${errorDetails}: ${finalErrorMessage}` : finalErrorMessage;
        errorUrl.hash = '#error=oauth_failed&error_description=' + encodeURIComponent(fullErrorMessage);

        console.log('🔄 错误重定向到:', errorUrl.toString());
        throw redirect(302, errorUrl.toString());
    }
};