import { createApiClient, type LLMRequest, type ApiResponse } from './api-client-factory';

// APICore.ai 特定的模型列表
export const APICORE_MODELS = {
	// OpenAI Models
	'gpt-4o': { name: 'GPT-4o', provider: 'OpenAI', category: 'chat' },
	'gpt-4o-mini': { name: 'GPT-4o Mini', provider: 'OpenAI', category: 'chat' },
	'gpt-4-turbo': { name: 'GPT-4 Turbo', provider: 'OpenAI', category: 'chat' },
	'gpt-3.5-turbo': { name: 'GPT-3.5 Turbo', provider: 'OpenAI', category: 'chat' },
	
	// Anthropic Models
	'claude-3-5-sonnet-20241022': { name: 'Claude 3.5 Sonnet', provider: 'Anthropic', category: 'chat' },
	'claude-3-haiku-20240307': { name: 'Claude 3 Haiku', provider: 'Anthropic', category: 'chat' },
	'claude-3-opus-20240229': { name: 'Claude 3 Opus', provider: 'Anthropic', category: 'chat' },
	
	// Google Models
	'gemini-1.5-pro': { name: 'Gemini 1.5 Pro', provider: 'Google', category: 'chat' },
	'gemini-1.5-flash': { name: 'Gemini 1.5 Flash', provider: 'Google', category: 'chat' },
	
	// Meta Models
	'llama-3.1-405b-instruct': { name: 'Llama 3.1 405B Instruct', provider: 'Meta', category: 'chat' },
	'llama-3.1-70b-instruct': { name: 'Llama 3.1 70B Instruct', provider: 'Meta', category: 'chat' },
	'llama-3.1-8b-instruct': { name: 'Llama 3.1 8B Instruct', provider: 'Meta', category: 'chat' },
	
	// Mistral Models
	'mistral-large-2407': { name: 'Mistral Large', provider: 'Mistral', category: 'chat' },
	'mistral-nemo': { name: 'Mistral Nemo', provider: 'Mistral', category: 'chat' },
	
	// Other Models
	'qwen2.5-72b-instruct': { name: 'Qwen 2.5 72B', provider: 'Alibaba', category: 'chat' },
	'deepseek-chat': { name: 'DeepSeek Chat', provider: 'DeepSeek', category: 'chat' }
} as const;

export type ApicoreModel = keyof typeof APICORE_MODELS;

// APICore.ai 特定的请求接口
export interface ApicoreRequest extends LLMRequest {
	model: ApicoreModel;
	top_p?: number;
	frequency_penalty?: number;
	presence_penalty?: number;
	stop?: string | string[];
	user?: string;
}

// APICore.ai 响应接口
export interface ApicoreResponse {
	id: string;
	object: string;
	created: number;
	model: string;
	choices: Array<{
		index: number;
		message: {
			role: string;
			content: string;
		};
		finish_reason: string;
	}>;
	usage: {
		prompt_tokens: number;
		completion_tokens: number;
		total_tokens: number;
	};
}

