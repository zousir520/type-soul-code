import { writable } from 'svelte/store';

export type SiteType = 'site-tool' | 'site-game' | 'site-blog';

export interface SiteConfig {
	type: SiteType;
	source?: 'environment' | 'file' | 'default';
}

export interface SiteConfigResponse {
	type: SiteType;
	source: 'environment' | 'file' | 'default';
	error?: string;
	message?: string;
	instruction?: string;
}

// 默认配置（仅作为类型引用，实际配置通过环境变量控制）
export const defaultConfig: SiteConfig = {
	type: 'site-tool',
	source: 'default'
};

// 创建只读 store（配置通过环境变量控制，不允许运行时修改）
export const siteConfig = writable<SiteConfig>(defaultConfig);

// 初始化 store (在 load 函数中调用，从 API 获取环境变量配置)
export function initializeSiteConfig(initialConfig: SiteConfig) {
    siteConfig.set(initialConfig);
}

// 获取当前配置
export function getSiteConfig(): Promise<SiteConfig> {
	return new Promise(resolve => {
		const unsubscribe = siteConfig.subscribe(config => {
			unsubscribe();
			resolve(config);
		});
	});
}

// 更新配置 (主要用于测试和开发)
export function updateSiteConfig(newConfig: Partial<SiteConfig>) {
	siteConfig.update(config => ({
		...config,
		...newConfig
	}));
}

// 从 API 加载配置（环境变量优先）
export async function loadSiteConfigFromAPI(): Promise<SiteConfigResponse> {
	try {
		const response = await fetch('/api/site-config');
		const data = await response.json();
		
		if (!response.ok) {
			throw new Error(data.message || 'Failed to load site config');
		}
		
		// 更新 store
		initializeSiteConfig({
			type: data.type,
			source: data.source
		});
		
		return data;
	} catch (error) {
		console.error('Failed to load site config:', error);
		throw error;
	}
}
