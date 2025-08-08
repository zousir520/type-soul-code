import { json } from '@sveltejs/kit';
import { testGitHubConnection } from '$lib/services/github-content.js';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { owner, repo, branch, token } = await request.json();
    
    if (!owner || !repo || !branch) {
      return json({
        success: false,
        message: 'Missing required fields: owner, repo, and branch are required'
      }, { status: 400 });
    }
    
    const result = await testGitHubConnection({
      owner,
      repo,
      branch,
      token
    });
    
    return json(result);
  } catch (error) {
    console.error('Error testing GitHub connection:', error);
    return json({
      success: false,
      message: `Server error: ${error instanceof Error ? error.message : 'Unknown error'}`
    }, { status: 500 });
  }
};
