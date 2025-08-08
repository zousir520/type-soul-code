/**
 * 数据源配置
 * 
 * 统一管理项目中的数据获取策略，确保数据一致性
 */

export const DATA_SOURCE_CONFIG = {
  // 内容管理策略
  CONTENT_STRATEGY: 'CMS_ONLY', // 'CMS_ONLY' | 'DATABASE_ONLY' | 'HYBRID'
  
  // 具体数据源配置
  BLOG_POSTS: {
    source: 'CMS', // 'CMS' | 'DATABASE' | 'GITHUB'
    fallback: null, // 不使用备用数据源，确保一致性
    description: '博客文章统一使用 CMS 文件系统'
  },
  
  HOMEPAGE_CONTENT: {
    source: 'CMS',
    fallback: null,
    description: '首页内容统一使用 CMS 文件系统'
  },
  
  NAVIGATION: {
    source: 'CMS',
    fallback: null,
    description: '导航菜单统一使用 CMS 文件系统'
  },
  
  SETTINGS: {
    source: 'CMS',
    fallback: null,
    description: '网站设置统一使用 CMS 文件系统'
  },
  
  USER_DATA: {
    source: 'DATABASE',
    fallback: null,
    description: '用户数据使用 Supabase 数据库'
  },
  
  GROWTH_DATA: {
    source: 'DATABASE',
    fallback: null,
    description: 'Growth 数据使用 Supabase 数据库'
  }
} as const;

/**
 * 验证数据源配置
 */
export function validateDataSource(dataType: keyof typeof DATA_SOURCE_CONFIG) {
  const config = DATA_SOURCE_CONFIG[dataType];
  if (!config) {
    throw new Error(`Unknown data type: ${dataType}`);
  }
  return config;
}

/**
 * 获取数据源描述
 */
export function getDataSourceInfo() {
  return {
    strategy: DATA_SOURCE_CONFIG.CONTENT_STRATEGY,
    sources: Object.entries(DATA_SOURCE_CONFIG)
      .filter(([key]) => key !== 'CONTENT_STRATEGY')
      .map(([key, config]) => ({
        type: key,
        source: typeof config === 'object' ? config.source : 'CMS',
        description: typeof config === 'object' ? config.description : 'CMS文件系统'
      }))
  };
}

/**
 * 数据源使用指南
 */
export const DATA_SOURCE_GUIDELINES = {
  CMS_FILES: {
    location: 'src/content/',
    usage: '静态内容、页面内容、博客文章、设置',
    advantages: ['版本控制', '易于编辑', '无需数据库', '快速部署'],
    disadvantages: ['不支持动态内容', '需要重新部署更新']
  },
  
  SUPABASE_DATABASE: {
    location: 'Supabase 云数据库',
    usage: '用户数据、动态内容、实时数据、Growth 数据',
    advantages: ['实时更新', '用户权限', '复杂查询', '数据关联'],
    disadvantages: ['需要网络连接', '配置复杂', '成本考虑']
  },
  
  GITHUB_API: {
    location: 'GitHub Repository',
    usage: '已禁用 - 避免数据不一致',
    status: 'DEPRECATED',
    reason: '为确保数据一致性，已统一使用 CMS 文件系统'
  }
};

/**
 * 数据一致性检查
 */
export function checkDataConsistency() {
  const issues: string[] = [];
  
  // 检查是否有冲突的数据源
  const contentSources = Object.values(DATA_SOURCE_CONFIG)
    .filter(config => typeof config === 'object' && 'source' in config)
    .map(config => config.source);
  
  const uniqueSources = new Set(contentSources);
  
  if (uniqueSources.has('CMS') && contentSources.includes('GITHUB' as any)) {
    issues.push('检测到 CMS 和 GitHub 数据源冲突，可能导致内容不一致');
  }
  
  if (uniqueSources.has('DATABASE') && uniqueSources.has('CMS')) {
    // 这是正常的，不同类型的数据可以使用不同源
  }
  
  return {
    isConsistent: issues.length === 0,
    issues
  };
}
