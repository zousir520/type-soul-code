import { typedSupabaseAdmin, type Database } from '$lib/supabase-admin';
import { withSupabaseAdmin } from '$lib/utils/supabase-utils';

type Order = Database['public']['Tables']['orders']['Row'];
type OrderInsert = Database['public']['Tables']['orders']['Insert'];
type OrderUpdate = Database['public']['Tables']['orders']['Update'];

export enum OrderStatus {
  Created = "created",
  Paid = "paid",
  Deleted = "deleted",
  Cancelled = "cancelled",
  Refunded = "refunded",
}

// 创建订单
export async function insertOrder(data: OrderInsert): Promise<Order | null> {
  return withSupabaseAdmin(async (client) => {
    const { data: order, error } = await client
      .from('orders')
      .insert(data)
      .select()
      .single();

    if (error) {
      console.error('Error inserting order:', error);
      return null;
    }

    return order;
  });
}

// 通过订单号查找订单
export async function findOrderByOrderNo(orderNo: string): Promise<Order | null> {
  return withSupabaseAdmin(async (client) => {
    const { data: order, error } = await client
      .from('orders')
      .select('*')
      .eq('order_no', orderNo)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      console.error('Error finding order by order_no:', error);
      return null;
    }

    return order;
  });
}

// 通过 Stripe Session ID 查找订单
export async function findOrderByStripeSessionId(sessionId: string): Promise<Order | null> {
  return withSupabaseAdmin(async (client) => {
    const { data: order, error } = await client
      .from('orders')
      .select('*')
      .eq('stripe_session_id', sessionId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      console.error('Error finding order by stripe_session_id:', error);
      return null;
    }

    return order;
  });
}

// 获取用户订单列表
export async function getUserOrders(
  userId: string,
  page: number = 1,
  limit: number = 50
): Promise<Order[]> {
  const result = await withSupabaseAdmin(async (client) => {
    const offset = (page - 1) * limit;

    const { data: orders, error } = await client
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error getting user orders:', error);
      return [];
    }

    return orders || [];
  }, []);

  return result || [];
}

// 获取所有订单（管理员用）
export async function getAllOrders(
  page: number = 1,
  limit: number = 50,
  status?: OrderStatus
): Promise<Order[]> {
  const result = await withSupabaseAdmin(async (client) => {
    const offset = (page - 1) * limit;

    let query = client
      .from('orders')
      .select('*');

    if (status) {
      query = query.eq('status', status);
    }

    const { data: orders, error } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error getting all orders:', error);
      return [];
    }

    return orders || [];
  }, []);

  return result || [];
}

// 更新订单
export async function updateOrder(
  orderId: string,
  updates: OrderUpdate
): Promise<Order | null> {
  return withSupabaseAdmin(async (client) => {
    const { data: order, error } = await client
      .from('orders')
      .update(updates)
      .eq('id', orderId)
      .select()
      .single();

    if (error) {
      console.error('Error updating order:', error);
      return null;
    }

    return order;
  });
}

// 通过订单号更新订单
export async function updateOrderByOrderNo(
  orderNo: string,
  updates: OrderUpdate
): Promise<Order | null> {
  return withSupabaseAdmin(async (client) => {
    const { data: order, error } = await client
      .from('orders')
      .update(updates)
      .eq('order_no', orderNo)
      .select()
      .single();

    if (error) {
      console.error('Error updating order by order_no:', error);
      return null;
    }

    return order;
  });
}

// 标记订单为已支付
export async function markOrderAsPaid(
  orderNo: string,
  paidDetails?: {
    paid_at?: string;
    paid_email?: string;
    paid_detail?: string;
  }
): Promise<Order | null> {
  try {
    const updates: OrderUpdate = {
      status: OrderStatus.Paid,
      paid_at: paidDetails?.paid_at || new Date().toISOString(),
      paid_email: paidDetails?.paid_email,
      paid_detail: paidDetails?.paid_detail,
    };

    return await updateOrderByOrderNo(orderNo, updates);
  } catch (error) {
    console.error('Error marking order as paid:', error);
    return null;
  }
}

// 取消订单
export async function cancelOrder(orderNo: string): Promise<Order | null> {
  try {
    return await updateOrderByOrderNo(orderNo, { status: OrderStatus.Cancelled });
  } catch (error) {
    console.error('Error cancelling order:', error);
    return null;
  }
}

// 删除订单
export async function deleteOrder(orderId: string): Promise<boolean> {
  const result = await withSupabaseAdmin(async (client) => {
    const { error } = await client
      .from('orders')
      .delete()
      .eq('id', orderId);

    if (error) {
      console.error('Error deleting order:', error);
      return false;
    }

    return true;
  }, false);

  return result || false;
}

// 获取订单统计信息
export async function getOrderStats(): Promise<{
  totalOrders: number;
  paidOrders: number;
  totalRevenue: number;
  ordersToday: number;
  revenueToday: number;
}> {
  const defaultStats = {
    totalOrders: 0,
    paidOrders: 0,
    totalRevenue: 0,
    ordersToday: 0,
    revenueToday: 0
  };

  const result = await withSupabaseAdmin(async (client) => {
    // 获取所有订单
    const { data: allOrders, error: allError } = await client
      .from('orders')
      .select('status, amount, created_at');

    if (allError) {
      console.error('Error getting order stats:', allError);
      return defaultStats;
    }

    if (!allOrders || allOrders.length === 0) {
      return defaultStats;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayISO = today.toISOString();

    let totalOrders = allOrders.length;
    let paidOrders = 0;
    let totalRevenue = 0;
    let ordersToday = 0;
    let revenueToday = 0;

    allOrders.forEach(order => {
      if (order.status === OrderStatus.Paid) {
        paidOrders++;
        totalRevenue += order.amount;
      }

      if (order.created_at >= todayISO) {
        ordersToday++;
        if (order.status === OrderStatus.Paid) {
          revenueToday += order.amount;
        }
      }
    });

    return {
      totalOrders,
      paidOrders,
      totalRevenue,
      ordersToday,
      revenueToday
    };
  }, defaultStats);

  return result || defaultStats;
}

// 获取用户的有效订单（已支付且未过期）
export async function getUserValidOrders(userId: string): Promise<Order[]> {
  const result = await withSupabaseAdmin(async (client) => {
    const now = new Date().toISOString();

    const { data: orders, error } = await client
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .eq('status', OrderStatus.Paid)
      .or(`expired_at.is.null,expired_at.gt.${now}`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error getting user valid orders:', error);
      return [];
    }

    return orders || [];
  }, []);

  return result || [];
}

// 检查用户是否有有效的订阅
export async function checkUserHasValidSubscription(userId: string): Promise<boolean> {
  try {
    const validOrders = await getUserValidOrders(userId);
    return validOrders.length > 0;
  } catch (error) {
    console.error('Error checking user subscription:', error);
    return false;
  }
}
