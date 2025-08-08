import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import {
	getUserApiKeys,
	createUserApiKey
} from '$lib/services/supabase-api-keys';
import type { ApiKeyCreateRequest } from '$lib/types/api-keys';

// GET - 获取所有 API Keys
export const GET: RequestHandler = async ({ locals }) => {
	try {
		// 检查用户是否已认证
		if (!locals.user) {
			return json({
				success: false,
				error: 'Unauthorized'
			}, { status: 401 });
		}

		// 使用用户ID作为唯一标识符
		const userId = locals.user.id;
		const apiKeys = await getUserApiKeys(userId);
		
		return json({
			success: true,
			data: apiKeys
		});
	} catch (error) {
		console.error('Error loading API keys:', error);
		return json({
			success: false,
			error: 'Failed to load API keys'
		}, { status: 500 });
	}
};

// POST - 创建新的 API Key
export const POST: RequestHandler = async ({ request, locals }) => {
	try {
		// 检查用户是否已认证
		if (!locals.user) {
			return json({
				success: false,
				error: 'Unauthorized'
			}, { status: 401 });
		}

		const userId = locals.user.id;
		const data: ApiKeyCreateRequest = await request.json();
		
		// 验证必填字段
		if (!data.providerId || !data.name || !data.fields) {
			return json({
				success: false,
				error: 'Provider ID, name, and fields are required'
			}, { status: 400 });
		}
		
		// 创建 API Key
		const newApiKey = await createUserApiKey(userId, data);
		
		return json({
			success: true,
			data: newApiKey
		});
	} catch (error) {
		console.error('Error creating API key:', error);
		return json({
			success: false,
			error: 'Failed to create API key'
		}, { status: 500 });
	}
};
