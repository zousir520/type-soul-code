import { createClient } from '@supabase/supabase-js';
import { encryptApiKeyFields } from '../services/encryption';
import type { ApiKeyConfig } from '../types/api-keys';

// 环境检测
const isNodeEnvironment = typeof process !== 'undefined' && process.cwd;

// 旧的本地存储格式
interface LegacyApiKey {
	id: string;
	providerId: string;
	name: string;
	description?: string;
	fields: Record<string, string>;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
	lastUsed?: string;
	usageCount?: number;
}

// 迁移脚本
export async function migrateApiKeysToSupabase(userId: string): Promise<{
	success: boolean;
	migratedCount: number;
	errors: string[];
}> {
	const errors: string[] = [];
	let migratedCount = 0;

	try {
		// 检查环境是否支持文件系统操作
		if (!isNodeEnvironment) {
			errors.push('Migration not supported in this environment (file system not available)');
			return { success: false, migratedCount: 0, errors };
		}

		// 检查环境变量
		const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
		const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
		const encryptionSecret = process.env.ENCRYPTION_SECRET;

		if (!supabaseUrl || !supabaseServiceKey || !encryptionSecret) {
			errors.push('Missing required environment variables for Supabase migration');
			return { success: false, migratedCount: 0, errors };
		}

		// 创建 Supabase 客户端
		const supabase = createClient(supabaseUrl, supabaseServiceKey);

		// 动态导入文件系统模块
		const { readFile } = await import(/* @vite-ignore */ 'fs' + '/promises');
		const { join } = await import(/* @vite-ignore */ 'path');

		// 读取旧的 API Keys 文件
		const legacyFilePath = join(process.cwd(), 'data', 'api-keys.json');
		let legacyKeys: LegacyApiKey[] = [];

		try {
			const fileContent = await readFile(legacyFilePath, 'utf-8');
			legacyKeys = JSON.parse(fileContent);
		} catch (error) {
			errors.push('No legacy API keys file found or file is corrupted');
			return { success: true, migratedCount: 0, errors };
		}

		// 迁移每个 API Key
		for (const legacyKey of legacyKeys) {
			try {
				// 加密字段
				const { encryptedFields, salt, iv, tag } = encryptApiKeyFields(legacyKey.fields, userId);

				// 插入到 Supabase
				const { error } = await supabase
					.from('api_keys')
					.insert({
						id: legacyKey.id,
						user_id: userId,
						provider_id: legacyKey.providerId,
						name: legacyKey.name,
						description: legacyKey.description,
						encrypted_fields: encryptedFields,
						salt,
						iv,
						tag,
						is_active: legacyKey.isActive,
						created_at: legacyKey.createdAt,
						updated_at: legacyKey.updatedAt,
						last_used: legacyKey.lastUsed,
						usage_count: legacyKey.usageCount || 0
					});

				if (error) {
					errors.push(`Failed to migrate key "${legacyKey.name}": ${error.message}`);
				} else {
					migratedCount++;
				}
			} catch (error) {
				errors.push(`Error processing key "${legacyKey.name}": ${error instanceof Error ? error.message : 'Unknown error'}`);
			}
		}

		return {
			success: errors.length === 0,
			migratedCount,
			errors
		};
	} catch (error) {
		errors.push(`Migration failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
		return { success: false, migratedCount, errors };
	}
}

// 验证迁移结果
export async function verifyMigration(userId: string): Promise<{
	success: boolean;
	supabaseCount: number;
	legacyCount: number;
	issues: string[];
}> {
	const issues: string[] = [];

	try {
		// 检查环境是否支持文件系统操作
		if (!isNodeEnvironment) {
			issues.push('Verification not supported in this environment (file system not available)');
			return { success: false, supabaseCount: 0, legacyCount: 0, issues };
		}

		// 检查 Supabase 中的记录数
		const supabaseUrl = process.env.PUBLIC_SUPABASE_URL!;
		const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
		const supabase = createClient(supabaseUrl, supabaseServiceKey);

		const { data: supabaseKeys, error: supabaseError } = await supabase
			.from('api_keys')
			.select('id')
			.eq('user_id', userId);

		if (supabaseError) {
			issues.push(`Failed to query Supabase: ${supabaseError.message}`);
			return { success: false, supabaseCount: 0, legacyCount: 0, issues };
		}

		// 动态导入文件系统模块
		const { readFile } = await import(/* @vite-ignore */ 'fs' + '/promises');
		const { join } = await import(/* @vite-ignore */ 'path');

		// 检查本地文件中的记录数
		let legacyCount = 0;
		try {
			const legacyFilePath = join(process.cwd(), 'data', 'api-keys.json');
			const fileContent = await readFile(legacyFilePath, 'utf-8');
			const legacyKeys = JSON.parse(fileContent);
			legacyCount = legacyKeys.length;
		} catch {
			// 文件不存在或无法读取
		}

		const supabaseCount = supabaseKeys?.length || 0;

		if (supabaseCount !== legacyCount) {
			issues.push(`Record count mismatch: Supabase has ${supabaseCount}, legacy file has ${legacyCount}`);
		}

		return {
			success: issues.length === 0,
			supabaseCount,
			legacyCount,
			issues
		};
	} catch (error) {
		issues.push(`Verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
		return { success: false, supabaseCount: 0, legacyCount: 0, issues };
	}
}

// 备份现有数据
export async function backupLegacyData(): Promise<{
	success: boolean;
	backupPath?: string;
	error?: string;
}> {
	try {
		// 检查环境是否支持文件系统操作
		if (!isNodeEnvironment) {
			return {
				success: false,
				error: 'Backup not supported in this environment (file system not available)'
			};
		}

		// 动态导入文件系统模块
		const { writeFile, readFile } = await import(/* @vite-ignore */ 'fs' + '/promises');
		const { join } = await import(/* @vite-ignore */ 'path');

		const legacyFilePath = join(process.cwd(), 'data', 'api-keys.json');
		const backupPath = join(process.cwd(), 'data', `api-keys-backup-${Date.now()}.json`);

		// 读取原文件
		const fileContent = await readFile(legacyFilePath, 'utf-8');
		
		// 写入备份文件
		await writeFile(backupPath, fileContent, 'utf-8');

		return { success: true, backupPath };
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Unknown error'
		};
	}
}

// 清理旧数据（谨慎使用）
export async function cleanupLegacyData(): Promise<{
	success: boolean;
	error?: string;
}> {
	try {
		// 检查环境是否支持文件系统操作
		if (!isNodeEnvironment) {
			return {
				success: false,
				error: 'Cleanup not supported in this environment (file system not available)'
			};
		}

		// 动态导入文件系统模块
		const { unlink } = await import(/* @vite-ignore */ 'fs' + '/promises');
		const { join } = await import(/* @vite-ignore */ 'path');

		const legacyFilePath = join(process.cwd(), 'data', 'api-keys.json');
		
		await unlink(legacyFilePath);
		
		return { success: true };
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Unknown error'
		};
	}
}
