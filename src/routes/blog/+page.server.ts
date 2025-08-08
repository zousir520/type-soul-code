import { getBlogPosts } from '$lib/content.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, locals }) => {
	try {
		const page = parseInt(url.searchParams.get('page') || '1');
		const searchQuery = url.searchParams.get('search') || '';
		const postsPerPage = 6;

		// 统一使用本地 CMS 文件作为数据源
		console.log('Loading blog posts from CMS (local files)');
		let allPosts = await getBlogPosts();

		// Filter posts based on search query
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase().trim();
			allPosts = allPosts.filter(post =>
				post.title.toLowerCase().includes(query) ||
				post.description.toLowerCase().includes(query) ||
				post.content.toLowerCase().includes(query) ||
				post.tags.some(tag => tag.toLowerCase().includes(query)) ||
				post.author.toLowerCase().includes(query)
			);
		}

		const totalPosts = allPosts.length;
		const totalPages = Math.ceil(totalPosts / postsPerPage);

		const startIndex = (page - 1) * postsPerPage;
		const endIndex = startIndex + postsPerPage;
		const posts = allPosts.slice(startIndex, endIndex);

		return {
			posts,
			searchQuery,
			pagination: {
				currentPage: page,
				totalPages,
				totalPosts,
				postsPerPage,
				hasNextPage: page < totalPages,
				hasPrevPage: page > 1
			},
			session: locals.session
		};
	} catch (error) {
		console.error('Error loading blog posts:', error);
		return {
			posts: [],
			pagination: {
				currentPage: 1,
				totalPages: 0,
				totalPosts: 0,
				postsPerPage: 6,
				hasNextPage: false,
				hasPrevPage: false
			},
			session: locals.session
		};
	}
};
