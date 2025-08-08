import type { ApiKeyConfig, ApiKeyCreateRequest, ApiKeyUpdateRequest } from '$lib/types/api-keys';

// 环境检测
const isNodeEnvironment = typeof process !== 'undefined' && process.cwd;

// 动态导入文件系统模块
async function getFileSystemModules() {
	if (!isNodeEnvironment) {
		throw new Error('文件系统操作在当前环境中不支持');
	}
	
	// 使用更复杂的字符串构建来避免构建时静态分析
	const fsModuleName = ['fs', 'promises'].join('/');
	const pathModuleName = 'path';
	const cryptoModuleName = 'crypto';
	
	const { readFile, writeFile, mkdir } = await import(/* @vite-ignore */ fsModuleName);
	const { join } = await import(/* @vite-ignore */ pathModuleName);
	const { randomUUID } = await import(/* @vite-ignore */ cryptoModuleName);
	
	return { readFile, writeFile, mkdir, join, randomUUID };
}

// 生成UUID的替代方法（用于非Node环境）
function generateUUID(): string {
	// 简单的UUID v4生成器（用于非Node环境）
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		const r = Math.random() * 16 | 0;
		const v = c === 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	});
}

// 确保数据目录存在
async function ensureDataDir() {
	if (!isNodeEnvironment) {
		// 在非Node环境中，跳过目录创建
		return;
	}

	try {
		const { mkdir, join } = await getFileSystemModules();
		const API_KEYS_DIR = join(process.cwd(), 'data');
		await mkdir(API_KEYS_DIR, { recursive: true });
	} catch (error) {
		// 目录已存在，忽略错误
	}
}

// 读取所有 API Keys
export async function getAllApiKeys(): Promise<ApiKeyConfig[]> {
	if (!isNodeEnvironment) {
		// 在非Node环境中（如Cloudflare Workers），返回空数组
		console.warn('API密钥读取功能在当前环境中不可用');
		return [];
	}

	try {
		await ensureDataDir();
		const { readFile, join } = await getFileSystemModules();
		const API_KEYS_FILE = join(process.cwd(), 'data', 'api-keys.json');
		const content = await readFile(API_KEYS_FILE, 'utf-8');
		return JSON.parse(content);
	} catch (error) {
		// 文件不存在，返回空数组
		return [];
	}
}

// 保存 API Keys
async function saveApiKeys(apiKeys: ApiKeyConfig[]): Promise<void> {
	if (!isNodeEnvironment) {
		// 在非Node环境中（如Cloudflare Workers），抛出错误
		throw new Error('API密钥保存功能在当前环境中不可用');
	}

	await ensureDataDir();
	const { writeFile, join } = await getFileSystemModules();
	const API_KEYS_FILE = join(process.cwd(), 'data', 'api-keys.json');
	await writeFile(API_KEYS_FILE, JSON.stringify(apiKeys, null, 2), 'utf-8');
}

// 创建新的 API Key
export async function createApiKey(request: ApiKeyCreateRequest): Promise<ApiKeyConfig> {
	const apiKeys = await getAllApiKeys();
	
	// 生成UUID - 使用环境适配的方法
	let uuid: string;
	if (isNodeEnvironment) {
		try {
			const { randomUUID } = await getFileSystemModules();
			uuid = randomUUID();
		} catch {
			uuid = generateUUID();
		}
	} else {
		uuid = generateUUID();
	}
	
	const newApiKey: ApiKeyConfig = {
		id: uuid,
		providerId: request.providerId,
		name: request.name,
		description: request.description,
		fields: request.fields,
		isActive: true,
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
		usageCount: 0
	};
	
	apiKeys.push(newApiKey);
	await saveApiKeys(apiKeys);
	
	return newApiKey;
}

// 更新 API Key
export async function updateApiKey(id: string, request: ApiKeyUpdateRequest): Promise<ApiKeyConfig | null> {
	const apiKeys = await getAllApiKeys();
	const index = apiKeys.findIndex(key => key.id === id);
	
	if (index === -1) {
		return null;
	}
	
	const updatedApiKey = {
		...apiKeys[index],
		...request,
		updatedAt: new Date().toISOString()
	};
	
	apiKeys[index] = updatedApiKey;
	await saveApiKeys(apiKeys);
	
	return updatedApiKey;
}

// 删除 API Key
export async function deleteApiKey(id: string): Promise<boolean> {
	const apiKeys = await getAllApiKeys();
	const filteredKeys = apiKeys.filter(key => key.id !== id);
	
	if (filteredKeys.length === apiKeys.length) {
		return false; // 没有找到要删除的 key
	}
	
	await saveApiKeys(filteredKeys);
	return true;
}

// 获取单个 API Key
export async function getApiKeyById(id: string): Promise<ApiKeyConfig | null> {
	const apiKeys = await getAllApiKeys();
	return apiKeys.find(key => key.id === id) || null;
}

// 根据提供商获取 API Keys
export async function getApiKeysByProvider(providerId: string): Promise<ApiKeyConfig[]> {
	const apiKeys = await getAllApiKeys();
	return apiKeys.filter(key => key.providerId === providerId);
}

// 获取活跃的 API Key（用于实际 API 调用）
export async function getActiveApiKey(providerId: string): Promise<ApiKeyConfig | null> {
	const apiKeys = await getApiKeysByProvider(providerId);
	return apiKeys.find(key => key.isActive) || null;
}

// 更新使用统计
export async function updateUsageStats(id: string): Promise<void> {
	const apiKeys = await getAllApiKeys();
	const index = apiKeys.findIndex(key => key.id === id);
	
	if (index !== -1) {
		apiKeys[index].lastUsed = new Date().toISOString();
		apiKeys[index].usageCount = (apiKeys[index].usageCount || 0) + 1;
		await saveApiKeys(apiKeys);
	}
}

// 加密敏感字段（简单实现，生产环境应使用更强的加密）
function encryptField(value: string): string {
	// 这里应该使用真正的加密算法
	// 目前只是简单的 base64 编码作为示例
	return Buffer.from(value).toString('base64');
}

// 解密敏感字段
function decryptField(encryptedValue: string): string {
	try {
		return Buffer.from(encryptedValue, 'base64').toString('utf-8');
	} catch {
		return encryptedValue; // 如果解密失败，返回原值
	}
}

// 加密 API Key 配置中的敏感字段
export function encryptApiKeyFields(apiKey: ApiKeyConfig): ApiKeyConfig {
	const encryptedFields: Record<string, string> = {};
	
	for (const [key, value] of Object.entries(apiKey.fields)) {
		// 加密包含 'key', 'secret', 'token', 'password' 的字段
		if (key.toLowerCase().includes('key') || 
			key.toLowerCase().includes('secret') || 
			key.toLowerCase().includes('token') || 
			key.toLowerCase().includes('password')) {
			encryptedFields[key] = encryptField(value);
		} else {
			encryptedFields[key] = value;
		}
	}
	
	return {
		...apiKey,
		fields: encryptedFields
	};
}

// 解密 API Key 配置中的敏感字段
export function decryptApiKeyFields(apiKey: ApiKeyConfig): ApiKeyConfig {
	const decryptedFields: Record<string, string> = {};
	
	for (const [key, value] of Object.entries(apiKey.fields)) {
		if (key.toLowerCase().includes('key') || 
			key.toLowerCase().includes('secret') || 
			key.toLowerCase().includes('token') || 
			key.toLowerCase().includes('password')) {
			decryptedFields[key] = decryptField(value);
		} else {
			decryptedFields[key] = value;
		}
	}
	
	return {
		...apiKey,
		fields: decryptedFields
	};
}
