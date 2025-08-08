import { sequence } from '@sveltejs/kit/hooks';
import { simpleAuthHandle } from '$lib/auth/simple-auth';
import type { Handle } from '@sveltejs/kit';

// 使用简单认证中间件
export const handle = simpleAuthHandle;
