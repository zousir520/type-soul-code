import { supabaseAdmin } from '$lib/server/supabase';
import { createUserProfile, findUserById } from '$lib/services/user-supabase';
import { increaseCredits, CreditsTransType, CreditsAmount } from '$lib/services/credit-supabase';
import { generateUuid } from '$lib/utils/hash';
import { withSupabaseAdmin } from '$lib/utils/supabase-utils';

// Helper function to safely access supabaseAdmin
async function withSupabaseAuth<T>(
  operation: (admin: NonNullable<typeof supabaseAdmin>) => Promise<T>,
  fallback?: T
): Promise<T> {
  if (!supabaseAdmin) {
    console.error('Supabase admin client is not available');
    if (fallback !== undefined) {
      return fallback;
    }
    throw new Error('Supabase admin client is not available');
  }
  return operation(supabaseAdmin);
}

export interface UserInfo {
  id: string;
  email: string;
  nickname?: string;
  avatar_url?: string;
  created_at: string;
  signin_type?: string;
  signin_provider?: string;
  signin_openid?: string;
}

// 处理用户登录/注册
export async function handleSignInUser(
  authUser: any,
  provider?: string
): Promise<UserInfo | null> {
  try {
    if (!authUser.email) {
      throw new Error("invalid signin user - no email");
    }

    // 检查用户档案是否已存在
    const existingProfile = await findUserById(authUser.id);
    
    if (existingProfile) {
      // 用户档案已存在，返回现有信息
      return {
        id: existingProfile.id,
        email: authUser.email,
        nickname: existingProfile.nickname || '',
        avatar_url: existingProfile.avatar_url || '',
        created_at: existingProfile.created_at,
        signin_type: existingProfile.signin_type || '',
        signin_provider: existingProfile.signin_provider || provider || '',
        signin_openid: existingProfile.signin_openid || '',
      };
    }

    // 创建新用户档案
    const userProfileData = {
      id: authUser.id,
      uuid: generateUuid(),
      nickname: authUser.user_metadata?.full_name || authUser.user_metadata?.name || '',
      avatar_url: authUser.user_metadata?.avatar_url || authUser.user_metadata?.picture || '',
      locale: 'en',
      signin_type: 'oauth',
      signin_provider: provider || '',
      signin_openid: authUser.id,
      invite_code: '',
      invited_by: '',
      is_affiliate: false,
      created_at: new Date().toISOString(),
    };

    const savedProfile = await createUserProfile(userProfileData);
    
    if (!savedProfile) {
      throw new Error("Failed to save user profile");
    }

    // 给新用户赠送积分
    try {
      const oneYearLater = new Date();
      oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);
      
      await increaseCredits({
        user_id: savedProfile.id,
        trans_type: CreditsTransType.NewUser,
        credits: CreditsAmount.NewUserGet,
        expired_at: oneYearLater.toISOString(),
      });
    } catch (e) {
      console.error("Failed to give new user credits:", e);
      // 不要因为积分失败而阻止登录流程
    }

    return {
      id: savedProfile.id,
      email: authUser.email,
      nickname: savedProfile.nickname || '',
      avatar_url: savedProfile.avatar_url || '',
      created_at: savedProfile.created_at,
      signin_type: savedProfile.signin_type || '',
      signin_provider: savedProfile.signin_provider || '',
      signin_openid: savedProfile.signin_openid || '',
    };
  } catch (e) {
    console.error("handle signin user failed:", e);
    return null;
  }
}

// 获取用户信息
export async function getUserInfo(userId: string): Promise<UserInfo | null> {
  try {
    // 从 Supabase Auth 获取用户信息
    const { data: authUser, error: authError } = await withSupabaseAuth(
      (admin) => admin.auth.admin.getUserById(userId)
    );
    
    if (authError || !authUser.user) {
      console.error('Error fetching auth user:', authError);
      return null;
    }

    // 获取用户档案
    const profile = await findUserById(userId);
    
    if (!profile) {
      // 如果没有档案，可能需要创建一个
      return {
        id: authUser.user.id,
        email: authUser.user.email || '',
        nickname: authUser.user.user_metadata?.full_name || '',
        avatar_url: authUser.user.user_metadata?.avatar_url || '',
        created_at: authUser.user.created_at,
        signin_type: '',
        signin_provider: '',
        signin_openid: '',
      };
    }

    return {
      id: profile.id,
      email: authUser.user.email || '',
      nickname: profile.nickname || '',
      avatar_url: profile.avatar_url || '',
      created_at: profile.created_at,
      signin_type: profile.signin_type || '',
      signin_provider: profile.signin_provider || '',
      signin_openid: profile.signin_openid || '',
    };
  } catch (e) {
    console.error("get user info failed:", e);
    return null;
  }
}

