/**
 * 简单的 OAuth 回调 URL 配置
 * 所有 OAuth 提供商都使用统一的回调地址：/api/auth/callback
 * 然后通过 provider 参数区分不同的提供商
 */

/**
 * 获取通用回调 URL - 所有 OAuth 提供商都用这个
 */
export function getUniversalCallbackUrl(baseUrl: string): string {
    return `${baseUrl}/api/auth/callback`;
}

/**
 * OAuth 提供商配置示例
 * 在各自的 OAuth 应用中配置回调 URL 时使用：
 *
 * GitHub: https://tenniszero.org/api/auth/callback?provider=github
 * Google: https://tenniszero.org/api/auth/callback?provider=google
 * Stripe: https://tenniszero.org/api/auth/callback?provider=stripe
 */
