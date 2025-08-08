import { typedSupabaseAdmin, type Database } from '$lib/supabase-admin';
import { generateUuid } from '$lib/utils/hash';
import { withSupabaseAdmin } from '$lib/utils/supabase-utils';

type Credit = Database['public']['Tables']['credits']['Row'];
type CreditInsert = Database['public']['Tables']['credits']['Insert'];

export enum CreditsTransType {
  NewUser = "new_user",
  Purchase = "purchase",
  Consume = "consume",
  Refund = "refund",
  Affiliate = "affiliate",
}

export enum CreditsAmount {
  NewUserGet = 1000,
}

export interface IncreaseCreditsParams {
  user_id: string;
  trans_type: CreditsTransType;
  credits: number;
  expired_at?: string;
  order_no?: string;
}

// 创建积分记录
export async function insertCredit(data: CreditInsert): Promise<Credit | null> {
  return withSupabaseAdmin(async (client) => {
    const { data: credit, error } = await client
      .from('credits')
      .insert(data)
      .select()
      .single();

    if (error) {
      console.error('Error inserting credit:', error);
      return null;
    }

    return credit;
  });
}

// 通过交易号查找积分记录
export async function findCreditByTransNo(transNo: string): Promise<Credit | null> {
  return withSupabaseAdmin(async (client) => {
    const { data: credit, error } = await client
      .from('credits')
      .select('*')
      .eq('trans_no', transNo)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      console.error('Error finding credit by trans_no:', error);
      return null;
    }

    return credit;
  });
}

// 获取用户总积分
export async function getUserTotalCredits(userId: string): Promise<number> {
  const result = await withSupabaseAdmin(async (client) => {
    const { data: credits, error } = await client
      .from('credits')
      .select('credits')
      .eq('user_id', userId);

    if (error) {
      console.error('Error getting user total credits:', error);
      return 0;
    }

    if (!credits || credits.length === 0) {
      return 0;
    }

    // 计算总积分（正数为增加，负数为消费）
    const totalCredits = credits.reduce((sum, credit) => sum + credit.credits, 0);
    return Math.max(0, totalCredits); // 确保不返回负数
  }, 0);

  return result || 0;
}

// 获取用户有效积分（未过期的）
export async function getUserValidCredits(userId: string): Promise<number> {
  const result = await withSupabaseAdmin(async (client) => {
    const now = new Date().toISOString();

    const { data: credits, error } = await client
      .from('credits')
      .select('credits')
      .eq('user_id', userId)
      .or(`expired_at.is.null,expired_at.gt.${now}`);

    if (error) {
      console.error('Error getting user valid credits:', error);
      return 0;
    }

    if (!credits || credits.length === 0) {
      return 0;
    }

    const totalCredits = credits.reduce((sum, credit) => sum + credit.credits, 0);
    return Math.max(0, totalCredits);
  }, 0);

  return result || 0;
}

// 增加积分
export async function increaseCredits(params: IncreaseCreditsParams): Promise<Credit | null> {
  const { user_id, trans_type, credits, expired_at, order_no } = params;

  const creditData: CreditInsert = {
    trans_no: generateUuid(),
    user_id,
    trans_type,
    credits,
    expired_at: expired_at ? new Date(expired_at).toISOString() : undefined,
    order_no: order_no || undefined,
    created_at: new Date().toISOString(),
  };

  return await insertCredit(creditData);
}

// 减少积分（消费）
export async function decreaseCredits(params: IncreaseCreditsParams): Promise<Credit | null> {
  const { user_id, trans_type, credits, expired_at, order_no } = params;

  const creditData: CreditInsert = {
    trans_no: generateUuid(),
    user_id,
    trans_type,
    credits: -credits, // 负数表示消费
    expired_at: expired_at ? new Date(expired_at).toISOString() : undefined,
    order_no: order_no || undefined,
    created_at: new Date().toISOString(),
  };

  return await insertCredit(creditData);
}

// 获取用户积分余额
export async function getUserCreditsBalance(userId: string): Promise<number> {
  return await getUserValidCredits(userId);
}

// 获取用户积分历史
export async function getUserCreditsHistory(
  userId: string,
  page: number = 1,
  limit: number = 50
): Promise<Credit[]> {
  const result = await withSupabaseAdmin(async (client) => {
    const offset = (page - 1) * limit;

    const { data: credits, error } = await client
      .from('credits')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error getting user credits history:', error);
      return [];
    }

    return credits || [];
  }, []);

  return result || [];
}

// 检查用户是否有足够积分
export async function checkUserHasEnoughCredits(
  userId: string,
  requiredCredits: number
): Promise<boolean> {
  try {
    const currentCredits = await getUserCreditsBalance(userId);
    return currentCredits >= requiredCredits;
  } catch (error) {
    console.error('Error checking user credits:', error);
    return false;
  }
}

// 获取积分统计信息
export async function getCreditsStats(): Promise<{
  totalCreditsIssued: number;
  totalCreditsConsumed: number;
  activeCredits: number;
}> {
  const defaultStats = {
    totalCreditsIssued: 0,
    totalCreditsConsumed: 0,
    activeCredits: 0
  };

  const result = await withSupabaseAdmin(async (client) => {
    // 获取所有积分记录
    const { data: allCredits, error } = await client
      .from('credits')
      .select('credits, expired_at');

    if (error) {
      console.error('Error getting credits stats:', error);
      return {
        totalCreditsIssued: 0,
        totalCreditsConsumed: 0,
        activeCredits: 0
      };
    }

    if (!allCredits || allCredits.length === 0) {
      return {
        totalCreditsIssued: 0,
        totalCreditsConsumed: 0,
        activeCredits: 0
      };
    }

    const now = new Date();
    let totalIssued = 0;
    let totalConsumed = 0;
    let activeCredits = 0;

    allCredits.forEach(credit => {
      if (credit.credits > 0) {
        totalIssued += credit.credits;
        
        // 检查是否未过期
        if (!credit.expired_at || new Date(credit.expired_at) > now) {
          activeCredits += credit.credits;
        }
      } else {
        totalConsumed += Math.abs(credit.credits);
      }
    });

    return {
      totalCreditsIssued: totalIssued,
      totalCreditsConsumed: totalConsumed,
      activeCredits: Math.max(0, activeCredits - totalConsumed)
    };
  }, defaultStats);

  return result || defaultStats;
}

// 清理过期积分记录（可选的维护功能）
export async function cleanupExpiredCredits(): Promise<number> {
  try {
    const result = await withSupabaseAdmin(async (client) => {
      const now = new Date().toISOString();

      const { data: expiredCredits, error } = await client
        .from('credits')
        .delete()
        .lt('expired_at', now)
        .select();

      if (error) {
        console.error('Error cleaning up expired credits:', error);
        return 0;
      }

      return expiredCredits?.length || 0;
    });

    return result || 0;
  } catch (error) {
    console.error('Error in cleanupExpiredCredits:', error);
    return 0;
  }
}
