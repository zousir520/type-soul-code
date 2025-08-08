import { createHash, randomBytes, createCipheriv, createDecipheriv, pbkdf2Sync } from 'crypto';

// 加密配置
const ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32;
const IV_LENGTH = 16;
const SALT_LENGTH = 32;
const TAG_LENGTH = 16;
const ITERATIONS = 100000;

// 生成随机盐
export function generateSalt(): string {
	return randomBytes(SALT_LENGTH).toString('hex');
}

// 从密码和盐生成密钥
export function deriveKey(password: string, salt: string): Buffer {
	return pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, 'sha256');
}

// 生成用户主密钥（基于用户ID和系统密钥）
export function generateUserMasterKey(userId: string): string {
	const systemSecret = process.env.ENCRYPTION_SECRET || 'default-secret-change-in-production';
	return createHash('sha256').update(userId + systemSecret).digest('hex');
}

// 加密数据
export function encrypt(data: string, password: string, salt?: string): {
	encrypted: string;
	salt: string;
	iv: string;
	tag: string;
} {
	const actualSalt = salt || generateSalt();
	const key = deriveKey(password, actualSalt);
	const iv = randomBytes(IV_LENGTH);
	
	const cipher = createCipheriv(ALGORITHM, key, iv);
	
	let encrypted = cipher.update(data, 'utf8', 'hex');
	encrypted += cipher.final('hex');
	
	const tag = cipher.getAuthTag();
	
	return {
		encrypted,
		salt: actualSalt,
		iv: iv.toString('hex'),
		tag: tag.toString('hex')
	};
}

// 解密数据
export function decrypt(
	encryptedData: string,
	password: string,
	salt: string,
	iv: string,
	tag: string
): string {
	const key = deriveKey(password, salt);
	const decipher = createDecipheriv(ALGORITHM, key, Buffer.from(iv, 'hex'));
	
	decipher.setAuthTag(Buffer.from(tag, 'hex'));
	
	let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
	decrypted += decipher.final('utf8');
	
	return decrypted;
}

// 加密 API Key 字段
export function encryptApiKeyFields(
	fields: Record<string, string>,
	userId: string
): {
	encryptedFields: string;
	salt: string;
	iv: string;
	tag: string;
} {
	const masterKey = generateUserMasterKey(userId);
	const fieldsJson = JSON.stringify(fields);

	const result = encrypt(fieldsJson, masterKey);
	return {
		encryptedFields: result.encrypted,
		salt: result.salt,
		iv: result.iv,
		tag: result.tag
	};
}

// 解密 API Key 字段
export function decryptApiKeyFields(
	encryptedFields: string,
	salt: string,
	iv: string,
	tag: string,
	userId: string
): Record<string, string> {
	try {
		const masterKey = generateUserMasterKey(userId);
		const decryptedJson = decrypt(encryptedFields, masterKey, salt, iv, tag);
		return JSON.parse(decryptedJson);
	} catch (error) {
		console.error('Failed to decrypt API key fields:', error);
		throw new Error('Failed to decrypt API key fields');
	}
}

// 验证加密数据完整性
export function verifyEncryptedData(
	encryptedData: string,
	salt: string,
	iv: string,
	tag: string,
	userId: string
): boolean {
	try {
		const masterKey = generateUserMasterKey(userId);
		decrypt(encryptedData, masterKey, salt, iv, tag);
		return true;
	} catch {
		return false;
	}
}

// 生成安全的 API Key ID
export function generateSecureId(): string {
	return randomBytes(16).toString('hex');
}

// 哈希敏感数据用于搜索（不可逆）
export function hashForSearch(data: string): string {
	return createHash('sha256').update(data).digest('hex').substring(0, 16);
}

// 创建密钥指纹（用于识别但不暴露密钥）
export function createKeyFingerprint(apiKey: string): string {
	const hash = createHash('sha256').update(apiKey).digest('hex');
	return `${apiKey.substring(0, 4)}...${hash.substring(0, 8)}`;
}

// 验证密钥格式
export function validateKeyFormat(apiKey: string, expectedFormat?: string): boolean {
	if (!expectedFormat) return true;
	
	// 支持的格式模式
	const patterns: Record<string, RegExp> = {
		'sk-...': /^sk-[a-zA-Z0-9]{32,}$/,
		'sk-ant-...': /^sk-ant-[a-zA-Z0-9-]{32,}$/,
		'AIza...': /^AIza[a-zA-Z0-9_-]{35}$/,
		'fal_...': /^fal_[a-zA-Z0-9]{32,}$/,
		'sk-or-...': /^sk-or-[a-zA-Z0-9-]{32,}$/
	};
	
	const pattern = patterns[expectedFormat];
	return pattern ? pattern.test(apiKey) : true;
}

// 安全地比较两个字符串（防止时序攻击）
export function secureCompare(a: string, b: string): boolean {
	if (a.length !== b.length) {
		return false;
	}
	
	let result = 0;
	for (let i = 0; i < a.length; i++) {
		result |= a.charCodeAt(i) ^ b.charCodeAt(i);
	}
	
	return result === 0;
}

// 生成用于显示的遮盖密钥
export function maskApiKey(apiKey: string): string {
	if (apiKey.length <= 8) {
		return '*'.repeat(apiKey.length);
	}
	
	const start = apiKey.substring(0, 4);
	const end = apiKey.substring(apiKey.length - 4);
	const middle = '*'.repeat(Math.min(apiKey.length - 8, 20));
	
	return `${start}${middle}${end}`;
}

// 环境变量验证
export function validateEncryptionEnvironment(): {
	isValid: boolean;
	errors: string[];
} {
	const errors: string[] = [];
	
	if (!process.env.ENCRYPTION_SECRET) {
		errors.push('ENCRYPTION_SECRET environment variable is required');
	} else if (process.env.ENCRYPTION_SECRET === 'default-secret-change-in-production') {
		errors.push('ENCRYPTION_SECRET must be changed from default value in production');
	} else if (process.env.ENCRYPTION_SECRET.length < 32) {
		errors.push('ENCRYPTION_SECRET must be at least 32 characters long');
	}
	
	return {
		isValid: errors.length === 0,
		errors
	};
}
