import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';
import type { SiteType } from '$lib/types/database';

export async function GET() {
    try {
        // 仅从环境变量读取站点类型
        const envSiteType = publicEnv.PUBLIC_SITE_TYPE || env.SITE_TYPE;
        
        if (!envSiteType) {
            return json({
                error: 'MISSING_SITE_TYPE',
                message: '必须设置 PUBLIC_SITE_TYPE 环境变量',
                instruction: '请在环境变量中设置 PUBLIC_SITE_TYPE，支持的值：site-tool, site-game, site-blog'
            }, { status: 400 });
        }

        // 验证环境变量值
        const validTypes: SiteType[] = ['site-tool', 'site-game', 'site-blog'];
        if (!validTypes.includes(envSiteType as SiteType)) {
            return json({
                error: 'INVALID_SITE_TYPE',
                message: `无效的站点类型: ${envSiteType}`,
                instruction: '支持的值：site-tool, site-game, site-blog'
            }, { status: 400 });
        }

        console.log('Site type loaded from environment variable:', envSiteType);
        return json({
            type: envSiteType as SiteType,
            source: 'environment'
        });
    } catch (error) {
        console.error('Error reading site config:', error);
        return json({
            error: 'CONFIG_ERROR',
            message: '读取站点配置失败'
        }, { status: 500 });
    }
}

// POST 方法已移除 - Site mode 仅通过环境变量控制
// 如需修改 site mode，请设置 PUBLIC_SITE_TYPE 环境变量
// 支持的值：site-tool, site-game, site-blog
export async function POST() {
    return json({
        error: 'READONLY_CONFIG',
        message: 'Site mode 配置为只读模式，仅通过环境变量控制',
        instruction: '请设置 PUBLIC_SITE_TYPE 环境变量来修改站点模式\n\n支持的值：\n- site-tool\n- site-game\n- site-blog\n\n设置方法：\n1. 本地开发：在 .env.local 文件中添加 PUBLIC_SITE_TYPE=site-game\n2. 生产环境：在 Vercel Dashboard 中设置环境变量'
    }, { status: 405 });
}