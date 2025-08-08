import staticAdapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';
import mdsvexConfig from './mdsvex.config.js';

// 使用静态适配器用于GitHub Pages
const getAdapter = () => {
	console.log('📄 使用 Static 适配器 (GitHub Pages)');
	return staticAdapter({
		pages: 'docs',
		assets: 'docs',
		fallback: 'index.html',
		precompress: false,
		strict: false
	});
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
