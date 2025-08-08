import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// 调试：在构建时检查环境变量可用性
console.log('🔍 调试: 检查构建时环境变量...');

let envVars: Record<string, string | undefined> = {};
let importError: string | null = null;

try {
    // 尝试从 $env/static/private 导入
    const { 
        GITHUB_CLIENT_ID, 
        GITHUB_CLIENT_SECRET,
        GITHUB_REDIRECT_URI 
    } = await import('$env/static/private');
    
    envVars = {
        GITHUB_CLIENT_ID,
        GITHUB_CLIENT_SECRET,
        GITHUB_REDIRECT_URI
    };
    
    console.log('✅ 成功从 $env/static/private 导入环境变量');
    console.log('📋 环境变量状态:', {
        GITHUB_CLIENT_ID: GITHUB_CLIENT_ID ? '已设置' : '未设置',
        GITHUB_CLIENT_SECRET: GITHUB_CLIENT_SECRET ? '已设置' : '未设置',
        GITHUB_REDIRECT_URI: GITHUB_REDIRECT_URI ? '已设置' : '未设置'
    });
    
} catch (error) {
    importError = String(error);
    console.error('❌ 从 $env/static/private 导入失败:', error);
    
    // 备用方法：尝试从 process.env 获取
    try {
        envVars = {
            GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
            GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
            GITHUB_REDIRECT_URI: process.env.GITHUB_REDIRECT_URI
        };
        console.log('🔄 尝试从 process.env 获取:', {
            GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID ? '已设置' : '未设置',
            GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET ? '已设置' : '未设置',
            GITHUB_REDIRECT_URI: process.env.GITHUB_REDIRECT_URI ? '已设置' : '未设置'
        });
    } catch (processError) {
        console.error('❌ process.env 也失败:', processError);
    }
}

export const GET: RequestHandler = async () => {
    return json({
        status: 'debug',
        envVars: Object.keys(envVars).reduce((acc, key) => {
            acc[key] = envVars[key] ? `设置 (长度: ${envVars[key]!.length})` : '未设置';
            return acc;
        }, {} as Record<string, string>),
        importError,
        timestamp: new Date().toISOString()
    });
};