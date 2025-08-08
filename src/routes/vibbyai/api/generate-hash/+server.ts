import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { hashPassword, validatePasswordStrength } from '$lib/auth/simple-auth';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { password } = await request.json();

    if (!password) {
      return json({ 
        success: false, 
        error: '密码不能为空' 
      }, { status: 400 });
    }

    // 验证密码强度
    const validation = validatePasswordStrength(password);
    if (!validation.valid) {
      return json({ 
        success: false, 
        error: validation.message 
      }, { status: 400 });
    }

    // 生成哈希
    const hash = await hashPassword(password);

    return json({ 
      success: true, 
      hash 
    });
  } catch (error) {
    console.error('Hash generation error:', error);
    return json({ 
      success: false, 
      error: '生成哈希失败' 
    }, { status: 500 });
  }
};
