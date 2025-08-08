import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ cookies, url }) => {
    const oauthState = cookies.get('oauth_state');
    const receivedState = url.searchParams.get('state');
    
    return json({
        storedState: oauthState ? oauthState.substring(0, 8) + '...' : null,
        receivedState: receivedState ? receivedState.substring(0, 8) + '...' : null,
        hasStoredState: !!oauthState,
        hasReceivedState: !!receivedState,
        stateMatch: oauthState === receivedState,
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
    });
};
