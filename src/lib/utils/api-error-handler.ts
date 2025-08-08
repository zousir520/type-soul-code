import { json } from '@sveltejs/kit';
import type { NumericRange } from '@sveltejs/kit';

// 标准化API响应接口
export interface ApiResponse<T = unknown> {
	success: boolean;
	data?: T;
	error?: string;
	message?: string;
	code?: string;
	timestamp?: string;
	source?: string;
}

// 错误类型枚举
export enum ApiErrorType {
	VALIDATION_ERROR = 'VALIDATION_ERROR',
	NOT_FOUND = 'NOT_FOUND',
	UNAUTHORIZED = 'UNAUTHORIZED',
	FORBIDDEN = 'FORBIDDEN',
	INTERNAL_ERROR = 'INTERNAL_ERROR',
	DATABASE_ERROR = 'DATABASE_ERROR',
	FILE_ERROR = 'FILE_ERROR',
	NETWORK_ERROR = 'NETWORK_ERROR',
	RATE_LIMIT = 'RATE_LIMIT'
}

// 自定义API错误类
export class ApiError extends Error {
	public readonly type: ApiErrorType;
	public readonly statusCode: NumericRange<400, 599>;
	public readonly code: string;
	public readonly details?: unknown;

	constructor(
		message: string,
		type: ApiErrorType,
		statusCode: NumericRange<400, 599> = 500,
		code?: string,
		details?: unknown
	) {
		super(message);
		this.name = 'ApiError';
		this.type = type;
		this.statusCode = statusCode;
		this.code = code || type;
		this.details = details;
	}
}

// 预定义的常用错误
export const ApiErrors = {
	ValidationError: (message: string, details?: unknown) =>
		new ApiError(message, ApiErrorType.VALIDATION_ERROR, 400, 'VALIDATION_ERROR', details),
	
	NotFound: (resource: string) =>
		new ApiError(`${resource} not found`, ApiErrorType.NOT_FOUND, 404, 'NOT_FOUND'),
	
	Unauthorized: (message = 'Unauthorized access') =>
		new ApiError(message, ApiErrorType.UNAUTHORIZED, 401, 'UNAUTHORIZED'),
	
	Forbidden: (message = 'Access forbidden') =>
		new ApiError(message, ApiErrorType.FORBIDDEN, 403, 'FORBIDDEN'),
	
	InternalError: (message = 'Internal server error', details?: unknown) =>
		new ApiError(message, ApiErrorType.INTERNAL_ERROR, 500, 'INTERNAL_ERROR', details),
	
	DatabaseError: (message = 'Database operation failed', details?: unknown) =>
		new ApiError(message, ApiErrorType.DATABASE_ERROR, 500, 'DATABASE_ERROR', details),
	
	FileError: (message = 'File operation failed', details?: unknown) =>
		new ApiError(message, ApiErrorType.FILE_ERROR, 500, 'FILE_ERROR', details),
	
	NetworkError: (message = 'Network operation failed', details?: unknown) =>
		new ApiError(message, ApiErrorType.NETWORK_ERROR, 500, 'NETWORK_ERROR', details),
	
	RateLimit: (message = 'Rate limit exceeded') =>
		new ApiError(message, ApiErrorType.RATE_LIMIT, 429, 'RATE_LIMIT')
};

// 统一的错误处理函数
export function handleApiError(error: unknown, source?: string): Response {
	const timestamp = new Date().toISOString();
	
	// 如果是我们的自定义错误
	if (error instanceof ApiError) {
		console.error(`[API Error] ${source || 'Unknown'}: ${error.message}`, {
			type: error.type,
			code: error.code,
			details: error.details,
			timestamp
		});

		const response: ApiResponse = {
			success: false,
			error: error.message,
			code: error.code,
			timestamp,
			source
		};

		return json(response, { status: error.statusCode });
	}

	// 如果是普通错误对象
	if (error instanceof Error) {
		console.error(`[Unexpected Error] ${source || 'Unknown'}: ${error.message}`, {
			stack: error.stack,
			timestamp
		});

		const response: ApiResponse = {
			success: false,
			error: 'Internal server error',
			code: 'INTERNAL_ERROR',
			message: process.env.NODE_ENV === 'development' ? error.message : undefined,
			timestamp,
			source
		};

		return json(response, { status: 500 });
	}

	// 未知错误类型
	console.error(`[Unknown Error] ${source || 'Unknown'}:`, error, { timestamp });

	const response: ApiResponse = {
		success: false,
		error: 'Unknown error occurred',
		code: 'UNKNOWN_ERROR',
		timestamp,
		source
	};

	return json(response, { status: 500 });
}

// 成功响应工具函数
export function successResponse<T>(
	data: T,
	message?: string,
	source?: string
): Response {
	const response: ApiResponse<T> = {
		success: true,
		data,
		message,
		timestamp: new Date().toISOString(),
		source
	};

	return json(response);
}

// 请求验证工具函数
export function validateRequest(
	data: unknown,
	requiredFields: string[]
): asserts data is Record<string, unknown> {
	if (!data || typeof data !== 'object') {
		throw ApiErrors.ValidationError('Invalid request data');
	}

	const missingFields = requiredFields.filter(
		field => !(field in (data as Record<string, unknown>))
	);

	if (missingFields.length > 0) {
		throw ApiErrors.ValidationError(
			`Missing required fields: ${missingFields.join(', ')}`,
			{ missingFields, receivedData: data }
		);
	}
}

// 安全的异步操作包装器
export async function safeAsync<T>(
	operation: () => Promise<T>,
	errorMessage?: string,
	errorType: ApiErrorType = ApiErrorType.INTERNAL_ERROR
): Promise<T> {
	try {
		return await operation();
	} catch (error) {
		if (error instanceof ApiError) {
			throw error;
		}
		throw new ApiError(
			errorMessage || 'Operation failed',
			errorType,
			500,
			errorType,
			error
		);
	}
}