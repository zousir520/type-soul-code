// 环境变量配置接口 - 客户端安全版本
// 只包含类型定义，不包含 Node.js 依赖的函数

export interface EnvConfig {
	// 基础配置
	NODE_ENV?: string;
	PUBLIC_SITE_URL?: string;
	
	// 数据库配置
	DATABASE_URL?: string;
	
	// Supabase 配置
	PUBLIC_SUPABASE_URL?: string;
	PUBLIC_SUPABASE_ANON_KEY?: string;
	SUPABASE_SERVICE_ROLE_KEY?: string;
	
	// 加密配置
	ENCRYPTION_SECRET?: string;
	
	// 邮件配置
	SMTP_HOST?: string;
	SMTP_PORT?: string;
	SMTP_USER?: string;
	SMTP_PASS?: string;
	SMTP_FROM?: string;
	
	// 分析工具
	GOOGLE_ANALYTICS_ID?: string;
	MICROSOFT_CLARITY_ID?: string;
	
	// 社交登录
	GITHUB_CLIENT_ID?: string;
	GITHUB_CLIENT_SECRET?: string;
	GOOGLE_CLIENT_ID?: string;
	GOOGLE_CLIENT_SECRET?: string;
	
	// 支付配置
	STRIPE_PUBLIC_KEY?: string;
	STRIPE_SECRET_KEY?: string;
	STRIPE_WEBHOOK_SECRET?: string;
	
	// Redis 配置
	REDIS_URL?: string;
	
	// AI 服务配置 (Legacy - 建议使用 API 密钥管理)
	OPENAI_API_KEY?: string;
	ANTHROPIC_API_KEY?: string;
	GOOGLE_AI_API_KEY?: string;
	COHERE_API_KEY?: string;
	HUGGINGFACE_API_KEY?: string;
	REPLICATE_API_TOKEN?: string;
	STABILITY_API_KEY?: string;
	DEEPSEEK_API_KEY?: string;
	OPENROUTER_API_KEY?: string;
	FAL_KEY?: string;
	APICORE_API_KEY?: string;
}

// 配置步骤接口
export interface ConfigStep {
	id: string;
	title: string;
	description: string;
	required: boolean;
	completed: boolean;
	optional?: boolean;
	category?: string;
	fields?: Array<{
		key: string;
		label: string;
		type: string;
		required?: boolean;
		placeholder?: string;
		description?: string;
		options?: Array<{
			value: string;
			label: string;
		}>;
	}>;
}

// 配置验证结果
export interface ConfigValidation {
	isValid: boolean;
	errors: string[];
	warnings: string[];
}

// 配置步骤定义
export const CONFIG_STEPS: ConfigStep[] = [
	{
		id: 'basic',
		title: 'Basic Configuration',
		description: 'Set up basic site configuration',
		required: true,
		completed: false
	},
	{
		id: 'database',
		title: 'Database Setup',
		description: 'Configure Supabase database connection',
		required: false,
		completed: false
	},
	{
		id: 'security',
		title: 'Security Settings',
		description: 'Generate encryption keys and security settings',
		required: true,
		completed: false
	},
	{
		id: 'email',
		title: 'Email Service',
		description: 'Configure SMTP email service (optional)',
		required: false,
		completed: false
	},
	{
		id: 'analytics',
		title: 'Analytics',
		description: 'Set up Google Analytics and Microsoft Clarity (optional)',
		required: false,
		completed: false
	},
	{
		id: 'social',
		title: 'Social Login',
		description: 'Configure OAuth providers (optional)',
		required: false,
		completed: false
	},
	{
		id: 'payment',
		title: 'Payment Service',
		description: 'Configure Stripe payment processing (optional)',
		required: false,
		completed: false
	}
];

// 预设配置模板
export const CONFIG_PRESETS = {
	development: {
		NODE_ENV: 'development',
		PUBLIC_SITE_URL: 'http://localhost:5173'
	},
	production: {
		NODE_ENV: 'production',
		PUBLIC_SITE_URL: 'https://yourdomain.com'
	}
} as const;

// 敏感字段列表
export const SENSITIVE_FIELDS: (keyof EnvConfig)[] = [
	'PUBLIC_SUPABASE_ANON_KEY',
	'SUPABASE_SERVICE_ROLE_KEY',
	'ENCRYPTION_SECRET',
	'SMTP_PASS',
	'GITHUB_CLIENT_SECRET',
	'GOOGLE_CLIENT_SECRET',
	'STRIPE_SECRET_KEY',
	'STRIPE_WEBHOOK_SECRET',
	'REDIS_URL',
	'OPENAI_API_KEY',
	'ANTHROPIC_API_KEY',
	'GOOGLE_AI_API_KEY',
	'COHERE_API_KEY',
	'HUGGINGFACE_API_KEY',
	'REPLICATE_API_TOKEN',
	'STABILITY_API_KEY',
	'DEEPSEEK_API_KEY',
	'OPENROUTER_API_KEY',
	'FAL_KEY',
	'APICORE_API_KEY'
];

// 必需字段列表
export const REQUIRED_FIELDS: (keyof EnvConfig)[] = [
	'NODE_ENV',
	'PUBLIC_SITE_URL'
];

// 字段分组
export const FIELD_GROUPS = {
	basic: ['NODE_ENV', 'PUBLIC_SITE_URL'],
	database: ['DATABASE_URL', 'PUBLIC_SUPABASE_URL', 'PUBLIC_SUPABASE_ANON_KEY', 'SUPABASE_SERVICE_ROLE_KEY'],
	security: ['ENCRYPTION_SECRET'],
	email: ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'SMTP_FROM'],
	analytics: ['GOOGLE_ANALYTICS_ID', 'MICROSOFT_CLARITY_ID'],
	social: ['GITHUB_CLIENT_ID', 'GITHUB_CLIENT_SECRET', 'GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET'],
	payment: ['STRIPE_PUBLIC_KEY', 'STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET'],
	redis: ['REDIS_URL'],
	ai: [
		'OPENAI_API_KEY',
		'ANTHROPIC_API_KEY',
		'GOOGLE_AI_API_KEY',
		'COHERE_API_KEY',
		'HUGGINGFACE_API_KEY',
		'REPLICATE_API_TOKEN',
		'STABILITY_API_KEY',
		'DEEPSEEK_API_KEY',
		'OPENROUTER_API_KEY',
		'FAL_KEY',
		'APICORE_API_KEY'
	]
} as const;