// 更新用户档案
export async function updateUserInfo(
  userId: string,
  updates: {
    nickname?: string;
    avatar_url?: string;
    locale?: string;
  }
): Promise<UserInfo | null> {
  try {
    if (!supabaseAdmin) {
      console.error('Supabase admin client not available');
      return null;
    }

    // 更新 Supabase Auth 用户元数据
    const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      user_metadata: {
        full_name: updates.nickname,
        avatar_url: updates.avatar_url,
      }
    });

    if (authError) {
      console.error('Error updating auth user:', authError);
    }

    // 更新用户档案
    const { updateUserProfile } = await import('$lib/services/user-supabase');
    const updatedProfile = await updateUserProfile(userId, updates);
    
    if (!updatedProfile) {
      throw new Error("Failed to update user profile");
    }

    return await getUserInfo(userId);
  } catch (e) {
    console.error("update user info failed:", e);
    return null;
  }
}

// 删除用户
export async function deleteUser(userId: string): Promise<boolean> {
  try {
    // 删除用户档案（会级联删除相关数据）
    const { deleteUserProfile } = await import('$lib/services/user-supabase');
    await deleteUserProfile(userId);

    // 删除 Supabase Auth 用户
    if (!supabaseAdmin) {
      console.error('Supabase admin client not available');
      return false;
    }

    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
    
    if (error) {
      console.error('Error deleting auth user:', error);
      return false;
    }

    return true;
  } catch (e) {
    console.error("delete user failed:", e);
    return false;
  }
}

// 检查用户是否为管理员
export async function isUserAdmin(userId: string): Promise<boolean> {
  try {
    const profile = await findUserById(userId);
    
    if (!profile) {
      return false;
    }

    // 这里可以根据实际需求定义管理员逻辑
    // 例如：检查特定的邮箱域名、角色字段等
    const adminEmails = process.env.ADMIN_EMAILS?.split(',') || [];
    
    if (!supabaseAdmin) {
      console.error('Supabase admin client not available');
      return false;
    }

    const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(userId);
    const userEmail = authUser.user?.email;
    
    return userEmail ? adminEmails.includes(userEmail) : false;
  } catch (e) {
    console.error("check user admin failed:", e);
    return false;
  }
}

// 生成邀请码
export async function generateInviteCode(userId: string): Promise<string | null> {
  try {
    const inviteCode = generateUuid().substring(0, 8).toUpperCase();
    
    const { updateUserInviteCode } = await import('$lib/services/user-supabase');
    const updatedProfile = await updateUserInviteCode(userId, inviteCode);
    
    if (!updatedProfile) {
      throw new Error("Failed to update invite code");
    }

    return inviteCode;
  } catch (e) {
    console.error("generate invite code failed:", e);
    return null;
  }
}

// 处理邀请码注册
export async function handleInviteSignup(
  authUser: any,
  inviteCode: string,
  provider?: string
): Promise<UserInfo | null> {
  try {
    // 先正常处理用户注册
    const userInfo = await handleSignInUser(authUser, provider);
    
    if (!userInfo) {
      return null;
    }

    // 更新邀请信息
    const { updateUserProfile } = await import('$lib/services/user-supabase');
    await updateUserProfile(userInfo.id, {
      invited_by: inviteCode
    });

    // 这里可以添加邀请奖励逻辑
    // 例如：给邀请人和被邀请人都增加积分

    return userInfo;
  } catch (e) {
    console.error("handle invite signup failed:", e);
    return null;
  }
}
