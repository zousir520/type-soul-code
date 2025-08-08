import { getBlogPosts, getSettingsData } from '$lib/content.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, url, locals }) => {
  const page = parseInt(url.searchParams.get('page') || '1');
  const searchQuery = url.searchParams.get('q') || '';
  const postsPerPage = 6;

  const [allPosts, generalSettings] = await Promise.all([
    getBlogPosts(),
    getSettingsData('general')
  ]);

  // Filter posts based on search query
  let filteredPosts = allPosts;
  if (searchQuery) {
    filteredPosts = allPosts.filter((post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }

  // Pagination
  const totalPosts = filteredPosts.length;
  const totalPages = Math.ceil(totalPosts / postsPerPage);
  const startIndex = (page - 1) * postsPerPage;
  const posts = filteredPosts.slice(startIndex, startIndex + postsPerPage);

  return {
    posts,
    pagination: {
      currentPage: page,
      totalPages,
      totalPosts,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    },
    searchQuery,
    generalSettings,
    lang: params.lang,
    session: locals.session
  };
};
