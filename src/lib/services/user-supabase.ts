import { supabaseAdmin, typedSupabaseAdmin, type Database } from '$lib/supabase-admin';
import { generateUuid } from '$lib/utils/hash';
import { ensureSupabaseAdmin, ensureSupabaseAdminUntyped, withSupabaseAdmin, withSupabaseAuth } from '$lib/utils/supabase-utils';

type UserProfile = Database['public']['Tables']['user_profiles']['Row'];
type UserProfileInsert = Database['public']['Tables']['user_profiles']['Insert'];
type UserProfileUpdate = Database['public']['Tables']['user_profiles']['Update'];

// 创建用户档案
export async function createUserProfile(
  data: UserProfileInsert
): Promise<UserProfile | null> {
  return withSupabaseAdmin(async (client) => {
    const { data: profile, error } = await client
      .from('user_profiles')
      .insert({
        ...data,
        uuid: data.uuid || generateUuid()
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating user profile:', error);
      return null;
    }

    return profile;
  });
}

// 通过邮箱查找用户（需要先从 auth.users 查找，再关联 user_profiles）
export async function findUserByEmail(email: string): Promise<UserProfile | null> {
  return withSupabaseAuth(async (authClient) => {
    // 首先从 auth.users 表查找用户
    const { data: authUser, error: authError } = await authClient.auth.admin.listUsers();

    if (authError) {
      console.error('Error fetching auth users:', authError);
      return null;
    }

    const user = authUser.users.find(u => u.email === email);
    if (!user) {
      return null;
    }

    // 然后查找用户档案
    return withSupabaseAdmin(async (client) => {
      const { data: profile, error: profileError } = await client
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) {
        // 如果没有档案，可能是新用户，返回 null
        if (profileError.code === 'PGRST116') {
          return null;
        }
        console.error('Error fetching user profile:', profileError);
        return null;
      }

      return profile;
    });
  });
}

// 通过 UUID 查找用户档案
export async function findUserByUuid(uuid: string): Promise<UserProfile | null> {
  return withSupabaseAdmin(async (client) => {
    const { data: profile, error } = await client
      .from('user_profiles')
      .select('*')
      .eq('uuid', uuid)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      console.error('Error fetching user by uuid:', error);
      return null;
    }

    return profile;
  });
}

// 通过 ID 查找用户档案
export async function findUserById(id: string): Promise<UserProfile | null> {
  return withSupabaseAdmin(async (client) => {
    const { data: profile, error } = await client
      .from('user_profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      console.error('Error fetching user by id:', error);
      return null;
    }

    return profile;
  });
}

// 获取用户列表（分页）
export async function getUsers(
  page: number = 1,
  limit: number = 50
): Promise<UserProfile[]> {
  const result = await withSupabaseAdmin(async (client) => {
    const offset = (page - 1) * limit;

    const { data: profiles, error } = await client
      .from('user_profiles')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching users:', error);
      return [];
    }

    return profiles || [];
  }, []);

  return result || [];
}

// 更新用户邀请码
export async function updateUserInviteCode(
  userId: string,
  inviteCode: string
): Promise<UserProfile | null> {
  return withSupabaseAdmin(async (client) => {
    const { data: profile, error } = await client
      .from('user_profiles')
      .update({
        invite_code: inviteCode,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating user invite code:', error);
      return null;
    }

    return profile;
  });
}

// 更新用户档案
export async function updateUserProfile(
  userId: string,
  updates: UserProfileUpdate
): Promise<UserProfile | null> {
  return withSupabaseAdmin(async (client) => {
    const { data: profile, error } = await client
      .from('user_profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating user profile:', error);
      return null;
    }

    return profile;
  });
}

// 删除用户档案
export async function deleteUserProfile(userId: string): Promise<boolean> {
  const result = await withSupabaseAdmin(async (client) => {
    const { error } = await client
      .from('user_profiles')
      .delete()
      .eq('id', userId);

    if (error) {
      console.error('Error deleting user profile:', error);
      return false;
    }

    return true;
  }, false);

  return result || false;
}

// 检查邀请码是否存在
export async function checkInviteCodeExists(inviteCode: string): Promise<boolean> {
  const result = await withSupabaseAdmin(async (client) => {
    const { data, error } = await client
      .from('user_profiles')
      .select('id')
      .eq('invite_code', inviteCode)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return false; // 邀请码不存在
      }
      console.error('Error checking invite code:', error);
      return false;
    }

    return !!data;
  }, false);

  return result || false;
}

// 获取用户统计信息
export async function getUserStats(): Promise<{
  totalUsers: number;
  newUsersToday: number;
  activeUsers: number;
}> {
  const defaultStats = {
    totalUsers: 0,
    newUsersToday: 0,
    activeUsers: 0
  };

  const result = await withSupabaseAdmin(async (client) => {
    // 总用户数
    const { count: totalUsers, error: totalError } = await client
      .from('user_profiles')
      .select('*', { count: 'exact', head: true });

    if (totalError) {
      console.error('Error getting total users:', totalError);
    }

    // 今日新用户
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { count: newUsersToday, error: newError } = await client
      .from('user_profiles')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', today.toISOString());

    if (newError) {
      console.error('Error getting new users today:', newError);
    }

    // 活跃用户（这里简单定义为有邀请码的用户，可以根据实际需求调整）
    const { count: activeUsers, error: activeError } = await client
      .from('user_profiles')
      .select('*', { count: 'exact', head: true })
      .neq('invite_code', '');

    if (activeError) {
      console.error('Error getting active users:', activeError);
    }

    return {
      totalUsers: totalUsers || 0,
      newUsersToday: newUsersToday || 0,
      activeUsers: activeUsers || 0
    };
  }, defaultStats);

  return result || defaultStats;
}
