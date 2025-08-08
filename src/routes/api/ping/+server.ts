import { respData, respErr, respBadRequest } from '$lib/utils/response';
import type { RequestEvent } from '@sveltejs/kit';

export async function POST(event: RequestEvent) {
  try {
    const body = await event.request.json();
    const { message } = body;

    if (!message) {
      return respBadRequest("invalid params");
    }

    return respData({
      pong: `received message: ${message}`,
    });
  } catch (e) {
    console.log("test failed:", e);
    return respErr("test failed");
  }
}
