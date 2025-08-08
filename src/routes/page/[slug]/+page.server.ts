import { error } from '@sveltejs/kit';
import { loadContent } from '$lib/content-loader';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	const { slug } = params;
	
	// Skip language codes to avoid conflict with [lang] route
	const languageCodes = ['en', 'zh'];
	if (languageCodes.includes(slug)) {
		throw error(404, 'Page not found');
	}
	
	try {
		// Try to load page content
		const pageContent = await loadContent(`pages/${slug}`);
		
		if (!pageContent) {
			throw error(404, 'Page not found');
		}
		
		return {
			pageContent,
			slug,
			session: locals.session
		};
	} catch (e) {
		console.error(`Error loading page ${slug}:`, e);
		throw error(404, 'Page not found');
	}
};
