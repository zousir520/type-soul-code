import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	// Redirect old dashboard route to new vibbyai route
	throw redirect(301, '/vibbyai');
};
