// API 提供商配置
export interface ApiProvider {
	id: string;
	name: string;
	description: string;
	category: 'llm' | 'image' | 'audio' | 'video' | 'search' | 'traditional';
	baseUrl?: string;
	authType: 'bearer' | 'api-key' | 'custom';
	keyFormat?: string; // 密钥格式说明
	testEndpoint?: string; // 用于测试连接的端点
	documentation?: string; // 文档链接
	icon: string; // SVG path
	color: string;
	fields: ApiProviderField[];
}

export interface ApiProviderField {
	key: string;
	label: string;
	type: 'text' | 'password' | 'url' | 'select';
	required: boolean;
	placeholder?: string;
	description?: string;
	options?: { value: string; label: string }[];
}

export const API_PROVIDERS: ApiProvider[] = [
	// AI LLM 提供商
	{
		id: 'openai',
		name: 'OpenAI',
		description: 'GPT models, DALL-E, Whisper, and more',
		category: 'llm',
		baseUrl: 'https://api.openai.com/v1',
		authType: 'bearer',
		keyFormat: 'sk-...',
		testEndpoint: '/models',
		documentation: 'https://platform.openai.com/docs',
		icon: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
		color: 'green',
		fields: [
			{
				key: 'apiKey',
				label: 'API Key',
				type: 'password',
				required: true,
				placeholder: 'sk-...',
				description: 'Your OpenAI API key from platform.openai.com'
			},
			{
				key: 'organization',
				label: 'Organization ID',
				type: 'text',
				required: false,
				placeholder: 'org-...',
				description: 'Optional organization ID'
			}
		]
	},
	{
		id: 'openrouter',
		name: 'OpenRouter',
		description: 'Access to multiple LLM models through one API',
		category: 'llm',
		baseUrl: 'https://openrouter.ai/api/v1',
		authType: 'bearer',
		keyFormat: 'sk-or-...',
		testEndpoint: '/models',
		documentation: 'https://openrouter.ai/docs',
		icon: 'M13 10V3L4 14h7v7l9-11h-7z',
		color: 'purple',
		fields: [
			{
				key: 'apiKey',
				label: 'API Key',
				type: 'password',
				required: true,
				placeholder: 'sk-or-...',
				description: 'Your OpenRouter API key'
			},
			{
				key: 'siteName',
				label: 'Site Name',
				type: 'text',
				required: false,
				placeholder: 'Your App Name',
				description: 'Optional site name for usage tracking'
			},
			{
				key: 'siteUrl',
				label: 'Site URL',
				type: 'url',
				required: false,
				placeholder: 'https://yourapp.com',
				description: 'Optional site URL for usage tracking'
			}
		]
	},
	{
		id: 'deepseek',
		name: 'DeepSeek',
		description: 'DeepSeek AI models for reasoning and coding',
		category: 'llm',
		baseUrl: 'https://api.deepseek.com/v1',
		authType: 'bearer',
		keyFormat: 'sk-...',
		testEndpoint: '/models',
		documentation: 'https://platform.deepseek.com/api-docs',
		icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
		color: 'blue',
		fields: [
			{
				key: 'apiKey',
				label: 'API Key',
				type: 'password',
				required: true,
				placeholder: 'sk-...',
				description: 'Your DeepSeek API key'
			}
		]
	},
	{
		id: 'fal',
		name: 'Fal.ai',
		description: 'Fast AI inference for images, video, and audio',
		category: 'image',
		baseUrl: 'https://fal.run/fal-ai',
		authType: 'api-key',
		keyFormat: 'fal_...',
		documentation: 'https://fal.ai/docs',
		icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
		color: 'orange',
		fields: [
			{
				key: 'apiKey',
				label: 'API Key',
				type: 'password',
				required: true,
				placeholder: 'fal_...',
				description: 'Your Fal.ai API key'
			}
		]
	},
	// 可以继续添加更多提供商
	{
		id: 'anthropic',
		name: 'Anthropic',
		description: 'Claude AI models for conversations and analysis',
		category: 'llm',
		baseUrl: 'https://api.anthropic.com/v1',
		authType: 'api-key',
		keyFormat: 'sk-ant-...',
		testEndpoint: '/messages',
		documentation: 'https://docs.anthropic.com',
		icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
		color: 'indigo',
		fields: [
			{
				key: 'apiKey',
				label: 'API Key',
				type: 'password',
				required: true,
				placeholder: 'sk-ant-...',
				description: 'Your Anthropic API key'
			}
		]
	},
	{
		id: 'google',
		name: 'Google AI',
		description: 'Gemini models and Google AI services',
		category: 'llm',
		baseUrl: 'https://generativelanguage.googleapis.com/v1',
		authType: 'api-key',
		keyFormat: 'AIza...',
		documentation: 'https://ai.google.dev/docs',
		icon: 'M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM13.5 10.5a3 3 0 11-6 0 3 3 0 016 0z',
		color: 'red',
		fields: [
			{
				key: 'apiKey',
				label: 'API Key',
				type: 'password',
				required: true,
				placeholder: 'AIza...',
				description: 'Your Google AI API key'
			}
		]
	},
	{
		id: 'apicore',
		name: 'APICore.ai',
		description: 'Multi-model AI API aggregation platform with competitive pricing',
		category: 'llm',
		baseUrl: 'https://api.apicore.ai/v1',
		authType: 'bearer',
		keyFormat: 'sk-...',
		testEndpoint: '/models',
		documentation: 'https://docs.apicore.ai',
		icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
		color: 'cyan',
		fields: [
			{
				key: 'apiKey',
				label: 'API Key',
				type: 'password',
				required: true,
				placeholder: 'sk-...',
				description: 'Your APICore.ai API key from dashboard'
			},
			{
				key: 'baseModel',
				label: 'Default Model',
				type: 'select',
				required: false,
				description: 'Default model to use for requests',
				options: [
					{ value: 'gpt-4o', label: 'GPT-4o' },
					{ value: 'gpt-4o-mini', label: 'GPT-4o Mini' },
					{ value: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
					{ value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
					{ value: 'claude-3-5-sonnet-20241022', label: 'Claude 3.5 Sonnet' },
					{ value: 'claude-3-haiku-20240307', label: 'Claude 3 Haiku' },
					{ value: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro' },
					{ value: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash' },
					{ value: 'llama-3.1-405b-instruct', label: 'Llama 3.1 405B' },
					{ value: 'llama-3.1-70b-instruct', label: 'Llama 3.1 70B' },
					{ value: 'llama-3.1-8b-instruct', label: 'Llama 3.1 8B' }
				]
			},
			{
				key: 'organization',
				label: 'Organization ID',
				type: 'text',
				required: false,
				placeholder: 'org-...',
				description: 'Optional organization ID for team accounts'
			}
		]
	},
	{
		id: 'mistral',
		name: 'Mistral AI',
		description: 'High-performance language models for various tasks',
		category: 'llm',
		baseUrl: 'https://api.mistral.ai/v1',
		authType: 'bearer',
		keyFormat: 'sk-...',
		testEndpoint: '/models',
		documentation: 'https://docs.mistral.ai',
		icon: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
		color: 'orange',
		fields: [
			{
				key: 'apiKey',
				label: 'API Key',
				type: 'password',
				required: true,
				placeholder: 'sk-...',
				description: 'Your Mistral AI API key'
			}
		]
	},
	{
		id: 'groq',
		name: 'Groq',
		description: 'Ultra-fast AI inference with GroqChip technology',
		category: 'llm',
		baseUrl: 'https://api.groq.com/openai/v1',
		authType: 'bearer',
		keyFormat: 'gsk_...',
		testEndpoint: '/models',
		documentation: 'https://console.groq.com/docs',
		icon: 'M13 10V3L4 14h7v7l9-11h-7z',
		color: 'green',
		fields: [
			{
				key: 'apiKey',
				label: 'API Key',
				type: 'password',
				required: true,
				placeholder: 'gsk_...',
				description: 'Your Groq API key'
			}
		]
	},
	{
		id: 'fireworks',
		name: 'Fireworks.ai',
		description: 'Fast and affordable generative AI inference',
		category: 'llm',
		baseUrl: 'https://api.fireworks.ai/inference/v1',
		authType: 'bearer',
		keyFormat: 'fw_...',
		testEndpoint: '/models',
		documentation: 'https://docs.fireworks.ai',
		icon: 'M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z',
		color: 'red',
		fields: [
			{
				key: 'apiKey',
				label: 'API Key',
				type: 'password',
				required: true,
				placeholder: 'fw_...',
				description: 'Your Fireworks.ai API key'
			}
		]
	},
	{
		id: 'together',
		name: 'Together.ai',
		description: 'Open-source AI models at scale',
		category: 'llm',
		baseUrl: 'https://api.together.xyz/v1',
		authType: 'bearer',
		keyFormat: 'sk-...',
		testEndpoint: '/models',
		documentation: 'https://docs.together.ai',
		icon: 'M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z',
		color: 'blue',
		fields: [
			{
				key: 'apiKey',
				label: 'API Key',
				type: 'password',
				required: true,
				placeholder: 'sk-...',
				description: 'Your Together.ai API key'
			}
		]
	},
	{
		id: 'perplexity',
		name: 'Perplexity API',
		description: 'AI-powered search and reasoning capabilities',
		category: 'llm',
		baseUrl: 'https://api.perplexity.ai',
		authType: 'bearer',
		keyFormat: 'pplx-...',
		testEndpoint: '/chat/completions',
		documentation: 'https://docs.perplexity.ai',
		icon: 'M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM13.5 10.5a3 3 0 11-6 0 3 3 0 016 0z',
		color: 'purple',
		fields: [
			{
				key: 'apiKey',
				label: 'API Key',
				type: 'password',
				required: true,
				placeholder: 'pplx-...',
				description: 'Your Perplexity API key'
			}
		]
	},
	{
		id: 'openrouter',
		name: 'OpenRouter',
		description: 'Access to multiple AI models through one API',
		category: 'llm',
		baseUrl: 'https://openrouter.ai/api/v1',
		authType: 'bearer',
		keyFormat: 'sk-or-...',
		testEndpoint: '/models',
		documentation: 'https://openrouter.ai/docs',
		icon: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1',
		color: 'indigo',
		fields: [
			{
				key: 'apiKey',
				label: 'API Key',
				type: 'password',
				required: true,
				placeholder: 'sk-or-...',
				description: 'Your OpenRouter API key'
			}
		]
	},
	{
		id: 'apicore',
		name: 'APICore.ai',
		description: 'Unified API access to multiple AI providers',
		category: 'llm',
		baseUrl: 'https://api.apicore.ai/v1',
		authType: 'bearer',
		keyFormat: 'ac-...',
		testEndpoint: '/models',
		documentation: 'https://docs.apicore.ai',
		icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
		color: 'teal',
		fields: [
			{
				key: 'apiKey',
				label: 'API Key',
				type: 'password',
				required: true,
				placeholder: 'ac-...',
				description: 'Your APICore.ai API key'
			}
		]
	},
	// 搜索增强 API 平台
	{
		id: 'serper',
		name: 'Serper.dev',
		description: 'Google Search API for developers',
		category: 'search',
		baseUrl: 'https://google.serper.dev',
		authType: 'api-key',
		keyFormat: 'sk-...',
		testEndpoint: '/search',
		documentation: 'https://serper.dev/docs',
		icon: 'M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM13.5 10.5a3 3 0 11-6 0 3 3 0 016 0z',
		color: 'blue',
		fields: [
			{
				key: 'apiKey',
				label: 'API Key',
				type: 'password',
				required: true,
				placeholder: 'sk-...',
				description: 'Your Serper.dev API key'
			}
		]
	},
	{
		id: 'searchapi',
		name: 'SearchApi.io',
		description: 'Real-time search results API',
		category: 'search',
		baseUrl: 'https://www.searchapi.io/api/v1',
		authType: 'api-key',
		keyFormat: 'sk-...',
		testEndpoint: '/search',
		documentation: 'https://www.searchapi.io/docs',
		icon: 'M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM13.5 10.5a3 3 0 11-6 0 3 3 0 016 0z',
		color: 'green',
		fields: [
			{
				key: 'apiKey',
				label: 'API Key',
				type: 'password',
				required: true,
				placeholder: 'sk-...',
				description: 'Your SearchApi.io API key'
			}
		]
	},
	{
		id: 'brave-search',
		name: 'Brave Search API',
		description: 'Independent search results from Brave',
		category: 'search',
		baseUrl: 'https://api.search.brave.com/res/v1',
		authType: 'api-key',
		keyFormat: 'BSA...',
		testEndpoint: '/web/search',
		documentation: 'https://brave.com/search/api/',
		icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
		color: 'orange',
		fields: [
			{
				key: 'apiKey',
				label: 'API Key',
				type: 'password',
				required: true,
				placeholder: 'BSA...',
				description: 'Your Brave Search API key'
			}
		]
	}
];

// 按类别分组
export function getProvidersByCategory() {
	return API_PROVIDERS.reduce((acc, provider) => {
		if (!acc[provider.category]) {
			acc[provider.category] = [];
		}
		acc[provider.category].push(provider);
		return acc;
	}, {} as Record<string, ApiProvider[]>);
}

// 获取提供商配置
export function getProviderById(id: string): ApiProvider | undefined {
	return API_PROVIDERS.find(provider => provider.id === id);
}

// API 类别定义
export const API_CATEGORIES = {
	llm: {
		name: 'AI 语言模型',
		description: '通用人工智能语言模型服务，支持文本生成、对话和推理'
	},
	search: {
		name: '搜索增强',
		description: '搜索引擎API服务，提供实时搜索结果和网络信息检索'
	},
	image: {
		name: '图像生成',
		description: '图像生成和处理服务，支持AI绘画和图像编辑'
	},
	audio: {
		name: '音频处理',
		description: '音频生成和处理服务，支持语音合成和音频分析'
	},
	video: {
		name: '视频处理',
		description: '视频生成和处理服务，支持视频编辑和动画制作'
	},
	traditional: {
		name: '传统API',
		description: '传统的API服务和第三方集成'
	}
} as const;

// 类别标签（保持向后兼容）
export const CATEGORY_LABELS = {
	llm: 'Language Models',
	image: 'Image Generation',
	audio: 'Audio Processing',
	video: 'Video Processing',
	search: 'Search Enhancement',
	traditional: 'Traditional APIs'
};
