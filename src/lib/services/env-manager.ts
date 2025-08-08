// 环境变量管理器
// 用于管理应用程序的环境变量配置

import type { EnvConfig } from '$lib/types/env-config';

// 检查是否为Node环境
const isNodeEnvironment = typeof process !== 'undefined' && process.versions && process.versions.node;

// 动态导入文件系统模块
async function getFileSystemModules() {
	if (!isNodeEnvironment) {
		throw new Error('File system operations are not available in this environment');
	}

	try {
		const { readFile, writeFile } = await import('fs/promises');
		const { join } = await import('path');
		return { readFile, writeFile, path: { join } };
	} catch (error) {
		throw new Error('Failed to import file system modules');
	}
}

// 环境变量字段定义
export interface EnvField {
	key: keyof EnvConfig;
	label: string;
	type: 'text' | 'password' | 'url' | 'email' | 'number' | 'select';
	placeholder?: string;
	description?: string;
	required?: boolean;
	validation?: RegExp;
	options?: { value: string; label: string }[];
	generateButton?: boolean;
}

// 环境变量字段配置
export const envFields: EnvField[][] = [
	[
		{
			key: 'NODE_ENV',
			label: 'Node Environment',
			type: 'select',
			options: [
				{ value: 'development', label: 'Development' },
				{ value: 'production', label: 'Production' },
				{ value: 'test', label: 'Test' }
			],
			description: '应用程序运行环境'
		},
		{
			key: 'PUBLIC_SITE_URL',
			label: 'Site URL',
			type: 'url',
			placeholder: 'https://your-site.com',
			description: '网站公开URL'
		}
	],
	[
		{
			key: 'DATABASE_URL',
			label: 'Database URL',
			type: 'url',
			placeholder: 'postgresql://user:password@localhost:5432/dbname',
			description: '数据库连接URL'
		}
	],
	[
		{
			key: 'PUBLIC_SUPABASE_URL',
			label: 'Supabase URL',
			type: 'url',
			placeholder: 'https://your-project.supabase.co',
			description: 'Supabase项目URL'
		},
		{
			key: 'PUBLIC_SUPABASE_ANON_KEY',
			label: 'Supabase Anonymous Key',
			type: 'password',
			placeholder: 'Enter your Supabase anonymous key',
			description: 'Supabase匿名密钥'
		},
		{
			key: 'SUPABASE_SERVICE_ROLE_KEY',
			label: 'Supabase Service Role Key',
			type: 'password',
			placeholder: 'Enter your Supabase service role key',
			description: 'Supabase服务角色密钥'
		}
	],
	[
		{
			key: 'ENCRYPTION_SECRET',
			label: 'Encryption Secret',
			type: 'password',
			placeholder: 'Enter your encryption secret',
			description: '加密密钥（至少32位字符）',
			generateButton: true
		}
	],
	[
		{
			key: 'SMTP_HOST',
			label: 'SMTP Host',
			type: 'text',
			placeholder: 'smtp.gmail.com',
			description: 'SMTP服务器地址'
		},
		{
			key: 'SMTP_PORT',
			label: 'SMTP Port',
			type: 'number',
			placeholder: '587',
			description: 'SMTP端口'
		},
		{
			key: 'SMTP_USER',
			label: 'SMTP Username',
			type: 'email',
			placeholder: 'your-email@gmail.com',
			description: 'SMTP用户名'
		},
		{
			key: 'SMTP_PASS',
			label: 'SMTP Password',
			type: 'password',
			placeholder: 'Enter your SMTP password',
			description: 'SMTP密码'
		},
		{
			key: 'SMTP_FROM',
			label: 'From Email',
			type: 'email',
			placeholder: 'noreply@your-site.com',
			description: '发件人邮箱地址'
		}
	],
	[
		{
			key: 'GOOGLE_ANALYTICS_ID',
			label: 'Google Analytics ID',
			type: 'text',
			placeholder: 'G-XXXXXXXXXX',
			description: 'Google Analytics跟踪ID'
		},
		{
			key: 'MICROSOFT_CLARITY_ID',
			label: 'Microsoft Clarity ID',
			type: 'text',
			placeholder: 'Enter your Microsoft Clarity ID',
			description: 'Microsoft Clarity跟踪ID'
		}
	],
	[
		{
			key: 'GITHUB_CLIENT_ID',
			label: 'GitHub Client ID',
			type: 'text',
			placeholder: 'Enter your GitHub client ID',
			description: 'GitHub OAuth客户端ID'
		},
		{
			key: 'GITHUB_CLIENT_SECRET',
			label: 'GitHub Client Secret',
			type: 'password',
			placeholder: 'Enter your GitHub client secret',
			description: 'GitHub OAuth客户端密钥'
		},
		{
			key: 'GOOGLE_CLIENT_ID',
			label: 'Google Client ID',
			type: 'text',
			placeholder: 'Enter your Google client ID',
			description: 'Google OAuth客户端ID'
		},
		{
			key: 'GOOGLE_CLIENT_SECRET',
			label: 'Google Client Secret',
			type: 'password',
			placeholder: 'Enter your Google client secret',
			description: 'Google OAuth客户端密钥'
		}
	],
	[
		{
			key: 'STRIPE_PUBLIC_KEY',
			label: 'Stripe Public Key',
			type: 'text',
			placeholder: 'pk_test_...',
			description: 'Stripe公钥'
		},
		{
			key: 'STRIPE_SECRET_KEY',
			label: 'Stripe Secret Key',
			type: 'password',
			placeholder: 'Enter your Stripe secret key',
			description: 'Stripe密钥（服务端使用）'
		},
		{
			key: 'STRIPE_WEBHOOK_SECRET',
			label: 'Stripe Webhook Secret',
			type: 'password',
			placeholder: 'Enter your Stripe webhook secret',
			description: 'Stripe Webhook端点密钥'
		}
	]
];

