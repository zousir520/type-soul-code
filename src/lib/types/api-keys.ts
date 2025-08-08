export interface ApiKeyConfig {
	id: string;
	providerId: string;
	name: string; // 用户自定义名称
	description?: string;
	fields: Record<string, string>; // 存储各种配置字段
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
	lastUsed?: string;
	usageCount?: number;
}

export interface ApiKeyCreateRequest {
	providerId: string;
	name: string;
	description?: string;
	fields: Record<string, string>;
}

export interface ApiKeyUpdateRequest {
	name?: string;
	description?: string;
	fields?: Record<string, string>;
	isActive?: boolean;
}

export interface ApiKeyTestResult {
	success: boolean;
	message: string;
	responseTime?: number;
	details?: any;
}

// API 使用统计
export interface ApiUsageStats {
	providerId: string;
	totalRequests: number;
	successfulRequests: number;
	failedRequests: number;
	lastRequest?: string;
	averageResponseTime?: number;
}
