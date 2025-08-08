import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { getUITextData } from '$lib/content';

export const GET: RequestHandler = async () => {
  try {
    const uiText = await getUITextData();
    
    if (!uiText) {
      return json({ error: 'UI text not found' }, { status: 404 });
    }
    
    return json(uiText);
  } catch (error) {
    console.error('Error loading UI text:', error);
    return json({ error: 'Failed to load UI text' }, { status: 500 });
  }
};