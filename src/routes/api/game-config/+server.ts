import { json } from '@sveltejs/kit';
import { defaultGameConfig } from '$lib/types/game-config';
import { getGameConfigData } from '$lib/content';

export async function GET() {
	try {
		const config = await getGameConfigData();
		return json({ ...defaultGameConfig, ...config });
	} catch (error) {
		console.error('Error loading game config:', error);
		return json(defaultGameConfig);
	}
}