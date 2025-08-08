import { getBlogPost, getRelatedPosts } from '$lib/content.js';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	try {
		// 统一使用本地 CMS 文件作为数据源
		console.log(`Loading blog post "${params.slug}" with language "${params.lang}" from CMS (local files)`);
		const post = await getBlogPost(params.slug, params.lang);

		if (!post) {
			throw error(404, 'Blog post not found');
		}

		// 获取相关文章（使用本地 CMS 数据）
		const relatedPosts = await getRelatedPosts(post.slug, post.tags, 3, params.lang);

		return {
			post,
			relatedPosts,
			session: locals.session,
			lang: params.lang
		};
	} catch (err) {
		console.error('Error loading blog post:', err);
		throw error(404, 'Blog post not found');
	}
};