// 获取可用模型列表
export async function getApicoreModels(): Promise<ApiResponse<unknown>> {
	try {
		const client = await createApiClient('apicore');
		if (!client) {
			return {
				success: false,
				error: 'Failed to create APICore.ai client'
			};
		}

		const result = await client.makeRequest('/models');
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

// 调用 APICore.ai 聊天完成
export async function callApicoreChat(request: ApicoreRequest): Promise<ApiResponse<ApicoreResponse>> {
	try {
		const client = await createApiClient('apicore');
		if (!client) {
			return {
				success: false,
				error: 'Failed to create APICore.ai client'
			};
		}

		const requestBody = {
			model: request.model,
			messages: request.messages,
			temperature: request.temperature || 0.7,
			max_tokens: request.maxTokens || 1000,
			top_p: request.top_p || 1,
			frequency_penalty: request.frequency_penalty || 0,
			presence_penalty: request.presence_penalty || 0,
			stream: request.stream || false,
			...(request.stop && { stop: request.stop }),
			...(request.user && { user: request.user })
		};

		const result = await client.makeRequest<ApicoreResponse>('/chat/completions', {
			method: 'POST',
			body: JSON.stringify(requestBody)
		});

		return {
			success: true,
			data: result,
			usage: result.usage ? {
				promptTokens: result.usage.prompt_tokens,
				completionTokens: result.usage.completion_tokens,
				totalTokens: result.usage.total_tokens
			} : undefined
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Unknown error'
		};
	}
}

// 流式聊天完成
export async function callApicoreChatStream(
	request: ApicoreRequest,
	onChunk: (chunk: string) => void,
	onComplete: (response: ApicoreResponse) => void,
	onError: (error: string) => void
): Promise<void> {
	try {
		const client = await createApiClient('apicore');
		if (!client) {
			onError('Failed to create APICore.ai client');
			return;
		}

		const requestBody = {
			...request,
			stream: true
		};

		const response = await fetch(`${client.baseUrl}/chat/completions`, {
			method: 'POST',
			headers: client.headers,
			body: JSON.stringify(requestBody)
		});

		if (!response.ok) {
			throw new Error(`HTTP ${response.status}: ${response.statusText}`);
		}

		const reader = response.body?.getReader();
		if (!reader) {
			throw new Error('No response body');
		}

		const decoder = new TextDecoder();
		let buffer = '';

		while (true) {
			const { done, value } = await reader.read();
			if (done) break;

			buffer += decoder.decode(value, { stream: true });
			const lines = buffer.split('\n');
			buffer = lines.pop() || '';

			for (const line of lines) {
				if (line.startsWith('data: ')) {
					const data = line.slice(6);
					if (data === '[DONE]') {
						return;
					}

					try {
						const parsed = JSON.parse(data);
						const content = parsed.choices?.[0]?.delta?.content;
						if (content) {
							onChunk(content);
						}

						if (parsed.choices?.[0]?.finish_reason) {
							onComplete(parsed);
						}
					} catch (e) {
						// 忽略解析错误
					}
				}
			}
		}
	} catch (error) {
		onError(error instanceof Error ? error.message : 'Unknown error');
	}
}

// 获取模型信息
export function getModelInfo(model: ApicoreModel) {
	return APICORE_MODELS[model];
}

// 按提供商分组模型
export function getModelsByProvider() {
	const grouped: Record<string, Array<{ id: ApicoreModel; info: typeof APICORE_MODELS[ApicoreModel] }>> = {};
	
	for (const [id, info] of Object.entries(APICORE_MODELS)) {
		if (!grouped[info.provider]) {
			grouped[info.provider] = [];
		}
		grouped[info.provider].push({ id: id as ApicoreModel, info });
	}
	
	return grouped;
}

// 估算 token 数量（简单实现）
export function estimateTokens(text: string): number {
	// 简单的 token 估算：大约 4 个字符 = 1 个 token
	return Math.ceil(text.length / 4);
}

// 计算请求成本（需要根据 APICore.ai 的定价更新）
export function estimateCost(model: ApicoreModel, promptTokens: number, completionTokens: number): number {
	// 这里需要根据 APICore.ai 的实际定价来计算
	// 目前使用示例价格
	const pricing: Record<string, { input: number; output: number }> = {
		'gpt-4o': { input: 0.005, output: 0.015 },
		'gpt-4o-mini': { input: 0.00015, output: 0.0006 },
		'gpt-4-turbo': { input: 0.01, output: 0.03 },
		'gpt-3.5-turbo': { input: 0.0005, output: 0.0015 },
		'claude-3-5-sonnet-20241022': { input: 0.003, output: 0.015 },
		'claude-3-haiku-20240307': { input: 0.00025, output: 0.00125 },
		'gemini-1.5-pro': { input: 0.0035, output: 0.0105 },
		'gemini-1.5-flash': { input: 0.000075, output: 0.0003 },
		'llama-3.1-405b-instruct': { input: 0.003, output: 0.003 },
		'llama-3.1-70b-instruct': { input: 0.0009, output: 0.0009 },
		'llama-3.1-8b-instruct': { input: 0.0002, output: 0.0002 }
	};

	const modelPricing = pricing[model];
	if (!modelPricing) {
		return 0;
	}

	const inputCost = (promptTokens / 1000) * modelPricing.input;
	const outputCost = (completionTokens / 1000) * modelPricing.output;
	
	return inputCost + outputCost;
}
