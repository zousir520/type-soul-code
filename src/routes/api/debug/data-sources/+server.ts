import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getDataSourceInfo, checkDataConsistency, DATA_SOURCE_GUIDELINES } from '$lib/config/data-sources';
import { getBlogPosts } from '$lib/content.js';

export const GET: RequestHandler = async () => {
  try {
    // 获取数据源配置信息
    const dataSourceInfo = getDataSourceInfo();
    
    // 检查数据一致性
    const consistencyCheck = checkDataConsistency();
    
    // 测试 CMS 数据获取
    let cmsTestResult;
    try {
      const posts = await getBlogPosts();
      cmsTestResult = {
        success: true,
        postsCount: posts.length,
        samplePost: posts[0] ? {
          title: posts[0].title,
          slug: posts[0].slug,
          date: posts[0].date
        } : null
      };
    } catch (error) {
      cmsTestResult = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
    
    // 检查环境变量
    const envCheck = {
      CONTENT_SOURCE: process.env.CONTENT_SOURCE || 'not set',
      USE_GITHUB_CONTENT: process.env.USE_GITHUB_CONTENT || 'not set',
      NODE_ENV: process.env.NODE_ENV || 'not set'
    };
    
    return json({
      timestamp: new Date().toISOString(),
      dataSourceInfo,
      consistencyCheck,
      cmsTestResult,
      envCheck,
      guidelines: DATA_SOURCE_GUIDELINES,
      recommendations: [
        '确保所有内容数据都通过 CMS 文件系统获取',
        '避免使用多个数据源导致内容不一致',
        '定期检查数据源配置',
        '在开发环境中测试数据一致性'
      ]
    });
  } catch (error) {
    console.error('Error checking data sources:', error);
    return json(
      { 
        error: 'Failed to check data sources',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
};
