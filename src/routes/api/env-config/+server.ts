import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// GET - 读取当前环境变量配置
export const GET: RequestHandler = async () => {
	try {
		// 检查是否在Cloudflare Workers环境中
		if (typeof process === 'undefined' || !process.cwd) {
			return json({
				success: false,
				error: 'Environment configuration API is not available in Cloudflare Workers environment. Use environment variables directly.'
			}, { status: 501 });
		}

		// 动态导入env-manager
		const { readEnvConfig } = await import('$lib/services/env-manager');
		const config = await readEnvConfig();
		
		// 过滤敏感信息，只返回非敏感的配置用于显示
		const safeConfig = {
			NODE_ENV: config.NODE_ENV,
			PUBLIC_SITE_URL: config.PUBLIC_SITE_URL,
			PUBLIC_SUPABASE_URL: config.PUBLIC_SUPABASE_URL,
			// 对于敏感字段，只返回是否已设置的状态
			PUBLIC_SUPABASE_ANON_KEY: config.PUBLIC_SUPABASE_ANON_KEY ? '***已设置***' : '',
			SUPABASE_SERVICE_ROLE_KEY: config.SUPABASE_SERVICE_ROLE_KEY ? '***已设置***' : '',
			ENCRYPTION_SECRET: config.ENCRYPTION_SECRET ? '***已设置***' : '',
			SMTP_HOST: config.SMTP_HOST,
			SMTP_PORT: config.SMTP_PORT,
			SMTP_USER: config.SMTP_USER,
			SMTP_PASS: config.SMTP_PASS ? '***已设置***' : '',
			SMTP_FROM: config.SMTP_FROM,
			GOOGLE_ANALYTICS_ID: config.GOOGLE_ANALYTICS_ID,
			MICROSOFT_CLARITY_ID: config.MICROSOFT_CLARITY_ID,
			GITHUB_CLIENT_ID: config.GITHUB_CLIENT_ID,
			GITHUB_CLIENT_SECRET: config.GITHUB_CLIENT_SECRET ? '***已设置***' : '',
			GOOGLE_CLIENT_ID: config.GOOGLE_CLIENT_ID,
			GOOGLE_CLIENT_SECRET: config.GOOGLE_CLIENT_SECRET ? '***已设置***' : '',
			STRIPE_PUBLIC_KEY: config.STRIPE_PUBLIC_KEY,
			STRIPE_SECRET_KEY: config.STRIPE_SECRET_KEY ? '***已设置***' : '',
			STRIPE_WEBHOOK_SECRET: config.STRIPE_WEBHOOK_SECRET ? '***已设置***' : '',
			REDIS_URL: config.REDIS_URL ? '***已设置***' : ''
		};

		return json({
			success: true,
			data: safeConfig
		});
	} catch (error) {
		console.error('Error reading env config:', error);
		return json({
			success: false,
			error: 'Failed to read configuration'
		}, { status: 500 });
	}
};

// POST - 保存环境变量配置
export const POST: RequestHandler = async ({ request }) => {
	try {
		// 检查是否在Cloudflare Workers环境中
		if (typeof process === 'undefined' || !process.cwd) {
			return json({
				success: false,
				error: 'Environment configuration API is not available in Cloudflare Workers environment. Use environment variables directly.'
			}, { status: 501 });
		}

		// 动态导入env-manager
		const { readEnvConfig, writeEnvConfig, validateConfig } = await import('$lib/services/env-manager');
		
		const config = await request.json();
		
		// 验证配置
		const validation = validateConfig(config);
		if (!validation.isValid) {
			return json({
				success: false,
				error: 'Configuration validation failed',
				details: validation.errors
			}, { status: 400 });
		}

		// 读取当前配置
		const currentConfig = await readEnvConfig();
		
		// 合并配置，保留已设置的敏感字段（如果新值是占位符）
		const mergedConfig = { ...config };
		
		// 处理敏感字段的占位符
		const sensitiveFields = [
			'PUBLIC_SUPABASE_ANON_KEY',
			'SUPABASE_SERVICE_ROLE_KEY',
			'ENCRYPTION_SECRET',
			'SMTP_PASS',
			'GITHUB_CLIENT_SECRET',
			'GOOGLE_CLIENT_SECRET',
			'STRIPE_SECRET_KEY',
			'STRIPE_WEBHOOK_SECRET',
			'REDIS_URL'
		];

		sensitiveFields.forEach(field => {
			if ((config as any)[field] === '***已设置***' && (currentConfig as any)[field]) {
				// 如果新值是占位符且当前有值，保留当前值
				(mergedConfig as any)[field] = (currentConfig as any)[field];
			}
		});

		// 写入配置文件
		await writeEnvConfig(mergedConfig);

		return json({
			success: true,
			message: 'Configuration saved successfully'
		});
	} catch (error) {
		console.error('Error saving env config:', error);
		return json({
			success: false,
			error: 'Failed to save configuration'
		}, { status: 500 });
	}
};

// PUT - 更新特定的环境变量
export const PUT: RequestHandler = async ({ request }) => {
	try {
		// 检查是否在Cloudflare Workers环境中
		if (typeof process === 'undefined' || !process.cwd) {
			return json({
				success: false,
				error: 'Environment configuration API is not available in Cloudflare Workers environment. Use environment variables directly.'
			}, { status: 501 });
		}

		// 动态导入env-manager
		const { readEnvConfig, writeEnvConfig, validateConfig } = await import('$lib/services/env-manager');
		
		const updates = await request.json();
		
		// 读取当前配置
		const currentConfig = await readEnvConfig();
		
		// 合并更新
		const updatedConfig = { ...currentConfig, ...updates };
		
		// 验证更新后的配置
		const validation = validateConfig(updatedConfig);
		if (!validation.isValid) {
			return json({
				success: false,
				error: 'Configuration validation failed',
				details: validation.errors
			}, { status: 400 });
		}

		// 写入配置文件
		await writeEnvConfig(updatedConfig);

		return json({
			success: true,
			message: 'Configuration updated successfully'
		});
	} catch (error) {
		console.error('Error updating env config:', error);
		return json({
			success: false,
			error: 'Failed to update configuration'
		}, { status: 500 });
	}
};

// DELETE - 重置配置（谨慎使用）
export const DELETE: RequestHandler = async () => {
	try {
		// 检查是否在Cloudflare Workers环境中
		if (typeof process === 'undefined' || !process.cwd) {
			return json({
				success: false,
				error: 'Environment configuration API is not available in Cloudflare Workers environment. Use environment variables directly.'
			}, { status: 501 });
		}

		// 动态导入env-manager
		const { writeEnvConfig } = await import('$lib/services/env-manager');
		
		// 只保留基础配置
		const resetConfig = {
			NODE_ENV: 'development',
			PUBLIC_SITE_URL: ''
		};

		await writeEnvConfig(resetConfig);

		return json({
			success: true,
			message: 'Configuration reset successfully'
		});
	} catch (error) {
		console.error('Error resetting env config:', error);
		return json({
			success: false,
			error: 'Failed to reset configuration'
		}, { status: 500 });
	}
};
