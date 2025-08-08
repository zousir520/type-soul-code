import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';

export const GET: RequestHandler = async () => {
    return json({
        GITHUB_CLIENT_ID: env.GITHUB_CLIENT_ID ? 'Set' : 'Not set',
        GITHUB_CLIENT_SECRET: env.GITHUB_CLIENT_SECRET ? 'Set' : 'Not set',
        GITHUB_REDIRECT_URI: env.GITHUB_REDIRECT_URI || 'Not set',
        NODE_ENV: process.env.NODE_ENV || 'development'
    });
};
