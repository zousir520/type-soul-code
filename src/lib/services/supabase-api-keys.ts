import { createClient } from '@supabase/supabase-js';
import { 
	encryptApiKeyFields, 
	decryptApiKeyFields, 
	generateSecureId,
	createKeyFingerprint,
	validateKeyFormat
} from './encryption';
import type { ApiKeyConfig, ApiKeyCreateRequest, ApiKeyUpdateRequest } from '$lib/types/api-keys';

// Supabase 客户端 - 使用环境变量，如果未配置则为 null
const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// 检查是否配置了有效的 Supabase 环境变量
const isValidSupabaseConfig = supabaseUrl &&
  supabaseServiceKey &&
  supabaseUrl.includes('supabase.co') &&
  supabaseUrl !== 'your-supabase-url' &&
  supabaseServiceKey !== 'your-service-key';

const supabase = isValidSupabaseConfig ? createClient(supabaseUrl, supabaseServiceKey) : null;

// 数据库中的 API Key 记录
interface DbApiKey {
	id: string;
	user_id: string;
	provider_id: string;
	name: string;
	description?: string;
	encrypted_fields: string;
	salt: string;
	iv: string;
	tag: string;
	is_active: boolean;
	created_at: string;
	updated_at: string;
	last_used?: string;
	usage_count: number;
}

// 转换数据库记录为 API Key 配置
function dbToApiKey(dbKey: DbApiKey, userId: string): ApiKeyConfig {
	const fields = decryptApiKeyFields(
		dbKey.encrypted_fields,
		dbKey.salt,
		dbKey.iv,
		dbKey.tag,
		userId
	);

	return {
		id: dbKey.id,
		providerId: dbKey.provider_id,
		name: dbKey.name,
		description: dbKey.description,
		fields,
		isActive: dbKey.is_active,
		createdAt: dbKey.created_at,
		updatedAt: dbKey.updated_at,
		lastUsed: dbKey.last_used,
		usageCount: dbKey.usage_count
	};
}

// 获取用户的所有 API Keys
export async function getUserApiKeys(userId: string): Promise<ApiKeyConfig[]> {
	if (!supabase) {
		console.warn('Supabase not configured, returning empty API keys list');
		return [];
	}

	try {
		const { data, error } = await supabase
			.from('api_keys')
			.select('*')
			.eq('user_id', userId)
			.order('created_at', { ascending: false });

		if (error) {
			throw new Error(`Failed to fetch API keys: ${error.message}`);
		}

		return data.map(dbKey => dbToApiKey(dbKey, userId));
	} catch (error) {
		console.error('Error fetching user API keys:', error);
		throw error;
	}
}

// 创建新的 API Key
export async function createUserApiKey(
	userId: string,
	request: ApiKeyCreateRequest
): Promise<ApiKeyConfig> {
	if (!supabase) {
		throw new Error('Supabase not configured');
	}

	try {
		// 验证密钥格式
		const provider = await import('$lib/config/api-providers').then(m => 
			m.getProviderById(request.providerId)
		);
		
		if (provider && provider.keyFormat && request.fields.apiKey) {
			if (!validateKeyFormat(request.fields.apiKey, provider.keyFormat)) {
				throw new Error(`Invalid API key format. Expected format: ${provider.keyFormat}`);
			}
		}

		// 加密字段
		const { encryptedFields, salt, iv, tag } = encryptApiKeyFields(request.fields, userId);

		// 插入数据库
		const { data, error } = await supabase
			.from('api_keys')
			.insert({
				id: generateSecureId(),
				user_id: userId,
				provider_id: request.providerId,
				name: request.name,
				description: request.description,
				encrypted_fields: encryptedFields,
				salt,
				iv,
				tag,
				is_active: true,
				usage_count: 0
			})
			.select()
			.single();

		if (error) {
			throw new Error(`Failed to create API key: ${error.message}`);
		}

		return dbToApiKey(data, userId);
	} catch (error) {
		console.error('Error creating API key:', error);
		throw error;
	}
}

// 更新 API Key
export async function updateUserApiKey(
	userId: string,
	keyId: string,
	request: ApiKeyUpdateRequest
): Promise<ApiKeyConfig | null> {
	if (!supabase) {
		throw new Error('Supabase not configured');
	}

	try {
		const updateData: any = {};

		if (request.name !== undefined) updateData.name = request.name;
		if (request.description !== undefined) updateData.description = request.description;
		if (request.isActive !== undefined) updateData.is_active = request.isActive;

		// 如果更新字段，需要重新加密
		if (request.fields) {
			const { encryptedFields, salt, iv, tag } = encryptApiKeyFields(request.fields, userId);
			updateData.encrypted_fields = encryptedFields;
			updateData.salt = salt;
			updateData.iv = iv;
			updateData.tag = tag;
		}

		const { data, error } = await supabase
			.from('api_keys')
			.update(updateData)
			.eq('id', keyId)
			.eq('user_id', userId)
			.select()
			.single();

		if (error) {
			if (error.code === 'PGRST116') {
				return null; // 记录不存在
			}
			throw new Error(`Failed to update API key: ${error.message}`);
		}

		return dbToApiKey(data, userId);
	} catch (error) {
		console.error('Error updating API key:', error);
		throw error;
	}
}

