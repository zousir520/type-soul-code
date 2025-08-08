import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { isSimpleAuthEnabled, verifyAuthToken } from '$lib/auth/simple-auth';

export const GET: RequestHandler = async ({ cookies }) => {
	try {
		// 检查认证系统是否启用
		const authEnabled = isSimpleAuthEnabled();
		
		// 检查当前用户是否已认证
		const token = cookies.get('admin_token');
		const user = token ? verifyAuthToken(token) : null;
		const isAuthenticated = !!user;
		
		return json({
			authEnabled,
			isAuthenticated,
			user: user ? { username: user.username, role: user.role } : null,
			timestamp: new Date().toISOString()
		});
	} catch (error) {
		console.error('Auth status check error:', error);
		return json({
			authEnabled: false,
			isAuthenticated: false,
			user: null,
			error: 'Failed to check auth status',
			timestamp: new Date().toISOString()
		}, { status: 500 });
	}
};
