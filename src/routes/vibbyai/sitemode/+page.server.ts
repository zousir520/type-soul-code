import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	// 加载初始配置数据
	try {
		// 这里可以从数据库或文件系统加载当前的 site 配置
		return {
			siteConfig: {
				type: 'site-game' // 默认值，实际会从 API 获取
			}
		};
	} catch (error) {
		console.error('Error loading site config in server:', error);
		return {
			siteConfig: {
				type: 'site-tool'
			}
		};
	}
};