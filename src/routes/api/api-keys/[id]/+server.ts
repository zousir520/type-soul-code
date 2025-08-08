import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import {
	getUserApiKey,
	updateUserApiKey,
	deleteUserApiKey
} from '$lib/services/supabase-api-keys';
import type { ApiKeyUpdateRequest } from '$lib/types/api-keys';

// GET - 获取单个 API Key
export const GET: RequestHandler = async ({ params, locals }) => {
	try {
		// 检查用户是否已认证
		if (!locals.user) {
			return json({
				success: false,
				error: 'Unauthorized'
			}, { status: 401 });
		}

		const userId = locals.user.id;
		const { id } = params;
		const apiKey = await getUserApiKey(userId, id);
		
		if (!apiKey) {
			return json({
				success: false,
				error: 'API key not found'
			}, { status: 404 });
		}
		
		return json({
			success: true,
			data: apiKey
		});
	} catch (error) {
		console.error('Error loading API key:', error);
		return json({
			success: false,
			error: 'Failed to load API key'
		}, { status: 500 });
	}
};

// PUT - 更新 API Key
export const PUT: RequestHandler = async ({ params, request, locals }) => {
	try {
		// 检查用户是否已认证
		if (!locals.user) {
			return json({
				success: false,
				error: 'Unauthorized'
			}, { status: 401 });
		}

		const userId = locals.user.id;
		const { id } = params;
		const data: ApiKeyUpdateRequest = await request.json();
		
		const updatedKey = await updateUserApiKey(userId, id, data);
		
		if (!updatedKey) {
			return json({
				success: false,
				error: 'API key not found'
			}, { status: 404 });
		}
		
		return json({
			success: true,
			data: updatedKey
		});
	} catch (error) {
		console.error('Error updating API key:', error);
		return json({
			success: false,
			error: 'Failed to update API key'
		}, { status: 500 });
	}
};

// DELETE - 删除 API Key
export const DELETE: RequestHandler = async ({ params, locals }) => {
	try {
		// 检查用户是否已认证
		if (!locals.user) {
			return json({
				success: false,
				error: 'Unauthorized'
			}, { status: 401 });
		}

		const userId = locals.user.id;
		const { id } = params;
		const success = await deleteUserApiKey(userId, id);
		
		if (!success) {
			return json({
				success: false,
				error: 'API key not found'
			}, { status: 404 });
		}
		
		return json({
			success: true,
			message: 'API key deleted successfully'
		});
	} catch (error) {
		console.error('Error deleting API key:', error);
		return json({
			success: false,
			error: 'Failed to delete API key'
		}, { status: 500 });
	}
};
