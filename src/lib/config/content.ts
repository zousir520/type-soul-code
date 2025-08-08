import { env } from '$env/dynamic/private';

// Content source configuration
export const CONTENT_CONFIG = {
  // GitHub repository settings
  github: {
    owner: env.GITHUB_OWNER || 'gstarwd',
    repo: env.GITHUB_REPO || 'sveltia_cms_git',
    branch: env.GITHUB_BRANCH || 'main',
    contentPath: env.GITHUB_CONTENT_PATH || 'src/content/blog',
    // GitHub Personal Access Token (optional, for private repos)
    token: env.GITHUB_TOKEN || '',
  },
  
  // Content source priority
  // 'github-first': Try GitHub first, fallback to local
  // 'local-only': Use local files only
  // 'github-only': Use GitHub only (fail if not available)
  source: (env.CONTENT_SOURCE as 'github-first' | 'local-only' | 'github-only') || 'github-first',
  
  // Enable/disable GitHub content fetching
  useGitHub: env.USE_GITHUB_CONTENT !== 'false',
  
  // Cache settings
  cache: {
    // Cache duration in milliseconds (default: 5 minutes)
    duration: parseInt(env.CONTENT_CACHE_DURATION || '300000'),
    // Enable/disable caching
    enabled: env.CONTENT_CACHE_ENABLED !== 'false',
  }
};

// Validate configuration
export function validateContentConfig() {
  const { github, source } = CONTENT_CONFIG;
  
  if (source === 'github-only' || source === 'github-first') {
    if (!github.owner || !github.repo) {
      console.warn('GitHub owner and repo must be configured when using GitHub content source');
      return false;
    }
  }
  
  return true;
}

// Get GitHub API headers
export function getGitHubHeaders() {
  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'SvelteKit-Blog'
  };
  
  if (CONTENT_CONFIG.github.token) {
    headers['Authorization'] = `token ${CONTENT_CONFIG.github.token}`;
  }
  
  return headers;
}
