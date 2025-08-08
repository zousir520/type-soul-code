import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createClient } from '@supabase/supabase-js';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { url, anonKey, serviceKey } = await request.json();

		if (!url || !anonKey) {
			return json({
				success: false,
				message: '请提供 Supabase URL 和匿名密钥'
			}, { status: 400 });
		}

		// 测试匿名密钥连接
		try {
			const supabaseAnon = createClient(url, anonKey);
			const { error: anonError } = await supabaseAnon.from('_test_').select('*').limit(1);
			
			// 这个查询会失败，但如果是认证错误说明密钥有问题
			if (anonError && anonError.message.includes('JWT')) {
				return json({
					success: false,
					message: '匿名密钥无效或格式错误'
				});
			}
		} catch (error) {
			return json({
				success: false,
				message: 'Supabase URL 或匿名密钥无效'
			});
		}

		// 测试服务密钥连接（如果提供）
		if (serviceKey) {
			try {
				const supabaseService = createClient(url, serviceKey);
				const { error: serviceError } = await supabaseService.from('_test_').select('*').limit(1);
				
				if (serviceError && serviceError.message.includes('JWT')) {
					return json({
						success: false,
						message: '服务密钥无效或格式错误'
					});
				}
			} catch (error) {
				return json({
					success: false,
					message: '服务密钥连接失败'
				});
			}
		}

		return json({
			success: true,
			message: 'Supabase 连接测试成功！所有密钥都有效。'
		});

	} catch (error) {
		console.error('Supabase test error:', error);
		return json({
			success: false,
			message: '连接测试失败：' + (error instanceof Error ? error.message : '未知错误')
		}, { status: 500 });
	}
};
