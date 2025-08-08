import vercelAdapter from '@sveltejs/adapter-vercel';
import cloudflareAdapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';
import mdsvexConfig from './mdsvex.config.js';

// 根据环境变量选择适配器
const ADAPTER_TYPE = process.env.ADAPTER || 'vercel';

// 适配器配置
const getAdapter = () => {
	switch (ADAPTER_TYPE) {
		case 'cloudflare':
			console.log('🔶 使用 Cloudflare 适配器');
			return cloudflareAdapter({
				platformProxy: {
					persist: false
				}
			});
		case 'vercel':
		default:
			console.log('▲ 使用 Vercel 适配器');
			return vercelAdapter({
				// 确保预编译的内容文件和文档被包含在部署中
				includeFiles: ['src/lib/generated/**/*', 'docs/**/*']
			});
	}
};

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: [vitePreprocess(), mdsvex(mdsvexConfig)],
	
	extensions: ['.svelte', ...mdsvexConfig.extensions],

	kit: {
		// 条件适配器选择
		adapter: getAdapter()
	}
};

export default config;
