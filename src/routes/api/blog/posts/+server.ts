import { respData, respErr, respBadRequest } from '$lib/utils/response';
// 统一使用 CMS 文件系统，不再使用数据库
import { getBlogPosts, getBlogPost } from '$lib/content.js';
import type { RequestEvent } from '@sveltejs/kit';

// Get blog posts
export async function GET(event: RequestEvent) {
  try {
    const url = new URL(event.request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const slug = url.searchParams.get('slug');
    const locale = url.searchParams.get('locale') || 'en';

    if (slug) {
      // Get single post by slug from CMS
      const post = await getBlogPost(slug);
      if (!post) {
        return respErr("post not found");
      }
      return respData(post);
    } else {
      // Get all posts from CMS with pagination
      const allPosts = await getBlogPosts();
      const offset = (page - 1) * limit;
      const posts = allPosts.slice(offset, offset + limit);

      return respData({
        posts,
        pagination: {
          page,
          limit,
          offset,
          total: allPosts.length
        }
      });
    }
  } catch (e) {
    console.log("get blog posts failed: ", e);
    return respErr("get blog posts failed");
  }
}