// 删除 API Key
export async function deleteUserApiKey(userId: string, keyId: string): Promise<boolean> {
	if (!supabase) {
		throw new Error('Supabase not configured');
	}

	try {
		const { error } = await supabase
			.from('api_keys')
			.delete()
			.eq('id', keyId)
			.eq('user_id', userId);

		if (error) {
			throw new Error(`Failed to delete API key: ${error.message}`);
		}

		return true;
	} catch (error) {
		console.error('Error deleting API key:', error);
		return false;
	}
}

// 获取单个 API Key
export async function getUserApiKey(userId: string, keyId: string): Promise<ApiKeyConfig | null> {
	if (!supabase) {
		console.warn('Supabase not configured, returning null');
		return null;
	}

	try {
		const { data, error } = await supabase
			.from('api_keys')
			.select('*')
			.eq('id', keyId)
			.eq('user_id', userId)
			.single();

		if (error) {
			if (error.code === 'PGRST116') {
				return null; // 记录不存在
			}
			throw new Error(`Failed to fetch API key: ${error.message}`);
		}

		return dbToApiKey(data, userId);
	} catch (error) {
		console.error('Error fetching API key:', error);
		throw error;
	}
}

// 获取活跃的 API Key（用于实际调用）
export async function getActiveUserApiKey(
	userId: string,
	providerId: string
): Promise<ApiKeyConfig | null> {
	if (!supabase) {
		console.warn('Supabase not configured, returning null');
		return null;
	}

	try {
		const { data, error } = await supabase
			.from('api_keys')
			.select('*')
			.eq('user_id', userId)
			.eq('provider_id', providerId)
			.eq('is_active', true)
			.order('created_at', { ascending: false })
			.limit(1)
			.single();

		if (error) {
			if (error.code === 'PGRST116') {
				return null; // 没有找到活跃的密钥
			}
			throw new Error(`Failed to fetch active API key: ${error.message}`);
		}

		return dbToApiKey(data, userId);
	} catch (error) {
		console.error('Error fetching active API key:', error);
		return null;
	}
}

// 更新使用统计
export async function updateApiKeyUsage(
	userId: string,
	keyId: string,
	stats?: {
		endpoint?: string;
		method?: string;
		statusCode?: number;
		responseTimeMs?: number;
		tokensUsed?: number;
		costUsd?: number;
	}
): Promise<void> {
	if (!supabase) {
		console.warn('Supabase not configured, skipping usage update');
		return;
	}

	try {
		// 更新 API Key 的使用计数和最后使用时间
		await supabase
			.from('api_keys')
			.update({
				last_used: new Date().toISOString(),
				usage_count: supabase.rpc('increment_usage_count', { key_id: keyId })
			})
			.eq('id', keyId)
			.eq('user_id', userId);

		// 如果提供了详细统计，插入使用记录
		if (stats) {
			await supabase
				.from('api_usage_stats')
				.insert({
					api_key_id: keyId,
					provider_id: (await getUserApiKey(userId, keyId))?.providerId,
					endpoint: stats.endpoint,
					method: stats.method,
					status_code: stats.statusCode,
					response_time_ms: stats.responseTimeMs,
					tokens_used: stats.tokensUsed,
					cost_usd: stats.costUsd
				});
		}
	} catch (error) {
		console.error('Error updating API key usage:', error);
		// 不抛出错误，因为这不应该影响主要功能
	}
}

// 获取 API Key 使用统计
export async function getApiKeyUsageStats(
	userId: string,
	keyId?: string,
	providerId?: string,
	days: number = 30
): Promise<any[]> {
	if (!supabase) {
		console.warn('Supabase not configured, returning empty usage stats');
		return [];
	}

	try {
		let query = supabase
			.from('api_usage_stats')
			.select(`
				*,
				api_keys!inner(user_id, provider_id, name)
			`)
			.eq('api_keys.user_id', userId)
			.gte('created_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString());

		if (keyId) {
			query = query.eq('api_key_id', keyId);
		}

		if (providerId) {
			query = query.eq('provider_id', providerId);
		}

		const { data, error } = await query.order('created_at', { ascending: false });

		if (error) {
			throw new Error(`Failed to fetch usage stats: ${error.message}`);
		}

		return data || [];
	} catch (error) {
		console.error('Error fetching usage stats:', error);
		return [];
	}
}

// 验证用户权限
export async function verifyUserAccess(userId: string, keyId: string): Promise<boolean> {
	if (!supabase) {
		console.warn('Supabase not configured, returning false');
		return false;
	}

	try {
		const { data, error } = await supabase
			.from('api_keys')
			.select('id')
			.eq('id', keyId)
			.eq('user_id', userId)
			.single();

		return !error && !!data;
	} catch {
		return false;
	}
}
