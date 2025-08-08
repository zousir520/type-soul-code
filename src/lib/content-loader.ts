import { getPageContent } from './generated/content';
import { markdownToHTML } from './content';

export async function loadContent(path: string): Promise<Record<string, unknown> | null> {
	try {
		const pageData = getPageContent(path);
		
		if (!pageData) {
			return null;
		}
		
		// Convert markdown to HTML
		const body = markdownToHTML(pageData.content);
		
		return {
			...pageData.frontmatter,
			body,
			content: pageData.content
		};
	} catch (error) {
		console.error(`Error loading content from ${path}:`, error);
		return null;
	}
}
