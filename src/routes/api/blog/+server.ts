import { json } from '@sveltejs/kit';
import { getBlogPosts } from '$lib/content';

export interface BlogPost {
	title: string;
	description: string;
	author: string;
	date: string;
	tags: string[];
	image?: string;
	slug: string;
	content: string;
}

export async function GET() {
	try {
		const posts = await getBlogPosts();
		
		// Transform to match the expected interface
		const transformedPosts: BlogPost[] = posts.map(post => ({
			title: post.title,
			description: post.description,
			author: post.author,
			date: post.date,
			tags: post.tags,
			image: post.image,
			slug: post.slug,
			content: post.content
		}));
		
		return json(transformedPosts);
	} catch (error) {
		console.error('Error loading blog posts:', error);
		return json([]);
	}
}