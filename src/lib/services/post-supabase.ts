import { typedSupabaseAdmin, type Database } from '$lib/supabase-admin';
import { generateUuid } from '$lib/utils/hash';
import { withSupabaseAdmin } from '$lib/utils/supabase-utils';

type Post = Database['public']['Tables']['posts']['Row'];
type PostInsert = Database['public']['Tables']['posts']['Insert'];
type PostUpdate = Database['public']['Tables']['posts']['Update'];

export enum PostStatus {
  Draft = "draft",
  Published = "published",
  Deleted = "deleted",
  Offline = "offline",
}

// 创建文章
export async function insertPost(data: PostInsert): Promise<Post | null> {
  return withSupabaseAdmin(async (client) => {
    const { data: post, error } = await client
      .from('posts')
      .insert({
        ...data,
        uuid: data.uuid || generateUuid()
      })
      .select()
      .single();

    if (error) {
      console.error('Error inserting post:', error);
      return null;
    }

    return post;
  });
}

// 更新文章
export async function updatePost(
  uuid: string,
  data: PostUpdate
): Promise<Post | null> {
  return withSupabaseAdmin(async (client) => {
    const { data: post, error } = await client
      .from('posts')
      .update({
        ...data,
        updated_at: new Date().toISOString()
      })
      .eq('uuid', uuid)
      .select()
      .single();

    if (error) {
      console.error('Error updating post:', error);
      return null;
    }

    return post;
  });
}

// 通过 UUID 查找文章
export async function findPostByUuid(uuid: string): Promise<Post | null> {
  return withSupabaseAdmin(async (client) => {
    const { data: post, error } = await client
      .from('posts')
      .select('*')
      .eq('uuid', uuid)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      console.error('Error finding post by uuid:', error);
      return null;
    }

    return post;
  });
}

// 通过 slug 和语言查找文章
export async function findPostBySlug(
  slug: string,
  locale: string = 'en'
): Promise<Post | null> {
  return withSupabaseAdmin(async (client) => {
    const { data: post, error } = await client
      .from('posts')
      .select('*')
      .eq('slug', slug)
      .eq('locale', locale)
      .eq('status', PostStatus.Published)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      console.error('Error finding post by slug:', error);
      return null;
    }

    return post;
  });
}

// 获取所有文章（管理员用）
export async function getAllPosts(
  page: number = 1,
  limit: number = 50,
  status?: PostStatus,
  locale?: string
): Promise<Post[]> {
  const result = await withSupabaseAdmin(async (client) => {
    const offset = (page - 1) * limit;

    let query = client
      .from('posts')
      .select('*');

    if (status) {
      query = query.eq('status', status);
    }

    if (locale) {
      query = query.eq('locale', locale);
    }

    const { data: posts, error } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error getting all posts:', error);
      return [];
    }

    return posts || [];
  }, []);

  return result || [];
}

// 获取已发布的文章（公开访问）
export async function findAllPosts(
  locale: string = 'en',
  limit: number = 10,
  offset: number = 0
): Promise<Post[]> {
  const result = await withSupabaseAdmin(async (client) => {
    const { data: posts, error } = await client
      .from('posts')
      .select('*')
      .eq('status', PostStatus.Published)
      .eq('locale', locale)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error finding all posts:', error);
      return [];
    }

    return posts || [];
  }, []);

  return result || [];
}

// 搜索文章
export async function searchPosts(
  query: string,
  locale: string = 'en',
  limit: number = 10
): Promise<Post[]> {
  const result = await withSupabaseAdmin(async (client) => {
    const { data: posts, error } = await client
      .from('posts')
      .select('*')
      .eq('status', PostStatus.Published)
      .eq('locale', locale)
      .or(`title.ilike.%${query}%,description.ilike.%${query}%,content.ilike.%${query}%`)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error searching posts:', error);
      return [];
    }

    return posts || [];
  }, []);

  return result || [];
}

// 删除文章
export async function deletePost(uuid: string): Promise<boolean> {
  const result = await withSupabaseAdmin(async (client) => {
    const { error } = await client
      .from('posts')
      .delete()
      .eq('uuid', uuid);

    if (error) {
      console.error('Error deleting post:', error);
      return false;
    }

    return true;
  }, false);

  return result || false;
}

// 软删除文章（标记为删除状态）
export async function softDeletePost(uuid: string): Promise<Post | null> {
  try {
    return await updatePost(uuid, { status: PostStatus.Deleted });
  } catch (error) {
    console.error('Error soft deleting post:', error);
    return null;
  }
}

// 发布文章
export async function publishPost(uuid: string): Promise<Post | null> {
  try {
    return await updatePost(uuid, { status: PostStatus.Published });
  } catch (error) {
    console.error('Error publishing post:', error);
    return null;
  }
}

// 下线文章
export async function unpublishPost(uuid: string): Promise<Post | null> {
  try {
    return await updatePost(uuid, { status: PostStatus.Offline });
  } catch (error) {
    console.error('Error unpublishing post:', error);
    return null;
  }
}

// 获取文章统计信息
export async function getPostStats(): Promise<{
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  postsToday: number;
}> {
  const defaultStats = {
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    postsToday: 0
  };

  const result = await withSupabaseAdmin(async (client) => {
    // 获取所有文章
    const { data: allPosts, error } = await client
      .from('posts')
      .select('status, created_at');

    if (error) {
      console.error('Error getting post stats:', error);
      return defaultStats;
    }

    if (!allPosts || allPosts.length === 0) {
      return defaultStats;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayISO = today.toISOString();

    let totalPosts = allPosts.length;
    let publishedPosts = 0;
    let draftPosts = 0;
    let postsToday = 0;

    allPosts.forEach(post => {
      if (post.status === PostStatus.Published) {
        publishedPosts++;
      } else if (post.status === PostStatus.Draft) {
        draftPosts++;
      }

      if (post.created_at >= todayISO) {
        postsToday++;
      }
    });

    return {
      totalPosts,
      publishedPosts,
      draftPosts,
      postsToday
    };
  }, defaultStats);

  return result || defaultStats;
}

// 获取热门文章（可以根据实际需求调整排序逻辑）
export async function getPopularPosts(
  locale: string = 'en',
  limit: number = 5
): Promise<Post[]> {
  const result = await withSupabaseAdmin(async (client) => {
    const { data: posts, error } = await client
      .from('posts')
      .select('*')
      .eq('status', PostStatus.Published)
      .eq('locale', locale)
      .order('created_at', { ascending: false }) // 这里可以改为按浏览量等排序
      .limit(limit);

    if (error) {
      console.error('Error getting popular posts:', error);
      return [];
    }

    return posts || [];
  }, []);

  return result || [];
}

// 获取相关文章（简单实现，可以根据标签等优化）
export async function getRelatedPosts(
  currentPostUuid: string,
  locale: string = 'en',
  limit: number = 3
): Promise<Post[]> {
  const result = await withSupabaseAdmin(async (client) => {
    const { data: posts, error } = await client
      .from('posts')
      .select('*')
      .eq('status', PostStatus.Published)
      .eq('locale', locale)
      .neq('uuid', currentPostUuid)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error getting related posts:', error);
      return [];
    }

    return posts || [];
  }, []);

  return result || [];
}
