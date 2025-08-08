import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	return json({
		success: true,
		env_vars: {
			PUBLIC_SUPABASE_URL: process.env.PUBLIC_SUPABASE_URL,
			PUBLIC_SUPABASE_ANON_KEY: process.env.PUBLIC_SUPABASE_ANON_KEY ? '***已设置***' : undefined,
			SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? '***已设置***' : undefined,
			NODE_ENV: process.env.NODE_ENV
		}
	});
};