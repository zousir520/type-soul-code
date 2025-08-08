import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { callApicoreChat, getApicoreModels, type ApicoreRequest } from '$lib/services/apicore-client';

// 环境检测
const isCloudflareWorkers = typeof process === 'undefined' || !process.cwd;

// POST - 测试 APICore.ai 聊天
export const POST: RequestHandler = async ({ request }) => {
	try {
		const data = await request.json();
		const { action, ...requestData } = data;

		switch (action) {
			case 'chat':
				const chatRequest: ApicoreRequest = {
					model: requestData.model || 'gpt-4o-mini',
					messages: requestData.messages || [
						{ role: 'user', content: 'Hello, how are you?' }
					],
					temperature: requestData.temperature || 0.7,
					maxTokens: requestData.maxTokens || 1000
				};

				const chatResponse = await callApicoreChat(chatRequest);
				return json(chatResponse);

			case 'models':
				const modelsResponse = await getApicoreModels();
				return json(modelsResponse);

			default:
				return json({
					success: false,
					error: 'Invalid action. Use "chat" or "models"'
				}, { status: 400 });
		}
	} catch (error) {
		console.error('APICore.ai test error:', error);
		return json({
			success: false,
			error: error instanceof Error ? error.message : 'Unknown error'
		}, { status: 500 });
	}
};