// 读取当前环境变量配置
export async function readEnvConfig(): Promise<EnvConfig> {
	if (!isNodeEnvironment) {
		console.warn('环境变量读取功能在当前环境中不可用');
		return {};
	}

	try {
		const { readFile, path } = await getFileSystemModules();
		const ENV_FILE_PATH = path.join(process.cwd(), '.env.development');
		const content = await readFile(ENV_FILE_PATH, 'utf-8');
		const config: EnvConfig = {};
		
		content.split('\n').forEach((line: string) => {
			const trimmed = line.trim();
			if (trimmed && !trimmed.startsWith('#')) {
				const [key, ...valueParts] = trimmed.split('=');
				if (key && valueParts.length > 0) {
					const value = valueParts.join('=').replace(/^["']|["']$/g, '');
					config[key as keyof EnvConfig] = value;
				}
			}
		});
		
		return config;
	} catch (error) {
		return {};
	}
}

// 写入环境变量配置
export async function writeEnvConfig(config: EnvConfig): Promise<void> {
	if (!isNodeEnvironment) {
		throw new Error('环境变量写入功能在当前环境中不可用');
	}

	try {
		const { writeFile, path } = await getFileSystemModules();
		const ENV_FILE_PATH = path.join(process.cwd(), '.env.development');
		
		const lines = [
			'# Environment Configuration',
			'# Generated by Setup Wizard',
			'',
			'# Basic Configuration',
			...(config.NODE_ENV ? [`NODE_ENV=${config.NODE_ENV}`] : []),
			...(config.PUBLIC_SITE_URL ? [`PUBLIC_SITE_URL=${config.PUBLIC_SITE_URL}`] : []),
			'',
			'# Database Configuration',
			...(config.DATABASE_URL ? [`DATABASE_URL="${config.DATABASE_URL}"`] : []),
			'',
			'# Supabase Configuration',
			...(config.PUBLIC_SUPABASE_URL ? [`PUBLIC_SUPABASE_URL=${config.PUBLIC_SUPABASE_URL}`] : []),
			...(config.PUBLIC_SUPABASE_ANON_KEY ? [`PUBLIC_SUPABASE_ANON_KEY=${config.PUBLIC_SUPABASE_ANON_KEY}`] : []),
			...(config.SUPABASE_SERVICE_ROLE_KEY ? [`SUPABASE_SERVICE_ROLE_KEY=${config.SUPABASE_SERVICE_ROLE_KEY}`] : []),
			'',
			'# Security Configuration',
			...(config.ENCRYPTION_SECRET ? [`ENCRYPTION_SECRET=${config.ENCRYPTION_SECRET}`] : []),
			'',
			'# Email Configuration',
			...(config.SMTP_HOST ? [`SMTP_HOST=${config.SMTP_HOST}`] : []),
			...(config.SMTP_PORT ? [`SMTP_PORT=${config.SMTP_PORT}`] : []),
			...(config.SMTP_USER ? [`SMTP_USER=${config.SMTP_USER}`] : []),
			...(config.SMTP_PASS ? [`SMTP_PASS=${config.SMTP_PASS}`] : []),
			...(config.SMTP_FROM ? [`SMTP_FROM=${config.SMTP_FROM}`] : []),
			'',
			'# Analytics Configuration',
			...(config.GOOGLE_ANALYTICS_ID ? [`GOOGLE_ANALYTICS_ID=${config.GOOGLE_ANALYTICS_ID}`] : []),
			...(config.MICROSOFT_CLARITY_ID ? [`MICROSOFT_CLARITY_ID=${config.MICROSOFT_CLARITY_ID}`] : []),
			'',
			'# Social Authentication',
			...(config.GITHUB_CLIENT_ID ? [`GITHUB_CLIENT_ID=${config.GITHUB_CLIENT_ID}`] : []),
			...(config.GITHUB_CLIENT_SECRET ? [`GITHUB_CLIENT_SECRET=${config.GITHUB_CLIENT_SECRET}`] : []),
			...(config.GOOGLE_CLIENT_ID ? [`GOOGLE_CLIENT_ID=${config.GOOGLE_CLIENT_ID}`] : []),
			...(config.GOOGLE_CLIENT_SECRET ? [`GOOGLE_CLIENT_SECRET=${config.GOOGLE_CLIENT_SECRET}`] : []),
			'',
			'# Payment Configuration',
			...(config.STRIPE_PUBLIC_KEY ? [`STRIPE_PUBLIC_KEY=${config.STRIPE_PUBLIC_KEY}`] : []),
			...(config.STRIPE_SECRET_KEY ? [`STRIPE_SECRET_KEY=${config.STRIPE_SECRET_KEY}`] : []),
			...(config.STRIPE_WEBHOOK_SECRET ? [`STRIPE_WEBHOOK_SECRET=${config.STRIPE_WEBHOOK_SECRET}`] : [])
		];

		await writeFile(ENV_FILE_PATH, lines.join('\n'), 'utf-8');
	} catch (error) {
		throw new Error(`Failed to write environment config: ${error}`);
	}
}

// 检查环境变量文件是否存在
export async function envFileExists(): Promise<boolean> {
	if (!isNodeEnvironment) {
		return false;
	}

	try {
		const { readFile, path } = await getFileSystemModules();
		const ENV_FILE_PATH = path.join(process.cwd(), '.env.development');
		await readFile(ENV_FILE_PATH, 'utf-8');
		return true;
	} catch (error) {
		return false;
	}
}

// 生成加密密钥
export function generateEncryptionSecret(): string {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let result = '';
	for (let i = 0; i < 32; i++) {
		result += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return result;
}

// 验证配置
export function validateConfig(config: EnvConfig): { isValid: boolean; errors: string[] } {
	const errors: string[] = [];

	if (!config.NODE_ENV) {
		errors.push('NODE_ENV is required');
	}

	if (!config.PUBLIC_SITE_URL) {
		errors.push('PUBLIC_SITE_URL is required');
	}

	if (config.ENCRYPTION_SECRET && config.ENCRYPTION_SECRET.length < 32) {
		errors.push('ENCRYPTION_SECRET must be at least 32 characters long');
	}

	return {
		isValid: errors.length === 0,
		errors
	};
}
