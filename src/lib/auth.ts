import { env } from '$env/dynamic/private';

// 简单的认证配置
export const AUTH_CONFIG = {
	username: env.ADMIN_USERNAME || 'admin',
	password: env.ADMIN_PASSWORD || 'admin123'
};

// 验证用户凭据
export function validateCredentials(username: string, password: string): boolean {
	return username === AUTH_CONFIG.username && password === AUTH_CONFIG.password;
}

// 生成简单的会话令牌
export function generateSessionToken(): string {
	return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// 验证会话令牌（这里使用简单的内存存储，生产环境应该使用数据库）
const activeSessions = new Set<string>();

export function createSession(token: string): void {
	activeSessions.add(token);
}

export function validateSession(token: string): boolean {
	return activeSessions.has(token);
}

export function destroySession(token: string): void {
	activeSessions.delete(token);
}

// 创建简单的哈希函数（用于密码验证）
export function simpleHash(input: string): string {
	let hash = 0;
	for (let i = 0; i < input.length; i++) {
		const char = input.charCodeAt(i);
		hash = ((hash << 5) - hash) + char;
		hash = hash & hash; // Convert to 32bit integer
	}
	return hash.toString();
}

// 验证哈希密码
export function verifyPassword(password: string, hashedPassword: string): boolean {
	return simpleHash(password) === hashedPassword;
}
