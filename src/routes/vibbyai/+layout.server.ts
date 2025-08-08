import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { verifyAuthToken } from '$lib/auth/simple-auth';

export const load: LayoutServerLoad = async ({ url, cookies }) => {
	// 跳过登录页面的认证检查
	if (url.pathname === '/vibbyai/login') {
		return {
			user: null
		};
	}

	// 使用简单认证的会话检查
	const token = cookies.get('admin_token');
	const user = token ? verifyAuthToken(token) : null;

	if (!user) {
		throw redirect(302, `/vibbyai/login?redirect=${encodeURIComponent(url.pathname)}`);
	}

	return {
		user: {
			name: user.username,
			email: `${user.username}@tenniszero.org`,
			avatar: '/avatar-placeholder.png',
			role: user.role
		}
	};
};