import { respData } from '$lib/utils/response';
import type { RequestEvent } from '@sveltejs/kit';

export async function GET(event: RequestEvent) {
  return respData({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
}
