// API 响应相关类型定义

// 通用API响应接口
export interface ApiResponse<T = unknown> {
	success: boolean;
	data?: T;
	error?: string;
	usage?: ApiUsage;
}

// API使用统计
export interface ApiUsage {
	promptTokens?: number;
	completionTokens?: number;
	totalTokens?: number;
}

// LLM消息类型
export interface LLMMessage {
	role: 'system' | 'user' | 'assistant';
	content: string;
}

// LLM请求接口
export interface LLMRequest {
	model: string;
	messages: LLMMessage[];
	temperature?: number;
	maxTokens?: number;
	stream?: boolean;
}

// LLM响应接口
export interface LLMResponse {
	id: string;
	object: string;
	created: number;
	model: string;
	choices: LLMChoice[];
	usage?: ApiUsage;
}

export interface LLMChoice {
	index: number;
	message: LLMMessage;
	finish_reason: string;
}

// OpenAI风格的响应
export interface OpenAIResponse {
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
	usage?: {
		prompt_tokens: number;
		completion_tokens: number;
		total_tokens: number;
	};
}

// Anthropic风格的响应
export interface AnthropicResponse {
	id: string;
	type: string;
	role: string;
	content: Array<{
		type: string;
		text: string;
	}>;
	model: string;
	stop_reason: string;
	stop_sequence: null;
	usage: {
		input_tokens: number;
		output_tokens: number;
	};
}

// 模型列表响应
export interface ModelsResponse {
	object: string;
	data: ModelInfo[];
}

export interface ModelInfo {
	id: string;
	object: string;
	created: number;
	owned_by: string;
}

// 测试连接响应
export interface TestConnectionResponse {
	success: boolean;
	responseTime?: number;
	error?: string;
	data?: unknown;
}

// 请求配置类型
export interface RequestConfig extends RequestInit {
	timeout?: number;
	retries?: number;
}