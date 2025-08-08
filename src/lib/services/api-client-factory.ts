import { getActiveApiKey, updateUsageStats, decryptApiKeyFields } from './api-keys';
import { getProviderById, type ApiProvider } from '$lib/config/api-providers';
import type { ApiKeyConfig } from '$lib/types/api-keys';
import type {
	ApiResponse,
	LLMRequest as BaseLLMRequest,
	LLMResponse,
	OpenAIResponse,
	AnthropicResponse,
	ModelsResponse,
	TestConnectionResponse
} from '$lib/types/api-responses';

// 重新导出类型以供其他模块使用
export type { ApiResponse } from '$lib/types/api-responses';

// 通用 API 客户端接口
export interface ApiClient {
	providerId: string;
	baseUrl: string;
	headers: Record<string, string>;
	makeRequest<T = unknown>(endpoint: string, options?: RequestInit): Promise<T>;
}

// 创建 API 客户端
export async function createApiClient(providerId: string): Promise<ApiClient | null> {
	try {
		// 获取活跃的 API Key
		const apiKey = await getActiveApiKey(providerId);
		if (!apiKey) {
			throw new Error(`No active API key found for provider: ${providerId}`);
		}

		// 获取提供商配置
		const provider = getProviderById(providerId);
		if (!provider) {
			throw new Error(`Unknown provider: ${providerId}`);
		}

		// 解密 API Key 字段
		const decryptedKey = decryptApiKeyFields(apiKey);

		// 构建认证头
		const headers = buildAuthHeaders(provider.authType, decryptedKey, provider);

		// 创建客户端
		const client: ApiClient = {
			providerId,
			baseUrl: provider.baseUrl || '',
			headers,
			makeRequest: async <T = unknown>(endpoint: string, options: RequestInit = {}): Promise<T> => {
				return makeApiRequest<T>(client, endpoint, options, apiKey.id);
			}
		};

		return client;
	} catch (error) {
		console.error(`Error creating API client for ${providerId}:`, error);
		return null;
	}
}

// 构建认证头
function buildAuthHeaders(
	authType: string,
	apiKey: ApiKeyConfig,
	provider: ApiProvider
): Record<string, string> {
	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
		'User-Agent': 'tenniszero.org/1.0'
	};

	switch (authType) {
		case 'bearer':
			if (apiKey.fields.apiKey) {
				headers['Authorization'] = `Bearer ${apiKey.fields.apiKey}`;
			}
			break;

		case 'api-key':
			if (apiKey.fields.apiKey) {
				headers['Authorization'] = `Bearer ${apiKey.fields.apiKey}`;
			}
			break;

		case 'custom':
			// 处理自定义认证方式
			switch (provider.id) {
				case 'openrouter':
					if (apiKey.fields.apiKey) {
						headers['Authorization'] = `Bearer ${apiKey.fields.apiKey}`;
					}
					if (apiKey.fields.siteName) {
						headers['HTTP-Referer'] = apiKey.fields.siteUrl || 'https://tenniszero.org';
						headers['X-Title'] = apiKey.fields.siteName;
					}
					break;

				case 'fal':
					if (apiKey.fields.apiKey) {
						headers['Authorization'] = `Key ${apiKey.fields.apiKey}`;
					}
					break;

				case 'apicore':
					if (apiKey.fields.apiKey) {
						headers['Authorization'] = `Bearer ${apiKey.fields.apiKey}`;
					}
					if (apiKey.fields.organization) {
						headers['OpenAI-Organization'] = apiKey.fields.organization;
					}
					break;
			}
			break;
	}

	return headers;
}

// 执行 API 请求
async function makeApiRequest<T = unknown>(
	client: ApiClient,
	endpoint: string,
	options: RequestInit,
	keyId: string
): Promise<T> {
	const url = endpoint.startsWith('http') ? endpoint : `${client.baseUrl}${endpoint}`;
	
	const requestOptions: RequestInit = {
		...options,
		headers: {
			...client.headers,
			...options.headers
		}
	};

	try {
		const startTime = Date.now();
		const response = await fetch(url, requestOptions);
		const responseTime = Date.now() - startTime;

		// 更新使用统计
		await updateUsageStats(keyId);

		if (!response.ok) {
			const errorText = await response.text();
			throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`);
		}

		const data = await response.json();
		
		// 记录成功的请求
		console.log(`API request to ${client.providerId} completed in ${responseTime}ms`);
		
		return data;
	} catch (error) {
		console.error(`API request to ${client.providerId} failed:`, error);
		throw error;
	}
}

// 测试 API 连接
export async function testApiConnection(providerId: string): Promise<ApiResponse<unknown>> {
	try {
		const client = await createApiClient(providerId);
		if (!client) {
			return {
				success: false,
				error: 'Failed to create API client'
			};
		}

		const provider = getProviderById(providerId);
		if (!provider?.testEndpoint) {
			return {
				success: false,
				error: 'No test endpoint configured for this provider'
			};
		}

		// 执行测试请求
		const startTime = Date.now();
		const result = await client.makeRequest(provider.testEndpoint);
		const responseTime = Date.now() - startTime;

		return {
			success: true,
			data: result,
			usage: {
				totalTokens: 0 // 测试请求不计入使用量
			}
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Unknown error'
		};
	}
}

// 通用 LLM 请求接口
export interface LLMRequest {
	model: string;
	messages: Array<{
		role: 'system' | 'user' | 'assistant';
		content: string;
	}>;
	temperature?: number;
	maxTokens?: number;
	stream?: boolean;
}

// 统一的 LLM 调用接口
export async function callLLM(
	providerId: string,
	request: LLMRequest
): Promise<ApiResponse<unknown>> {
	try {
		const client = await createApiClient(providerId);
		if (!client) {
			return {
				success: false,
				error: 'Failed to create API client'
			};
		}

		// 根据不同提供商转换请求格式
		const transformedRequest = transformLLMRequest(providerId, request);
		
		const result = await client.makeRequest('/chat/completions', {
			method: 'POST',
			body: JSON.stringify(transformedRequest)
		});

		return {
			success: true,
			data: result
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Unknown error'
		};
	}
}

// 转换 LLM 请求格式
function transformLLMRequest(providerId: string, request: LLMRequest): Record<string, unknown> {
	const baseRequest = {
		model: request.model,
		messages: request.messages,
		temperature: request.temperature || 0.7,
		stream: request.stream || false
	};

	switch (providerId) {
		case 'openai':
			return {
				...baseRequest,
				max_tokens: request.maxTokens
			};

		case 'openrouter':
			return {
				...baseRequest,
				max_tokens: request.maxTokens
			};

		case 'deepseek':
			return {
				...baseRequest,
				max_tokens: request.maxTokens
			};

		case 'apicore':
			return {
				...baseRequest,
				max_tokens: request.maxTokens,
				// APICore.ai 支持 OpenAI 兼容格式
				top_p: 1,
				frequency_penalty: 0,
				presence_penalty: 0
			};

		case 'anthropic':
			return {
				model: request.model,
				max_tokens: request.maxTokens || 1000,
				messages: request.messages
			};

		default:
			return baseRequest;
	}
}
